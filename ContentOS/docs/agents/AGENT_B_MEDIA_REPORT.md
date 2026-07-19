# Agent B — Media Processing & Transcription workstream report

## Delivered
- FFprobe normalized metadata + full multi-stream inventory with color/VFR/
  rotation/field-order capture (`media_probe_service`, `codec_service`)
- CodecCompatibilityService: decode ladder (hw→sw→tolerant), begin/middle/end
  samples at warning loglevel (concealment markers visible), benign
  seek-noise classification, differentiated failure states, per-source codec
  reports; 16/16 synthetic matrix verified on this ffmpeg 6.1.1 build
- Review proxy: H.264/yuv420p/AAC 48k faststart ≤720p, full duration,
  CFR-normalized for VFR with drift verification, recorded HDR tone-map
- ProRes (proxy/422/HQ) + DNxHR (LB/SQ/HQX) mezzanines with relink metadata
- Audio extraction: 16k mono ASR wav + 48k PCM master
- Transcription adapters: faster-whisper (CUDA fp16 → int8_float16 → CPU int8,
  mode recorded), fixture, energy (silencedetect, empty text, flagged)
- Caption engine: word-timing cues, punctuation-aware breaks, reading-speed
  and line constraints, style presets, real font fallback, ffmpeg burn-in
- Draft renderer executing edit plans (trim/concat filtergraph, center-crop
  vertical, loudnorm, burn-in) with ffprobe verification

## Not verified here (environment)
RTX 3090 NVDEC decode, faster-whisper large-v3 on CUDA — code paths exist,
run `python scripts/verify_gpu.py` on the workstation.
