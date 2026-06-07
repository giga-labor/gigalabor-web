/**
 * news-it.js — Testi news in Italiano
 * Struttura: window.GL.newsStrings['it'][id] = { date, title, excerpt, body, badge, source_* }
 * body: paragrafi separati da \n\n
 */

window.GL = window.GL || {};
window.GL.newsStrings = window.GL.newsStrings || {};

window.GL.newsStrings['it'] = {

  'anthropic-recursive-self-improvement': {
    date:         '4 giugno 2026',
    title:        'Anthropic: "L\'AI sta imparando a costruire se stessa"',
    excerpt:      "L'Anthropic Institute documenta come l'AI stia accelerando il proprio sviluppo: oggi oltre l'80% del codice di Anthropic è scritto da Claude, con ingegneri 8× più produttivi rispetto al 2024.",
    body:         "Il 4 giugno 2026, l'Anthropic Institute ha pubblicato 'When AI builds itself', un'analisi dettagliata su come l'intelligenza artificiale stia accelerando il proprio sviluppo fino a una potenziale ricorsività. I dati interni di Anthropic sono eloquenti: ad oggi oltre l'80% del codice integrato nel codebase di Anthropic è scritto da Claude. Nel secondo trimestre 2026, un ingegnere tipico integra 8× più codice al giorno rispetto al 2024 — non perché lavori di più, ma perché Claude scrive il codice mentre il ricercatore dirige e revisiona. I benchmark di ingegneria del software (SWE-bench) sono passati da punteggi a singola cifra alla saturazione in due anni; Claude Mythos Preview raggiunge uno speedup ~52× nell'ottimizzazione del codice di training (contro ~3× di Opus 4 un anno prima e ~4× di un ricercatore umano in 4–8 ore).\n\nSull'autonomia nella ricerca, a aprile 2026 Claude ha condotto autonomamente un intero esperimento di AI safety — dalla proposta delle ipotesi all'iterazione sui risultati — recuperando il 97% del gap misurato, rispetto al 23% ottenuto da due ricercatori umani in una settimana. Su task open-ended, il tasso di successo di Claude Code è passato dal 26% al 76% in sei mesi. Claude Mythos Preview ha lavorato autonomamente per «almeno 16 ore» secondo METR, «al limite superiore di ciò che riesce a misurare senza nuovi task».\n\nAnthropic identifica tre scenari futuri: la curva si piega prima della soglia critica, si ha un compounding di efficienza con gli umani ancora al timone, oppure si raggiunge il vero auto-miglioramento ricorsivo in cui i modelli progettano e addestrano i propri successori. In quest'ultimo scenario — ritenuto plausibile ma non inevitabile — il ritmo dell'AI sarebbe limitato solo dalla disponibilità di compute. Il documento si chiude con un appello alla costruzione di meccanismi di verifica internazionali che rendano credibile una pausa coordinata nello sviluppo frontier, se mai necessaria.",
    badge:        'Ricerca',
    source_label: 'Fonte:',
    source_name:  'Anthropic Institute',
    source_url:   'https://www.anthropic.com/institute/recursive-self-improvement'
  },

  'anthropic-ipo-2026': {
    date:         '1 giugno 2026 (in arrivo)',
    title:        'Anthropic deposita la domanda di IPO in via confidenziale',
    excerpt:      "Anthropic ha depositato l'S-1 in via confidenziale presso la SEC il 1° giugno 2026, con una valutazione di $965 miliardi dopo aver raccolto $65 miliardi nel più grande round della storia AI.",
    body:         "Il 1° giugno 2026, Anthropic ha depositato in via confidenziale la documentazione per la sua IPO presso la U.S. Securities and Exchange Commission. L'annuncio arriva pochi giorni dopo la chiusura del round Series H da $65 miliardi — il più grande della storia dell'industria AI — che ha portato la valutazione dell'azienda a $965 miliardi, a un passo dal traguardo dei $1.000 miliardi.\n\nIl revenue run rate di Anthropic ha raggiunto $47 miliardi annui, in forte crescita rispetto ai $10 miliardi del 2025, trainati principalmente da Claude Code — il suo assistente AI per la scrittura di codice — e dai servizi API enterprise. Il deposito confidenziale consente di avviare la revisione regolatoria SEC senza obbligo di disclosure pubblica immediata, gestendo in privato le eventuali osservazioni prima del prospetto definitivo.\n\nL'annuncio sorprende i mercati per i tempi: Anthropic supera il rivale OpenAI anche nella corsa verso Wall Street. OpenAI stava preparando la propria domanda di IPO, ma è Anthropic ad arrivare prima. La quotazione attesa per l'autunno 2026 rappresenterebbe uno dei più grandi debutti borsistici della storia tech.",
    badge:        'In arrivo',
    source_label: 'Fonte:',
    source_name:  'Fortune',
    source_url:   'https://fortune.com/2026/06/01/anthropic-confidentially-files-ipo-965-billion-valuation/'
  },

  'microsoft-build-2026': {
    date:         '2 giugno 2026',
    title:        'Microsoft Build 2026: sette modelli MAI e Windows come OS per agenti AI',
    excerpt:      "Build 2026 ha presentato sette nuovi modelli MAI sviluppati internamente, il riposizionamento di Windows come piattaforma per agenti autonomi e il chip quantistico Majorana 2.",
    body:         "Il 2 giugno 2026, Microsoft ha tenuto il suo evento annuale Build a Fort Mason Center, San Francisco. Il CEO Satya Nadella ha presentato sette nuovi modelli AI sviluppati internamente dal Microsoft AI Superintelligence Team: MAI-Thinking-1 (ragionamento, 35B parametri attivi, finestra di contesto 256K), MAI-Code-1-Flash (coding), MAI-Image-2.5 (generazione immagini), MAI-Transcribe-1.5 (trascrizione) e MAI-Voice-2 (sintesi vocale). MAI-Code-1 è già disponibile in Copilot e VS Code.\n\nIl segnale strategico più importante è il riposizionamento di Windows: Microsoft lo ridefinisce come un ambiente di esecuzione sicuro e di prima classe per agenti AI autonomi, non più solo un sistema operativo per applicazioni desktop. In parallelo è stato annunciato Project Solara — una nuova piattaforma basata su Android per dispositivi agent-driven, in cui gli agenti AI sostituiscono le app tradizionali.\n\nAltri annunci rilevanti: le Work IQ APIs (disponibili dal 16 giugno) offrono accesso programmabile all'intelligence layer aziendale; Web IQ è un motore di ricerca AI-first e MCP-native per il grounding in tempo reale, 2,5× più veloce dei competitor. Sul fronte hardware, Majorana 2 è il nuovo chip quantistico con affidabilità dei qubit 1.000× superiore alla generazione precedente, con un percorso verso un milione di qubit su un singolo chip.",
    badge:        'Piattaforma',
    source_label: 'Fonte:',
    source_name:  'Microsoft Blog',
    source_url:   'https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/'
  },

  'anthropic-mythos': {
    date:         '2 giugno 2026',
    title:        'Claude Mythos e Project Glasswing: 150 organizzazioni in 15+ paesi',
    excerpt:      "Anthropic ha esteso Project Glasswing portando Claude Mythos Preview — un modello frontier non pubblico ottimizzato per la cybersecurity — a 150 nuove organizzazioni di infrastrutture critiche.",
    body:         "Il 2 giugno 2026, Anthropic ha annunciato la seconda fase di Project Glasswing, il programma per rafforzare la sicurezza delle infrastrutture critiche tramite Claude Mythos Preview. Dopo una prima fase con 50 partner — tra cui agenzie governative degli Stati Uniti — l'accesso è stato esteso a 150 nuove organizzazioni in 15+ paesi, con focus su energia, acqua, sanità, comunicazioni e hardware.\n\nClaude Mythos Preview è un modello frontier non ancora rilasciato al pubblico, ottimizzato per la sicurezza informatica con capacità che superano tutti gli esperti umani tranne i più specializzati nell'identificazione e sfruttamento di vulnerabilità software. Nelle settimane precedenti l'annuncio il modello aveva già identificato migliaia di vulnerabilità ad alto rischio, alcune presenti in ogni principale sistema operativo e browser web. Il governo giapponese, le principali istituzioni finanziarie nipponiche e il governo australiano hanno ricevuto l'accesso.\n\nProject Glasswing rappresenta un cambio di paradigma: invece di aspettare che i vendor sistemino le vulnerabilità, Anthropic mette direttamente in mano ai proprietari dei sistemi critici uno strumento per trovare e correggere falle prima che vengano sfruttate. L'accesso al modello rimane controllato e soggetto a vetting, dato il rischio duale della tecnologia.",
    badge:        'Sicurezza',
    source_label: 'Fonte:',
    source_name:  'TechCrunch',
    source_url:   'https://techcrunch.com/2026/06/02/anthropic-scales-claude-mythos-to-critical-infrastructure-in-15-countries/'
  },

  'claude-opus-4-8': {
    date:         '28 maggio 2026',
    title:        'Anthropic rilascia Claude Opus 4.8',
    excerpt:      'Il nuovo modello porta miglioramenti su coding, task agentici e autonomia prolungata, con una modalità fast 2,5× più veloce a parità di costo.',
    body:         "Il 28 maggio 2026, Anthropic ha rilasciato Claude Opus 4.8, il suo modello più capace disponibile al pubblico. Il miglioramento principale rispetto a Opus 4.7 riguarda tre aree: coding su repository complessi, capacità di operare in modo autonomo per sessioni prolungate senza degrado della qualità, e maggiore onestà nel riportare i propri progressi su task a lungo termine.\n\nTra le novità operative, gli utenti claude.ai possono ora regolare l'effort computazionale del modello tramite un apposito controllo — utile per bilanciare velocità e profondità di risposta in base al tipo di task. Claude Code introduce i 'dynamic workflows', che permettono al modello di scomporre e affrontare problemi di larga scala in modo strutturato. La modalità fast, che opera a 2,5× la velocità standard, è ora tre volte più economica rispetto ai modelli precedenti.\n\nIl pricing rimane invariato rispetto a Opus 4.7: $5 per milione di token in input e $25 per milione in output, con sconti fino al 90% con prompt caching. Il modello è disponibile su claude.ai per i piani Pro, Max, Team ed Enterprise, e via API su Claude Platform, AWS, Google Cloud e Microsoft Foundry.",
    badge:        'Rilascio',
    source_label: 'Fonte:',
    source_name:  'Anthropic',
    source_url:   'https://www.anthropic.com/news/claude-opus-4-8'
  },

  'openai-ipo-2026': {
    date:         '22 maggio 2026 (in arrivo)',
    title:        'OpenAI deposita in via confidenziale la domanda di IPO',
    excerpt:      "OpenAI ha depositato l'S-1 in via confidenziale presso la SEC con target di quotazione a settembre 2026 e una valutazione attesa fino a $1.000 miliardi.",
    body:         "Il 22 maggio 2026, OpenAI ha depositato in via confidenziale la documentazione S-1 per la sua IPO presso la Securities and Exchange Commission statunitense. Goldman Sachs e Morgan Stanley co-guidano l'operazione, con una valutazione target compresa tra $852 miliardi e $1.000 miliardi. La finestra di quotazione è fissata per settembre 2026.\n\nIl deposito confidenziale consente a OpenAI di avviare la revisione regolatoria SEC senza obbligo di disclosure pubblica immediata, gestendo in privato le eventuali osservazioni prima del prospetto definitivo. Il contesto finanziario è sotto scrutinio: nel 2025 OpenAI ha generato $13,1 miliardi di ricavi ma ha bruciato circa $22 miliardi, con una perdita netta di ~$9 miliardi. Le proiezioni interne indicano una perdita operativa di $14 miliardi per il 2026, nonostante i ricavi in forte crescita.\n\nL'IPO rappresenta un passaggio storico per l'azienda e per l'intero settore AI. La quotazione avviene in parallelo con una corsa alla valorizzazione: Anthropic ha annunciato un round da $30 miliardi a una valutazione superiore a $900 miliardi, superando per la prima volta quella di OpenAI sul mercato privato. La competizione tra i due principali lab AI si estende ora anche ai mercati finanziari.",
    badge:        'In arrivo',
    source_label: 'Fonte:',
    source_name:  'Fortune',
    source_url:   'https://fortune.com/2026/05/22/openai-ipo-filing-1-trillion-may-finally-answer-these-big-questions/'
  },

  'google-io-2026': {
    date:         '20 maggio 2026',
    title:        'Google I/O 2026: Gemini 3.5 Flash, Omni e Spark',
    excerpt:      "Google I/O 2026 ha lanciato una nuova generazione di modelli Gemini con capacità multimodali avanzate e un agente personale 24/7 disponibile agli abbonati Ultra.",
    body:         "Il 20 maggio 2026, durante Google I/O, il CEO Sundar Pichai ha presentato la nuova generazione di modelli Gemini. Gemini 3.5 Flash è il modello di punta di questa release: supera Gemini 3.1 Pro nei benchmark di coding, task agentici e multimodali, mantenendo la velocità e il costo della serie Flash (4× più veloce dei modelli frontier concorrenti). È disponibile immediatamente nell'app Gemini, in Search, e via Gemini API.\n\nGemini Omni è una nuova serie di modelli che unifica ragionamento e generazione: accetta input di testo, immagini, audio e video, e produce output video fondati su conoscenza reale. Gemini Spark è invece il primo vero agente personale proattivo di Google — opera in background su email, calendario e notifiche, e completa task per conto dell'utente senza supervisione attiva. Sarà disponibile la settimana successiva agli abbonati Google AI Ultra negli USA.\n\nAltri annunci rilevanti: l'abbonamento AI Ultra è stato ridotto da $250 a $100 al mese, Daily Brief introduce una sintesi giornaliera personalizzata da Gmail e Calendar, e Canva, Adobe e CapCut hanno annunciato integrazioni native nell'app Gemini per editing di immagini e video direttamente dall'assistente. Google ha anche confermato che Gemini 3.5 Pro è in fase di test e sarà disponibile il mese successivo.",
    badge:        'Prodotto',
    source_label: 'Fonte:',
    source_name:  'Google Blog',
    source_url:   'https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/'
  },

  'ai-act-2026': {
    date:         '2 agosto 2026 (in arrivo) — aggiornato maggio 2026',
    title:        'AI Act UE: trasparenza confermata ad agosto, alto rischio posticipato al 2027',
    excerpt:      "L'Omnibus Digitale UE (maggio 2026) ha posticipato gli obblighi per i sistemi ad alto rischio al dicembre 2027, ma conferma gli obblighi di trasparenza dal 2 agosto 2026.",
    body:         "L'AI Act dell'Unione Europea è il primo quadro normativo globale dedicato all'intelligenza artificiale, in vigore dal 2024 con attuazione progressiva. Il 7 maggio 2026, il Consiglio UE, il Parlamento Europeo e la Commissione hanno raggiunto un accordo provvisorio sull'Omnibus Digitale sull'AI, introducendo modifiche significative al calendario originario.\n\nAggiornamento chiave: gli obblighi per i sistemi AI ad alto rischio (Allegato III, uso-based) sono stati posticipati dal 2 agosto 2026 al 2 dicembre 2027 — uno slittamento di 16 mesi. Gli obblighi per i sistemi regolamentati come prodotti (Allegato I, tra cui dispositivi medici e ascensori) slittano invece dall'agosto 2027 all'agosto 2028. Il framework semplificato per le PMI è stato esteso alle aziende fino a 750 dipendenti e €150 milioni di fatturato annuo.\n\nCiò che rimane confermato dal 2 agosto 2026: gli obblighi di trasparenza dell'articolo 50, incluso l'obbligo di informare gli utenti quando interagiscono con un sistema AI (chatbot, assistenti vocali). Nuovi divieti su contenuti intimi non consensuali e CSAM generati da AI entreranno in vigore il 2 dicembre 2026. L'adozione formale dell'Omnibus è attesa per giugno 2026, con pubblicazione in luglio. Le sanzioni per inosservanza degli obblighi applicabili rimangono invariate: fino al 3% del fatturato globale annuo (6% per i sistemi vietati).",
    badge:        'In arrivo',
    source_label: 'Fonte:',
    source_name:  'Inside Privacy / EU Commission',
    source_url:   'https://www.insideprivacy.com/artificial-intelligence/eu-ai-act-update-timeline-relief-targeted-simplification-and-new-prohibitions/'
  }