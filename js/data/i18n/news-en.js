/**
 * news-en.js — News texts in English
 * Structure: window.GL.newsStrings['en'][id] = { date, title, excerpt, body, badge, source_* }
 * body: paragraphs separated by \n\n
 */

window.GL = window.GL || {};
window.GL.newsStrings = window.GL.newsStrings || {};

window.GL.newsStrings['en'] = {

  'claude-haiku-5-5': {
    date:         'October 7, 2026',
    title:        "Claude Haiku 5.5: Anthropic's small model gets 75% cheaper",
    excerpt:      "Anthropic releases Haiku 5.5 with a 1M-token context window, an adjustable effort setting and pricing from $0.10 per million input tokens.",
    body:         "On October 7, 2026, Anthropic released Claude Haiku 5.5, billed as its cheapest, fastest and most capable small model. It targets high-volume workloads: summaries, context compaction, database queries, classification, live support and subagent work.\n\nOn average it costs around 75% less to run than Haiku 4.5, with developer pricing starting at $0.10 per million input tokens and $0.50 per million output tokens. The model has a 1M-token context window, up to 128k output tokens, and is the first Haiku-class model with an adjustable effort setting that trades cost against answer quality. In the same launch Anthropic halved the price of Sonnet 5.5 cache reads.\n\nHaiku 5.5 can be selected on Claude.ai on every plan, including Free, and is available through the API, Claude Code and the major cloud platforms. For complex agentic coding Anthropic still points to Sonnet 5.5 and Opus 5.5, and warns that code written for Haiku 4.5 may need changes.",
    badge:        'Released',
    source_label: 'Source:',
    source_name:  'Anthropic',
    source_url:   'https://www.anthropic.com/claude-haiku-5-5'
  },

  'gpt-6-intelligent-ui': {
    date:         'October 7, 2026',
    title:        'OpenAI brings GPT-6 and interactive answers to every ChatGPT user',
    excerpt:      "From October 7, GPT-6 reaches the chat on all plans together with Intelligent UI: answers can contain charts, calculators, maps and interactive controls.",
    body:         "On October 7, 2026, OpenAI began the global rollout of GPT-6 in the ChatGPT chat experience together with Intelligent UI. Plus, Pro, Business and Enterprise went first, with Free and Go following the next day. For companies, availability depends on admin settings.\n\nWith Intelligent UI an answer is no longer text only: it can include buttons, task-specific calculators, editable charts, diagrams and maps that the user manipulates inside the conversation. When text is the clearest format the answer stays textual, and users can reduce the amount of visual material.\n\nAccording to reports, paid plans run on GPT-6 Sol and free plans on GPT-6 Luna, while the models behind Work and Codex are unchanged. OpenAI frames the release around the more than 1.2 billion people who use ChatGPT each week. The first GPT-6 models reached paying customers in September.",
    badge:        'Released',
    source_label: 'Source:',
    source_name:  'OpenAI',
    source_url:   'https://openai.com/index/gpt-6-for-everyone/'
  },

  'gtig-ai-vulnerabilities': {
    date:         'October 1, 2026',
    title:        'Google: half of AI-discovered vulnerabilities lead to remote code execution',
    excerpt:      "Google's threat intelligence group measures how AI is changing vulnerability research: monthly disclosures doubled in 2026 and exploitation follows within days.",
    body:         "The Google Threat Intelligence Group (GTIG) published an analysis of how AI is changing vulnerability discovery and exploitation, based on data from January 2025 to August 2026. Monthly CVE disclosures doubled in eight months, from 5,045 in January 2026 to 10,740 in August. Only 0.23% were seen exploited in real attacks, but absolute numbers are rising: 141 in the first eight months of 2026 against 127 in all of 2025.\n\nFlaws found by AI systems have a different profile: 50% lead to remote code execution, compared with 26% of the rest. Timelines are shrinking too: CVE-2026-1731, found autonomously by the Hacktron research agent in BeyondTrust remote access products, was exploited by a first threat cluster within four days of disclosure and by five more within a week.\n\nAI software is itself a target: 2,076 vulnerabilities tracked over the period, more than 1,500 of them in 2026, half in agent orchestration frameworks such as Flowise and Langflow; another 212 affect inference software such as vLLM, Ollama and LiteLLM. GTIG recommends moving from unprioritized mass patching to intelligence-driven triage, with targeted defense of exposed systems and automated remediation.",
    badge:        'Report',
    source_label: 'Source:',
    source_name:  'Google Threat Intelligence Group',
    source_url:   'https://cloud.google.com/blog/topics/threat-intelligence/vulnerability-discovery-and-exploitation-trends-in-the-ai-era'
  },

  'gemini-4-argon': {
    date:         'September 30, 2026',
    title:        'Google unveils Gemini 4 Argon, limited to cyber defenders for now',
    excerpt:      "Google's new frontier model focuses on software engineering, specialist knowledge work and cybersecurity. Initial access is limited to the Fairwind program.",
    body:         "On September 30, 2026, Google DeepMind announced Gemini 4 Argon, its new frontier model, aimed at real-world software engineering, specialist legal and financial work, and cyber defense. The output limit rises from 64k to 1 million tokens.\n\nGoogle claims state-of-the-art results on several benchmarks: 77.9% on DeepSWE v1.1 (long-horizon software engineering), 91.7% on LVBench (long-video understanding) and 68% on CWE-bench v1 (vulnerability remediation), tied for first.\n\nThe model is not generally available yet: it is rolling out first to verified cyber defenders in the Fairwind program, while Google takes part in the U.S. government's voluntary pre-release access process. A broader release is promised soon, starting with paid API customers and Google AI Ultra subscribers. Introductory pricing is $2 per million input tokens and $10 per million output tokens, set to double after the launch period.",
    badge:        'Limited access',
    source_label: 'Source:',
    source_name:  'Google',
    source_url:   'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/'
  },

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
    date:         'August 2, 2026',
    title:        'EU AI Act: transparency obligations are now in force',
    excerpt:      "Since August 2, 2026, chatbots, deepfakes and synthetic content must be disclosed. High-risk obligations are pushed back to December 2027.",
    body:         "Since August 2, 2026, the transparency obligations in Article 50 of the AI Act apply, regardless of a system's risk classification. Chatbot providers must tell people they are interacting with an AI, unless it is obvious from context. Synthetic audio, images, video and text must be marked in a machine-readable format, and anyone publishing deepfakes of real people, places or events must disclose it. Deployers of emotion recognition or biometric categorisation systems must inform the people exposed to them.\n\nGenerative systems already on the market before August 2 have until December 2, 2026 to comply with the marking obligation. Fines for breaching Article 50 reach 15 million euros or 3% of worldwide annual turnover.\n\nThe timetable for the rest of the regulation changed with the Digital Omnibus on AI, Regulation (EU) 2026/1744, in force since July 27, 2026: obligations for Annex III high-risk systems move to December 2, 2027, and those for systems embedded in regulated products (Annex I) to August 2, 2028. New prohibitions, including one on nudification apps, apply from December 2, 2026.",
    badge:        'In force',
    source_label: 'Source:',
    source_name:  'Goodwin',
    source_url:   'https://www.goodwinlaw.com/en/insights/publications/2026/08/alerts-technology-dpc-eu-ai-act-transparency-obligations-now-in-force'
  },

  'gpt-5-5': {
    date:         'April 23, 2026',
    title:        'OpenAI introduces GPT-5.5',
    excerpt:      'OpenAI introduced GPT-5.5 as a model aimed at real work across coding, research, and multi-step tool-based tasks.',
    body:         "On April 23, 2026, OpenAI officially introduced GPT-5.5, positioning it as a work-focused model compared to its predecessors. Unlike GPT-5 — optimized for general excellence — GPT-5.5 is designed for high-intensity practical tasks: complex code writing, research and information synthesis, and multi-step flows with external tool calls.\n\nBenchmark performance in coding shows significant improvements over GPT-5, with particular progress on tasks requiring reasoning over existing repositories and iterative debugging. The model is available via API with increased rate limits for developers and in advanced ChatGPT plans.\n\nThe announcement comes at a time of strong competitive pressure from Anthropic — with Claude Opus 4 — Google, and open-source models like Qwen and Llama, signaling a market where the release pace has considerably accelerated.",
    badge:        'Release',
    source_label: 'Source:',
    source_name:  'OpenAI',
    source_url:   'https://openai.com/index/introducing-gpt-5-5/'
  },

  'openai-voice-realtime': {
    date:         'May 7, 2026',
    title:        'New realtime voice models in the OpenAI API',
    excerpt:      'OpenAI released a new generation of realtime voice models for reasoning, translation, and live transcription.',
    body:         "On May 7, 2026, OpenAI released a new suite of realtime voice models for its APIs. The new models bring substantial improvements in three key areas: voice reasoning with the ability to process a response before speaking — reducing errors and hallucinations — live translation with sub-500ms latency, and high-accuracy transcription with automatic language detection.\n\nDevelopers can now build fully native voice-to-voice applications without composing separate pipelines of ASR (speech-to-text) + LLM + TTS (text-to-speech). The entire chain is integrated, with native handling of interruptions, overlaps, and mid-sentence language switching.\n\nPricing remained unchanged from previous models, making this technology accessible to startups and indie projects as well. OpenAI also published an updated migration guide for developers moving from previous audio models.",
    badge:        'API',
    source_label: 'Source:',
    source_name:  'OpenAI',
    source_url:   'https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/'
  },

  'gemini-agentic': {
    date:         'May 19, 2026',
    title:        'Gemini becomes more agentic',
    excerpt:      'Google updated the Gemini app with more proactive capabilities and round-the-clock assistance patterns.',
    body:         "On May 19, 2026, Google updated the Gemini app with a set of features focused on proactivity and continuous operation. The most significant change is the 'Always Active' mode: the assistant can now monitor background activities — emails, calendar, notifications — and intervene autonomously on tasks delegated by the user.\n\nGemini can now complete multi-app operations without constant supervision: update Google Workspace documents, set up intelligent contextual reminders, and synthesize information from multiple sources into a single proactive response. Google also announced Workspace Enterprise API integrations, opening the door to enterprise deployments of custom AI agents.\n\nThe move intensifies competition with Anthropic's agentic assistants (Claude with computer use) and Microsoft (Copilot), signaling that the future of AI assistants is no longer reactive but proactive.",
    badge:        'Product',
    source_label: 'Source:',
    source_name:  'Google Blog',
    source_url:   'https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/'
  },

  'anthropic-vercept': {
    date:         'February 25, 2026',
    title:        'Anthropic acquires Vercept',
    excerpt:      "The acquisition is meant to advance Claude's computer-use capabilities for complex tasks in live software.",
    body:         "On February 25, 2026, Anthropic acquired Vercept, a startup specializing in computer vision applied to visual UI interaction. The deal value was not disclosed. The strategic goal is to strengthen Claude's 'computer use' capabilities: the ability for the model to navigate graphical interfaces, interpret screenshots, click elements, and fill forms autonomously.\n\nVercept had developed proprietary techniques for visual segmentation and action grounding on desktop and web UIs, with results superior to standard OCR + coordinate approaches on dynamic layouts and applications not optimized for AI agents. Vercept's team (approximately 12 people) will integrate into Anthropic's Alignment & Capabilities group.\n\nIntegration into the Claude platform is expected in experimental form by mid-2026, initially for Enterprise API customers. The acquisition fits into the broader race toward AI agents capable of operating on real software without dedicated APIs.",
    badge:        'Research',
    source_label: 'Source:',
    source_name:  'Anthropic',
    source_url:   'https://www.anthropic.com/news/acquires-vercept'
  },

  'openssf-model-signing': {
    date:         'April 4, 2025',
    title:        'OpenSSF launches Model Signing v1.0',
    excerpt:      'The project adds signing and verification for ML models to improve integrity and provenance in AI supply chains.',
    body:         "On April 4, 2025, the Open Source Security Foundation (OpenSSF) released Model Signing v1.0, an open standard for cryptographic signing and verification of machine learning models. The initiative stems from growing concern over the AI supply chain: models downloaded from public repositories like Hugging Face may have been tampered with or replaced by malicious versions without users' awareness.\n\nModel Signing v1.0 defines a standard format for attaching digital signatures to model files — in formats such as .safetensors, .gguf, .bin and others — and for verifying them automatically before loading. The framework is compatible with Sigstore, already widely adopted in the open-source software supply chain (used by npm, PyPI, Maven).\n\nAdoption is supported by Google, Intel, and several AI vendors. OpenSSF also released SDKs for Python and Go to integrate verification directly into training and inference frameworks.",
    badge:        'Security',
    source_label: 'Source:',
    source_name:  'OpenSSF',
    source_url:   'https://openssf.org/blog/2025/04/04/launch-of-model-signing-v1-0-openssf-ai-ml-working-group-secures-the-machine-learning-supply-chain/'
  },

  'microsoft-build-agentic': {
    date:         'May 19, 2025',
    title:        'Microsoft Build highlights the open agentic web',
    excerpt:      'Microsoft announced broad MCP support across platforms and new foundations for cross-agent interoperability.',
    body:         "On May 19, 2025, during Microsoft Build, CEO Satya Nadella outlined Microsoft's vision for the 'open agentic web'. The centerpiece was the announcement of native MCP (Model Context Protocol) support across Copilot, Azure AI, Windows, and GitHub Copilot — a significant endorsement of the open protocol originally developed by Anthropic, which accelerated its industrial adoption.\n\nMicrosoft also presented Agent2Agent (A2A), a new set of standards for interoperability between heterogeneous AI agents. A2A allows multiple agents — even from different vendors — to coordinate on complex tasks via shared protocols, without the need for custom integrations. At launch, over 50 ecosystem partners declared conformance.\n\nThe move positions Microsoft as a neutral platform for the future of AI automation in enterprise, with Azure as the central infrastructure. The openness toward MCP is particularly relevant for the open-source world, which now has an industrial reference point for building compatible tools.",
    badge:        'Ecosystem',
    source_label: 'Source:',
    source_name:  'Microsoft',
    source_url:   'https://blogs.microsoft.com/blog/2025/05/19/microsoft-build-2025-the-age-of-ai-agents-and-building-the-open-agentic-web/'
  }

};
