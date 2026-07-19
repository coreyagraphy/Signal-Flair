# Gap analysis — honest per-feature status

Categories: **verified** (executed + tested here) · **blocked** (code complete,
needs the Windows workstation / credentials / hardware) · **interface-only**
(adapter contract real, client intentionally unimplemented pending verified
docs) · **not implemented**.

| Feature | Status | Notes |
|---|---|---|
| Ingest, dedupe, quarantine, managed copies | verified | e2e + unit tests |
| SQLite persistence, migrations, restart resume, retry | verified | tests |
| FFprobe metadata + full stream inventory | verified | tests |
| Codec decode ladder + differentiated failures | verified | 16/16 matrix on this ffmpeg build |
| Hardware (NVDEC) decode tier | blocked | code path real; needs RTX 3090 machine |
| Review proxy (CFR/VFR, HDR tone-map, decode-verified) | verified | tests |
| ProRes / DNxHR mezzanine + relink metadata | verified | generated + probed here |
| faster-whisper transcription | blocked | adapter + fallback ladder real; package/GPU absent here; fixture + energy adapters verified |
| Caption engine (cues, styles, burn-in, SRT/VTT) | verified | tests + burned output probed |
| Conservative cut analysis + explainable cut report | verified | tests |
| Clip scoring | verified | deterministic heuristics, tests |
| Strategy briefs + evidence provenance + caching | verified | local_docs provider; LLM via Ollama blocked (no Ollama here); template fallback verified |
| External research providers (Brave/Perplexity/Firecrawl/YouTube) | interface-only | honest stubs; no endpoint guessing |
| Draft renderer (edit-plan execution, both aspects) | verified | ffprobe-verified outputs |
| Quality gates | verified | tests |
| Review package + local review server + revision loop | verified | e2e incl. generic-note regression |
| Taste Database + confidence growth + autopilot eligibility | verified | tests |
| Premiere MCP transport (JSON-RPC stdio) | verified | against scripted fake server |
| Premiere capability discovery + tool mapper | verified logic / blocked live | real Premiere + MCP server exist only on Windows |
| Premiere vertical slice against real Premiere | blocked | requires Windows; steps in docs/05 |
| Distribution dry-run + idempotency + platform validation | verified | e2e |
| Zernio / YouTube live publishing | interface-only | credential-gated, refuse honestly |
| Analytics ingest + sample-size-guarded recommendations | verified | unit-level |
| Asset library scan/classify/preview/report/selection | verified | synthetic library test |
| Four Editors folder scan | blocked | folder exists only on Windows; run `assets register` + `assets scan` there |
| OneDrive placeholder detection | blocked (logic verified) | Windows file attributes; non-Windows returns 'local' |
| Streamlit control panel | code complete, unverified UI | streamlit not installed here; logic imports test-covered modules |
| Remotion motion-graphics route | not implemented | routing target only, honestly labeled |
| DaVinci Resolve adapter | not implemented | documented as future tier |
