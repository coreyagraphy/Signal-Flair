#!/usr/bin/env python3
"""Generate synthetic test media locally — no private footage required.

Synthesizes a ~50s 1280x720 MP4: testsrc2 visuals plus a stdlib-generated
WAV of speech-like tone bursts separated by real silence gaps, and a sidecar
transcript fixture so the full pipeline (captions, clip scoring, edit
planning, rendering) runs without an ASR engine.
"""
from __future__ import annotations

import json
import math
import struct
import sys
import wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from core.proc import run_command, which  # noqa: E402

TOTAL_SECONDS = 50.0
SAMPLE_RATE = 48000

FIXTURE_SENTENCES = [
    (1.0, 4.5, "Here's the biggest mistake local businesses make with AI search."),
    (4.9, 8.2, "They assume Google rankings carry over to ChatGPT answers."),
    (8.6, 12.0, "They don't. AI engines read structure, not just keywords."),
    (14.5, 18.0, "So what actually works? Three things matter most."),
    (18.4, 22.0, "First, entity clarity. The engine must know who you are."),
    (22.4, 26.0, "Second, crawlable structure that answers real questions."),
    (26.4, 30.0, "Third, proof signals the engine can verify and cite."),
    (33.0, 36.5, "Fix those three and you stop being invisible."),
    (36.9, 40.5, "That's the whole game. Structure beats volume every time."),
    (41.0, 44.0, "If this helped, the full audit process is on the site."),
]


def write_burst_wav(path: Path) -> None:
    """Sine bursts during 'speech' ranges, silence elsewhere (stdlib only)."""
    n_samples = int(TOTAL_SECONDS * SAMPLE_RATE)
    voiced = [(s, e) for s, e, _ in FIXTURE_SENTENCES]
    frames = bytearray()
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        active = any(s <= t <= e for s, e in voiced)
        if active:
            # Mix two tones with slow amplitude wobble — vaguely speech-shaped.
            value = 0.35 * math.sin(2 * math.pi * 180 * t) \
                  + 0.20 * math.sin(2 * math.pi * 310 * t)
            value *= 0.6 + 0.4 * math.sin(2 * math.pi * 3.1 * t)
        else:
            value = 0.0
        frames += struct.pack("<h", int(max(-1.0, min(1.0, value)) * 32000))
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(bytes(frames))


def main(out_dir: Path | None = None) -> Path:
    which("ffmpeg")
    out_dir = out_dir or Path(__file__).resolve().parent.parent / "tests" / "fixtures"
    out_dir.mkdir(parents=True, exist_ok=True)
    video = out_dir / "synthetic_talking_head.mp4"
    tmp_wav = out_dir / "_synthetic_audio.wav"
    write_burst_wav(tmp_wav)

    run_command([
        "ffmpeg", "-y",
        "-f", "lavfi", "-i",
        f"testsrc2=size=1280x720:rate=30:duration={TOTAL_SECONDS}",
        "-i", str(tmp_wav),
        "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-ar", "48000", "-shortest",
        str(video),
    ], timeout=600)
    tmp_wav.unlink(missing_ok=True)

    words, segments = [], []
    for i, (start, end, text) in enumerate(FIXTURE_SENTENCES):
        segments.append({"id": i, "start": start, "end": end, "text": text,
                         "confidence": 0.95})
        tokens = text.split()
        step = (end - start) / len(tokens)
        for j, token in enumerate(tokens):
            words.append({"start": round(start + j * step, 3),
                          "end": round(start + (j + 1) * step, 3),
                          "word": token, "confidence": 0.95})
    fixture = {
        "engine": "fixture", "engine_mode": "synthetic", "language": "en",
        "duration_seconds": TOTAL_SECONDS, "segments": segments, "words": words,
        "flags": [], "raw": {"note": "synthetic fixture for automated tests"},
    }
    (out_dir / "synthetic_talking_head.transcript.json").write_text(
        json.dumps(fixture, indent=2), encoding="utf-8")
    print(f"Wrote {video}")
    return video


if __name__ == "__main__":
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else None)
