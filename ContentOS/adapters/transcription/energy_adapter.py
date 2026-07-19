"""Energy adapter: last-resort fallback when no ASR engine is available.

Uses ffmpeg silencedetect to find speech regions and emits segments with
EMPTY text, flagged ``no_speech_recognition``. This keeps the dead-air
editing pipeline useful offline without ever inventing speech.
"""
from __future__ import annotations

import re
from pathlib import Path

from core.proc import run_command, which

from .base import TranscriptionAdapter

_SILENCE_START = re.compile(r"silence_start:\s*([0-9.]+)")
_SILENCE_END = re.compile(r"silence_end:\s*([0-9.]+)")
_DURATION = re.compile(r"Duration:\s*(\d+):(\d+):(\d+\.?\d*)")


def detect_silences(wav_path: Path, *, noise_db: float = -35.0,
                    min_silence_seconds: float = 0.5) -> tuple[list[tuple[float, float]], float]:
    """Return ([(silence_start, silence_end)], total_duration)."""
    which("ffmpeg")
    result = run_command([
        "ffmpeg", "-hide_banner", "-i", str(wav_path),
        "-af", f"silencedetect=noise={noise_db}dB:d={min_silence_seconds}",
        "-f", "null", "-",
    ], timeout=1800, check=False)
    text = result.stderr
    duration = 0.0
    m = _DURATION.search(text)
    if m:
        duration = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    starts = [float(x) for x in _SILENCE_START.findall(text)]
    ends = [float(x) for x in _SILENCE_END.findall(text)]
    silences: list[tuple[float, float]] = []
    for i, s in enumerate(starts):
        e = ends[i] if i < len(ends) else duration
        silences.append((s, e))
    return silences, duration


class EnergyAdapter(TranscriptionAdapter):
    name = "energy"

    def __init__(self, noise_db: float = -35.0, min_silence_seconds: float = 0.5):
        self.noise_db = noise_db
        self.min_silence_seconds = min_silence_seconds

    def available(self) -> tuple[bool, str]:
        try:
            which("ffmpeg")
        except Exception:
            return False, "ffmpeg not on PATH"
        return True, "ffmpeg silencedetect available"

    def transcribe(self, wav_path: Path, *, language: str | None = None) -> dict:
        silences, duration = detect_silences(
            wav_path, noise_db=self.noise_db,
            min_silence_seconds=self.min_silence_seconds)
        # Invert silences into voiced regions.
        segments = []
        cursor = 0.0
        idx = 0
        for s_start, s_end in silences:
            if s_start - cursor > 0.2:
                segments.append({"id": idx, "start": round(cursor, 3),
                                 "end": round(s_start, 3), "text": "",
                                 "confidence": 0.0})
                idx += 1
            cursor = max(cursor, s_end)
        if duration - cursor > 0.2:
            segments.append({"id": idx, "start": round(cursor, 3),
                             "end": round(duration, 3), "text": "", "confidence": 0.0})
        return {
            "engine": self.name, "engine_mode": "silencedetect",
            "language": None, "duration_seconds": duration,
            "segments": segments, "words": [],
            "flags": ["no_speech_recognition"],
            "raw": {"silences": silences, "noise_db": self.noise_db},
        }
