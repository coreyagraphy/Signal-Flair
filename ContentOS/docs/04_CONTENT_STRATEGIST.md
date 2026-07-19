# Content strategist

Per job the strategist grounds itself in: transcript themes, Knowledge Base
brand/voice/audience files, active taste rules (retrieved before generation),
and researched evidence. It never invents brand facts (Knowledge Base
templates use explicit placeholders) and never fabricates trends.

**Research**: providers behind `adapters/research/`; every claim carries URL,
title, publisher, capture date, query, provider, hash, and source class.
Results cache under `data/research` (reproducible, free re-runs) and persist
to `research_sources`. `local_docs` (Knowledge_Base/research) is always
available; Brave/Perplexity/Firecrawl/YouTube are credential-gated interfaces
awaiting verified client implementations — they refuse rather than guess
endpoints. Evidence rolls up into a signal class: verified_trend /
emerging_signal / anecdotal_signal / internal_hypothesis.

**Generation**: LLM adapter (Ollama at `CONTENTOS_OLLAMA_URL` by default;
Anthropic optional; deterministic template fallback labeled
`heuristic: true`). Prompts version-tagged (`PROMPT_VERSION`); transcript and
research text is framed as untrusted data inside every prompt. Outputs:
`strategy_brief.{json,md}` per job plus platform copy packages
(`Output/social/<job>_social.json`) with per-platform limits and
review-before-posting placeholders when no model was available.
