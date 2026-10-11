/**
 * prerender-i18n.js - Scrive nell'HTML i testi italiani di default.
 *
 * Il sito traduce a runtime gli elementi [data-i18n]; senza questo passaggio
 * l'HTML servito contiene <title>, <h1> e paragrafi vuoti, che è ciò che vedono
 * motori di ricerca, anteprime social e chi ha JavaScript disattivato.
 *
 * Uso (dalla cartella gigalabor-site, dopo aver modificato js/data/i18n/it.js):
 *   node tools/prerender-i18n.js
 *
 * Idempotente: rieseguirlo riallinea i testi statici alle stringhe correnti.
 * Nessuna dipendenza. Non viene caricato dal sito.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_LANG = 'it';

function loadStrings() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  ['js/data/gl-data.js', `js/data/i18n/${DEFAULT_LANG}.js`].forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });
  });
  return sandbox.window.GL.i18n[DEFAULT_LANG];
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
  const strings = loadStrings();
  const files = [path.join(ROOT, 'index.html'), ...listHtmlFiles(path.join(ROOT, 'pages'))];
  files.forEach((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const { out, filled } = prerender(html, strings, path.basename(file, '.html'));
    if (out !== html) fs.writeFileSync(file, out);
    console.log(`${path.relative(ROOT, file)}: ${filled} testi${out !== html ? ' (aggiornato)' : ''}`);
  });
}

main();
