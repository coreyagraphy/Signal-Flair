"""FFprobe metadata capture, normalized to a stable JSON shape."""
from __future__ import annotations

import json
from fractions import Fraction
from pathlib import Path

from core.config import Settings
from core.exceptions import MediaError
from core.job_store import JobStore
from core.proc import run_command, which


def _parse_rate(rate: str | None) -> float | None:
    if not rate or rate in ("0/0", "N/A"):
        return None
    try:
        return float(Fraction(rate))
    except (ValueError, ZeroDivisionError):
        return None


def probe_media(path: Path) -> dict:
    which("ffprobe")
    result = run_command([
        "ffprobe", "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", str(path),
    ], timeout=120)
    try:
        raw = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise MediaError(f"ffprobe returned invalid JSON for {path.name}") from exc

    fmt = raw.get("format", {})
    video = next((s for s in raw.get("streams", []) if s.get("codec_type") == "video"), None)
    audio = next((s for s in raw.get("streams", []) if s.get("codec_type") == "audio"), None)

    rotation = 0
    if video:
        for sd in video.get("side_data_list", []) or []:
            if "rotation" in sd:
                rotation = int(sd["rotation"])
        rotation = int(video.get("tags", {}).get("rotate", rotation) or rotation)

    return {
        "container": (fmt.get("format_name") or "").split(",")[0] or None,
        "duration_seconds": float(fmt.get("duration", 0) or 0),
        "size_bytes": int(fmt.get("size", 0) or 0),
        "bit_rate": int(fmt.get("bit_rate", 0) or 0),
        "start_time": float(fmt.get("start_time", 0) or 0),
        "has_video": video is not None,
        "has_audio": audio is not None,
        "width": int(video["width"]) if video and video.get("width") else None,
        "height": int(video["height"]) if video and video.get("height") else None,
        "frame_rate": _parse_rate(video.get("avg_frame_rate")) if video else None,
        "pixel_format": video.get("pix_fmt") if video else None,
        "video_codec": video.get("codec_name") if video else None,
        "time_base": video.get("time_base") if video else None,
        "rotation": rotation,
        "color_space": video.get("color_space") if video else None,
        "audio_codec": audio.get("codec_name") if audio else None,
        "audio_sample_rate": int(audio["sample_rate"]) if audio and audio.get("sample_rate") else None,
        "audio_channels": int(audio["channels"]) if audio and audio.get("channels") else None,
        "raw": raw,
    }


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    """Stage runner for 'analyzed': write normalized metadata JSON."""
    artifacts = store.artifacts(job_id)
    source = Path(artifacts["managed_original"])
    meta = probe_media(source)
    job_dir = settings.paths.job_dir(job_id)
    out = job_dir / "metadata.json"
    out.write_text(json.dumps(meta, indent=2, default=str), encoding="utf-8")
    store.set_artifact(job_id, "metadata_json", out)
    job = store.get_job(job_id)
    store.update_asset(job["asset_id"], metadata_json=json.dumps(
        {k: v for k, v in meta.items() if k != "raw"}, default=str))
    return {"duration": meta["duration_seconds"], "resolution":
            f"{meta['width']}x{meta['height']}", "fps": meta["frame_rate"]}
