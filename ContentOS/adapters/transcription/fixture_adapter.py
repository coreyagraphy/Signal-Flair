"""Fixture adapter: loads a transcript JSON sitting beside the source media.

Used by automated tests and by operators who already have a transcript.
Looks for ``<media stem>.transcript.json`` next to the wav/managed original.
"""
from __future__ import annotations

import json
from pathlib import Path

from core.exceptions import ProviderUnavailable

from .base import TranscriptionAdapter


class FixtureAdapter(TranscriptionAdapter):
    name = "fixture"

    def __init__(self, explicit_path: Path | None = None):
        self.explicit_path = explicit_path

    def _candidates(self, wav_path: Path) -> list[Path]:
        out = []
        if self.explicit_path:
            out.append(self.explicit_path)
        stem = wav_path.stem
        for suffix in ("_asr16k", "_master48k"):
            if stem.endswith(suffix):
                stem = stem[: -len(suffix)]
        out.append(wav_path.parent / f"{stem}.transcript.json")
        out.append(wav_path.with_suffix(".transcript.json"))
        return out

    def available(self) -> tuple[bool, str]:
        return True, "fixture adapter always importable; needs a sidecar file at runtime"

    def transcribe(self, wav_path: Path, *, language: str | None = None) -> dict:
        for candidate in self._candidates(wav_path):
            if candidate.exists():
                data = json.loads(candidate.read_text(encoding="utf-8"))
                data.setdefault("engine", self.name)
                data.setdefault("engine_mode", "fixture")
                data.setdefault("language", language or "en")
                data.setdefault("words", [])
                data.setdefault("flags", [])
                data.setdefault("raw", {"fixture_path": str(candidate)})
                if "segments" not in data:
                    raise ProviderUnavailable(
                        f"Fixture {candidate.name} has no 'segments' array")
                return data
        raise ProviderUnavailable(
            f"No transcript fixture found near {wav_path.name}")
