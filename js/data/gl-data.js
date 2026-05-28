/**
 * gl-data.js - Tutti i dati del sito GiGa Labor
 * Nessun fetch, nessun JSON esterno. Funziona su file:// e HTTP.
 */

window.GL = {

  config: {
    defaultLang:    'it',
    supportedLangs: ['it', 'en'],
    storageKeys: { theme: 'gl_theme', lang: 'gl_lang' },
    themes: ['dark-tech', 'light', 'contrast'],
    defaultTheme: 'contrast',
    emailjs: { publicKey: '', serviceId: '', templateId: '' },
    formsubmit: { adminEmail: 'giga.labor2026@gmail.com' }
  },

  projects: [
    { id: 'controlchaos', icon: '\u{1F300}', color: '#00b4ff', page: 'pages/projects/controlchaos.html', updated_at: '2026-01-15', order: 1 },
    { id: 'evobrain',     icon: '\u{1F9E0}', color: '#8b5cf6', page: 'pages/projects/evobrain.html',     updated_at: '2026-02-10', order: 2 },
    { id: 'iargos',       icon: '\u{1F916}', color: '#d4883a', page: 'pages/projects/iargos.html',       updated_at: '2026-03-01', order: 3 },
    { id: 'lab',          icon: '\u{1F9EA}', color: '#ffb000', page: 'pages/projects/lab.html',          updated_at: '2026-03-15', order: 4 }
  ],

  langBadges: {
    it: { text: '#f8fbff', file: 'it.webp' },
    en: { text: '#f8fbff', file: 'en.webp' }
  },

  i18n: {

    /* --------------------------------------------------------- */
    it: {
      meta: {
        siteName:    'GiGa Labor',
        tagline:     'Ingegneria digitale. Ricerca. Innovazione.',
        description: 'GiGa Labor è un laboratorio digitale personale dedicato allo sviluppo di software, sistemi intelligenti e ricerca applicata.'
      },
      nav: {
        home: 'Home', projects: 'Progetti', news: 'News',
        scritti: 'Scritti', about: 'Chi siamo', contact: 'Contatti',
        toggleTheme: 'Tema', toggleLang: 'EN'
      },
      hero: {
        headline:       'Ingegneria digitale.<br>Ricerca. Innovazione.',
        headline_line2: 'Ingegneria digitale.',
        system_status:  'GiGa Labor // Laboratorio digitale',
        typewriter_phrases: [
          'Ingegneria digitale.',
          'Ricerca applicata.',
          'Automazione avanzata.',
          'Software su misura.',
          'Sistemi modulari.',
          'Strumenti su misura.',
          'Costruisco soluzioni.'
        ],
        canvas_words: {
          ai:       ['Logica', 'Struttura', 'Metodo', 'Modulo', 'Processo'],
          data:     ['Python', 'JSON', 'API', 'Analisi', 'Pattern'],
          auto:     ['Script', 'Deploy', 'Pipeline', 'CI/CD', 'Shell'],
          research: ['Prototipo', 'Modello', 'Test', 'Ricerca', 'Verifica'],
          tech:     ['Linux', 'Node.js', 'Git', 'Docker', 'Web']
        },
        subheadline:       'GiGa Labor è un laboratorio personale dedicato allo sviluppo di software, sistemi intelligenti e ricerca applicata.',
        cta_primary:       'Esplora i progetti',
        cta_secondary:     'Chi siamo',
        metric_projects:   'Progetti attivi',
        metric_founded:    'Fondato',
        metric_indep:      'Personale',
        metric_origin:     'Origine'
      },
      sections: {
        ecosystem_label:    'Progetti personali',
        mission_label:      'Approccio',
        updates_label:      'Aggiornamenti',
        projects_title:     'Progetti',
        projects_subtitle:  'Ogni progetto è autonomo. Insieme formano la raccolta personale GiGa Labor.',
        lab_title:          'Lab',
        lab_subtitle:       'Esperimenti, prototipi e ricerca in corso.',
        about_title:        'Chi siamo',
        contact_title:      'Contatti'
      },
      projects: {
        controlchaos: {
          name: 'ControlChaos', domain: 'superenalottocc.it',
          category: 'Analisi & Predizione',
          short: 'Sistema di analisi statistica e modelli predittivi applicati al SuperEnalotto italiano.',
          description: 'ControlChaos è un sistema di analisi statistica, visualizzazione e modelli predittivi applicati al gioco del SuperEnalotto. Combina elaborazione dati storici, riconoscimento di pattern e simulazione.',
          status: 'active',
          tags: ['Python', 'Statistica', 'Analisi dati', 'Predizione'],
          links: { site: 'https://superenalottocc.it', github: '#', docs: '#' }
        },
        evobrain: {
          name: 'EvoBrain', domain: '',
          category: 'AI & Cognizione',
          short: 'Architettura cognitiva locale per memoria persistente, conoscenza e ragionamento adattivo.',
          description: 'EvoBrain è un sistema di intelligenza artificiale locale progettato per gestire memoria persistente, base di conoscenza strutturata e ragionamento adattivo. Funziona senza dipendenze cloud, focalizzato su privacy, efficienza e modularità.',
          status: 'development',
          tags: ['AI', 'LLM', 'Memoria', 'Architettura cognitiva'],
          links: { site: '#', github: '#', docs: '#' }
        },
        iargos: {
          name: 'iARGOS', domain: '',
          category: 'Automazione & Backend',
          short: 'Agente operativo intelligente per automazione backend, monitoraggio e orchestrazione.',
          description: 'iARGOS è un agente operativo autonomo progettato per automazione di processi backend, monitoraggio di sistemi, orchestrazione di task e integrazione con servizi esterni. Modulare ed estensibile.',
          status: 'development',
          tags: ['Automazione', 'Backend', 'Agent', 'Orchestrazione'],
          links: { site: '#', github: '#', docs: '#' }
        },
        lab: {
          name: 'GiGa Lab', domain: '',
          category: 'Ricerca & Prototipazione',
          short: 'Spazio aperto per esperimenti, prototipi, strumenti e ricerca applicata.',
          description: 'GiGa Lab è lo spazio dedicato alla ricerca libera, prototipazione rapida ed esperimenti tecnici. Qui nascono le idee prima di diventare progetti strutturati.',
          status: 'ongoing',
          tags: ['Ricerca', 'Prototipazione', 'Sperimentazione', 'Strumenti'],
          links: { site: '#', github: '#', docs: '#' }
        }
      },
      status: { active: 'Attivo', development: 'In sviluppo', ongoing: 'In corso', archived: 'Archiviato' },
      about: {
        headline:      'Chi è GiGa Labor',
        body:          'GiGa Labor nasce come laboratorio digitale personale dove progetti, strumenti e idee evolvono nel tempo in una direzione autoriale.',
        mission_title: 'Approccio',
        mission:       'Costruire strumenti intelligenti, autonomi e modulari che amplino le capacità umane nel dominio digitale.',
        values_title:  'Valori',
        values: ['Autonomia', 'Modularità', 'Ricerca applicata', 'Qualità tecnica', 'Trasparenza'],
        features: {
          item1: { title: 'Ricerca continua',        desc: 'Sperimentazione pratica su idee, metodi e prototipi evolutivi.' },
          item2: { title: 'Architetture modulari',   desc: 'Sistemi componibili, mantenibili e facili da estendere nel tempo.' },
          item3: { title: 'Affidabilità operativa', desc: 'Automazioni e strumenti progettati per uso reale e costante.' },
          item4: { title: 'Visione personale',       desc: 'Un laboratorio autoriale con direzione tecnica coerente.' }
        }
      },
      contact: {
        headline:    'Contatti',
        subheadline: 'Per collaborazioni, domande tecniche o segnalazioni.',
        email_label: 'Email', name_label: 'Nome', message_label: 'Messaggio',
        send_btn:    'Invia messaggio',
        email_address: 'giga.labor2026@gmail.com'
      },
      footer: {
        copy:       '© 2026 GiGa Labor. Tutti i diritti riservati.',
        tagline:    'Laboratorio digitale personale.',
        site_title: 'Sito',
        links: { privacy: 'Privacy', terms: 'Termini' }
      },
      ui: {
        read_more: 'Scopri di più', open_project: 'Apri progetto',
        view_docs: 'Documentazione', view_github: 'GitHub',
        back: '← Torna indietro', loading: 'Caricamento...',
        theme_dark: 'Dark Tech', theme_light: 'Light', theme_contrast: 'High Contrast',
        scroll: 'scroll', scroll_down: 'Scorri in basso', back_to_top: 'Torna su',
        all_news: 'Tutte le notizie →', read_write: 'Leggi e scrivi →',
        view_all_projects: 'Vedi tutti i progetti →'
      },
      forms: {
        errors: {
          required_message:       'Il messaggio è obbligatorio.',
          required_email_message: 'Email e messaggio sono obbligatori.',
          invalid_email:          'Indirizzo email non valido.'
        },
        success: { sent: 'Messaggio inviato! Ti risponderemo presto.' }
      }
    },

    /* --------------------------------------------------------- */
    en: {
      meta: {
        siteName:    'GiGa Labor',
        tagline:     'Digital engineering. Research. Innovation.',
        description: 'GiGa Labor is a personal digital laboratory dedicated to software development, intelligent systems and applied research projects.'
      },
      nav: {
        home: 'Home', projects: 'Projects', news: 'News',
        scritti: 'Written works', about: 'About', contact: 'Contact',
        toggleTheme: 'Theme', toggleLang: 'IT'
      },
      hero: {
        headline:       'Digital engineering.<br>Research. Innovation.',
        headline_line2: 'Digital engineering.',
        system_status:  'GiGa Labor // Personal digital lab',
        typewriter_phrases: [
          'Digital engineering.',
          'Applied research.',
          'Advanced automation.',
          'Custom software.',
          'Modular systems.',
          'Tailored tools.',
          'Building solutions.'
        ],
        canvas_words: {
          ai:       ['Logic', 'Structure', 'Method', 'Module', 'Process'],
          data:     ['Python', 'JSON', 'API', 'Analysis', 'Pattern'],
          auto:     ['Script', 'Deploy', 'Pipeline', 'CI/CD', 'Shell'],
          research: ['Prototype', 'Model', 'Testing', 'Research', 'Review'],
          tech:     ['Linux', 'Node.js', 'Git', 'Docker', 'Web']
        },
        subheadline:      'GiGa Labor is a personal laboratory dedicated to software development, intelligent systems and applied research.',
        cta_primary:      'Explore projects',
        cta_secondary:    'About us',
        metric_projects:  'Active projects',
        metric_founded:   'Founded',
        metric_indep:     'Personal',
        metric_origin:    'Origin'
      },
      sections: {
        ecosystem_label:   'Personal Projects',
        mission_label:     'Approach',
        updates_label:     'Updates',
        projects_title:    'Projects',
        projects_subtitle: 'Each project is autonomous. Together they build the personal GiGa Labor collection.',
        lab_title:         'Lab',
        lab_subtitle:      'Experiments, prototypes and ongoing research.',
        about_title:       'About',
        contact_title:     'Contact'
      },
      projects: {
        controlchaos: {
          name: 'ControlChaos', domain: 'superenalottocc.it',
          category: 'Analysis & Prediction',
          short: 'Statistical analysis system and predictive models applied to the Italian SuperEnalotto lottery.',
          description: 'ControlChaos is a statistical analysis system, visualization and predictive models applied to the SuperEnalotto game. It combines historical data processing, pattern recognition and simulation.',
          status: 'active',
          tags: ['Python', 'Statistics', 'Data Analysis', 'Prediction'],
          links: { site: 'https://superenalottocc.it', github: '#', docs: '#' }
        },
        evobrain: {
          name: 'EvoBrain', domain: '',
          category: 'AI & Cognition',
          short: 'Local cognitive architecture for persistent memory, knowledge and adaptive reasoning.',
          description: 'EvoBrain is a local artificial intelligence system designed to manage persistent memory, structured knowledge base and adaptive reasoning. Runs without cloud dependency, focused on privacy, efficiency and modularity.',
          status: 'development',
          tags: ['AI', 'LLM', 'Memory', 'Cognitive Architecture'],
          links: { site: '#', github: '#', docs: '#' }
        },
        iargos: {
          name: 'iARGOS', domain: '',
          category: 'Automation & Backend',
          short: 'Intelligent operational agent for backend automation, monitoring and orchestration.',
          description: 'iARGOS is an autonomous operational agent designed for backend process automation, system monitoring, task orchestration and integration with external services. Modular and extensible.',
          status: 'development',
          tags: ['Automation', 'Backend', 'Agent', 'Orchestration'],
          links: { site: '#', github: '#', docs: '#' }
        },
        lab: {
          name: 'GiGa Lab', domain: '',
          category: 'Research & Prototyping',
          short: 'Open space for experiments, prototypes, tools and applied research.',
          description: 'GiGa Lab is the space dedicated to free research, rapid prototyping and technical experiments. This is where ideas are born before becoming structured projects.',
          status: 'ongoing',
          tags: ['Research', 'Prototyping', 'Experimentation', 'Tools'],
          links: { site: '#', github: '#', docs: '#' }
        }
      },
      status: { active: 'Active', development: 'In development', ongoing: 'Ongoing', archived: 'Archived' },
      about: {
        headline:      'Who is GiGa Labor',
        body:          'GiGa Labor is a personal digital lab where projects, tools and ideas evolve over time with an authorial direction.',
        mission_title: 'Approach',
        mission:       'Build intelligent, autonomous and modular tools that expand human capabilities in the digital domain.',
        values_title:  'Values',
        values: ['Autonomy', 'Modularity', 'Applied research', 'Technical quality', 'Transparency'],
        features: {
          item1: { title: 'Continuous research',      desc: 'Hands-on experimentation on ideas, methods, and evolving prototypes.' },
          item2: { title: 'Modular architectures',    desc: 'Composable systems that stay maintainable and easy to extend.' },
          item3: { title: 'Operational reliability',  desc: 'Automations and tools designed for real, constant use.' },
          item4: { title: 'Personal vision',          desc: 'An authorial lab with a coherent technical direction.' }
        }
      },
      contact: {
        headline:    'Contact',
        subheadline: 'For collaborations, technical questions or reports.',
        email_label: 'Email', name_label: 'Name', message_label: 'Message',
        send_btn:    'Send message',
        email_address: 'giga.labor2026@gmail.com'
      },
      footer: {
        copy:       '© 2026 GiGa Labor. All rights reserved.',
        tagline:    'Personal digital laboratory.',
        site_title: 'Site',
        links: { privacy: 'Privacy', terms: 'Terms' }
      },
      ui: {
        read_more: 'Learn more', open_project: 'Open project',
        view_docs: 'Documentation', view_github: 'GitHub',
        back: '← Go back', loading: 'Loading...',
        theme_dark: 'Dark Tech', theme_light: 'Light', theme_contrast: 'High Contrast',
        scroll: 'scroll', scroll_down: 'Scroll down', back_to_top: 'Back to top',
        all_news: 'All news →', read_write: 'Read and write →',
        view_all_projects: 'View all projects →'
      },
      forms: {
        errors: {
          required_message:       'Message is required.',
          required_email_message: 'Email and message are required.',
          invalid_email:          'Invalid email address.'
        },
        success: { sent: 'Message sent! We will reply soon.' }
      }
    }
  }
};
