/**
 * news-en.js — News texts in English
 * Structure: window.GL.newsStrings['en'][id] = { date, title, excerpt, body, badge, source_* }
 * body: paragraphs separated by \n\n
 */

window.GL = window.GL || {};
window.GL.newsStrings = window.GL.newsStrings || {};

window.GL.newsStrings['en'] = {

  'anthropic-recursive-self-improvement': {
    date:         'June 4, 2026',
    title:        'Anthropic: "AI is learning to build itself"',
    excerpt:      "The Anthropic Institute documents how AI is accelerating its own development: today more than 80% of Anthropic's code is authored by Claude, with engineers 8× more productive than in 2024.",
    body:         "On June 4, 2026, the Anthropic Institute published 'When AI builds itself', a detailed analysis of how AI is accelerating its own development toward a potential recursive loop. Anthropic's internal data is striking: more than 80% of the code merged into Anthropic's codebase is now authored by Claude. In Q2 2026, the typical engineer merges 8× more code per day than in 2024 — not because they work more, but because Claude writes the code while the researcher directs and reviews. Software engineering benchmarks (SWE-bench) went from single-digit scores to saturation in two years; Claude Mythos Preview achieves ~52× speedup in training code optimization (vs. ~3× for Opus 4 a year ago and ~4× for a skilled human expert in 4–8 hours).\n\nOn research autonomy, in April 2026 Claude autonomously ran an entire AI safety experiment — from proposing hypotheses to iterating on findings — recovering 97% of the measurable gap, versus 23% achieved by two human researchers in a week. On open-ended tasks, Claude Code's session success rate climbed from 26% to 76% in six months. Claude Mythos Preview worked autonomously for 'at least 16 hours' according to METR, 'at the upper end of what they can measure without new tasks.'\n\nAnthropic identifies three possible futures: the capability curve bends before the critical threshold; efficiency gains compound with humans still steering decisions; or true recursive self-improvement is reached, where models design and train their own successors. In the third scenario — considered plausible but not inevitable — AI progress would be bounded only by compute availability. The paper closes with a call to build international verification mechanisms that would make a credible, coordinated pause in frontier AI development possible if ever needed.",
    badge:        'Research',
    source_label: 'Source:',
    source_name:  'Anthropic Institute',
    source_url:   'https://www.anthropic.com/institute/recursive-self-improvement'
  },

  'anthropic-ipo-2026': {
    date:         'June 1, 2026 (upcoming)',
    title:        'Anthropic confidentially files for IPO',
    excerpt:      "Anthropic submitted a confidential S-1 to the SEC on June 1, 2026, backed by a $965 billion valuation after closing a record $65 billion funding round.",
    body:         "On June 1, 2026, Anthropic confidentially submitted its IPO registration documentation to the U.S. Securities and Exchange Commission. The announcement came just days after closing a $65 billion Series H funding round — the largest in AI industry history — pushing the company's valuation to $965 billion, within reach of the $1 trillion milestone.\n\nAnthropic's revenue run rate has reached $47 billion annually, up sharply from $10 billion in 2025, driven primarily by Claude Code — its AI coding assistant — and enterprise API services. The confidential filing allows the company to begin the SEC review process without any immediate public disclosure requirement, handling regulatory comments privately before the definitive prospectus.\n\nThe timing surprised markets: Anthropic is getting ahead of rival OpenAI in the race to Wall Street too. OpenAI was preparing its own IPO filing, but Anthropic moved first. The listing, expected in fall 2026, would be one of the largest tech IPOs in history.",
    badge:        'Upcoming',
    source_label: 'Source:',
    source_name:  'Fortune',
    source_url:   'https://fortune.com/2026/06/01/anthropic-confidentially-files-ipo-965-billion-valuation/'
  },

  'microsoft-build-2026': {
    date:         'June 2, 2026',
    title:        'Microsoft Build 2026: seven MAI models and Windows as AI agent OS',
    excerpt:      "Build 2026 unveiled seven new in-house MAI models, repositioned Windows as a first-class platform for autonomous agents, and announced the Majorana 2 quantum chip.",
    body:         "On June 2, 2026, Microsoft held its annual Build event at Fort Mason Center in San Francisco. CEO Satya Nadella introduced seven new AI models developed in-house by the Microsoft AI Superintelligence Team: MAI-Thinking-1 (reasoning, 35B active parameters, 256K context window), MAI-Code-1-Flash (coding), MAI-Image-2.5 (image generation), MAI-Transcribe-1.5 (transcription), and MAI-Voice-2 (speech synthesis). MAI-Code-1 is already available in Copilot and VS Code.\n\nThe most significant strategic signal is the repositioning of Windows: Microsoft redefines it as a secure, first-class execution environment for autonomous AI agents — no longer merely a desktop operating system for running applications. Alongside this, Project Solara was announced: a new Android-based platform for agent-driven devices where AI agents replace traditional apps.\n\nOther notable announcements: Work IQ APIs (generally available June 16) provide programmatic access to the enterprise intelligence layer; Web IQ is an AI-first, MCP-native search stack for real-time grounding, running 2.5× faster than competing alternatives. On the hardware front, Majorana 2 is a new quantum chip with qubit reliability 1,000× higher than the previous generation, on a path toward one million qubits on a single chip.",
    badge:        'Platform',
    source_label: 'Source:',
    source_name:  'Microsoft Blog',
    source_url:   'https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/'
  },

  'anthropic-mythos': {
    date:         'June 2, 2026',
    title:        'Claude Mythos and Project Glasswing: 150 organizations across 15+ countries',
    excerpt:      "Anthropic expanded Project Glasswing, giving Claude Mythos Preview — an unreleased frontier model optimized for cybersecurity — to 150 new critical infrastructure organizations.",
    body:         "On June 2, 2026, Anthropic announced the second phase of Project Glasswing, its program to strengthen critical infrastructure security using Claude Mythos Preview. After an initial phase involving 50 partners — including U.S. government agencies — access was extended to 150 new organizations across 15+ countries, focused on power, water, healthcare, communications, and hardware sectors.\n\nClaude Mythos Preview is an unreleased frontier model optimized for cybersecurity, with capabilities that surpass all but the most skilled human experts at finding and exploiting software vulnerabilities. In the weeks before the announcement, the model had already identified thousands of high-severity vulnerabilities, including some present in every major operating system and web browser. The Japanese government, Japan's major financial institutions, and the Australian government all received access.\n\nProject Glasswing represents a paradigm shift: rather than waiting for vendors to patch vulnerabilities, Anthropic puts a tool directly in the hands of critical infrastructure owners to find and fix flaws before they can be exploited. Access to the model remains controlled and subject to vetting, given the dual-use risk of the technology.",
    badge:        'Security',
    source_label: 'Source:',
    source_name:  'TechCrunch',
    source_url:   'https://techcrunch.com/2026/06/02/anthropic-scales-claude-mythos-to-critical-infrastructure-in-15-countries/'
  },

  'claude-opus-4-8': {
    date:         'May 28, 2026',
    title:        'Anthropic releases Claude Opus 4.8',
    excerpt:      'The new model brings improvements in coding, agentic tasks, and extended autonomy, with a fast mode running 2.5× faster at the same price.',
    body:         "On May 28, 2026, Anthropic released Claude Opus 4.8, its most capable generally available model. The primary improvements over Opus 4.7 span three areas: coding across complex repositories, the ability to operate autonomously for extended sessions without quality degradation, and greater honesty when reporting its own progress on long-running tasks.\n\nAmong the operational changes, claude.ai users can now adjust the model's computational effort via a dedicated control — useful for balancing speed and response depth based on the task at hand. Claude Code introduces 'dynamic workflows', allowing the model to break down and tackle large-scale problems in a structured way. Fast mode, which operates at 2.5× standard speed, is now three times cheaper than in previous models.\n\nPricing remains unchanged from Opus 4.7: $5 per million input tokens and $25 per million output tokens, with discounts up to 90% with prompt caching. The model is available on claude.ai for Pro, Max, Team, and Enterprise plans, and via API on Claude Platform, AWS, Google Cloud, and Microsoft Foundry.",
    badge:        'Release',
    source_label: 'Source:',
    source_name:  'Anthropic',
    source_url:   'https://www.anthropic.com/news/claude-opus-4-8'
  },

  'openai-ipo-2026': {
    date:         'May 22, 2026 (upcoming)',
    title:        'OpenAI confidentially files for IPO',
    excerpt:      'OpenAI submitted a confidential S-1 to the SEC targeting a September 2026 listing at a valuation of up to $1 trillion.',
    body:         "On May 22, 2026, OpenAI confidentially submitted its S-1 IPO documentation to the U.S. Securities and Exchange Commission. Goldman Sachs and Morgan Stanley are co-leading the deal, targeting a valuation between $852 billion and $1 trillion, with a public market debut set for September 2026.\n\nA confidential filing allows OpenAI to begin the SEC review process without any public disclosure obligation, working through regulatory comments privately before the definitive prospectus. The financial backdrop draws scrutiny: in 2025, OpenAI generated $13.1 billion in revenue while burning through approximately $22 billion, resulting in a net loss of around $9 billion. Internal projections point to a $14 billion operating loss for 2026 despite rapidly growing revenues.\n\nThe IPO represents a historic milestone for the company and for the AI sector at large. The listing arrives alongside an intense valuation race: Anthropic announced a $30 billion funding round at a valuation above $900 billion, overtaking OpenAI on private markets for the first time. The competition between the two leading AI labs has now extended to financial markets.",
    badge:        'Upcoming',
    source_label: 'Source:',
    source_name:  'Fortune',
    source_url:   'https://fortune.com/2026/05/22/openai-ipo-filing-1-trillion-may-finally-answer-these-big-questions/'
  },

  'google-io-2026': {
    date:         'May 20, 2026',
    title:        'Google I/O 2026: Gemini 3.5 Flash, Omni, and Spark',
    excerpt:      'Google I/O 2026 launched a new generation of Gemini models with advanced multimodal capabilities and a 24/7 personal agent for Ultra subscribers.',
    body:         "On May 20, 2026, during Google I/O, CEO Sundar Pichai unveiled the new generation of Gemini models. Gemini 3.5 Flash is the flagship of this release: it surpasses Gemini 3.1 Pro on coding, agentic, and multimodal benchmarks while maintaining the speed and cost of the Flash series — 4× faster than competing frontier models. It rolled out immediately in the Gemini app, Search, and via the Gemini API.\n\nGemini Omni is a new model series that unifies reasoning and generation: it accepts text, image, audio, and video input and produces video output grounded in real-world knowledge. Gemini Spark is Google's first truly proactive personal agent — it runs in the background across email, calendar, and notifications, completing tasks on the user's behalf without active supervision. It becomes available the following week to Google AI Ultra subscribers in the US.\n\nOther notable announcements: the AI Ultra subscription was cut from $250 to $100 per month, Daily Brief delivers a personalized morning digest drawn from Gmail and Calendar, and Canva, Adobe, and CapCut announced native integrations directly inside the Gemini app for image and video editing. Google also confirmed that Gemini 3.5 Pro is in testing and will be available the following month.",
    badge:        'Product',
    source_label: 'Source:',
    source_name:  'Google Blog',
    source_url:   'https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/'
  },

  'ai-act-2026': {
    date:         'August 2, 2026 (upcoming) — updated May 2026',
    title:        'EU AI Act: transparency confirmed for August, high-risk deadline shifted to 2027',
    excerpt:      'The EU Digital Omnibus (May 2026) postponed high-risk AI obligations to December 2027, while transparency requirements for chatbots remain on track for August 2, 2026.',
    body:         "The EU AI Act is the world's first dedicated regulatory framework for artificial intelligence, in force since 2024 with a phased implementation schedule. On May 7, 2026, the EU Council, European Parliament, and Commission reached a provisional agreement on the Digital AI Omnibus, introducing significant changes to the original timeline.\n\nKey update: obligations for high-risk AI systems (Annex III, use-based) have been postponed from August 2, 2026 to December 2, 2027 — a 16-month deferral. Obligations for product-regulated systems (Annex I, including medical devices and lifts) shift from August 2027 to August 2028. The simplified compliance framework for SMEs has been extended to companies with up to 750 employees and €150 million in annual revenue.\n\nWhat remains confirmed from August 2, 2026: the Article 50 transparency obligations, including the requirement to notify users when they are interacting with an AI system (chatbots, voice assistants). New prohibitions on AI-generated non-consensual intimate material and CSAM take effect December 2, 2026. Formal adoption of the Omnibus is expected in June 2026, with publication in July. Fines for non-compliance with applicable obligations remain unchanged: up to 3% of global annual turnover (6% for prohibited systems).",
    badge:        'Upcoming',
    source_label: 'Source:',
    source_name:  'Inside Privacy / EU Commission',
    source_url:   'https://www.insideprivacy.com/artificial-intelligence/eu-ai-act-update-timeline-relief-targeted-simplification-and-new-prohibitions/'
  },

  'gpt-5-5': {
    date:         'April 23, 2026',
    title:        'OpenAI introduces GPT-5.5',
    excerpt:      'OpenAI introduced GPT-5.5 as a model aimed at real work across codin