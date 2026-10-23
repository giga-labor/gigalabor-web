/**
 * gl-data.js - Configurazione e progetti del sito GiGa Labor
 * Nessun fetch, nessun JSON esterno. Funziona su file:// e HTTP.
 */

window.GL = {

  config: {
    defaultLang:    'it',
    supportedLangs: ['it', 'en'],
    storageKeys: { theme: 'gl_theme', lang: 'gl_lang' },
    themes: ['dark-tech', 'light', 'contrast'],
    defaultTheme: 'dark-tech',
    siteUrl: 'https://giga-labor.github.io/gigalabor-web/',   /* indirizzo pubblico: usato per link e oggetto delle email */
    formsubmit: { adminEmail: 'giga.labor2026@gmail.com' }
  },

  projects: [
    { id: 'controlchaos', icon: '\u{1F300}', color: '#00b4ff', page: 'pages/projects/controlchaos.html', updated_at: '2026-01-15', order: 1 },
    { id: 'evobrain',     icon: '\u{1F9E0}', color: '#8b5cf6', page: 'pages/projects/evobrain.html',     updated_at: '2026-02-10', order: 2 },
    { id: 'iargos',       icon: '\u{1F916}', color: '#d4883a', page: 'pages/projects/iargos.html',       updated_at: '2026-03-01', order: 3 },
    { id: 'lab',          icon: '\u{1F9EA}', color: '#ffb000', page: 'pages/projects/lab.html',          updated_at: '2026-03-15', order: 4 },
    { id: 'kairos',       icon: 'K·O',       color: '#7aae8a', page: 'pages/projects/kairos.html',       updated_at: '2026-06-08', order: 5 },
    { id: 'betareader',   icon: '📖',        color: '#c8a27c', page: 'pages/projects/betareader.html',   updated_at: '2026-09-28', order: 6 },
    { id: 'bloom',        icon: '🌸',        color: '#e2607f', page: 'pages/projects/bloom.html',        updated_at: '2026-10-23', order: 7,
      /* Fine del test chiuso su Google Play: 12 tester per 14 giorni, contati sull'ora del Pacifico
         (12 tester dal 14 ottobre 2026 PT -> 28 ottobre 00:00 PT = 08:00 ora italiana) */
      countdown: '2026-10-28T07:00:00Z' }
  ],

  langBadges: {
    it: { text: '#f8fbff', file: 'it.webp' },
    en: { text: '#f8fbff', file: 'en.webp' }
  },

  /* Le stringhe localizzate sono in js/data/i18n/it.js e en.js */
  i18n: {}
};
