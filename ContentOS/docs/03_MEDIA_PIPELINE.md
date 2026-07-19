# Media pipeline

## Codec acceptance (P0 addendum)
A source is `codec_verified` only after: full multi-stream probe → decode
samples at beginning/middle/end (warning-loglevel so concealment markers are
visible) → timestamp inspection (VFR, negative/missing/non-monotonic pts) →
proxy generation → independent proxy decode + duration verification.
Decoder ladder: NVDEC hardware (when present) → software → tolerant retry to
distinguish damage from missing decoders. Failures are differentiated:
`zero_byte_file`, `missing_moov_atom`, `corrupt_container`, `drm_protected`,
`damaged_frames`, `unsupported_codec` (names the exact missing decoder and a
recommended path). Reports: `Output/reports/<job>_codec_report.{json,md}`.
Build inventory: `contentos_cli.py codec-inventory` →
`docs/audit/INSTALLED_CODEC_CAPABILITY_REPORT.md`. Matrix:
`scripts/run_codec_matrix.py` (+ real samples in
`tests/codec_samples_private/`, never committed).

## Proxies
- **Review proxy**: MP4 H.264 yuv420p 8-bit, AAC-LC 48k, faststart, ≤720p,
  full source duration; CFR-normalized for VFR sources (drift-checked); HDR
  gets a recorded zscale+hable tone-map (original untouched, fallback
  recorded if zscale is absent). Plays in Chromium/Streamlit regardless of
  the camera codec.
- **Editing proxies/mezzanines** (`contentos_cli.py mezzanine`): ProRes
  Proxy/422/422HQ, DNxHR LB/SQ/HQX — each verified after encode, with
  `.relink.json` recording the proxy↔original relationship for conform.

## Transcription
Adapter ladder (`auto`): fixture sidecar → faster-whisper (CUDA fp16 →
int8_float16 → CPU int8; the mode actually used is recorded — no silent
downgrade) → energy fallback (silence-derived segments, empty text, flagged
`no_speech_recognition`). Raw ASR output is preserved; cleanup writes a
separate revision (fillers flagged in segments AND word timings, glossary
proper-noun fixes from `Knowledge_Base/brand/GLOSSARY.md`, low-confidence
words listed; speech is never invented).

## Captions
Word-timing cues with punctuation-aware breaks, line-length/cue-duration/
reading-speed constraints (best-effort under very dense speech — the quality
gate reports violations), style presets in `config/caption_styles.yaml`, real
font fallback via platform font directories, SRT/VTT/JSON outputs, ffmpeg
burn-in for drafts + sidecars for Premiere.

## Dead-air editing (deliberately conservative)
Only silences ≥ `minimum_removable_silence_ms` (default 1.2s) are removable;
post-sentence beats keep `maximum_natural_pause_ms`; cuts carry pre/post
padding, minimum spacing, word-safe boundaries (including swallowed words),
and reviewer-protected ranges. Cuts that would orphan a short speech fragment
are skipped, not taken. Every decision lands in `cut_report.md` with reason,
confidence, and audio evidence; uncertain cuts are flagged for review.
