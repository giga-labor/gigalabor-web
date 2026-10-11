/**
 * prerender-i18n.js - Scrive nell'HTML i testi italiani di default e le
 * schede di progetti e notizie.
 *
 * Il sito traduce a runtime gli elementi [data-i18n] e costruisce via script
 * le griglie #projects-grid, #home-news e #news-grid; senza questo passaggio
 * l'HTML servito contiene <title>, <h1>, paragrafi e griglie vuoti, che è ciò
 * che vedono motori di ricerca, anteprime social, assistenti AI e chi ha
 * JavaScript disattivato.
 *
 * Uso (dalla cartella gigalabor-site, dopo aver modificato i file in js/data):
 *   node tools/prerender-i18n.js
 * Il workflow di deploy lo esegue comunque a ogni pubblicazione.
 *
 * Le schede statiche replicano il markup di ProjectCards e HomeNews (js/app.js)
 * e di cardHTML (pages/news.html): al caricamento gli script le ricostruiscono,
 * quindi una modifica a quel markup va riportata anche qui.
 *
 * Idempotente: rieseguirlo riallinea i testi statici ai dati correnti.
 * Nessuna dipendenza. Non viene caricato dal sito.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_LANG = 'it';
const HOME_COUNT = 3;   // schede in home, come in ProjectCards e HomeNews
const MAX_NEWS = 50;    // come in pages/news.html

function loadData() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  [
    'js/data/gl-data.js',
    'js/data/gl-news.js',
    `js/data/i18n/${DEFAULT_LANG}.js`,
    `js/data/i18n/news-${DEFAULT_LANG}.js`
  ].forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });
  });
  const GL = sandbox.window.GL;
  return {
    strings: GL.i18n[DEFAULT_LANG],
    projects: GL.projects || [],
    news: GL.NEWS || [],
    newsStrings: (GL.newsStrings || {})[DEFAULT_LANG] || {}
  };
}

function lookup(strings, key) {
  return key.split('.').reduce((obj, part) => (obj && obj[part] !== undefined ? obj[part] : null), strings);
}

function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/"/g, '&quot;');
}

function listHtmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function metaContent(html, attr, name) {
  const match = html.match(new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`));
  return match ? match[1] : '';
}

/* Schede progetto: stesso markup di ProjectCards in js/app.js */
function projectCards(data, prefix, limit) {
  const texts = data.strings.projects || {};
  const status = data.strings.status || {};
  const sorted = data.projects.slice().sort((a, b) => {
    const ta = Date.parse(a.updated_at || '') || 0;
    const tb = Date.parse(b.updated_at || '') || 0;
    if (tb !== ta) return tb - ta;
    return (a.order || 999) - (b.order || 999);
  });
  return (limit ? sorted.slice(0, limit) : sorted).map((meta) => {
    const t = texts[meta.id];
    if (!t) return '';
    return `<a class="project-card animate" href="${prefix}${meta.page}" style="--card-accent: ${meta.color};">` +
      '<div class="project-card__header">' +
        '<div>' +
          `<div class="project-card__name">${t.name}</div>` +
          `<div class="project-card__category">${t.category}</div>` +
        '</div>' +
        `<div class="project-card__icon">${meta.icon}</div>` +
      '</div>' +
      `<p class="project-card__desc">${t.short}</p>` +
      '<div class="project-card__footer">' +
        '<div class="flex-gap" style="flex-wrap:wrap;">' +
          `<span class="badge badge--${t.status}">${status[t.status] || t.status}</span>` +
          t.tags.slice(0, 2).map((tag) => `<span class="tag">${tag}</span>`).join('') +
        '</div>' +
        '<div class="project-card__arrow">→</div>' +
      '</div>' +
    '</a>';
  });
}

/* Schede notizia: stesso markup di HomeNews (js/app.js) e di cardHTML (pages/news.html) */
function newsCard(data, item, href) {
  const t = data.newsStrings[item.id];
  if (!t) return '';
  const tag = href ? 'a' : 'div';
  const attrs = href
    ? `href="${href}${encodeURIComponent(item.id)}"`
    : `data-news-id="${item.id}" data-category="${item.category}"`;
  return `<${tag} class="news-card animate animated" ${attrs}>` +
    `<div class="news-card__date">${t.date}</div>` +
    `<h3 class="news-card__title">${t.title}</h3>` +
    `<p class="news-card__excerpt">${t.excerpt}</p>` +
    '<div class="news-card__footer">' +
      `<span class="badge ${item.badge_class}">${t.badge}</span>` +
      `<span class="news-card__read">→ ${data.strings.news.read_more}</span>` +
    '</div>' +
  `</${tag}>`;
}

function sortedNews(data) {
  return data.news.slice().sort((a, b) => b.sort_date.localeCompare(a.sort_date));
}

function homeNewsCards(data, today) {
  return sortedNews(data)
    .filter((n) => n.sort_date && n.sort_date <= today)
    .slice(0, HOME_COUNT)
    .map((n) => newsCard(data, n, 'pages/news.html#'));
}

function isoWeek(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 3 - (d.getUTCDay() + 6) % 7);
  const year = d.getUTCFullYear();
  const w1 = new Date(Date.UTC(year, 0, 4));
  const week = 1 + Math.round(((d - w1) / 86400000 - 3 + (w1.getUTCDay() + 6) % 7) / 7);
  return { year, week: String(week).padStart(2, '0') };
}

/* Tutte le notizie, raggruppate come nella pagina: prima le future, poi per settimana */
function newsPageCards(data, today) {
  const all = sortedNews(data).slice(0, MAX_NEWS);
  const label = (text) => `<div class="news-group__label">${text}</div>`;
  const out = [];
  const future = all.filter((n) => n.sort_date > today);
  if (future.length) out.push(label(data.strings.news.group_future), ...future.map((n) => newsCard(data, n)));
  let current = '';
  all.filter((n) => n.sort_date <= today).forEach((n) => {
    const { year, week } = isoWeek(n.sort_date);
    const key = `${week}/${year}`;
    if (key !== current) {
      current = key;
      out.push(label(`${data.strings.news.group_week} ${key}`));
    }
    out.push(newsCard(data, n));
  });
  return out;
}

/* Riempie <div id="..."> tra due marcatori, così la riesecuzione sostituisce il blocco */
function fillGrid(html, id, cards) {
  const pattern = new RegExp(
    `(<div[^<>]*\\sid="${id}"[^<>]*>)(?:\\s*<!-- prerender:start -->[\\s\\S]*?<!-- prerender:end -->\\s*)?(</div>)`
  );
  const items = cards.filter(Boolean);
  if (!items.length || !pattern.test(html)) return { html, count: 0 };
  const block = `\n<!-- prerender:start -->\n${items.join('\n')}\n<!-- prerender:end -->\n`;
  return {
    html: html.replace(pattern, (whole, open, close) => open + block + close),
    count: items.filter((item) => item.includes('-card ')).length
  };
}

function prerenderGrids(html, data, relPath) {
  const today = new Date().toISOString().slice(0, 10);
  const grids = {
    'index.html': [
      ['projects-grid', () => projectCards(data, '', HOME_COUNT)],
      ['home-news', () => homeNewsCards(data, today)]
    ],
    'pages/projects.html': [['projects-grid', () => projectCards(data, '../')]],
    'pages/news.html': [['news-grid', () => newsPageCards(data, today)]]
  }[relPath] || [];
  let cards = 0;
  grids.forEach(([id, build]) => {
    const result = fillGrid(html, id, build());
    html = result.html;
    cards += result.count;
  });
  return { html, cards };
}

function prerender(html, strings, pageName) {
  let filled = 0;

  // Elementi con solo testo: <tag ... data-i18n="chiave" ...>testo</tag>
  let out = html.replace(
    /<(\w+)([^<>]*\sdata-i18n="([^"]+)"[^<>]*)>([^<]*)<\/\1>/g,
    (whole, tag, attrs, key) => {
      const value = lookup(strings, key);
      if (typeof value !== 'string') return whole;
      filled += 1;
      return `<${tag}${attrs}>${escapeHtml(value)}</${tag}>`;
    }
  );

  // <title> e descrizione vuoti: si riusano quelli già scritti per le anteprime social
  // (o, in mancanza, l'h1 della pagina e la descrizione dedicata nelle stringhe)
  const h1 = out.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = metaContent(out, 'property', 'og:title') ||
    (h1 ? `${h1[1].trim()} — ${escapeHtml(strings.meta.siteName)}` : '');
  const pageStrings = strings[`${pageName}_page`] || {};
  const description = metaContent(out, 'property', 'og:description') ||
    escapeAttr(pageStrings.meta_description || strings.meta.description);
  if (title) out = out.replace('<title></title>', `<title>${title}</title>`);
  out = out.replace('<meta name="description" content="">', `<meta name="description" content="${description}">`);

  return { out, filled };
}

function main() {
  const data = loadData();
  const files = [path.join(ROOT, 'index.html'), ...listHtmlFiles(path.join(ROOT, 'pages'))];
  files.forEach((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(ROOT, file).split(path.sep).join('/');
    const { out: texts, filled } = prerender(html, data.strings, path.basename(file, '.html'));
    const { html: out, cards } = prerenderGrids(texts, data, relPath);
    if (out !== html) fs.writeFileSync(file, out);
    console.log(`${relPath}: ${filled} testi${cards ? `, ${cards} schede` : ''}${out !== html ? ' (aggiornato)' : ''}`);
  });
}

main();
