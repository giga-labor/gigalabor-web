/**
 * news-it.js — Testi news in Italiano
 * Struttura: window.GL.newsStrings['it'][id] = { date, title, excerpt, body, badge, source_* }
 * body: paragrafi separati da \n\n
 */

window.GL = window.GL || {};
window.GL.newsStrings = window.GL.newsStrings || {};

window.GL.newsStrings['it'] = {

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
    date:         '2 agosto 2026 (in arrivo)',
    title:        'AI Act UE: piena applicazione prevista',
    excerpt:      "Secondo la Commissione europea, l'AI Act diventa pienamente applicabile dal 2 agosto 2026, con impatto operativo su sviluppo e adozione dei sistemi AI.",
    body:         "L'AI Act dell'Unione Europea è diventato il primo quadro normativo globale dedicato all'intelligenza artificiale. Dopo un lungo iter legislativo iniziato nel 2021, il regolamento è entrato in vigore nel 2024 con un calendario di attuazione progressiva.\n\nDal 2 agosto 2026 sarà pienamente applicabile per la maggior parte dei sistemi AI, imponendo obblighi precisi di trasparenza, valutazione del rischio e documentazione tecnica. I sistemi classificati come ad alto rischio — in ambiti quali sanità, credito, sicurezza pubblica e istruzione — dovranno soddisfare requisiti stringenti di conformità prima di essere messi in uso.\n\nLe sanzioni per inosservanza possono arrivare fino al 3% del fatturato globale annuo o 15 milioni di euro, a seconda di quale valore sia maggiore. Per i sistemi AI vietati (come il social scoring generalizzato) le sanzioni salgono al 6%. Questo obbliga tutte le aziende che operano nel mercato UE — indipendentemente dalla sede — ad adeguarsi.",
    badge:        'In arrivo',
    source_label: 'Fonte:',
    source_name:  'Commissione Europea',
    source_url:   'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'
  },

  'gpt-5-5': {
    date:         '23 aprile 2026',
    title:        'OpenAI annuncia GPT-5.5',
    excerpt:      'OpenAI ha presentato GPT-5.5 come modello orientato al lavoro reale su codice, ricerca e task multi-step con uso strumenti.',
    body:         "Il 23 aprile 2026 OpenAI ha ufficialmente presentato GPT-5.5, posizionato come un modello da lavoro rispetto ai predecessori. A differenza di GPT-5 — ottimizzato per eccellenza generale — GPT-5.5 è progettato per task pratici ad alta intensità: scrittura di codice complessa, ricerca e sintesi di informazioni, gestione di flussi multi-step con chiamate a strumenti esterni.\n\nLe performance nei benchmark di coding mostrano miglioramenti rilevanti rispetto a GPT-5, con particolari progressi su task che richiedono ragionamento su repository esistenti e debugging iterativo. Il modello è disponibile tramite API con maggiori limiti di rate per i developer e nei piani avanzati di ChatGPT.\n\nL'annuncio arriva in un momento di forte pressione competitiva da parte di Anthropic — con Claude Opus 4 — Google e dei modelli open-source come Qwen e Llama, segnalando un mercato dove il ritmo di rilascio si è notevolmente accelerato.",
    badge:        'Rilascio',
    source_label: 'Fonte:',
    source_name:  'OpenAI',
    source_url:   'https://openai.com/index/introducing-gpt-5-5/'
  },

  'openai-voice-realtime': {
    date:         '7 maggio 2026',
    title:        'Nuovi modelli vocali realtime nelle API OpenAI',
    excerpt:      'OpenAI ha rilasciato una nuova generazione di modelli voce realtime per ragionamento, traduzione e trascrizione live.',
    body:         "Il 7 maggio 2026, OpenAI ha rilasciato una nuova suite di modelli vocali realtime per le sue API. I nuovi modelli portano miglioramenti sostanziali in tre aree chiave: ragionamento vocale con la capacità di elaborare una risposta prima di parlare — riducendo errori e deviazioni — traduzione live con latenza inferiore a 500ms, e trascrizione ad alta accuratezza con rilevamento automatico della lingua.\n\nGli sviluppatori possono ora costruire applicazioni voce-a-voce completamente native senza dover comporre pipeline separate ASR (speech-to-text) + LLM + TTS (text-to-speech). L'intera catena è integrata, con gestione nativa di interruzioni, sovrapposizioni e cambio lingua mid-sentence.\n\nIl pricing è rimasto invariato rispetto ai modelli precedenti, rendendo questa tecnologia accessibile anche a startup e progetti indie. OpenAI ha anche pubblicato una guida aggiornata per la migrazione dai modelli audio precedenti.",
    badge:        'API',
    source_label: 'Fonte:',
    source_name:  'OpenAI',
    source_url:   'https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/'
  },

  'gemini-agentic': {
    date:         '19 maggio 2026',
    title:        'Gemini diventa più agentico',
    excerpt:      "Google ha aggiornato l'app Gemini con funzioni più proattive e operative continue, spingendo verso un assistente 24/7.",
    body:         "Il 19 maggio 2026 Google ha aggiornato l'app Gemini introducendo un set di funzioni orientate alla proattività e all'operatività continua. Il cambiamento più significativo è la modalità 'Always Active': l'assistente può ora monitorare attività in background — email, calendario, notifiche — e intervenire autonomamente su task delegati dall'utente.\n\nGemini può ora completare operazioni multi-app senza supervisione costante: aggiornare documenti in Google Workspace, configurare reminder intelligenti contestuali e sintetizzare informazioni da più fonti in un'unica risposta proattiva. Google ha inoltre annunciato l'integrazione con le API di Workspace Enterprise, aprendo la porta a deployment aziendali di agenti AI personalizzati.\n\nLa mossa acuisce la competizione con gli assistenti agentici di Anthropic (Claude con computer use) e Microsoft (Copilot), segnalando che il futuro degli assistenti AI non è più reattivo ma proattivo.",
    badge:        'Prodotto',
    source_label: 'Fonte:',
    source_name:  'Google Blog',
    source_url:   'https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/'
  },

  'anthropic-vercept': {
    date:         '25 febbraio 2026',
    title:        'Anthropic acquisisce Vercept',
    excerpt:      "L'acquisizione punta a migliorare le capacità di computer use di Claude su task complessi in applicazioni reali.",
    body:         "Il 25 febbraio 2026, Anthropic ha acquisito Vercept, startup specializzata in computer vision applicata all'interazione con UI visive. Il valore dell'operazione non è stato divulgato. L'obiettivo strategico è rafforzare le capacità di 'computer use' di Claude: la possibilità per il modello di navigare interfacce grafiche, interpretare screenshot, cliccare elementi e compilare form in modo autonomo.\n\nVercept aveva sviluppato tecniche proprietarie di segmentazione visiva e action grounding su UI desktop e web, con risultati superiori agli approcci standard OCR + coordinate su layout dinamici e su applicazioni non ottimizzate per agenti AI. Il team di Vercept (circa 12 persone) si integrerà nel gruppo Alignment & Capabilities di Anthropic.\n\nL'integrazione nella piattaforma Claude è prevista in forma sperimentale entro metà 2026, inizialmente per i clienti API Enterprise. L'acquisizione si inserisce nella corsa più ampia verso agenti AI capaci di operare su software reale senza necessità di API dedicate.",
    badge:        'Ricerca',
    source_label: 'Fonte:',
    source_name:  'Anthropic',
    source_url:   'https://www.anthropic.com/news/acquires-vercept'
  },

  'openssf-model-signing': {
    date:         '4 aprile 2025',
    title:        'OpenSSF rilascia Model Signing v1.0',
    excerpt:      'Il progetto introduce firma e verifica dei modelli ML per rafforzare integrità e provenienza nella supply chain AI.',
    body:         "Il 4 aprile 2025, la Open Source Security Foundation (OpenSSF) ha rilasciato Model Signing v1.0, uno standard aperto per la firma crittografica e la verifica dei modelli di machine learning. L'iniziativa nasce dalla crescente preoccupazione per la supply chain AI: modelli scaricati da repository pubblici come Hugging Face possono essere stati alterati o sostituiti da versioni malevole senza che gli utenti ne siano consapevoli.\n\nModel Signing v1.0 definisce un formato standard per allegare firme digitali ai file di modello — nei formati .safetensors, .gguf, .bin e altri — e per verificarle automaticamente prima del caricamento. Il framework è compatibile con Sigstore, già ampiamente adottato nella supply chain del software open-source (usato da npm, PyPI, Maven).\n\nL'adozione è sostenuta da Google, Intel e diversi vendor AI. OpenSSF ha anche rilasciato SDK per Python e Go per integrare la verifica direttamente nei framework di training e inferenza.",
    badge:        'Sicurezza',
    source_label: 'Fonte:',
    source_name:  'OpenSSF',
    source_url:   'https://openssf.org/blog/2025/04/04/launch-of-model-signing-v1-0-openssf-ai-ml-working-group-secures-the-machine-learning-supply-chain/'
  },

  'microsoft-build-agentic': {
    date:         '19 maggio 2025',
    title:        'Microsoft Build: focus su web agentico aperto',
    excerpt:      'Microsoft ha annunciato supporto esteso a MCP su più piattaforme e nuove basi per interoperabilità tra agenti.',
    body:         "Il 19 maggio 2025, durante Microsoft Build, il CEO Satya Nadella ha delineato la visione di Microsoft per il 'web agentico aperto'. L'annuncio centrale è stato il supporto nativo a MCP (Model Context Protocol) su Copilot, Azure AI, Windows e GitHub Copilot — un significativo endorsement del protocollo open sviluppato originariamente da Anthropic, che ha accelerato la sua adozione industriale.\n\nMicrosoft ha inoltre presentato Agent2Agent (A2A), un nuovo set di standard per l'interoperabilità tra agenti AI eterogenei. A2A permette a più agenti — anche di vendor diversi — di coordinarsi su task complessi tramite protocolli condivisi, senza necessità di integrazioni custom. Al lancio, oltre 50 partner dell'ecosistema hanno dichiarato conformità.\n\nLa mossa posiziona Microsoft come piattaforma neutrale per il futuro dell'automazione AI in azienda, con Azure come infrastruttura centrale. L'apertura verso MCP è particolarmente rilevante per il mondo open-source, che ora ha un punto di riferimento industriale per costruire tool compatibili.",
    badge:        'Ecosistema',
    source_label: 'Fonte:',
    source_name:  'Microsoft',
    source_url:   'https://blogs.microsoft.com/blog/2025/05/19/microsoft-build-2025-the-age-of-ai-agents-and-building-the-open-agentic-web/'
  }

};
