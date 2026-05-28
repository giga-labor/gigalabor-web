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

    function apply(theme) {
      if (CFG.themes.indexOf(theme) === -1) theme = CFG.defaultTheme;
      _current = theme;
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.theme === theme);
      });
      try { localStorage.setItem(CFG.storageKeys.theme, theme); } catch(e) {}
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
      if (siteName && tagline) document.title = siteName + ' - ' + tagline;
      if (desc) {
        var metaDesc = document.querySelector('meta[name=\"description\"]');
        if (metaDesc) metaDesc.setAttribute('content', customDesc || desc);
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

  /* =
     LAYOUT - Topbar + Sidenav + Bottombar (Shell V3)
  = */
  var Layout = (function () {
    var isHome = false;

    function logoSVG() {
      return '<svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="15,2 28,27 2,27" fill="none" stroke="rgba(212,136,58,0.5)" stroke-width="1.2"/>' +
        '<text x="8" y="22" font-family="JetBrains Mono,monospace" font-size="9" font-weight="700" fill="#d4883a">G</text>' +
        '<text x="16" y="22" font-family="JetBrains Mono,monospace" font-size="9" font-weight="700" fill="#00b4ff">G</text>' +
        '</svg>';
    }

    function icon(type) {
      var icons = {
        proj:    '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="1.5" width="6.5" height="6.5" rx=".5"/><rect x="10" y="1.5" width="6.5" height="6.5" rx=".5"/><rect x="1.5" y="10" width="6.5" height="6.5" rx=".5"/><rect x="10" y="10" width="6.5" height="6.5" rx=".5"/></svg>',
        lab:     '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M7 2v7l-4 6h12l-4-6V2" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="2" x2="12" y2="2" stroke-linecap="round"/><circle cx="11" cy="13" r="1.2" fill="currentColor" stroke="none" opacity=".5"/></svg>',
        news:    '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="3" width="14" height="12" rx="1"/><line x1="5" y1="7" x2="13" y2="7" stroke-linecap="round"/><line x1="5" y1="10" x2="10" y2="10" stroke-linecap="round"/></svg>',
        about:   '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="9" cy="6" r="3"/><path d="M2 16c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke-linecap="round"/></svg>',
        contact: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="4" width="14" height="10" rx="1"/><polyline points="2,4 9,10 16,4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      };
      return icons[type] || '';
    }

    function topbarHTML() {
      var px = rootPrefix();
      return '<div id="tb">' +
        '<a class="tb-logo" href="' + px + 'home.html">' +
          '<div class="tb-logo-mark">' + logoSVG() + '</div>' +
          '<div class="tb-logo-text"><span class="gi">Gi</span><span class="ga">Ga</span><span class="labor"> Labor</span></div>' +
        '</a>' +
        '<div class="tb-sep"></div>' +
        '<div class="tb-live"><div class="pip"></div><span data-i18n="hero.system_status"></span></div>' +
        '<div class="tb-r">' +
          '<div class="theme-panel" role="group" aria-label="Seleziona tema">' +
            '<button class="theme-btn theme-btn--dark"     data-theme="dark-tech" title="Dark Tech"     aria-label="Dark Tech"></button>' +
            '<button class="theme-btn theme-btn--light"    data-theme="light"     title="Light"         aria-label="Light"></button>' +
            '<button class="theme-btn theme-btn--contrast" data-theme="contrast"  title="High Contrast" aria-label="High Contrast"></button>' +
          '</div>' +
          '<button class="navbar__lang-btn" id="lang-toggle" aria-label="Cambia lingua">EN</button>' +
          '<div class="tb-sep"></div>' +
          '<span class="tb-time" id="tb-time">--:--:--</span>' +
        '</div>' +
      '</div>';
    }

    function sidenavHTML() {
      var px = rootPrefix();
      var path = window.location.pathname;
      var items = [
        { id: 'proj',    labelKey: 'nav.projects', href: px + 'pages/projects.html', page: 'projects' },
        { id: 'lab',     labelKey: 'nav.home',     href: px + 'home.html',           page: 'home'     },
        { id: 'news',    labelKey: 'nav.news',     href: px + 'pages/news.html',     page: 'news'     },
        { id: 'about',   labelKey: 'nav.about',    href: px + 'pages/about.html',    page: 'about'    },
        { id: 'contact', labelKey: 'nav.contact',  href: px + 'pages/contact.html',  page: 'contact'  }
      ];

      function isActive(item) {
        if (isHome) return false; // home uses panel system
        return path.indexOf(item.page) !== -1;
      }

      var itemsHTML = items.map(function(item) {
        var activeClass = isActive(item) ? ' on' : '';
        if (isHome) {
          return '<div class="si' + activeClass + '" data-p="' + item.id + '" role="button" tabindex="0" aria-label="">' +
            icon(item.id) +
            '<span class="si-tt" data-i18n="' + item.labelKey + '"></span>' +
            '<span class="si-arrow">\u203a</span>' +
          '</div>';
        } else {
          return '<a class="si' + activeClass + '" href="' + item.href + '" aria-label="">' +
            icon(item.id) +
            '<span class="si-tt" data-i18n="' + item.labelKey + '"></span>' +
          '</a>';
        }
      }).join('');

      return '<nav id="side" aria-label="Navigazione principale">' + itemsHTML + '</nav>';
    }

    function bottombarHTML() {
      var px = rootPrefix();
      return '<div id="bb">' +
        '<span data-i18n="footer.tagline"></span>' +
        '<span class="bb-sep">\u00b7</span>' +
        '<span id="bb-msg"></span>' +
        '<div class="bb-r">' +
          '<a href="' + px + 'pages/privacy.html" data-i18n="footer.links.privacy" style="color:inherit;text-decoration:none;margin-right:.8rem"></a>' +
          '<a href="' + px + 'pages/terms.html"   data-i18n="footer.links.terms"   style="color:inherit;text-decoration:none;margin-right:.8rem"></a>' +
          '<span data-i18n="footer.copy"></span>' +
        '</div>' +
      '</div>' +
      '<button id="back-to-top" aria-label="" data-i18n-attr="aria-label:ui.back_to_top">\u2191</button>';
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
      var subject = subjectRaw ? ('Nuovo invio [' + subjectRaw + '] da gigalabor.it') : 'Nuovo contatto da gigalabor.it';
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
        _captcha: 'false',
        _template: 'table',
        _replyto: payload.email || '',
        name: payload.name,
        user_email: payload.email || '--',
        category: payload.subjectRaw || '--',
        publish_consent: payload.publish ? 'yes' : 'no',
        message: payload.message,
        submitted_at_utc: payload.ts,
        source: 'gigalabor.it/contact',
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
        btn.classList.add('loading');
        btn.disabled = true;
        if (formId === 'contact-form' || formId === 'scritti-form') {
          var payload = buildPayload(form);
          postFormSubmitAjax(payload).then(function() {
            btn.classList.remove('loading');
            btn.disabled = false;
            showFeedback(feedback, 'success', I18n.t('forms.success.sent'));
            form.reset();
            closeScrittiFormIfNeeded(formId);
          }).catch(function() {
            postFormSubmitNoCors(payload).then(function() {
              btn.classList.remove('loading');
              btn.disabled = false;
              showFeedback(feedback, 'success', I18n.t('forms.success.sent'));
              form.reset();
              closeScrittiFormIfNeeded(formId);
            }).catch(function() {
              btn.classList.remove('loading');
              btn.disabled = false;
              openMailtoFallback(form);
              showFeedback(feedback, 'success', I18n.t('forms.success.sent'));
              form.reset();
              closeScrittiFormIfNeeded(formId);
            });
          });
          return;
        }
        setTimeout(function() {
          btn.classList.remove('loading');
          btn.disabled = false;
          showFeedback(feedback, 'success', I18n.t('forms.success.sent'));
          form.reset();
          closeScrittiFormIfNeeded(formId);
        }, 1000);
      });
    }

    function showFeedback(el, type, msg) {
      if (!el) return;
      el.textContent   = msg;
      el.className     = 'form-feedback form-feedback--' + type;
      el.style.display = 'block';
      setTimeout(function() { if (el) el.style.display = 'none'; }, 5000);
    }

    return { setupForm: setupForm };
  })();

  /* =
     NEWS - filtri categoria
  = */
  var News = (function () {
    function init() {
      var btns  = document.querySelectorAll('.filter-btn');
      var cards = document.querySelectorAll('.news-card');
      if (!btns.length) return;
      btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          btns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var filter = btn.dataset.filter;
          cards.forEach(function(card) {
            card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
          });
        });
      });
    }
    return { init: init };
  })();

  /* =
     HOME NEWS PREVIEW - ultime 3 notizie da news.cards
  = */
  var HomeNewsPreview = (function () {
    function toList(cardsObj) {
      if (!cardsObj || typeof cardsObj !== 'object') return [];
      return Object.keys(cardsObj).map(function(k) { return cardsObj[k]; });
    }

    function render() {
      var root = document.getElementById('home-news-preview');
      if (!root) return;
      var slots = root.querySelectorAll('[data-home-news-item]');
      if (!slots.length) return;

      var cards = toList(I18n.t('news.cards')).filter(function(c) {
        return c && c.sort_date && c.date && c.title && c.excerpt;
      });

      cards.sort(function(a, b) {
        var ta = Date.parse(a.sort_date) || 0;
        var tb = Date.parse(b.sort_date) || 0;
        return tb - ta;
      });

      var top3 = cards.slice(0, 3);
      slots.forEach(function(slot, i) {
        var n = top3[i];
        var dateEl = slot.querySelector('[data-role="date"]');
        var titleEl = slot.querySelector('[data-role="title"]');
        var excerptEl = slot.querySelector('[data-role="excerpt"]');
        if (!n) {
          slot.style.display = 'none';
          return;
        }
        slot.style.display = '';
        if (dateEl) dateEl.textContent = n.date;
        if (titleEl) titleEl.textContent = n.title;
        if (excerptEl) excerptEl.textContent = n.excerpt;
      });
    }

    function init() {
      render();
      document.addEventListener('langChange', render);
    }

    return { init: init, render: render };
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
     SHELL - Cursor, Intro, Panel system (home page)
  = */
  var Shell = (function () {

    /* - Cursor - */
    function initCursor() {
      var cur  = document.getElementById('cur');
      var curR = document.getElementById('cur-r');
      if (!cur || !curR) return;
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
        document.querySelectorAll('.si, .p-close, .tb-logo, .theme-btn, #lang-toggle').forEach(addXL);
      }, 600);
    }

    /* - Intro - */
    function initIntroSplash() {
      /* Usato da initSplash() - dismissal redirecta a home.html */
      var intro = document.getElementById('intro');
      if (!intro) return;
      function enter() {
        if (intro.classList.contains('out')) return;
        intro.classList.add('out');
        setTimeout(function() { window.location.href = './home.html'; }, 800);
      }
      intro.addEventListener('click', enter);
      window.addEventListener('keydown', function handler(e) {
        if (!intro.classList.contains('out')) enter();
        window.removeEventListener('keydown', handler);
      });
    }

    function initSplash() {
      initCursor();
      initIntroSplash();
    }

    /* - Panel content renderers - */
    var PANEL_DEF = {
      proj: {
        kickerKey: 'sections.ecosystem_label',
        titleKey:  'sections.projects_title',
        subKey:    'sections.projects_subtitle',
        msgKey:    'nav.projects',
        render: function(body) {
          var i18nProj   = get(I18N_ALL[I18n.current], 'projects') || {};
          var i18nStatus = get(I18N_ALL[I18n.current], 'status')   || {};
          var html = '<div class="p-sec">' + (I18n.t('sections.ecosystem_label') || 'Progetti') + '</div>';
          PROJECTS.forEach(function(meta) {
            var data = i18nProj[meta.id];
            if (!data) return;
            var statusLabel = i18nStatus[data.status] || data.status;
            var sc = data.status === 'active' ? 'badge badge--active' :
                     data.status === 'development' ? 'badge badge--development' : 'badge badge--ongoing';
            html += '<a class="pc" href="' + rootPrefix() + meta.page + '" style="--pc-color:' + meta.color + '">' +
              '<div class="pc-top"><span class="pc-name">' + data.name + '</span><span class="pc-icon">' + meta.icon + '</span></div>' +
              '<div class="pc-cat">' + data.category + '</div>' +
              '<div class="pc-desc">' + data.short + '</div>' +
              '<div class="pc-tags"><span class="' + sc + '">' + statusLabel + '</span>' +
              data.tags.slice(0,2).map(function(t){ return '<span class="tag">' + t + '</span>'; }).join('') +
              '</div></a>';
          });
          body.innerHTML = html;
        }
      },
      lab: {
        kickerKey: 'sections.lab_title',
        titleKey:  'sections.lab_title',
        subKey:    'sections.lab_subtitle',
        msgKey:    'sections.lab_title',
        render: function(body) {
          var vals = I18n.t('about.values');
          var valHtml = Array.isArray(vals) ? vals.map(function(v){ return '<div class="ab-val">' + v + '</div>'; }).join('') : '';
          body.innerHTML =
            '<div class="p-sec">' + (I18n.t('sections.mission_label') || 'Approccio') + '</div>' +
            '<div class="ab-body">' + (I18n.t('about.mission') || '') + '</div>' +
            '<div class="p-sec" style="margin-top:1rem">' + (I18n.t('about.values_title') || 'Valori') + '</div>' +
            valHtml +
            '<div class="p-sec" style="margin-top:1rem">Stack</div>' +
            [['Backend','Python, Node.js','a'],['Infra','Linux, Docker','b'],['AI','LLM, agenti locali',''],['Frontend','Vanilla JS, CSS','a']]
            .map(function(r){ return '<div class="sr"><span class="sr-k">'+r[0]+'</span><span class="sr-v '+r[2]+'">'+r[1]+'</span></div>'; }).join('');
        }
      },
      news: {
        kickerKey: 'sections.updates_label',
        titleKey:  'nav.news',
        subKey:    'sections.updates_label',
        msgKey:    'nav.news',
        render: function(body) {
          var lang = (I18n && I18n.current) ? I18n.current : 'it';
          var meta = (window.GL && Array.isArray(window.GL.NEWS)) ? window.GL.NEWS : [];
          var strings = (window.GL && window.GL.newsStrings && window.GL.newsStrings[lang]) ? window.GL.newsStrings[lang] :
                        ((window.GL && window.GL.newsStrings && window.GL.newsStrings.it) ? window.GL.newsStrings.it : {});
          var list = meta
            .map(function(n){
              var t = strings[n.id];
              if (!t) return null;
              return {
                id: n.id || '',
                title: t.title || '',
                date: t.date || '',
                category: n.category || '',
                sort_date: n.sort_date || ''
              };
            })
            .filter(function(c){ return c && c.title; })
            .sort(function(a,b){ return String(b.sort_date).localeCompare(String(a.sort_date)); })
            .slice(0,8);
          var html = '<div class="p-sec">' + (I18n.t('sections.updates_label') || 'Recenti') + '</div>';
          if (!list.length) {
            html += '<div style="font-size:.65rem;color:var(--text-muted);padding:.5rem 0">Nessuna notizia disponibile</div>';
          } else {
            list.forEach(function(n) {
              html += '<div class="p-news-item" data-news-id="' + (n.id || '') + '" tabindex="0" role="button">' +
                '<div class="p-news-meta">' +
                  '<span class="p-news-cat">' + (n.category || '') + '</span>' +
                  '<span class="p-news-date">' + (n.date || '') + '</span>' +
                '</div>' +
                '<div class="p-news-title">' + (n.title || '') + '</div>' +
              '</div>';
            });
          }
          body.innerHTML = html;
          bindPanelNewsTips(body);
        }
      },
      about: {
        kickerKey: 'sections.about_title',
        titleKey:  'about.headline',
        subKey:    'meta.tagline',
        msgKey:    'nav.about',
        render: function(body) {
          var vals = I18n.t('about.values');
          var features = I18n.t('about.features') || {};
          var valHtml = Array.isArray(vals) ? vals.map(function(v){ return '<div class="ab-val">' + v + '</div>'; }).join('') : '';
          var fHtml = '';
          ['item1','item2','item3','item4'].forEach(function(k){
            var f = features[k];
            if (f) fHtml += '<div class="sr"><span class="sr-k">' + f.title + '</span><span class="sr-v" style="font-size:.58rem;color:var(--text-muted);max-width:160px;text-align:right">' + f.desc + '</span></div>';
          });
          body.innerHTML =
            '<div class="p-sec">' + (I18n.t('sections.about_title') || 'Chi siamo') + '</div>' +
            '<div class="ab-body">' + (I18n.t('about.body') || '') + '</div>' +
            '<div class="p-sec" style="margin-top:1rem">' + (I18n.t('about.values_title') || 'Valori') + '</div>' +
            valHtml +
            (fHtml ? '<div class="p-sec" style="margin-top:1rem">' + (I18n.t('about.mission_title') || 'Approccio') + '</div>' + fHtml : '');
        }
      },
      contact: {
        kickerKey: 'sections.contact_title',
        titleKey:  'contact.headline',
        subKey:    'contact.subheadline',
        msgKey:    'nav.contact',
        render: function(body) {
          body.innerHTML =
            '<div class="p-sec">' + (I18n.t('sections.contact_title') || 'Contatti') + '</div>' +
            '<div class="cr"><span class="cr-icon">@</span><div class="cr-text"><a href="mailto:' + (I18n.t('contact.email_address') || 'giga.labor2026@gmail.com') + '">' + (I18n.t('contact.email_address') || 'giga.labor2026@gmail.com') + '</a></div></div>' +
            '<div class="cr"><span class="cr-icon">⌘</span><div class="cr-text"><a href="https://gigalabor.it" target="_blank">gigalabor.it</a></div></div>' +
            '<div class="p-sec" style="margin-top:1.2rem">' + (I18n.t('contact.headline') || 'Messaggio') + '</div>' +
            '<form id="panel-contact-form">' +
              '<div class="p-form-field">' +
                '<label class="p-form-label" for="pc-email">' + (I18n.t('contact.email_label') || 'Email') + '</label>' +
                '<input class="p-form-input" id="pc-email" name="email" type="email">' +
              '</div>' +
              '<div class="p-form-field">' +
                '<label class="p-form-label" for="pc-msg">' + (I18n.t('contact.message_label') || 'Messaggio') + '</label>' +
                '<textarea class="p-form-textarea" id="pc-msg" name="message"></textarea>' +
              '</div>' +
              '<div id="panel-form-feedback"></div>' +
              '<button class="p-form-submit" type="submit">' + (I18n.t('contact.send_btn') || 'Invia') + '</button>' +
            '</form>';
          Forms.setupForm('panel-contact-form', 'panel-form-feedback');
        }
      }
    };

    /* - Panel system - */
    var currentPanel = null;
    var panelEl, kicker, ptitle, psub, pbody, bbMsg, sideEl;

    function buildPanelDOM() {
      var root = document.getElementById('panel-root');
      if (!root) return;
      root.innerHTML =
        '<div id="panel">' +
          '<div class="p-head">' +
            '<div class="p-close" id="p-cls">✕</div>' +
            '<span class="p-kicker" id="p-kicker"></span>' +
            '<div class="p-title" id="p-title"></div>' +
            '<span class="p-sub" id="p-sub"></span>' +
          '</div>' +
          '<div class="p-body" id="p-body"></div>' +
        '</div>';
      panelEl = document.getElementById('panel');
      kicker  = document.getElementById('p-kicker');
      ptitle  = document.getElementById('p-title');
      psub    = document.getElementById('p-sub');
      pbody   = document.getElementById('p-body');
      bbMsg   = document.getElementById('bb-msg');
      sideEl  = document.getElementById('side');

      document.getElementById('p-cls').addEventListener('click', closePanel);
    }

    function showPanel(id) {
      var def = PANEL_DEF[id];
      if (!def) return;
      currentPanel = id;
      if (kicker) kicker.textContent = I18n.t(def.kickerKey) || '';
      if (ptitle)  ptitle.textContent = I18n.t(def.titleKey)  || '';
      if (psub)    psub.textContent   = I18n.t(def.subKey)    || '';
      if (bbMsg)   bbMsg.textContent  = I18n.t(def.msgKey)    || '';
      if (pbody)   def.render(pbody);
      if (panelEl) panelEl.classList.add('open');
      if (sideEl)  {
        sideEl.classList.add('used');
        sideEl.querySelectorAll('.si').forEach(function(s) {
          s.classList.toggle('on', s.dataset.p === id);
        });
      }
    }

    function closePanel() {
      if (panelEl) panelEl.classList.remove('open');
      if (bbMsg)   bbMsg.textContent = '';
      currentPanel = null;
      if (sideEl) sideEl.querySelectorAll('.si').forEach(function(s) { s.classList.remove('on'); });
    }

    function refreshPanel() {
      if (currentPanel && PANEL_DEF[currentPanel]) showPanel(currentPanel);
    }

    function initPanels() {
      buildPanelDOM();
      document.querySelectorAll('.si[data-p]').forEach(function(si) {
        si.addEventListener('click', function() {
          var id = si.dataset.p;
          if (currentPanel === id && panelEl && panelEl.classList.contains('open')) {
            closePanel();
          } else {
            showPanel(id);
          }
        });
        si.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); si.click(); }
        });
      });
      document.addEventListener('langChange', refreshPanel);
    }

    function getNewsTextById(newsId) {
      if (!newsId) return null;
      var lang = (I18n && I18n.current) ? I18n.current : 'it';
      var ns = (window.GL && window.GL.newsStrings) ? window.GL.newsStrings : {};
      return (ns[lang] && ns[lang][newsId]) || (ns.it && ns.it[newsId]) || null;
    }

    function ensureNewsTipDOM() {
      var existing = document.getElementById('panel-news-tip');
      if (existing) return existing;
      var wrap = document.createElement('div');
      wrap.id = 'panel-news-tip';
      wrap.className = 'panel-news-tip';
      wrap.style.cssText = 'position:fixed;inset:0;z-index:2200;opacity:0;pointer-events:none;transition:opacity .22s ease;';
      wrap.innerHTML =
        '<div class="panel-news-tip__backdrop" data-close-tip style="position:absolute;inset:0;background:rgba(0,0,0,.66)"></div>' +
        '<div class="panel-news-tip__panel" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,calc(100vw - 2rem));max-height:82vh;overflow:auto;background:var(--bg-surface);border:1px solid var(--border-light);border-radius:12px;padding:1rem 1.2rem 1.3rem;">' +
          '<button class="panel-news-tip__close" data-close-tip aria-label="close" style="position:absolute;right:.8rem;top:.7rem;width:28px;height:28px;border-radius:50%;border:1px solid var(--border);background:var(--bg-card);color:var(--text-secondary);cursor:pointer;">×</button>' +
          '<div class="panel-news-tip__date" id="panel-news-tip-date" style="font-family:JetBrains Mono,monospace;font-size:.62rem;color:var(--text-muted);margin-bottom:.55rem;"></div>' +
          '<h3 class="panel-news-tip__title" id="panel-news-tip-title" style="font-size:.95rem;line-height:1.4;color:var(--text-primary);margin-bottom:.8rem;padding-right:1.6rem;"></h3>' +
          '<div class="panel-news-tip__body" id="panel-news-tip-body" style="font-size:.72rem;color:var(--text-secondary);line-height:1.75;"></div>' +
          '<div class="panel-news-tip__source" id="panel-news-tip-source" style="margin-top:.95rem;padding-top:.75rem;border-top:1px solid var(--border);font-size:.62rem;color:var(--text-muted);"></div>' +
        '</div>';
      document.body.appendChild(wrap);
      wrap.querySelectorAll('[data-close-tip]').forEach(function(el) {
        el.addEventListener('click', function() {
          wrap.classList.remove('open');
          wrap.style.opacity = '0';
          wrap.style.pointerEvents = 'none';
        });
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          wrap.classList.remove('open');
          wrap.style.opacity = '0';
          wrap.style.pointerEvents = 'none';
        }
      });
      return wrap;
    }

    function openPanelNewsTip(newsId) {
      var t = getNewsTextById(newsId);
      if (!t) return;
      var tip = ensureNewsTipDOM();
      var dateEl = document.getElementById('panel-news-tip-date');
      var titleEl = document.getElementById('panel-news-tip-title');
      var bodyEl = document.getElementById('panel-news-tip-body');
      var sourceEl = document.getElementById('panel-news-tip-source');
      if (dateEl) dateEl.textContent = t.date || '';
      if (titleEl) titleEl.textContent = t.title || '';
      if (bodyEl) {
        var parts = String(t.body || t.excerpt || '').split('\n\n');
        bodyEl.innerHTML = parts.map(function(p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
      }
      if (sourceEl) {
        var srcLabel = (typeof I18n !== 'undefined') ? (I18n.t('news.source') || 'Fonte') : 'Fonte';
        var srcName = t.source_name || '';
        var srcUrl = t.source_url || '#';
        sourceEl.innerHTML = '<span>' + srcLabel + ':</span> <a href="' + srcUrl + '" target="_blank" rel="noopener">' + srcName + '</a>';
      }
      tip.classList.add('open');
      tip.style.opacity = '1';
      tip.style.pointerEvents = 'all';
    }

    function bindPanelNewsTips(root) {
      if (!root) return;
      root.querySelectorAll('.p-news-item[data-news-id]').forEach(function(el) {
        el.addEventListener('click', function() {
          openPanelNewsTip(el.getAttribute('data-news-id'));
        });
        el.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPanelNewsTip(el.getAttribute('data-news-id'));
          }
        });
      });
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
      /* Home: nessun intro (gia rimosso dall'HTML), cursor + panels + tooltip ratio */
      initCursor();
      initPanels();
      initRatioTooltip();
    }

    return { initHome: initHome, initSplash: initSplash, showPanel: showPanel };
  })();

  /* =
     HERO CANVAS - word cloud neurale con interazione mouse
  = */
  var HeroCanvas = (function () {
    var canvas, ctx, W, H, raf;
    var canvasRect = null;
    var NODE_COLORS = ['#00b4ff', '#d4883a', '#b060ff', '#ffb000', '#3a6880'];
    var mouse = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999 };
    var words = [];
    var time  = 0;

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

      POOL.forEach(function() {
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
      // Densifica il grafo solo con nodi semantici (mai vuoti).
      var area = (W * H) || (window.innerWidth * window.innerHeight);
      var extraNodes = Math.max(55, Math.min(140, Math.floor(area / 17000)));
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
          ctx.globalAlpha  = alpha;
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
      ctx.globalAlpha  = Math.max(0, w.a * 0.82);
      ctx.textBaseline = 'middle';
      ctx.fillText((w.sym || '•') + ' ' + w.t, w.x, w.y);
      ctx.globalAlpha  = 1;
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      time += 0.01;
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

    function init() {
      canvas = document.getElementById('hero-canvas');
      if (!canvas || !canvas.getContext) return;
      ctx = canvas.getContext('2d');
      resize();
      populate();
      window.addEventListener('resize', function() { resize(); populate(); });
      document.addEventListener('langChange', function() { populate(); });
      window.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
      window.addEventListener('touchmove', function(e) {
        var t = e.touches[0];
        mouse.x = t.clientX;
        mouse.y = t.clientY;
      }, { passive: true });
      frame();
    }

    function destroy() { if (raf) cancelAnimationFrame(raf); }

    return { init: init, destroy: destroy };
  })();

  var HeroTypewriter = (function () {
    var el, phrases, idx, charIdx, deleting, timer;
    var SPEED_TYPE   = 60;
    var SPEED_DELETE = 35;
    var PAUSE_FULL   = 3800;
    var PAUSE_EMPTY  = 550;

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
          idx = (idx + 1) % phrases.length;
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
      idx = 0; charIdx = 0; deleting = false;
      clearTimeout(timer);
      tick();
    }

    function onChange() {
      if (!el) return;
      clearTimeout(timer);
      phrases = I18n.t('hero.typewriter_phrases');
      if (!Array.isArray(phrases) || !phrases.length) phrases = ['GiGa Labor.'];
      idx = 0; charIdx = 0; deleting = false;
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
     BOOT
  = */
  function detectPage() {
    var path = window.location.pathname;
    if (/\/$/.test(path) && !/\/pages\//.test(path)) return 'splash';
    if (path === '/' || path === '' || /index\.html$/.test(path)) return 'splash';
    if (/home\.html$/.test(path)) return 'home';
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

    /* -- SPLASH -- entra sul sito, poi redirect a home.html */
    if (page === 'splash') {
      I18n.init();
      var splashLoader = document.getElementById('page-loader');
      if (splashLoader) setTimeout(function() { splashLoader.classList.add('hidden'); }, 350);
      Shell.initSplash();
      HeroCanvas.init();
      return;
    }

    /* -- TUTTE LE ALTRE PAGINE (home + sub-pages) -- */

    /* layout shell V3 (topbar + sidenav + bottombar) - PRIMA di I18n
       cosi applyStrings() trova gia i nodi data-i18n nel DOM */
    Layout.inject();

    /* lingua */
    I18n.init();

    /* topbar: tema, lingua, orologio */
    Navbar.init();

    /* animazioni scroll (sub-pagine) */
    Animations.init();

    /* page loader */
    var loader = document.getElementById('page-loader');
    if (loader) {
      setTimeout(function() { loader.classList.add('hidden'); }, 350);
    }

    /* back to top */
    var btt = document.getElementById('back-to-top');
    if (btt) {
      window.addEventListener('scroll', function() {
        btt.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
      btt.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (page === 'home') {
      /* Shell V3: cursor + panel system (niente intro) */
      Shell.initHome();

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
  }

  document.addEventListener('DOMContentLoaded', boot);

})();


