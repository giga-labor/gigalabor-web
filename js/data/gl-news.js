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
  { id: 'claude-haiku-5-5',        category: 'models',    sort_date: '2026-10-07', badge_class: 'badge--active'      },
  { id: 'gpt-6-intelligent-ui',    category: 'platforms', sort_date: '2026-10-07', badge_class: 'badge--active'      },
  { id: 'mistral-large-4',         category: 'models',    sort_date: '2026-10-06', badge_class: 'badge--development' },
  { id: 'nano-banana-2-1',         category: 'models',    sort_date: '2026-10-06', badge_class: 'badge--active'      },
  { id: 'reflection-beam',         category: 'models',    sort_date: '2026-10-05', badge_class: 'badge--development' },
  { id: 'gemini-4-argon',          category: 'models',    sort_date: '2026-09-30', badge_class: 'badge--development' },
  { id: 'gtig-ai-vulnerabilities', category: 'security',  sort_date: '2026-09-30', badge_class: 'badge--ongoing'     },
  { id: 'claude-sonnet-5-5',       category: 'models',    sort_date: '2026-09-28', badge_class: 'badge--active'      },
  { id: 'claude-opus-5-5',         category: 'models',    sort_date: '2026-09-22', badge_class: 'badge--active'      },
  { id: 'ai-act-2026',             category: 'research',  sort_date: '2026-08-02', badge_class: 'badge--active'      },
  { id: 'openai-ipo-2026',         category: 'platforms', sort_date: '2026-06-08', badge_class: 'badge--development' },
  { id: 'anthropic-recursive-self-improvement', category: 'research', sort_date: '2026-06-04', badge_class: 'badge--active' },
  { id: 'microsoft-build-2026',    category: 'platforms', sort_date: '2026-06-02', badge_class: 'badge--active'      },
  { id: 'anthropic-mythos',        category: 'security',  sort_date: '2026-06-02', badge_class: 'badge--active'      },
  { id: 'anthropic-ipo-2026',      category: 'platforms', sort_date: '2026-06-01', badge_class: 'badge--development' },
  { id: 'claude-opus-4-8',         category: 'models',    sort_date: '2026-05-28', badge_class: 'badge--active'      },
  { id: 'google-io-2026',          category: 'models',    sort_date: '2026-05-20', badge_class: 'badge--active'      },
  { id: 'gemini-agentic',          category: 'platforms', sort_date: '2026-05-19', badge_class: 'badge--active'      },
  { id: 'openai-voice-realtime',   category: 'models',    sort_date: '2026-05-07', badge_class: 'badge--active'      },
  { id: 'gpt-5-5',                 category: 'models',    sort_date: '2026-04-23', badge_class: 'badge--active'      },
  { id: 'anthropic-vercept',       category: 'platforms', sort_date: '2026-02-25', badge_class: 'badge--active'      },
  { id: 'microsoft-build-agentic', category: 'platforms', sort_date: '2025-05-19', badge_class: 'badge--active'      },
  { id: 'openssf-model-signing',   category: 'security',  sort_date: '2025-04-04', badge_class: 'badge--ongoing'     }
];
