"""Audio analysis for sound-design assets (Ocular addendum, section 12).

Measures loudness (EBU R128 integrated), true peak, leading/trailing silence,
and classifies loop vs one-shot — all with the installed ffmpeg, no paid
services. Analysis never modifies the source file.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from core.proc import run_command

_LOUDNORM_JSON = re.compile(r"\{[^{}]*\"input_i\"[^{}]*\}", re.DOTALL)
_SILENCE_START = re.compile(r"silence_start:\s*([0-9.]+)")
_SILENCE_END = re.compile(r"silence_end:\s*([0-9.]+)")


def analyze_audio(path: Path, *, duration_hint: float | None = None) -> dict:
    """Return loudness/peak/silence/loop metrics for an audio file."""
    out: dict = {"analyzed": False}

    # Integrated loudness + true peak via loudnorm's measurement pass.
    result = run_command([
        "ffmpeg", "-hide_banner", "-i", str(path),
        "-af", "loudnorm=print_format=json", "-f", "null", "-",
    ], timeout=600, check=False)
    m = _LOUDNORM_JSON.search(result.stderr)
    if m:
        try:
            stats = json.loads(m.group(0))
            out["integrated_lufs"] = float(stats.get("input_i", "nan"))
            out["true_peak_db"] = float(stats.get("input_tp", "nan"))
            out["loudness_range"] = float(stats.get("input_lra", "nan"))
            out["analyzed"] = True
        except (ValueError, json.JSONDecodeError):
            pass

    # Leading / trailing silence.
    result = run_command([
        "ffmpeg", "-hide_banner", "-i", str(path),
        "-af", "silencedetect=noise=-45dB:d=0.05", "-f", "null", "-",
    ], timeout=600, check=False)
    starts = [float(x) for x in _SILENCE_START.findall(result.stderr)]
    ends = [float(x) for x in _SILENCE_END.findall(result.stderr)]
    duration = duration_hint or 0.0
    if not duration:
        # Progress lines repeat; the largest time= value is the duration.
        times = [int(h) * 3600 + int(m2) * 60 + float(s)
                 for h, m2, s in re.findall(r"time=(\d+):(\d+):(\d+\.?\d*)",
                                            result.stderr)]
        duration = max(times, default=0.0)
    leading = 0.0
    if starts and starts[0] <= 0.05:
        leading = (ends[0] if ends else duration)
    trailing = 0.0
    if starts and duration and starts[-1] > 0:
        last_end = ends[-1] if len(ends) >= len(starts) else duration
        if abs(last_end - duration) < 0.1:
            trailing = duration - starts[-1]
    out["leading_silence_seconds"] = round(leading, 3)
    out["trailing_silence_seconds"] = round(max(0.0, trailing), 3)
    out["duration_seconds"] = round(duration, 3)

    # Loop vs one-shot heuristic: loops have negligible edge silence and
    # moderate length; one-shots decay into trailing silence.
    if duration:
        out["loop_or_oneshot"] = (
            "loop" if leading < 0.05 and trailing < 0.05 and duration >= 2.0
            else "one_shot")
    return out
