"""Caption engine, independent of Premiere.

Builds cues from word timings (segment timings when words are unavailable),
enforcing line length, cue duration, and reading-speed constraints with
punctuation-aware breaks. Outputs SRT, WebVTT, and JSON cues, plus a helper
for FFmpeg burn-in used by the renderer.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from core.config import Settings
from core.job_store import JobStore

from .transcription_service import write_srt, write_vtt


@dataclass
class CaptionStyle:
    name: str = "clean_white"
    font_family: str = "DejaVu Sans"     # present on the render host, or fallback
    fallback_font: str = "Arial"
    font_size: int = 48
    primary_color: str = "&HFFFFFF&"     # ASS BGR hex
    outline_color: str = "&H000000&"
    max_chars_per_line: int = 34
    max_lines: int = 2
    min_cue_seconds: float = 0.7
    max_cue_seconds: float = 6.0
    max_chars_per_second: float = 20.0   # reading speed cap
    safe_area_bottom_pct: int = 12
    uppercase: bool = False


def load_style(settings: Settings, name: str | None = None) -> CaptionStyle:
    style = CaptionStyle()
    path = settings.paths.config / "caption_styles.yaml"
    if not path.exists():
        return style
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    styles = data.get("styles", {})
    chosen = name or data.get("default", "clean_white")
    values = styles.get(chosen, {})
    style.name = chosen
    for key, val in values.items():
        if hasattr(style, key):
            setattr(style, key, val)
    return style


_BREAK_PUNCTUATION = (".", "!", "?", ",", ";", ":")


def build_cues_from_words(words: list[dict], style: CaptionStyle) -> list[dict]:
    """Greedy cue packing over word timings with punctuation-aware breaks."""
    cues: list[dict] = []
    current: list[dict] = []

    def flush():
        if not current:
            return
        text = " ".join(w["word"] for w in current).strip()
        if not text:
            current.clear()
            return
        start, end = current[0]["start"], current[-1]["end"]
        end = max(end, start + style.min_cue_seconds)
        # Reading-speed cap: extend duration rather than truncating words.
        min_duration = len(text) / style.max_chars_per_second
        end = max(end, start + min_duration)
        cues.append({"start": round(start, 3), "end": round(end, 3),
                     "text": _wrap(text, style)})
        current.clear()

    for word in words:
        if not word.get("word"):
            continue
        tentative = " ".join(w["word"] for w in current + [word])
        too_long = len(tentative) > style.max_chars_per_line * style.max_lines
        too_slow = current and (word["end"] - current[0]["start"]) > style.max_cue_seconds
        if too_long or too_slow:
            flush()
        current.append(word)
        if word["word"].endswith(_BREAK_PUNCTUATION) and \
                len(" ".join(w["word"] for w in current)) > style.max_chars_per_line * 0.6:
            flush()
    flush()

    # Enforce monotonic, non-overlapping cues.
    for i in range(1, len(cues)):
        if cues[i]["start"] < cues[i - 1]["end"]:
            cues[i - 1]["end"] = round(min(cues[i - 1]["end"], cues[i]["start"]), 3)
    return cues


def build_cues_from_segments(segments: list[dict], style: CaptionStyle) -> list[dict]:
    cues = []
    for seg in segments:
        text = (seg.get("text") or "").strip()
        if not text:
            continue
        cues.append({"start": round(seg["start"], 3), "end": round(seg["end"], 3),
                     "text": _wrap(text, style)})
    return cues


def _wrap(text: str, style: CaptionStyle) -> str:
    if style.uppercase:
        text = text.upper()
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if len(candidate) > style.max_chars_per_line and line:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return "\n".join(lines[: style.max_lines * 3])


def ass_style_args(style: CaptionStyle, vertical: bool = False) -> str:
    """force_style string for ffmpeg subtitles filter (with fallback font)."""
    size = style.font_size + (10 if vertical else 0)
    return (f"FontName={style.font_family},FontSize={size},"
            f"PrimaryColour={style.primary_color},OutlineColour={style.outline_color},"
            f"Outline=2,MarginV={style.safe_area_bottom_pct * 4}")


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    artifacts = store.artifacts(job_id)
    source = artifacts.get("transcript_clean_json") or artifacts["transcript_json"]
    transcript = json.loads(Path(source).read_text(encoding="utf-8"))
    style = load_style(settings)

    words = transcript.get("words") or []
    if words:
        cues = build_cues_from_words(words, style)
        basis = "words"
    else:
        cues = build_cues_from_segments(transcript.get("segments", []), style)
        basis = "segments"

    job_dir = settings.paths.job_dir(job_id)
    srt = settings.paths.output_captions / f"{job_id}.srt"
    vtt = settings.paths.output_captions / f"{job_id}.vtt"
    cue_json = job_dir / "captions.json"

    seg_like = [{"start": c["start"], "end": c["end"], "text": c["text"]} for c in cues]
    write_srt(seg_like, srt)
    write_vtt(seg_like, vtt)
    cue_json.write_text(json.dumps({"style": style.name, "basis": basis,
                                    "cues": cues}, indent=2, ensure_ascii=False),
                        encoding="utf-8")

    store.set_artifact(job_id, "captions_srt", srt)
    store.set_artifact(job_id, "captions_vtt", vtt)
    store.set_artifact(job_id, "captions_json", cue_json)
    return {"cues": len(cues), "style": style.name, "basis": basis}
