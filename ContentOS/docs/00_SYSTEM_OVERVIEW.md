# System overview

Content OS is a local-first, model-neutral content operating system: drop an
MP4/MOV into `Input/inbox` and it is ingested, fingerprinted, codec-verified,
proxied, transcribed, captioned, strategized, clip-scored, edit-planned,
draft-rendered (horizontal + vertical with burned captions), packaged for
Premiere, and parked for review — then approved into final renders and
dry-run distribution packages. State lives in SQLite; a restart never loses a
job; a failed stage retries without redoing verified work.

**Works fully offline** with only Python + FFmpeg. Optional layers (each
degrades gracefully when absent): faster-whisper on the RTX 3090, Ollama for
generation, API providers for research, Premiere MCP for editable sequences,
Zernio/YouTube for live publishing (dry-run is the hard default).

Trust rules baked in: nothing fakes success (unsupported operations say so),
transcripts/research are treated as untrusted data, no claim/testimonial is
ever fabricated, originals are never modified, and quality gates block
approval on critical failures.
