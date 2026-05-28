/**
 * gl-news.js — Struttura delle news di GiGa Labor
 * Solo metadati: id, category, sort_date, badge_class.
 * I testi localizzati sono in js/data/i18n/news-it.js e news-en.js.
 *
 * Per aggiungere una news: aggiungi un oggetto qui + la entry in ogni file i18n.
 * Per aggiungere una lingua: crea js/data/i18n/news-XX.js.
 */

window.GL = window.GL || {};

window.GL.NEWS = [
  { id: 'ai-act-2026',         category: 'research',  sort_date: '2026-08-02', badge_class: 'badge--development' },
  { id: 'gpt-5-5',             category: 'models',    sort_date: '2026-04-23', badge_class: 'badge--active'      },
  { id: 'openai-voice-realtime',category: 'models',    sort_date: '2026-05-07', badge_class: 'badge--development' },
  { id: 'gemini-agentic',      category: 'platforms', sort_date: '2026-05-19', badge_class: 'badge--active'      },
  { id: 'anthropic-vercept',   category: 'research',  sort_date: '2026-02-25', badge_class: 'badge--development' },
  { id: 'openssf-model-signing',category: 'security',  sort_date: '2025-04-04', badge_class: 'badge--ongoing'    },
  { id: 'microsoft-build-agentic', category: 'platforms', sort_date: '2025-05-19', badge_class: 'badge--active'  }
];
