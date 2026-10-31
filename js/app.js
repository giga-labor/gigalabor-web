/**
 * app.js - GiGa Labor
 * Logica completa del sito. Nessun import/export, nessun fetch.
 * Funziona su file://, HTTP e HTTPS.
 * Dipende da: js/data/gl-data.js (deve essere caricato prima)
 */
(function () {
  'use strict';

  /* =
     DATI - letti da gl-data.js
  = */
  var GL       = window.GL || {};
  var CFG      = GL.config  || { defaultLang: 'it', defaultTheme: 'dark-tech', themes: ['dark-tech','light','contrast'], storageKeys: { theme:'gl_theme', lang:'gl_lang' }, supportedLangs: ['it','en'] };
  var I18N_ALL = (GL.i18n)  || {};
  var PROJECTS = (GL.projects) || [];
  var SITE_URL  = CFG.siteUrl || (window.location.origin + '/');
  var SITE_NAME = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
  var FORM_SUBMIT = {
    adminEmail: (CFG.formsubmit && CFG.formsubmit.adminEmail) || 'giga.labor2026@gmail.com',
    ajaxBase: 'https://formsubmit.co/ajax/',
    formBase: 'https://formsubmit.co/'
  };

  /* =
     UTILITY
  = */
  function get(obj, key) {
    if (!obj || !key) return null;
    return key.split('.').reduce(function(o, k) {
      return (o && o[k] !== undefined) ? o[k] : null;
    }, obj);
  }

  function rootPrefix() {
    var path = window.location.pathname;
    if (/\/pages\/projects\/[^/]+$/.test(path)) return '../../';
    if (/\/pages\/[^/]+$/.test(path)) return '../';
    return '';
  }

  /* =
     TEMA
  = */
  var Theme = (function () {
    var _current = CFG.defaultTheme;
    var _switchTimer;

    function apply(theme) {
      if (CFG.themes.indexOf(theme) === -1) theme = CFG.defaultTheme;
      var root = document.documentElement;
      /* transizione colori solo durante un cambio reale (non al primo paint) */
      if (root.getAttribute('data-theme') !== theme) {
        root.classList.add('theme-switching');
        clearTimeout(_switchTimer);
        _switchTimer = setTimeout(function() { root.classList.remove('theme-switching'); }, 350);
      }
      _current = theme;
      root.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.theme === theme);
      });
      try { localStorage.setItem(CFG.storageKeys.theme, theme); } catch(e) {}
      document.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
    }

    function init() {
      var saved;
      try { saved = localStorage.getItem(CFG.storageKeys.theme); } catch(e) {}
      apply(saved && CFG.themes.indexOf(saved) !== -1 ? saved : CFG.defaultTheme);
    }

    function next() {
      var idx = CFG.themes.indexOf(_current);
      apply(CFG.themes[(idx + 1) % CFG.themes.length]);
    }

    return { init: init, set: apply, next: next, get current() { return _current; } };
  })();

  /* =
     I18N
  = */
  var I18n = (function () {
    var _available = Object.keys(I18N_ALL || {}).filter(function(k) {
      return I18N_ALL[k] && typeof I18N_ALL[k] === 'object';
    });
    if (!_available.length) _available = (CFG.supportedLangs || ['it', 'en']).slice();
    var _lang    = CFG.defaultLang;
    var _strings = {};
    var _staticDesc = null;

    function applyStrings() {
      document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var val = get(_strings, el.getAttribute('data-i18n'));
        if (val !== null && !Array.isArray(val)) el.textContent = val;
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        var val = get(_strings, el.getAttribute('data-i18n-html'));
        if (val !== null) el.innerHTML = val;
      });
      document.querySelectorAll('[data-i18n-attr]').forEach(function(el) {
        el.getAttribute('data-i18n-attr').split(',').forEach(function(pair) {
          var parts = pair.trim().split(':');
          var val = get(_strings, parts[1]);
          if (val !== null) el.setAttribute(parts[0], val);
        });
      });
      document.querySelectorAll('[data-i18n-toggle]').forEach(function(el) {
        var val = get(_strings, el.getAttribute('data-i18n-toggle'));
        if (val !== null) el.textContent = val;
      });
      var siteName = get(_strings, 'meta.siteName');
      var tagline  = get(_strings, 'meta.tagline');
      var desc     = get(_strings, 'meta.description');
      var path     = window.location.pathname || '';
      var customDesc  = null;
      if (/\/pages\/privacy/.test(path)) {
        customDesc  = get(_strings, 'privacy_page.meta_description');
      } else if (/\/pages\/terms/.test(path)) {
        customDesc  = get(_strings, 'terms_page.meta_description');
      }
      /* Titolo: "<h1 della pagina> — GiGa Labor" sulle pagine interne, sito + tagline sulla home */
      var onHome = document.body && document.body.getAttribute('data-page') === 'home';
      var h1 = onHome ? null : document.querySelector('h1');
      var pageTitle = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : '';
      if (siteName) {
        document.title = pageTitle ? (pageTitle + ' — ' + siteName)
                                   : (tagline ? siteName + ' — ' + tagline : siteName);
      }
      /* Descrizione: quella statica della pagina vale per la lingua di default */
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        if (_staticDesc === null) _staticDesc = metaDesc.getAttribute('content') || '';
        var useStatic = (_lang === CFG.defaultLang && _staticDesc);
        var content = customDesc || (useStatic ? _staticDesc : desc);
        if (content) metaDesc.setAttribute('content', content);
      }
      document.documentElement.setAttribute('lang', _lang);
    }

    function setLang(lang) {
      if (_available.indexOf(lang) === -1) lang = _available[0] || CFG.defaultLang;
      var data = I18N_ALL[lang];
      if (!data) return;
      _lang    = lang;
      _strings = data;
      try { localStorage.setItem(CFG.storageKeys.lang, lang); } catch(e) {}
      applyStrings();
      document.dispatchEvent(new CustomEvent('langChange', { detail: { lang: lang } }));
    }

    function toggle() {
      var i = _available.indexOf(_lang);
      var next = _available[(i + 1) % _available.length];
      setLang(next);
    }

    function t(key) {
      return get(_strings, key) !== null ? get(_strings, key) : key;
    }

    function init() {
      var saved;
      try { saved = localStorage.getItem(CFG.storageKeys.lang); } catch(e) {}
      setLang(saved || CFG.defaultLang);
    }

    return {
      init: init,
      setLang: setLang,
      toggle: toggle,
      t: t,
      get current() { return _lang; },
      get available() { return _available.slice(); }
    };
  })();

  /* Gli script di pagina (es. il gestore in news.html) leggono lingua e stringhe da qui */
  window.I18n = I18n;

  /* =
     LAYOUT - Topbar + Sidenav + Bottombar (Shell V3)
  = */
  var Layout = (function () {
    var isHome = false;

    function logoMark() {
      return '<img src="' + rootPrefix() + 'assets/logo/gigalabor-segno.svg" alt="" width="931" height="435">';
    }

    function icon(type) {
      var icons = {
        proj:    '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="1.5" width="6.5" height="6.5" rx=".5"/><rect x="10" y="1.5" width="6.5" height="6.5" rx=".5"/><rect x="1.5" y="10" width="6.5" height="6.5" rx=".5"/><rect x="10" y="10" width="6.5" height="6.5" rx=".5"/></svg>',
        lab:     '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M7 2v7l-4 6h12l-4-6V2" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="2" x2="12" y2="2" stroke-linecap="round"/><circle cx="11" cy="13" r="1.2" fill="currentColor" stroke="none" opacity=".5"/></svg>',
        news:    '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="3" width="14" height="12" rx="1"/><line x1="5" y1="7" x2="13" y2="7" stroke-linecap="round"/><line x1="5" y1="10" x2="10" y2="10" stroke-linecap="round"/></svg>',
        home:    '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2.5 8.5 9 2.5l6.5 6v7h-4.2v-4.5H6.7v4.5H2.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        about:   '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="9" cy="6" r="3"/><path d="M2 16c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke-linecap="round"/></svg>',
        audio:   '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7h2.8L9 4v10l-3.7-3H2.5z"/><path class="aw" d="M11.5 6.8a3 3 0 0 1 0 4.4"/><path class="aw aw2" d="M13.6 4.8a6 6 0 0 1 0 8.4"/><path class="ax" d="M12 7l4 4M16 7l-4 4"/></svg>',
        contact: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="4" width="14" height="10" rx="1"/><polyline points="2,4 9,10 16,4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      };
      return icons[type] || '';
    }

    function topbarHTML() {
      var px = rootPrefix();
      return '<header id="tb">' +
        '<a class="tb-logo" href="' + px + 'index.html" aria-label="GiGa Labor — Home">' +
          '<div class="tb-logo-mark">' + logoMark() + '</div>' +
          '<div class="tb-logo-text"><span class="gi">Gi</span><span class="ga">Ga</span><span class="labor"> Labor</span></div>' +
        '</a>' +
        '<div class="tb-r">' +
          '<div class="theme-panel" role="group" aria-label="Seleziona tema">' +
            '<button class="theme-btn theme-btn--dark"     data-theme="dark-tech" title="Dark Tech"     aria-label="Dark Tech"></button>' +
            '<button class="theme-btn theme-btn--light"    data-theme="light"     title="Light"         aria-label="Light"></button>' +
            '<button class="theme-btn theme-btn--contrast" data-theme="contrast"  title="High Contrast" aria-label="High Contrast"></button>' +
          '</div>' +
          '<button class="audio-btn" type="button" aria-pressed="false" data-i18n-attr="aria-label:ui.audio,title:ui.audio">' + icon('audio') + '</button>' +
          '<button class="navbar__lang-btn" id="lang-toggle" aria-label="Cambia lingua">EN</button>' +
          '<div class="tb-sep"></div>' +
          '<span class="tb-time" id="tb-time" aria-hidden="true">--:--:--</span>' +
        '</div>' +
      '</header>';
    }

    function sidenavHTML() {
      var px = rootPrefix();
      var path = window.location.pathname;
      /* Stesse voci e stessi link su ogni pagina, home compresa */
      var items = [
        { id: 'home',    labelKey: 'nav.home',     href: px + 'index.html',          page: 'home'     },
        { id: 'proj',    labelKey: 'nav.projects', href: px + 'pages/projects.html', page: 'projects' },
        { id: 'news',    labelKey: 'nav.news',     href: px + 'pages/news.html',     page: 'news'     },
        { id: 'about',   labelKey: 'nav.about',    href: px + 'pages/about.html',    page: 'about'    },
        { id: 'contact', labelKey: 'nav.contact',  href: px + 'pages/contact.html',  page: 'contact'  }
      ];

      function isActive(item) {
        if (isHome) return item.page === 'home';
        return item.page !== 'home' && path.indexOf('/' + item.page) !== -1;
      }

      var itemsHTML = items.map(function(item) {
        var active = isActive(item);
        return '<a class="si' + (active ? ' on' : '') + '" href="' + item.href + '"' +
            (active ? ' aria-current="page"' : '') + ' data-i18n-attr="aria-label:' + item.labelKey + '">' +
          icon(item.id) +
          /* .si-lbl: etichetta sotto l'icona (desktop e tab bar mobile) */
          '<span class="si-lbl" aria-hidden="true" data-i18n="' + item.labelKey + '"></span>' +
          /* .si-tt: tooltip, usato dove l'etichetta non entra (tablet) */
          '<span class="si-tt" aria-hidden="true" data-i18n="' + item.labelKey + '"></span>' +
        '</a>';
      }).join('');

      // La classe si-animate avvia l'animazione d'ingresso delle icone
      return '<nav id="side" class="si-animate" aria-label="Navigazione principale">' + itemsHTML + '</nav>';
    }

    function bottombarHTML() {
      var px = rootPrefix();
      return '<footer id="bb">' +
        '<span data-i18n="footer.tagline"></span>' +
        '<span class="bb-sep">\u00b7</span>' +
        '<span id="bb-msg"></span>' +
        '<div class="bb-r">' +
          '<a href="' + px + 'pages/privacy.html" data-i18n="footer.links.privacy" class="bb-link"></a>' +
          '<a href="' + px + 'pages/terms.html"   data-i18n="footer.links.terms" class="bb-link"></a>' +
          '<span class="bb-copy" data-i18n="footer.copy"></span>' +
        '</div>' +
      '</footer>' +
      '<button id="back-to-top" type="button" data-i18n-attr="aria-label:ui.back_to_top">\u2191</button>';
    }

    function inject() {
      isHome = (document.body && document.body.getAttribute('data-page') === 'home');
      var navRoot    = document.getElementById('navbar-root');
      var footerRoot = document.getElementById('footer-root');
      if (navRoot)    navRoot.innerHTML    = topbarHTML() + sidenavHTML();
      if (footerRoot) footerRoot.innerHTML = bottombarHTML();
    }

    return { inject: inject };
  })();

  /* =
     NAVBAR - comportamento topbar (Shell V3)
  = */
  var Navbar = (function () {

    function initThemePanel() {
      document.querySelectorAll('.theme-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { Theme.set(btn.dataset.theme); });
      });
    }

    function initLangToggle() {
      function applyLangBadge(btn, lang) {
        var badges = CFG.langBadges || {};
        var b = badges[lang] || {};
        /* Let CSS [data-lang] selectors handle the flag background-image.
           Clearing inline styles ensures they don't override the CSS rules. */
        btn.style.backgroundImage = '';
        btn.style.backgroundSize = '';
        btn.style.backgroundPosition = '';
        btn.style.backgroundRepeat = '';
        btn.style.setProperty('--lang-flag-text', b.text || '#f8fbff');
      }

      function updateBtn() {
        document.querySelectorAll('#lang-toggle').forEach(function(btn) {
          /* identico all'originale: mostra la lingua corrente + bandiera corrente */
          var lang = String(I18n.current || '').toLowerCase();
          btn.textContent = lang.toUpperCase();
          btn.setAttribute('data-lang', lang);
          applyLangBadge(btn, lang);
        });
      }
      document.querySelectorAll('#lang-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() { I18n.toggle(); });
      });
      document.addEventListener('langChange', updateBtn);
      updateBtn();
    }

    function initClock() {
      var el = document.getElementById('tb-time');
      if (!el) return;
      function tick() {
        var n = new Date();
        var p = function(x) { return String(x).padStart(2, '0'); };
        el.textContent = p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds());
      }
      tick();
      setInterval(tick, 1000);
    }

    function init() {
      if (!document.getElementById('tb')) return;
      initThemePanel();
      initLangToggle();
      initClock();
    }

    return { init: init };
  })();

  /* =
     ANIMAZIONI
  = */
  var Animations = (function () {
    function initFadeIn() {
      var els = document.querySelectorAll('.animate');
      if (!els.length || !window.IntersectionObserver) {
        els.forEach(function(el) { el.classList.add('animated'); });
        return;
      }
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function(el) { obs.observe(el); });
    }

    function initCounters() {
      var counters = document.querySelectorAll('[data-count]');
      if (!counters.length || !window.IntersectionObserver) return;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          var el   = entry.target;
          var end  = parseInt(el.dataset.count, 10);
          var step = Math.max(1, Math.floor(end / 90));
          var cur  = 0;
          function tick() {
            cur = Math.min(cur + step, end);
            el.textContent = cur.toLocaleString('it-IT');
            if (cur < end) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(function(el) { obs.observe(el); });
    }

    function initStagger() {
      document.querySelectorAll('[data-stagger]').forEach(function(container) {
        var delay = parseFloat(container.dataset.stagger) || 0.1;
        Array.from(container.children).forEach(function(child, i) {
          child.style.transitionDelay = (i * delay) + 's';
          child.classList.add('animate');
        });
      });
    }

    function initBackToTop() {
      var btn = document.getElementById('back-to-top');
      if (!btn) return;
      window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    function hideLoader() {
      var loader = document.getElementById('page-loader');
      if (!loader) return;
      function doHide() { setTimeout(function() { loader.classList.add('hidden'); }, 150); }
      if (document.readyState === 'complete') doHide();
      else window.addEventListener('load', doHide);
    }

    function init() {
      hideLoader();
      initStagger();
      initFadeIn();
      initCounters();
      initBackToTop();
    }

    return { init: init };
  })();

  /* =
     PROJECTS - render schede progetto
  = */
  var ProjectCards = (function () {
    function renderCards(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var i18nProj   = get(I18N_ALL[I18n.current], 'projects') || {};
      var i18nStatus = get(I18N_ALL[I18n.current], 'status')   || {};
      var px = rootPrefix();
      var isHome = (document.body && document.body.getAttribute('data-page') === 'home');
      container.innerHTML = '';
      var sorted = PROJECTS.slice().sort(function(a, b) {
        var ta = Date.parse(a.updated_at || '') || 0;
        var tb = Date.parse(b.updated_at || '') || 0;
        if (tb !== ta) return tb - ta;
        return (a.order || 999) - (b.order || 999);
      });
      var list = isHome ? sorted.slice(0, 3) : sorted;
      list.forEach(function(meta) {
        var data = i18nProj[meta.id];
        if (!data) return;
        var statusLabel = i18nStatus[data.status] || data.status;
        var card = document.createElement('a');
        card.className = 'project-card animate';
        card.href = px + meta.page;
        card.style.setProperty('--card-accent', meta.color);
        card.innerHTML =
          '<div class="project-card__header">' +
            '<div>' +
              '<div class="project-card__name">' + data.name + '</div>' +
              '<div class="project-card__category">' + data.category + '</div>' +
            '</div>' +
            '<div class="project-card__icon">' + meta.icon + '</div>' +
          '</div>' +
          '<p class="project-card__desc">' + data.short + '</p>' +
          '<div class="project-card__footer">' +
            '<div class="flex-gap" style="flex-wrap:wrap;">' +
              '<span class="badge badge--' + data.status + '">' + statusLabel + '</span>' +
              data.tags.slice(0, 2).map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('') +
            '</div>' +
            '<div class="project-card__arrow">\u2192</div>' +
          '</div>';
        container.appendChild(card);
      });
      document.querySelectorAll('.animate:not(.animated)').forEach(function(el) {
        setTimeout(function() { el.classList.add('animated'); }, 50);
      });
    }

    function init() {
      renderCards('projects-grid');
      document.addEventListener('langChange', function() { renderCards('projects-grid'); });
    }

    return { init: init, renderCards: renderCards };
  })();

  /* =
     FORM - validazione e feedback
  = */
  var Forms = (function () {
    function closeScrittiFormIfNeeded(formId) {
      if (formId !== 'scritti-form') return;
      var wrap = document.getElementById('scritti-form-wrap');
      var btn = document.getElementById('toggle-scritti-form');
      if (wrap) wrap.classList.remove('open');
      if (btn) btn.textContent = I18n.t('scritti.open_form_btn');
    }

    function buildPayload(form) {
      var name = ((form.querySelector('[name="name"]') || {}).value || '').trim();
      var email = ((form.querySelector('[name="email"]') || {}).value || '').trim();
      var message = ((form.querySelector('[name="message"]') || {}).value || '').trim();
      var subjectRaw = ((form.querySelector('[name="subject"]') || {}).value || '').trim();
      var publish = !!((form.querySelector('[name="publish"]') || {}).checked);
      var ts = new Date().toISOString();
      var subject = subjectRaw ? ('Nuovo invio [' + subjectRaw + '] da GiGa Labor') : 'Nuovo contatto da GiGa Labor';
      var bodyText = [
        'Nuovo invio dal form contatti GiGa Labor',
        '',
        'Nome: ' + (name || '--'),
        'Email: ' + (email || '--'),
        'Categoria: ' + (subjectRaw || '--'),
        'Pubblicazione consenso: ' + (publish ? 'SI' : 'NO'),
        'Messaggio:',
        message,
        '',
        'Inviato il (UTC): ' + ts
      ].join('\n');
      return {
        name: name || '--',
        email: email,
        message: message,
        subjectRaw: subjectRaw,
        publish: publish,
        ts: ts,
        subject: subject,
        bodyText: bodyText
      };
    }

    function buildFormSubmitBody(payload) {
      return {
        _subject: payload.subject,
        _template: 'table',
        _replyto: payload.email || '',
        name: payload.name,
        user_email: payload.email || '--',
        category: payload.subjectRaw || '--',
        publish_consent: payload.publish ? 'yes' : 'no',
        message: payload.message,
        submitted_at_utc: payload.ts,
        _honey: '',
        source: window.location.host + (window.location.pathname || ''),
        note: payload.bodyText
      };
    }

    function postFormSubmitAjax(payload) {
      var endpoint = FORM_SUBMIT.ajaxBase + encodeURIComponent(FORM_SUBMIT.adminEmail);
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(buildFormSubmitBody(payload))
      }).then(function(res) {
        return res.json().catch(function() { return {}; }).then(function(json) {
          if (!res.ok || json.success === 'false') {
            var err = new Error(json.message || 'FormSubmit AJAX failed');
            err.data = json;
            throw err;
          }
          return json;
        });
      });
    }

    function postFormSubmitNoCors(payload) {
      var endpoint = FORM_SUBMIT.formBase + encodeURIComponent(FORM_SUBMIT.adminEmail);
      var body = buildFormSubmitBody(payload);
      var fd = new FormData();
      Object.keys(body).forEach(function(k) { fd.append(k, body[k]); });
      return fetch(endpoint, { method: 'POST', mode: 'no-cors', body: fd }).then(function() {
        return { mode: 'form-no-cors' };
      });
    }

    function openMailtoFallback(form) {
      var payload = buildPayload(form);
      var href =
        'mailto:' + encodeURIComponent(FORM_SUBMIT.adminEmail) +
        '?subject=' + encodeURIComponent(payload.subject) +
        '&body=' + encodeURIComponent(payload.bodyText);
      window.location.href = href;
    }

    function setupForm(formId, feedbackId) {
      var form     = document.getElementById(formId);
      var feedback = document.getElementById(feedbackId);
      if (!form) return;
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn     = form.querySelector('[type="submit"]');
        var email   = (form.querySelector('[name="email"]')   || {}).value || '';
        var message = (form.querySelector('[name="message"]') || {}).value || '';
        if (!message.trim()) {
          showFeedback(feedback, 'error', I18n.t('forms.errors.required_message'));
          return;
        }
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          showFeedback(feedback, 'error', I18n.t('forms.errors.invalid_email'));
          return;
        }
        function done() {
          btn.classList.remove('loading');
          btn.disabled = false;
          showFeedback(feedback, 'success', I18n.t('forms.success.sent'));
          form.reset();
          closeScrittiFormIfNeeded(formId);
        }

        /* Honeypot: un bot che compila il campo nascosto riceve un finto successo, nulla viene inviato */
        var honey = form.querySelector('[name="_honey"]');
        if (honey && honey.value) { done(); return; }

        btn.classList.add('loading');
        btn.disabled = true;
        var payload = buildPayload(form);
        postFormSubmitAjax(payload)
          .catch(function() { return postFormSubmitNoCors(payload); })
          .catch(function() { openMailtoFallback(form); })
          .then(done);
      });
    }

    function showFeedback(el, type, msg) {
      if (!el) return;
      el.textContent   = msg;
      el.setAttribute('role', type === 'error' ? 'alert' : 'status');
      el.className     = 'form-feedback form-feedback--' + type;
      el.style.display = 'block';
      setTimeout(function() { if (el) el.style.display = 'none'; }, 5000);
    }

    return { setupForm: setupForm };
  })();

  /* =
     FOOTER - "ultimo aggiornamento" calcolato dai dati (progetti + notizie)
  = */
  var Footer = (function () {
    function latestDate() {
      var today = new Date().toISOString().slice(0, 10);
      var dates = PROJECTS.map(function(p) { return p.updated_at || ''; })
        .concat((GL.NEWS || []).map(function(n) { return n.sort_date || ''; }))
        .filter(function(d) { return d && d <= today; })
        .sort();
      return dates.length ? dates[dates.length - 1] : '';
    }

    function defaultMsg() {
      var iso = latestDate();
      if (!iso) return '';
      var locale = I18n.current === 'it' ? 'it-IT' : 'en-GB';
      var date = new Date(iso + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
      return I18n.t('footer.updated') + ' ' + date;
    }

    function render() {
      var el = document.getElementById('bb-msg');
      if (el) el.textContent = defaultMsg();
    }

    function init() {
      render();
      document.addEventListener('langChange', render);
    }

    return { init: init, defaultMsg: defaultMsg };
  })();

  /* =
     HOME NEWS - ultime notizie dalla stessa fonte dati della pagina Notizie
  = */
  var HomeNews = (function () {
    var COUNT = 3;

    function latest() {
      var today = new Date().toISOString().slice(0, 10);
      return (GL.NEWS || [])
        .filter(function(n) { return n.sort_date && n.sort_date <= today; })
        .sort(function(a, b) { return b.sort_date.localeCompare(a.sort_date); })
        .slice(0, COUNT);
    }

    function render() {
      var root = document.getElementById('home-news');
      if (!root) return;
      var all = GL.newsStrings || {};
      var strings = all[I18n.current] || all[CFG.defaultLang] || {};
      var href = rootPrefix() + 'pages/news.html#';
      root.innerHTML = latest().map(function(n) {
        var t = strings[n.id];
        if (!t) return '';
        return '<a class="news-card animate animated" href="' + href + encodeURIComponent(n.id) + '">' +
          '<div class="news-card__date">' + t.date + '</div>' +
          '<h3 class="news-card__title">' + t.title + '</h3>' +
          '<p class="news-card__excerpt">' + t.excerpt + '</p>' +
          '<div class="news-card__footer">' +
            '<span class="badge ' + n.badge_class + '">' + t.badge + '</span>' +
            '<span class="news-card__read">→ ' + I18n.t('news.read_more') + '</span>' +
          '</div>' +
        '</a>';
      }).join('');
    }

    function init() {
      render();
      document.addEventListener('langChange', render);
    }

    return { init: init };
  })();

  /* =
     ABOUT - lista valori
  = */
  var About = (function () {
    function renderValues() {
      var list = document.getElementById('values-list');
      if (!list) return;
      var values = I18n.t('about.values');
      if (Array.isArray(values)) {
        list.innerHTML = values.map(function(v) {
          return '<div class="value-item">' + v + '</div>';
        }).join('');
      }
    }
    function init() {
      renderValues();
      document.addEventListener('langChange', renderValues);
    }
    return { init: init };
  })();

  /* =
     SCRITTI - toggle form
  = */
  var ScrittiPage = (function () {
    function init() {
      var wrap = document.getElementById('scritti-form-wrap');
      var btn = document.getElementById('toggle-scritti-form');
      if (!wrap || !btn) return;
      function syncLabel() {
        btn.textContent = wrap.classList.contains('open')
          ? I18n.t('scritti.close_form_btn')
          : I18n.t('scritti.open_form_btn');
      }
      btn.addEventListener('click', function() {
        wrap.classList.toggle('open');
        syncLabel();
      });
      document.addEventListener('langChange', syncLabel);
      syncLabel();
    }
    return { init: init };
  })();

  /* =
     PROJECT DETAIL - pagina singola progetto
  = */
  var ProjectDetail = (function () {
    function hideDeadLinks() {
      document.querySelectorAll('a.btn[href="#"], a.btn[href=""]').forEach(function(a) {
        a.style.display = 'none';
      });
    }

    function init() {
      var tagContainer = document.querySelector('[data-project-tags]');
      if (!tagContainer) return;
      var projectId = tagContainer.dataset.projectTags;
      function renderTags() {
        var tags = I18n.t('projects.' + projectId + '.tags');
        if (Array.isArray(tags)) {
          tagContainer.innerHTML = tags.map(function(t) {
            return '<span class="tag">' + t + '</span>';
          }).join('');
        }
      }
      renderTags();
      hideDeadLinks();
      document.addEventListener('langChange', function() {
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
          var val = I18n.t(el.getAttribute('data-i18n'));
          if (val && !Array.isArray(val)) el.textContent = val;
        });
        renderTags();
        hideDeadLinks();
      });
    }
    return { init: init };
  })();


  /* =
     SHELL - Cursor, Intro, tooltip (home page)
  = */
  var Shell = (function () {

    /* - Cursor - */
    function initCursor() {
      var cur  = document.getElementById('cur');
      var curR = document.getElementById('cur-r');
      /* Cursore custom solo con mouse vero e senza richiesta di ridurre le animazioni */
      var mq = window.matchMedia || function() { return { matches: false }; };
      var usable = cur && curR &&
        mq('(hover: hover) and (pointer: fine)').matches &&
        !mq('(prefers-reduced-motion: reduce)').matches;
      if (!usable) {
        document.documentElement.classList.add('no-custom-cursor');
        return;
      }
      var tx = 0, ty = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', function(e) { tx = e.clientX; ty = e.clientY; });
      (function loop() {
        cur.style.left  = tx + 'px'; cur.style.top  = ty + 'px';
        rx += (tx - rx) * 0.18;     ry += (ty - ry) * 0.18;
        curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
        requestAnimationFrame(loop);
      })();
      function addXL(el) {
        if (!el) return;
        el.addEventListener('mouseenter', function() { curR.classList.add('xl'); });
        el.addEventListener('mouseleave', function() { curR.classList.remove('xl'); });
      }
      setTimeout(function() {
        document.querySelectorAll('a, button').forEach(addXL);
      }, 600);
    }

    /* - Intro: overlay sopra la home, mostrato solo alla prima visita - */
    var INTRO_KEY = 'gl_intro_seen';

    function initIntro() {
      var intro = document.getElementById('intro');
      if (!intro) return;
      var seen = false;
      try { seen = !!localStorage.getItem(INTRO_KEY); } catch(e) {}
      if (seen) { intro.remove(); return; }

      function enter() {
        if (intro.classList.contains('out')) return;
        intro.classList.add('out');
        try { localStorage.setItem(INTRO_KEY, '1'); } catch(e) {}
        window.removeEventListener('keydown', enter);
        window.removeEventListener('wheel', enter);
        setTimeout(function() { intro.remove(); }, 900);
      }
      intro.addEventListener('click', enter);
      window.addEventListener('keydown', enter);
      window.addEventListener('wheel', enter, { passive: true });
    }

    function initRatioTooltip() {
      var ratio = document.querySelector('.h-ratio');
      if (!ratio) return;

      /* Crea il tooltip come figlio diretto di body (position:fixed,
         sfugge a mask-image e overflow su qualsiasi antenato) */
      var tip = document.createElement('div');
      tip.className = 'h-tip-global';
      document.body.appendChild(tip);

      function setText() {
        tip.textContent = I18n.t('hero.tip_ratio') || '';
      }
      setText();
      document.addEventListener('langChange', setText);

      ratio.addEventListener('mouseenter', function() {
        var r = ratio.getBoundingClientRect();
        tip.style.left = (r.left + r.width / 2) + 'px';
        tip.style.top  = r.top + 'px';
        tip.classList.add('on');
      });
      ratio.addEventListener('mouseleave', function() {
        tip.classList.remove('on');
      });
    }

    function initHome() {
      /* Home: cursore custom, intro di prima visita, tooltip del rapporto umano/AI */
      initCursor();
      initIntro();
      initRatioTooltip();
    }

    return { initHome: initHome };
  })();

  /* =
     HERO CANVAS - word cloud neurale con interazione mouse
  = */
  var HeroCanvas = (function () {
    var canvas, ctx, W, H, raf;
    var reducedMotion = false;   /* prefers-reduced-motion: un solo fotogramma statico */
    var canvasRect = null;
    var NODE_COLORS = ['#00b4ff', '#d4883a', '#b060ff', '#ffb000', '#3a6880'];
    var mouse = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999 };
    var words = [];
    var time  = 0;

    /* ── FADE GLOBALE — nodi e link si affievoliscono dopo inattività ── */
    var globalFade      = 1;        /* moltiplicatore 0..1 applicato a tutti gli alpha */
    var lastInteraction = 0;        /* timestamp ultima interazione utente (ms) */
    var FADE_DELAY_MS   = 8000;     /* inattività prima che inizi il fade (8 s) */
    var FADE_MIN        = 0.28;     /* opacità minima a cui si stabilizza */
    var FADE_SPEED      = 0.0025;   /* decadimento per frame (~11 s dal 100% al minimo) */
    var RECOVER_SPEED   = 0.055;    /* recupero per frame (~0.5 s per tornare al 100%) */

    function buildPool() {
      var groups = I18n.t('hero.canvas_words') || {};
      var CATEGORY = {
        ai:       { color: '#b060ff', symbol: '◈' },
        data:     { color: '#00b4ff', symbol: '◉' },
        auto:     { color: '#d4883a', symbol: '⚙' },
        research: { color: '#ffb000', symbol: '◌' },
        tech:     { color: '#3a6880', symbol: '⬢' }
      };
      var KEYS = ['ai', 'data', 'auto', 'research', 'tech'];
      var MAX_WORDS_PER_CATEGORY = 10;
      function cleanList(arr) {
        if (!Array.isArray(arr)) return [];
        var seen = Object.create(null);
        var out = [];
        for (var i = 0; i < arr.length; i++) {
          var raw = String(arr[i] || '').trim();
          if (!raw) continue;
          var k = raw.toLowerCase();
          if (seen[k]) continue;
          seen[k] = 1;
          out.push(raw);
          if (out.length >= MAX_WORDS_PER_CATEGORY) break;
        }
        return out;
      }
      function mapWords(arr, key, base, step) {
        arr = cleanList(arr);
        if (!arr.length) return [];
        var meta = CATEGORY[key] || { color: '#00b4ff', symbol: '•' };
        return arr.map(function(t, i) {
          return {
            t: String(t),
            c: meta.color,
            s: base + ((i % 3) * step),
            k: key,
            sym: meta.symbol
          };
        });
      }
      var pool = [];
      KEYS.forEach(function(k) {
        var base = (k === 'tech') ? 10 : 11;
        var step = (k === 'tech') ? 1.5 : 2;
        pool = pool.concat(mapWords(groups[k], k, base, step));
      });
      return pool.length ? pool : [
        { t: 'Digital', c: '#00b4ff', s: 13, k: 'data', sym: '◉' },
        { t: 'Systems', c: '#d4883a', s: 13, k: 'auto', sym: '⚙' },
        { t: 'Research', c: '#ffb000', s: 13, k: 'research', sym: '◌' }
      ];
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      canvasRect = canvas.getBoundingClientRect();
    }

    function refreshCanvasRect() {
      if (!canvas) return;
      canvasRect = canvas.getBoundingClientRect();
    }

    function makeWord(def, initial) {
      var m = 80;
      return {
        t:  def.t,
        c:  def.c,
        s:  def.s,
        k:  def.k || 'tech',
        sym:def.sym || '•',
        node: !!def.node,
        x:  m + Math.random() * (W - m * 2),
        y:  initial ? (m + Math.random() * (H - m * 2)) : (Math.random() > 0.5 ? -40 : H + 40),
        ax: 0,
        ay: 0,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        ph: Math.random() * Math.PI * 2,   /* phase per breath */
        ba: 0.11 + Math.random() * 0.14,   /* base alpha */
        a:  0                               /* current alpha */
      };
    }

    function populate() {
      var POOL = buildPool();
      words = [];
      var MAX_DUPLICATES_PER_TERM = 2;
      function shuffled(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = (Math.random() * (i + 1)) | 0;
          var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
      }
      var byCategory = {};
      POOL.forEach(function(p) {
        var k = p.k || 'tech';
        if (!byCategory[k]) byCategory[k] = [];
        byCategory[k].push(p);
      });
      var categories = Object.keys(byCategory);
      var termCounts = Object.create(null);
      var catState = {};
      categories.forEach(function(k) {
        catState[k] = { queue: shuffled(byCategory[k]), idx: 0 };
      });
      var cycle = shuffled(categories);
      var cycleIdx = 0;

      function nextCategory() {
        if (!cycle.length) return 'tech';
        if (cycleIdx >= cycle.length) {
          cycle = shuffled(categories);
          cycleIdx = 0;
        }
        return cycle[cycleIdx++];
      }

      function nextFromCategory(k) {
        var state = catState[k];
        if (!state || !state.queue.length) return { t: 'Node', c: '#00b4ff', s: 10, k: 'tech', sym: '⬢' };
        for (var pass = 0; pass < 3; pass++) {
          if (state.idx >= state.queue.length) {
            state.queue = shuffled(byCategory[k]);
            state.idx = 0;
          }
          for (var i = state.idx; i < state.queue.length; i++) {
            var cand = state.queue[i];
            var key = String(cand.t || '').toLowerCase();
            var c = termCounts[key] || 0;
            if (c < MAX_DUPLICATES_PER_TERM) {
              state.idx = i + 1;
              termCounts[key] = c + 1;
              return cand;
            }
          }
          state.queue = shuffled(byCategory[k]);
          state.idx = 0;
        }
        return null;
      }

      function nextSemantic() {
        var k = nextCategory();
        return nextFromCategory(k);
      }

      // Densità nodi proporzionale ai pixel quadrati.
      // Riferimento desktop: 1920×1080 → scale 1.0, ~130 extra nodi.
      // Su schermi più piccoli scala con sqrt(area/refArea) per riduzione graduale.
      var area = (W * H) || (window.innerWidth * window.innerHeight);
      var REF_AREA   = 1920 * 1080;               // ~2 073 600 px²
      var scale      = Math.min(1, area / REF_AREA);              // lineare: densita costante
      var maxPool    = Math.max(6, Math.round(POOL.length * scale));
      var loopCount  = 0;

      POOL.forEach(function() {
        if (loopCount >= maxPool) return;
        loopCount++;
        var baseWord = nextSemantic();
        if (!baseWord) return;
        words.push(makeWord(baseWord, true));
        if (Math.random() < 0.55) {
          var secondWord = nextFromCategory(baseWord.k);
          if (!secondWord) return;
          words.push(makeWord({
            t: secondWord.t,
            c: secondWord.c,
            s: Math.max(9, secondWord.s - 1.4),
            k: secondWord.k,
            sym: secondWord.sym
          }, true));
        }
      });
      // Nodi extra: proporzionali all'area, nessun minimo fisso.
      var extraNodes = Math.max(4, Math.min(140, Math.round(scale * 130)));
      for (var i = 0; i < extraNodes; i++) {
        var src = nextSemantic();
        if (!src) break;
        words.push(makeWord({
          t: src.t,
          c: src.c || NODE_COLORS[(Math.random() * NODE_COLORS.length) | 0],
          s: Math.max(8, (src.s || 10) - 2.4 + Math.random() * 2.2),
          k: src.k,
          sym: src.sym
        }, true));
      }
    }

    /* distanza punto-segmento (al quadrato) - per highlight edge vicino al mouse */
    function ptSegDist2(px, py, ax, ay, bx, by) {
      var dx = bx - ax, dy = by - ay;
      var len2 = dx * dx + dy * dy;
      if (len2 === 0) { dx = px - ax; dy = py - ay; return dx * dx + dy * dy; }
      var t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
      var cx = ax + t * dx - px, cy = ay + t * dy - py;
      return cx * cx + cy * cy;
    }

    function drawLinks() {
      var MAX = 198, MAX2 = MAX * MAX;
      var MOUSE_R = 96, MOUSE_R2 = MOUSE_R * MOUSE_R;
      var n = words.length;
      for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          var wi = words[i], wj = words[j];
          var dx = wi.x - wj.x, dy = wi.y - wj.y;
          var d2 = dx * dx + dy * dy;
          if (d2 > MAX2) continue;
          var dist = Math.sqrt(d2);
          var base = (1 - dist / MAX) * 0.24;

          /* boost se il mouse e vicino al segmento */
          var md2  = ptSegDist2(mouse.x, mouse.y, wi.x, wi.y, wj.x, wj.y);
          var boost = md2 < MOUSE_R2 ? (1 - Math.sqrt(md2) / MOUSE_R) * 0.55 : 0;

          /* boost se il mouse si muove veloce (scia) */
          var speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
          boost += Math.min(0.3, speed * 0.018) * (md2 < 12000 ? 1 : 0);

          var alpha = Math.min(0.55, base + boost * 0.75);
          alpha *= Math.min(1, wi.a / (wi.ba + 0.01)) * Math.min(1, wj.a / (wj.ba + 0.01));
          if (alpha < 0.01) continue;

          /* colore: stesso dominio -> colore del nodo, misto -> blu */
          var col = (wi.c === wj.c) ? wi.c : '#00b4ff';
          ctx.beginPath();
          ctx.moveTo(wi.x, wi.y);
          ctx.lineTo(wj.x, wj.y);
          ctx.strokeStyle  = col;
          ctx.globalAlpha  = alpha * globalFade;
          ctx.lineWidth    = boost > 0.15 ? 0.58 : 0.26;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    function updateWord(w) {
      /* repulsione mouse */
      var dx = w.x - mouse.x, dy = w.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      var REPEL2 = 4200; /* ~65px - stronger interaction */
      if (d2 < REPEL2 && d2 > 1) {
        var d = Math.sqrt(d2);
        var f = (Math.sqrt(REPEL2) - d) / Math.sqrt(REPEL2) * 0.03;
        w.vx += (dx / d) * f;
        w.vy += (dy / d) * f;
      }

      /* scia del mouse: impulso nella direzione di movimento */
      var TRAIL2 = 14000;
      if (d2 < TRAIL2 && d2 > 1) {
        var spd = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
        if (spd > 0.5) {
          w.vx += mouse.vx * 0.12;
          w.vy += mouse.vy * 0.12;
        }
      }

      /* fluttuazione libera randomica in qualunque direzione */
      w.ph += 0.016;
      var randAmp = (d2 < BIND_R2 ? 0.012 : 0.022);
      w.vx += (Math.random() - 0.5) * randAmp;
      w.vy += (Math.random() - 0.5) * randAmp;

      /* vicino al mouse: vincolo morbido, evita collasso tra nodi */
      var BIND_R2 = 17000;
      if (d2 < BIND_R2) {
        w.vx += (w.ax - w.x) * 0.0016;
        w.vy += (w.ay - w.y) * 0.0016;
      }

      /* cap velocita */
      var spd2 = Math.sqrt(w.vx * w.vx + w.vy * w.vy);
      var cap  = (d2 < BIND_R2 ? 0.26 : 0.36);
      if (spd2 > cap) { w.vx = w.vx / spd2 * cap; w.vy = w.vy / spd2 * cap; }
      w.vx *= (d2 < BIND_R2 ? 0.86 : 0.88);
      w.vy *= (d2 < BIND_R2 ? 0.86 : 0.88);
      w.x  += w.vx;  w.y  += w.vy;

      /* wrap */
      var m = 70;
      if (w.x < -m) w.x = W + m;
      if (w.x > W + m) w.x = -m;
      if (w.y < -m) w.y = H + m;
      if (w.y > H + m) w.y = -m;
      if (w.ax === 0 && w.ay === 0) { w.ax = w.x; w.ay = w.y; }

      /* alpha: fade-in + respiro + vicinanza mouse */
      var breath   = Math.sin(w.ph) * 0.04;
      var target   = Math.max(0.06, w.ba + breath);
      if (d2 < 14400) target = Math.min(0.95, target + (1 - Math.sqrt(d2) / 120) * 0.55);
      w.a += (target - w.a) * 0.04;
    }

    function drawWord(w) {
      ctx.font         = 'bold ' + w.s + 'px JetBrains Mono, monospace';
      ctx.fillStyle    = w.c;
      ctx.globalAlpha  = Math.max(0, w.a * 0.82 * globalFade);
      ctx.textBaseline = 'middle';
      ctx.fillText((w.sym || '•') + ' ' + w.t, w.x, w.y);
      ctx.globalAlpha  = 1;
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      time += 0.01;

      /* Aggiorna globalFade: decade dopo FADE_DELAY_MS di inattività */
      if (Date.now() - lastInteraction > FADE_DELAY_MS) {
        globalFade = Math.max(FADE_MIN, globalFade - FADE_SPEED);
      } else {
        globalFade = Math.min(1, globalFade + RECOVER_SPEED);
      }

      /* velocita mouse (per scia) */
      mouse.vx = mouse.x - mouse.px;
      mouse.vy = mouse.y - mouse.py;
  
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      drawLinks();
      for (var i = 0; i < words.length; i++) {
        updateWord(words[i]);
        drawWord(words[i]);
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf && !reducedMotion) raf = requestAnimationFrame(frame); }
    function stop()  { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    /* Fotogramma unico senza animazione (reduced motion) */
    function renderStatic() {
      ctx.clearRect(0, 0, W, H);
      globalFade = 1;
      words.forEach(function(w) { w.a = w.ba; });
      drawLinks();
      words.forEach(drawWord);
    }

    function refresh() {
      populate();
      if (reducedMotion) renderStatic();
    }

    function init() {
      canvas = document.getElementById('hero-canvas');
      if (!canvas || !canvas.getContext) return;
      ctx = canvas.getContext('2d');
      reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      resize();
      refresh();
      var _resizeTimer;
      window.addEventListener('resize', function() {
        resize();
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function() {
          refresh();
        }, 150);
      });
      document.addEventListener('langChange', refresh);
      /* scheda in background: niente fotogrammi sprecati */
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) stop(); else start();
      });
      window.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        lastInteraction = Date.now();
      });
      window.addEventListener('touchmove', function(e) {
        var t = e.touches[0];
        mouse.x = t.clientX;
        mouse.y = t.clientY;
        lastInteraction = Date.now();
      }, { passive: true });
      window.addEventListener('touchstart', function() {
        lastInteraction = Date.now();
      }, { passive: true });
      start();
    }

    function destroy() { stop(); }

    return { init: init, destroy: destroy };
  })();

  var HeroTypewriter = (function () {
    var el, phrases, idx, charIdx, deleting, timer;
    var SPEED_TYPE   = 60;
    var SPEED_DELETE = 35;
    var PAUSE_FULL   = 3800;
    var PAUSE_EMPTY  = 550;

    function pickNextIndex() {
      if (!phrases || phrases.length <= 1) return 0;
      var next = idx;
      var guard = 0;
      while (next === idx && guard < 8) {
        next = Math.floor(Math.random() * phrases.length);
        guard++;
      }
      return next === idx ? (idx + 1) % phrases.length : next;
    }

    function tick() {
      var phrase = phrases[idx];
      if (!deleting) {
        charIdx++;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx >= phrase.length) {
          timer = setTimeout(startDelete, PAUSE_FULL);
          return;
        }
      } else {
        charIdx--;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx <= 0) {
          deleting = false;
          idx = pickNextIndex();
          timer = setTimeout(tick, PAUSE_EMPTY);
          return;
        }
      }
      timer = setTimeout(tick, deleting ? SPEED_DELETE : SPEED_TYPE);
    }

    function startDelete() { deleting = true; tick(); }

    function fitText() {
      /* sizing gestito via CSS clamp */
      if (!el) return;
    }

    function init() {
      el = document.getElementById('hero-typewriter');
      if (!el) return;
      phrases = I18n.t('hero.typewriter_phrases');
      if (!Array.isArray(phrases) || !phrases.length) phrases = ['GiGa Labor.'];
      idx = Math.floor(Math.random() * phrases.length); charIdx = 0; deleting = false;
      clearTimeout(timer);
      tick();
    }

    function onChange() {
      if (!el) return;
      clearTimeout(timer);
      phrases = I18n.t('hero.typewriter_phrases');
      if (!Array.isArray(phrases) || !phrases.length) phrases = ['GiGa Labor.'];
      idx = Math.floor(Math.random() * phrases.length); charIdx = 0; deleting = false;
      tick();
    }

    return { init: init, onChange: onChange };
  })();

  /* =
     FADE VEIL - transizione fluida tema / lingua
  = */
  var FadeVeil = (function () {
    var veil;
    var DURATION = 280;

    function getVeil() {
      if (veil) return veil;
      veil = document.createElement('div');
      veil.id = 'fade-veil';
      veil.style.cssText = 'position:fixed;inset:0;background:var(--bg-base);opacity:0;pointer-events:none;z-index:9990;transition:opacity ' + DURATION + 'ms ease;';
      document.body.appendChild(veil);
      return veil;
    }

    function wrap(fn) {
      var v = getVeil();
      v.style.pointerEvents = 'all';
      v.style.opacity = '1';
      setTimeout(function() {
        fn();
        setTimeout(function() {
          v.style.opacity = '0';
          v.style.pointerEvents = 'none';
        }, DURATION);
      }, DURATION);
    }

    function wrapTheme(theme) { wrap(function() { Theme.set(theme); }); }
    function wrapLang(lang)   { wrap(function() { I18n.setLang(lang); }); }

    return { wrapTheme: wrapTheme, wrapLang: wrapLang };
  })();

  /* =
     MUSICA DI SOTTOFONDO - synth cinematico generativo in Web Audio
     Atmosfera alla Vangelis (pad "ottoni" che si gonfiano, melodie lente con
     vibrato, pioggia, riverbero lungo) su un motore alla Tron Legacy (basso in
     sedicesimi, arpeggio serrato, pad che pompano sul battito, ottoni gravi).
     Nessun file audio: tutto e sintetizzato dal vivo, le note sono generate.
     Parte da sola se il browser lo permette, altrimenti al primo clic o tasto.
     Il pulsante in topbar la spegne e la scelta resta salvata.
  = */
  var Ambient = (function () {
    var STORE_KEY = 'gl_audio';
    var VOLUME    = 0.6;            /* guadagno finale, dopo il compressore */
    var FADE_IN   = 4;              /* secondi */
    var FADE_OUT  = 1.2;
    var BPM       = 96;
    var STEP      = 60 / BPM / 4;   /* sedicesimo */
    var CHORD_SEC = STEP * 16 * 6;  /* sei battute per accordo (15 s) */
    var XFADE     = 6;              /* dissolvenza dei pad, a cavallo del cambio */

    /* Re minore con l'ombra frigia del bII (Eb): otto accordi, ~2 minuti per giro.
       Note MIDI, voci larghe; la prima e la fondamentale per il basso. */
    var CHORDS = [
      [50, 57, 60, 64, 65],   /* Dm9      */
      [46, 53, 57, 62, 64],   /* Bbmaj7#11 */
      [43, 50, 53, 57, 58],   /* Gm9      */
      [51, 58, 62, 65, 67],   /* Ebmaj9   */
      [50, 57, 62, 64, 65],   /* Dm9      */
      [48, 53, 57, 64, 67],   /* Fmaj9/C  */
      [46, 53, 57, 60, 62],   /* Bbmaj9   */
      [45, 52, 57, 62, 64]    /* Asus4    */
    ];
    var ARP  = [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 2, 1, 3, 4, 3];   /* indici nell'accordo */
    var BASS = [0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 12, 0, 12];  /* ottave sul basso */
    var DRONE  = 38;   /* D2, pedale sotto tutti gli accordi */
    /* luminosita del passa-basso dei pad per ogni tema (Hz) */
    var BRIGHT = { 'dark-tech': 2600, 'light': 3800, 'contrast': 3000 };

    var ctx = null;
    var comp, master, send, echoIn, padBus, pump, padFilter, brassBus, keysBus, leadBus, arpBus, bassBus, noiseBuf;
    var pref = 'on';
    var chordIdx = 0, nextChordAt = 0, nextStepAt = 0, step = 0;
    var harmony = [];   /* cambi d'accordo programmati: { at, notes } */
    var stopTimer;
    var GESTURES = ['pointerdown', 'keydown', 'touchend'];

    function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

    function impulse(seconds, decay) {
      var rate = ctx.sampleRate, len = Math.floor(rate * seconds);
      var buf = ctx.createBuffer(2, len, rate);
      for (var c = 0; c < 2; c++) {
        var d = buf.getChannelData(c);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
      return buf;
    }

    function pinkNoise(seconds) {
      var rate = ctx.sampleRate, len = Math.floor(rate * seconds);
      var buf = ctx.createBuffer(1, len, rate);
      var d = buf.getChannelData(0), b0 = 0, b1 = 0, b2 = 0;
      for (var i = 0; i < len; i++) {
        var w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.0990460;
        b1 = 0.96300 * b1 + w * 0.2965164;
        b2 = 0.57000 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
      }
      return buf;
    }

    function lfo(freq, depth, target) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq;
      g.gain.value = depth;
      o.connect(g); g.connect(target);
      o.start();
      return o;
    }

    function gain(v) { var g = ctx.createGain(); g.gain.value = v; return g; }

    function filter(type, freq, q) {
      var f = ctx.createBiquadFilter();
      f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
      return f;
    }

    /* uscita a secco + mandata al riverbero (+ eco, se richiesta) */
    function route(node, dry, wet, echo) {
      var d = gain(dry), w = gain(wet);
      node.connect(d); d.connect(comp);
      node.connect(w); w.connect(send);
      if (echo) { var e = gain(echo); node.connect(e); e.connect(echoIn); }
    }

    function build() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();

      comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -22; comp.knee.value = 18; comp.ratio.value = 3;
      comp.attack.value = 0.03;   comp.release.value = 0.3;
      /* un filo d'aria sugli acuti in uscita */
      var air = filter('highshelf', 3500);
      air.gain.value = 5;
      master = gain(0);
      comp.connect(air); air.connect(master); master.connect(ctx.destination);

      /* riverbero da cattedrale con un filo di pre-delay */
      send = gain(1);
      var pre = ctx.createDelay(1), verb = ctx.createConvolver(), damp = filter('lowpass', 7000);
      pre.delayTime.value = 0.035;
      verb.buffer = impulse(6, 2.2);
      send.connect(pre); pre.connect(verb); verb.connect(damp); damp.connect(comp);

      /* eco ping-pong a croma puntata, a tempo con l'arpeggio */
      echoIn = gain(1);
      var dl = ctx.createDelay(2), dr = ctx.createDelay(2), fbf = filter('lowpass', 2400), fb = gain(0.4);
      var merge = ctx.createChannelMerger(2), echoOut = gain(0.45);
      dl.delayTime.value = STEP * 3; dr.delayTime.value = STEP * 3;
      echoIn.connect(dl); dl.connect(fbf); fbf.connect(dr); dr.connect(fb); fb.connect(dl);
      dl.connect(merge, 0, 0); dr.connect(merge, 0, 1);
      merge.connect(echoOut); echoOut.connect(comp); echoOut.connect(send);

      /* pad: pompano sul battito, lasciano i bassi al basso, poi un passa-basso che respira */
      padBus = gain(1); pump = gain(1);
      var padCut = filter('highpass', 170);
      padFilter = filter('lowpass', BRIGHT[Theme.current] || BRIGHT['dark-tech'], 0.5);
      lfo(0.03, 400, padFilter.frequency);
      padBus.connect(pump); pump.connect(padCut); padCut.connect(padFilter);
      route(padFilter, 0.55, 0.9);

      brassBus = gain(1);
      var brassCut = filter('highpass', 60);
      brassBus.connect(brassCut); route(brassCut, 0.5, 0.8);
      keysBus  = gain(1);  route(keysBus, 0.3, 0.9, 1);
      leadBus  = gain(1);  route(leadBus, 0.45, 1, 0.3);

      /* arpeggio e basso: il loro volume sale e scende in cicli di un paio di minuti */
      arpBus = gain(1);
      var arpFilter = filter('lowpass', 2200, 4), arpLevel = gain(0.5);
      lfo(0.017, 1200, arpFilter.frequency);
      lfo(0.009, 0.5, arpLevel.gain);
      arpBus.connect(arpFilter); arpFilter.connect(arpLevel);
      route(arpLevel, 0.7, 0.6, 0.8);

      bassBus = gain(1);
      var bassFilter = filter('lowpass', 520, 6), bassLevel = gain(0.42);
      lfo(0.02, 220, bassFilter.frequency);
      lfo(0.006, 0.3, bassLevel.gain);
      bassBus.connect(bassFilter); bassFilter.connect(bassLevel);
      route(bassLevel, 0.9, 0.15);

      /* pioggia: rumore rosa tagliato in alto e in basso */
      noiseBuf = pinkNoise(4);
      var rain = ctx.createBufferSource(), hp = filter('highpass', 1800), lp = filter('lowpass', 7500), rainLevel = gain(0.06);
      rain.buffer = noiseBuf; rain.loop = true;
      lfo(0.03, 0.015, rainLevel.gain);
      rain.connect(hp); hp.connect(lp); lp.connect(rainLevel);
      route(rainLevel, 1, 0.3);
      rain.start();

      /* pedale grave */
      var drone = ctx.createOscillator(), droneLevel = gain(0.045);
      drone.frequency.value = mtof(DRONE);
      lfo(0.11, 0.015, droneLevel.gain);
      drone.connect(droneLevel); droneLevel.connect(comp);
      drone.start();

      /* l'accordo di partenza dipende dall'ora: cambiando pagina l'armonia prosegue */
      chordIdx = Math.floor(Date.now() / 1000 / CHORD_SEC) % CHORDS.length;
      nextChordAt = nextStepAt = ctx.currentTime + 0.05;
      ctx.onstatechange = onState;
      scheduleMusic();
      scheduleKeys();
      scheduleThunder();
      return true;
    }

    function notesAt(t) {
      var notes = harmony[0].notes;
      for (var i = 0; i < harmony.length && harmony[i].at <= t; i++) notes = harmony[i].notes;
      return notes;
    }

    /* pad "ottoni": tre dente di sega scordate che derivano piano di intonazione */
    function padNote(midi, t0, dur, dest) {
      var env = ctx.createGain(), pan = ctx.createStereoPanner();
      pan.pan.value = rand(-0.6, 0.6);
      env.gain.setValueAtTime(0, t0);
      env.gain.linearRampToValueAtTime(1, t0 + XFADE);
      env.gain.setValueAtTime(1, t0 + dur - XFADE);
      env.gain.linearRampToValueAtTime(0, t0 + dur);
      env.connect(pan); pan.connect(dest);
      var drift = ctx.createOscillator(), driftDepth = gain(5);
      drift.frequency.value = rand(0.08, 0.25);
      drift.connect(driftDepth);
      [-9, 0, 9].forEach(function (cents) {
        var o = ctx.createOscillator(), g = gain(0.045);
        o.type = 'sawtooth';
        o.frequency.value = mtof(midi);
        o.detune.value = cents + rand(-2, 2);
        driftDepth.connect(o.detune);
        o.connect(g); g.connect(env);
        o.start(t0); o.stop(t0 + dur + 0.1);
      });
      drift.start(t0); drift.stop(t0 + dur + 0.1);
    }

    /* ogni accordo ha il suo filtro risonante che si apre come un fiato */
    function chord(notes, t0, dur) {
      var swell = filter('lowpass', 250, 3), f = swell.frequency;
      f.setValueAtTime(250, t0);
      f.linearRampToValueAtTime(3200, t0 + XFADE + 1);
      f.linearRampToValueAtTime(1500, t0 + dur * 0.6);
      f.linearRampToValueAtTime(400, t0 + dur);
      swell.connect(padBus);
      notes.forEach(function (m) { padNote(m, t0, dur, swell); });
    }

    /* ottoni gravi sul cambio d'accordo: fondamentale, ottava sotto e quinta */
    function brass(root, t0) {
      var swell = filter('lowpass', 150, 2), env = gain(0);
      swell.frequency.setValueAtTime(150, t0);
      swell.frequency.linearRampToValueAtTime(1800, t0 + 1.4);
      swell.frequency.linearRampToValueAtTime(300, t0 + 6);
      env.gain.setValueAtTime(0, t0);
      env.gain.linearRampToValueAtTime(0.16, t0 + 0.9);
      env.gain.exponentialRampToValueAtTime(0.001, t0 + 7);
      swell.connect(env); env.connect(brassBus);
      [root - 12, root, root + 7].forEach(function (m) {
        [-8, 8].forEach(function (cents) {
          var o = ctx.createOscillator();
          o.type = 'sawtooth';
          o.frequency.value = mtof(m);
          o.detune.value = cents;
          o.connect(swell);
          o.start(t0); o.stop(t0 + 7.1);
        });
      });
    }

    function arpNote(midi, t0, accent) {
      var o = ctx.createOscillator(), env = ctx.createGain();
      o.type = 'square';
      o.frequency.value = mtof(midi);
      env.gain.setValueAtTime(0, t0);
      env.gain.linearRampToValueAtTime(accent ? 0.06 : 0.04, t0 + 0.003);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
      o.connect(env); env.connect(arpBus);
      o.start(t0); o.stop(t0 + 0.16);
    }

    function bassNote(midi, t0) {
      var o = ctx.createOscillator(), env = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.value = mtof(midi);
      env.gain.setValueAtTime(0, t0);
      env.gain.linearRampToValueAtTime(0.22, t0 + 0.004);
      env.gain.exponentialRampToValueAtTime(0.001, t0 + STEP * 0.9);
      o.connect(env); env.connect(bassBus);
      o.start(t0); o.stop(t0 + STEP);
    }

    /* melodia lenta da synth polifonico: legato, portamento e vibrato che arriva tardi */
    function phrase(notes, t0) {
      var pool = notes.map(function (n) { return n + 12; }).filter(function (n) { return n >= 60 && n <= 79; });
      if (pool.length < 2) return;
      var filt = filter('lowpass', 500, 2), env = gain(0);
      var vib = ctx.createOscillator(), vibDepth = gain(0);
      var oscs = [ctx.createOscillator(), ctx.createOscillator()];
      vib.frequency.value = 5.2;
      vibDepth.gain.setValueAtTime(0, t0);
      vibDepth.gain.linearRampToValueAtTime(14, t0 + 1.5);
      vib.connect(vibDepth);
      filt.connect(env); env.connect(leadBus);
      var t = t0, last = null, count = 2 + Math.floor(Math.random() * 3);
      for (var i = 0; i < count; i++) {
        var m;
        do { m = pick(pool); } while (m === last);
        last = m;
        var f = mtof(m), len = rand(1.6, 3.2);
        oscs.forEach(function (o) {
          if (i === 0) o.frequency.setValueAtTime(f, t);
          else o.frequency.setTargetAtTime(f, t, 0.09);
        });
        env.gain.setTargetAtTime(0.1, t, 0.25);
        filt.frequency.setTargetAtTime(2600, t, 0.35);
        env.gain.setTargetAtTime(0.065, t + len * 0.6, 0.4);
        filt.frequency.setTargetAtTime(1200, t + len * 0.6, 0.5);
        t += len;
      }
      env.gain.setTargetAtTime(0, t, 0.8);
      filt.frequency.setTargetAtTime(400, t, 0.8);
      oscs.forEach(function (o, k) {
        o.type = 'sawtooth';
        o.detune.value = k ? 6 : -6;
        vibDepth.connect(o.detune);
        o.connect(filt);
        o.start(t0); o.stop(t + 5);
      });
      vib.start(t0); vib.stop(t + 5);
    }

    /* piano elettrico in FM (rapporto 1:1): note sparse dell'accordo, due ottave sopra */
    function tine(midi, t0) {
      var f = mtof(midi);
      var car = ctx.createOscillator(), mod = ctx.createOscillator(), modDepth = ctx.createGain();
      var env = ctx.createGain(), pan = ctx.createStereoPanner();
      car.frequency.value = f; mod.frequency.value = f;
      modDepth.gain.setValueAtTime(f * 2.5, t0);
      modDepth.gain.exponentialRampToValueAtTime(f * 0.2, t0 + 1.5);
      mod.connect(modDepth); modDepth.connect(car.frequency);
      env.gain.setValueAtTime(0, t0);
      env.gain.linearRampToValueAtTime(0.07, t0 + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + 5);
      pan.pan.value = rand(-0.7, 0.7);
      car.connect(env); env.connect(pan); pan.connect(keysBus);
      car.start(t0); mod.start(t0); car.stop(t0 + 5.1); mod.stop(t0 + 5.1);
    }

    /* tuono lontano: rumore rosa filtrato molto in basso */
    function thunder(t0) {
      var src = ctx.createBufferSource(), lp = filter('lowpass', 90), env = gain(0);
      src.buffer = noiseBuf; src.loop = true;
      lp.frequency.setValueAtTime(90, t0);
      lp.frequency.linearRampToValueAtTime(260, t0 + 1.2);
      lp.frequency.linearRampToValueAtTime(70, t0 + 8);
      env.gain.setValueAtTime(0, t0);
      env.gain.linearRampToValueAtTime(0.8, t0 + 1.5);
      env.gain.exponentialRampToValueAtTime(0.001, t0 + 9);
      src.connect(lp); lp.connect(env); env.connect(comp); env.connect(send);
      src.start(t0, rand(0, 3)); src.stop(t0 + 9.2);
    }

    /* sequencer: accordi, basso, arpeggio e pompaggio sulla stessa griglia */
    function scheduleMusic() {
      if (ctx.state === 'running') {
        var now = ctx.currentTime, ahead = now + 1;
        if (nextChordAt < now) nextChordAt = now;
        if (nextStepAt < now) nextStepAt = now;
        /* i pad partono mezza dissolvenza prima del cambio, basso e arpeggio sul cambio */
        while (nextChordAt - XFADE / 2 < ahead) {
          var notes = CHORDS[chordIdx];
          chord(notes, Math.max(now, nextChordAt - XFADE / 2), CHORD_SEC + XFADE);
          if (Math.random() < 0.4) brass(notes[0], nextChordAt);
          if (Math.random() < 0.45) phrase(notes, nextChordAt + rand(3, 6));
          harmony.push({ at: nextChordAt, notes: notes });
          if (harmony.length > 3) harmony.shift();
          chordIdx = (chordIdx + 1) % CHORDS.length;
          nextChordAt += CHORD_SEC;
        }
        while (nextStepAt < ahead) {
          var sorted = notesAt(nextStepAt).slice().sort(function (a, b) { return a - b; });
          var s = step % 16;
          arpNote(sorted[ARP[s] % sorted.length] + 12, nextStepAt, s % 4 === 0);
          bassNote(sorted[0] - 12 + BASS[s], nextStepAt);
          if (s % 4 === 0) {
            pump.gain.setValueAtTime(0.6, nextStepAt);
            pump.gain.setTargetAtTime(1, nextStepAt + 0.01, 0.13);
          }
          step++;
          nextStepAt += STEP;
        }
      }
      setTimeout(scheduleMusic, 250);
    }

    function scheduleKeys() {
      if (ctx.state === 'running' && harmony.length) {
        var t = ctx.currentTime + 0.05, notes = notesAt(t);
        var n = Math.random() < 0.3 ? 3 : 1;
        for (var i = 0; i < n; i++) tine(Math.min(pick(notes) + 24, 89), t + i * STEP * 2);
      }
      setTimeout(scheduleKeys, rand(3000, 9000));
    }

    function scheduleThunder() {
      if (ctx.state === 'running') thunder(ctx.currentTime + 0.05);
      setTimeout(scheduleThunder, rand(45000, 100000));
    }

    function fadeTo(v, sec) {
      var g = master.gain, t = ctx.currentTime;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(v, t + sec);
    }

    function audible() { return !!ctx && ctx.state === 'running' && pref === 'on'; }

    /* documenti serviti: il proprio e, in navigazione continua, quello nel riquadro */
    function docs() {
      var list = [document];
      if (frame && frame.contentDocument) list.push(frame.contentDocument);
      return list;
    }

    function onState() {
      if (audible() && !document.hidden) {
        fadeTo(VOLUME, FADE_IN);
        docs().forEach(function (d) {
          GESTURES.forEach(function (ev) { d.removeEventListener(ev, onGesture, true); });
        });
      }
      paint();
    }

    /* porta l'audio dove deve stare: acceso se voluto e la scheda e visibile */
    function ensure() {
      var wanted = pref === 'on' && !document.hidden;
      clearTimeout(stopTimer);
      if (wanted) {
        if (!ctx && !build()) return;
        if (ctx.state === 'running') onState();
        else { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); }
      } else if (ctx && ctx.state === 'running') {
        fadeTo(0, FADE_OUT);
        stopTimer = setTimeout(function () { ctx.suspend(); }, FADE_OUT * 1000 + 100);
      }
      paint();
    }

    function onGesture(e) {
      if (e.target && e.target.closest && e.target.closest('.audio-btn')) return;
      if (pref === 'on') ensure();
    }

    function onTheme(e) {
      if (ctx) padFilter.frequency.setTargetAtTime(BRIGHT[e.detail] || BRIGHT['dark-tech'], ctx.currentTime, 2);
    }

    function toggle() {
      pref = audible() ? 'off' : 'on';
      try { localStorage.setItem(STORE_KEY, pref); } catch (e) {}
      ensure();
    }

    function paint() {
      var on = audible(), waiting = pref === 'on' && !on;
      docs().forEach(function (d) {
        d.querySelectorAll('.audio-btn').forEach(function (btn) {
          btn.classList.toggle('is-on', on);
          btn.classList.toggle('is-wait', waiting);
          btn.classList.toggle('is-off', pref === 'off');
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    }

    /* NAVIGAZIONE CONTINUA
       Con la musica accesa i link interni non ricaricano la finestra: la nuova pagina
       si apre in un riquadro a tutto schermo e questo documento, nascosto sotto,
       continua a suonare. Indirizzo, titolo e tasto Indietro seguono il riquadro. */
    var frame = null;

    function onLink(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      var url = new URL(a.href, a.ownerDocument.baseURI);
      if (!/^https?:$/.test(url.protocol)) return;
      if (url.origin !== location.origin) {
        /* i siti esterni non si aprono nel riquadro: escono dalla finestra */
        if (a.ownerDocument !== document) { e.preventDefault(); location.href = url.href; }
        return;
      }
      if (!frame && !(pref === 'on' && ctx)) return;
      var here = a.ownerDocument.location;
      if (url.pathname === here.pathname && url.search === here.search && url.hash) return;
      e.preventDefault();
      go(url.href);
    }

    function go(url) {
      if (!frame) {
        history.replaceState({ glFrame: location.href }, '', location.href);
        /* la pagina ospite resta nascosta: le sue animazioni si fermano al prossimo fotogramma */
        window.requestAnimationFrame = function () { return 0; };
        /* stili in linea: non dipendono da un CSS magari ancora in cache */
        Array.prototype.forEach.call(document.body.children, function (el) { el.style.setProperty('display', 'none', 'important'); });
        document.documentElement.style.overflow = document.body.style.overflow = 'hidden';
        frame = document.createElement('iframe');
        frame.id = 'gl-frame';
        frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:100000;background:var(--bg-base);';
        frame.addEventListener('load', onFrameLoad);
        document.body.appendChild(frame);
        window.addEventListener('popstate', function (e) {
          if (e.state && e.state.glFrame) frame.contentWindow.location.replace(e.state.glFrame);
        });
      }
      frame.contentWindow.location.replace(url);
      history.pushState({ glFrame: url }, '', url);
    }

    function onFrameLoad() {
      var w = frame.contentWindow, d = frame.contentDocument;
      /* il riquadro appena inserito carica prima una pagina vuota */
      if (!d || w.location.protocol === 'about:') return;
      function sync() {
        if (w.location.href !== location.href) history.replaceState({ glFrame: w.location.href }, '', w.location.href);
      }
      document.title = frame.title = d.title;
      sync();
      w.addEventListener('hashchange', sync);
      try { w.focus(); } catch (e) {}
    }

    /* collega un documento: pulsante, gesti, tema e link */
    function attach(doc) {
      doc.querySelectorAll('.audio-btn').forEach(function (btn) {
        btn.addEventListener('click', toggle);
      });
      if (!audible()) GESTURES.forEach(function (ev) { doc.addEventListener(ev, onGesture, true); });
      doc.addEventListener('themeChange', onTheme);
      doc.addEventListener('click', onLink);
      paint();
    }

    function init() {
      /* dentro il riquadro: suona il documento ospite, qui si collega solo la pagina */
      var host = null;
      try { if (window.parent !== window) host = window.parent.__glAudioHost; } catch (e) {}
      if (host) { host.attach(document); return; }
      window.__glAudioHost = { attach: attach };

      try { if (localStorage.getItem(STORE_KEY) === 'off') pref = 'off'; } catch (e) {}
      attach(document);
      document.addEventListener('visibilitychange', ensure);
      /* tentativo di partenza automatica; dove il browser lo vieta di sicuro
         si aspetta il primo gesto, senza creare il contesto (e l'avviso in console) */
      var policy = navigator.getAutoplayPolicy ? navigator.getAutoplayPolicy('audiocontext') : 'unknown';
      if (pref === 'on' && policy !== 'disallowed') ensure();
    }

    return { init: init };
  })();

  /* =
     BOOT
  = */
  function detectPage() {
    var path = window.location.pathname;
    var declared = document.body && document.body.getAttribute('data-page');
    if (declared === 'home') return 'home';
    if (/\/about/.test(path))              return 'about';
    if (/\/contact/.test(path))            return 'contact';
    if (/\/news/.test(path))               return 'news';
    if (/\/scritti/.test(path))            return 'scritti';
    if (/\/privacy/.test(path))            return 'privacy';
    if (/\/terms/.test(path))              return 'terms';
    if (/\/projects\/[^/]+$/.test(path)) return 'project-detail';
    if (/\/projects/.test(path))           return 'projects';
    return 'unknown';
  }

  function boot() {
    Theme.init();

    var page = detectPage();

    /* layout shell V3 (topbar + sidenav + bottombar) - PRIMA di I18n
       cosi applyStrings() trova gia i nodi data-i18n nel DOM */
    Layout.inject();

    /* lingua */
    I18n.init();

    /* topbar: tema, lingua, orologio */
    Navbar.init();

    /* musica di sottofondo (pulsante in topbar) */
    Ambient.init();

    /* bottombar: data dell'ultimo aggiornamento */
    Footer.init();

    /* animazioni scroll (sub-pagine) */
    Animations.init();

    /* page loader */
    var loader = document.getElementById('page-loader');
    if (loader) {
      setTimeout(function() { loader.classList.add('hidden'); }, 350);
    }

    if (page === 'home') {
      /* Shell V3: cursore + intro di prima visita */
      Shell.initHome();

      /* Sezioni della home: progetti e notizie dagli stessi dati delle pagine interne */
      ProjectCards.init();
      HomeNews.init();

      /* Aggiorna contatore progetti dall'array reale */
      var countEl = document.querySelector('.h-m-val[data-count]');
      if (countEl) {
        var n = PROJECTS.length;
        countEl.setAttribute('data-count', String(n));
        countEl.textContent = String(n);
      }

      /* Word cloud */
      HeroCanvas.init();
      /* Typewriter */
      HeroTypewriter.init();
      document.addEventListener('langChange', HeroTypewriter.onChange);
    }

    if (page === 'about')          { About.init(); }
    if (page === 'projects')       { ProjectCards.init(); }
    /* news: gestita dal manager dedicato nella pagina news.html */
    if (page === 'scritti')        { ScrittiPage.init(); }
    if (page === 'contact')        { Forms.setupForm('contact-form', 'form-feedback'); }
    if (page === 'project-detail') { ProjectDetail.init(); }

    /* conti alla rovescia: dopo le schede, che li creano */
  }

  document.addEventListener('DOMContentLoaded', boot);

})();
