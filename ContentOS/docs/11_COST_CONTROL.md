# Cost control

**Fully local and free**: ingest, codec verification, proxies, mezzanines,
transcription (faster-whisper on your GPU/CPU), captions, cut analysis, clip
scoring, edit plans, rendering, quality gates, review, taste, dry-run
distribution, asset library, SQLite, local research docs, Ollama generation.

**Can create charges (all optional, all off by default)**:
| Provider | Env var | Disable by |
|---|---|---|
| Anthropic/OpenAI/Gemini | *_API_KEY | leaving unset; `CONTENTOS_LLM_ADAPTER=ollama` pins local |
| Perplexity/Brave/Firecrawl/YouTube research | *_API_KEY | leaving unset (local_docs always works) |
| Zernio | ZERNIO_API_KEY | leaving unset; dry-run default |

Cost guards: research responses cache under `data/research` (repeat queries
are free); the template fallback means no pipeline stage *requires* a model;
live publishing is impossible until explicitly enabled at three layers; no
subscription clip service is used anywhere — that dependency is what this
system replaces. A consumer Claude/ChatGPT subscription does NOT include API
credits; API keys bill separately.
