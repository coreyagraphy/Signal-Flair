"""Transcription adapter contract."""
from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path


class TranscriptionAdapter(ABC):
    """Produces the normalized transcript dict:

    {
      "engine": str, "engine_mode": str, "language": str|None,
      "duration_seconds": float,
      "segments": [{"id": int, "start": float, "end": float,
                    "text": str, "confidence": float}],
      "words": [{"start": float, "end": float, "word": str, "confidence": float}],
      "flags": [str],          # e.g. "no_speech_recognition" for fallbacks
      "raw": dict              # engine-native output, preserved verbatim
    }
    """

    name: str = "base"

    @abstractmethod
    def available(self) -> tuple[bool, str]:
        """(usable, reason)"""

    @abstractmethod
    def transcribe(self, wav_path: Path, *, language: str | None = None) -> dict:
        ...
