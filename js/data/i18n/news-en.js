/**
 * news-en.js — News texts in English
 * Structure: window.GL.newsStrings['en'][id] = { date, title, excerpt, body, badge, source_* }
 * body: paragraphs separated by \n\n
 */

window.GL = window.GL || {};
window.GL.newsStrings = window.GL.newsStrings || {};

window.GL.newsStrings['en'] = {

  'ai-act-2026': {
    date:         'August 2, 2026 (upcoming)',
    title:        'EU AI Act: full applicability scheduled',
    excerpt:      'According to the European Commission, the AI Act becomes fully applicable on August 2, 2026, with direct impact on AI development and deployment.',
    body:         "The European Union's AI Act has become the first global regulatory framework dedicated to artificial intelligence. After a long legislative process that started in 2021, the regulation entered into force in 2024 with a phased implementation schedule.\n\nFrom August 2, 2026, it becomes fully applicable for most AI systems, imposing precise obligations around transparency, risk assessment, and technical documentation. Systems classified as high-risk — in areas such as healthcare, credit, public safety, and education — will need to meet strict compliance requirements before being put into operation.\n\nFines for non-compliance can reach up to 3% of global annual turnover or €15 million, whichever is higher. For prohibited AI systems (such as general social scoring) fines rise to 6%. This forces all companies operating in the EU market — regardless of where they are based — to comply.",
    badge:        'Upcoming',
    source_label: 'Source:',
    source_name:  'European Commission',
    source_url:   'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'
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
