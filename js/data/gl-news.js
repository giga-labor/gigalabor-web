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
  { id: 'anthropic-recursive-self-improvement', category: 'research', sort_date: '2026-06-04', badge_class: 'badge--active' },
  { id: 'anthropic-ipo-2026',    category: 'platforms', sort_date: '2026-06-01', badge_class: 'badge--development' },
  { id: 'microsoft-build-2026',  category: 'platforms', sort_date: '2026-06-02', badge_class: 'badge--active'      },
  { id: 'anthropic-mythos',      category: 'security',  sort_date: '2026-06-02', badge_class: 'badge--active'      },
  { id: 'claude-opus-4-8',      category: 'models',    sort_date: '2026-05-28', badge_class: 'badge--active'      },
  { id: 'openai-ipo-2026',      category: 'platforms', sort_date: '2026-05-22', badge_class: 'badge--development' },
  { id: 'google-io-2026',       category: 'models',    sort_date: '2026-05-20', badge_class: 'badge--active'      },
  { id: 'ai-act-2026',         category: 'research',  sort_date: '2026-08-02', badge_class: 'badge--development' },
  { id: 'gpt-5-5',             category: 'models',    sort_date: '2026-04-23', badge_class: 'badge--active'      },
  { id: 'openai-voice-realtime',category: 'models',    sort_date: '2026-05-07', badge_class: 'badge--d