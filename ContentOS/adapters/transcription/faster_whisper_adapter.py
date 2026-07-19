"""faster-whisper adapter with explicit CUDA→CPU fallback ladder.

The fallback ladder never downgrades silently: the mode actually used is
recorded in ``engine_mode`` and surfaced in job events.
"""
from __future__ import annotations

from pathlib import Path

from core.exceptions import ProviderUnavailable
from core.logging import get_logger

from .base import TranscriptionAdapter

log = get_logger("contentos.asr.fasterwhisper")


class FasterWhisperAdapter(TranscriptionAdapter):
    name = "faster_whisper"

    def __init__(self, model_name: str = "large-v3", device: str = "cuda",
                 compute_type: str = "float16", cpu_fallback: bool = True):
        self.model_name = model_name
        self.device = device
        self.compute_type = compute_type
        self.cpu_fallback = cpu_fallback

    def available(self) -> tuple[bool, str]:
        try:
            import faster_whisper  # noqa: F401
        except ImportError:
            return False, "faster-whisper is not installed (pip install faster-whisper)"
        return True, "faster-whisper importable"

    def _ladder(self) -> list[tuple[str, str]]:
        rungs = [(self.device, self.compute_type)]
        if self.device == "cuda":
            rungs.append(("cuda", "int8_float16"))
            if self.cpu_fallback:
                rungs.append(("cpu", "int8"))
        return rungs

    def transcribe(self, wav_path: Path, *, language: str | None = None) -> dict:
        ok, reason = self.available()
        if not ok:
            raise ProviderUnavailable(reason)
        from faster_whisper import WhisperModel

        last_error: Exception | None = None
        for device, compute_type in self._ladder():
            try:
                model = WhisperModel(self.model_name, device=device,
                                     compute_type=compute_type)
                seg_iter, info = model.transcribe(
                    str(wav_path), language=language or None,
                    word_timestamps=True, vad_filter=True,
                )
                mode = f"{device}-{compute_type}"
                if (device, compute_type) != (self.device, self.compute_type):
                    log.warning("faster-whisper fell back to %s (requested %s-%s)",
                                mode, self.device, self.compute_type)
                segments, words = [], []
                for i, seg in enumerate(seg_iter):
                    segments.append({
                        "id": i, "start": float(seg.start), "end": float(seg.end),
                        "text": seg.text.strip(),
                        "confidence": float(getattr(seg, "avg_logprob", 0.0)),
                    })
                    for w in (seg.words or []):
                        words.append({"start": float(w.start), "end": float(w.end),
                                      "word": w.word.strip(),
                                      "confidence": float(w.probability)})
                return {
                    "engine": self.name, "engine_mode": mode,
                    "language": getattr(info, "language", language),
                    "duration_seconds": float(getattr(info, "duration", 0.0)),
                    "segments": segments, "words": words, "flags": [],
                    "raw": {"language_probability":
                            float(getattr(info, "language_probability", 0.0)),
                            "requested": f"{self.device}-{self.compute_type}"},
                }
            except Exception as exc:  # model load / CUDA errors → next rung
                last_error = exc
                log.warning("faster-whisper %s-%s failed: %s", device, compute_type, exc)
        raise ProviderUnavailable(f"faster-whisper failed on all devices: {last_error}")
