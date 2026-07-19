"""Local FFmpeg draft renderer.

Executes the edit plan for real: trims each planned segment from the source,
concatenates them, normalizes loudness, optionally burns captions, and
produces horizontal + vertical variants plus a thumbnail contact sheet.
Every render is verified with ffprobe before the stage completes.
"""
from __future__ import annotations

import json
from pathlib import Path

from core.config import Settings
from core.exceptions import MediaError
from core.job_store import JobStore, new_id
from core.proc import expect_output_file, run_command, which

from . import caption_service, media_probe_service


def _escape_filter_path(path: Path) -> str:
    """Escape a path for use inside an ffmpeg filter argument (subtitles=...)."""
    text = str(path).replace("\\", "/")
    return text.replace(":", "\\:").replace("'", "\\'")


def _segment_filters(segments: list[dict], *, vertical: bool,
                     src_w: int, src_h: int) -> tuple[str, int]:
    """filter_complex trimming/concatenating planned segments."""
    parts = []
    n = len(segments)
    crop = ""
    if vertical:
        # Center crop to 9:16 then scale. Subject-tracked reframing exports
        # keyframes to the manifest; the local draft uses center crop fallback.
        # Every expression containing commas must be quoted for the
        # filtergraph parser (commas otherwise split filter arguments).
        crop = ("crop=w='min(iw\\,ih*9/16)':h=ih:x='(iw-min(iw\\,ih*9/16))/2':y=0,"
                "scale=1080:1920,")
    else:
        crop = "scale=1920:1080:force_original_aspect_ratio=decrease," \
               "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,"
    for i, seg in enumerate(segments):
        parts.append(
            f"[0:v]trim=start={seg['source_in']}:end={seg['source_out']},"
            f"setpts=PTS-STARTPTS,{crop}format=yuv420p[v{i}];"
            f"[0:a]atrim=start={seg['source_in']}:end={seg['source_out']},"
            f"asetpts=PTS-STARTPTS[a{i}];")
    concat_inputs = "".join(f"[v{i}][a{i}]" for i in range(n))
    parts.append(f"{concat_inputs}concat=n={n}:v=1:a=1[vc][ac];")
    return "".join(parts), n


def render_variant(settings: Settings, *, source: Path, plan: dict, out_path: Path,
                   vertical: bool, burn_captions: bool, srt_path: Path | None,
                   src_w: int, src_h: int) -> Path:
    which("ffmpeg")
    segments = plan["segments"]
    if not segments:
        raise MediaError("Edit plan has no segments to render")
    fc, _n = _segment_filters(segments, vertical=vertical, src_w=src_w, src_h=src_h)

    audio_chain = "[ac]"
    if plan.get("audio", {}).get("normalize", True):
        target = plan.get("audio", {}).get("target_lufs", -16.0)
        peak = plan.get("audio", {}).get("true_peak_db", -1.5)
        fc += f"[ac]loudnorm=I={target}:TP={peak}:LRA=11[an];"
        audio_chain = "[an]"

    video_chain = "[vc]"
    if burn_captions and srt_path and srt_path.exists():
        style = caption_service.load_style(settings)
        force = caption_service.ass_style_args(style, vertical=vertical)
        fc += (f"[vc]subtitles='{_escape_filter_path(srt_path)}'"
               f":force_style='{force}'[vs];")
        video_chain = "[vs]"

    fc = fc.rstrip(";")
    run_command([
        "ffmpeg", "-y", "-i", str(source),
        "-filter_complex", fc,
        "-map", video_chain, "-map", audio_chain,
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        "-movflags", "+faststart",
        str(out_path),
    ], timeout=7200)
    return expect_output_file(out_path, "rendered variant")


def make_contact_sheet(source: Path, out_path: Path, duration: float) -> Path | None:
    interval = max(1.0, duration / 12)
    result = run_command([
        "ffmpeg", "-y", "-i", str(source),
        "-vf", f"fps=1/{interval:.3f},scale=320:-2,tile=4x3",
        "-frames:v", "1", str(out_path),
    ], timeout=600, check=False)
    return out_path if out_path.exists() and out_path.stat().st_size > 0 else None


def _verify_render(path: Path, expected_duration: float) -> dict:
    meta = media_probe_service.probe_media(path)
    if not meta["has_video"]:
        raise MediaError(f"Render has no video stream: {path.name}")
    if not meta["has_audio"]:
        raise MediaError(f"Render has no audio stream: {path.name}")
    drift = abs(meta["duration_seconds"] - expected_duration)
    if expected_duration > 0 and drift > max(2.0, expected_duration * 0.15):
        raise MediaError(
            f"Render duration {meta['duration_seconds']:.2f}s deviates from "
            f"planned {expected_duration:.2f}s: {path.name}")
    return meta


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    artifacts = store.artifacts(job_id)
    plan = json.loads(Path(artifacts["edit_plan"]).read_text(encoding="utf-8"))
    source = Path(artifacts["managed_original"])
    meta = json.loads(Path(artifacts["metadata_json"]).read_text(encoding="utf-8"))
    srt = Path(artifacts["captions_srt"]) if artifacts.get("captions_srt") else None
    planned_duration = plan["segments"][-1]["timeline_out"] if plan["segments"] else 0.0

    results = {}
    for variant in plan.get("variants", []):
        vertical = variant["name"] == "vertical"
        out = settings.paths.output_drafts / f"{job_id}_draft_{variant['name']}.mp4"
        render_variant(settings, source=source, plan=plan, out_path=out,
                       vertical=vertical,
                       burn_captions=plan.get("captions", {}).get("burn_in", True),
                       srt_path=srt, src_w=meta.get("width") or 1920,
                       src_h=meta.get("height") or 1080)
        rmeta = _verify_render(out, planned_duration)
        store.set_artifact(job_id, f"draft_{variant['name']}", out)
        store.conn.execute(
            "INSERT INTO renders(id, job_id, kind, variant, path, duration_seconds,"
            " verified) VALUES (?,?,?,?,?,?,1)",
            (new_id("render"), job_id, "draft", variant["name"], str(out),
             rmeta["duration_seconds"]))
        results[variant["name"]] = {"path": out.name,
                                    "duration": round(rmeta["duration_seconds"], 2)}

    sheet = settings.paths.output_thumbnails / f"{job_id}_contact_sheet.png"
    fresh = store.artifacts(job_id)
    any_draft = fresh.get("draft_horizontal") or fresh.get("draft_vertical")
    if any_draft and make_contact_sheet(Path(any_draft), sheet, planned_duration):
        store.set_artifact(job_id, "contact_sheet", sheet)
    return {"variants": results, "planned_duration": round(planned_duration, 2)}


def render_final(settings: Settings, store: JobStore, job_id: str) -> dict:
    """Final render after approval: re-render at final quality into Output/finals."""
    artifacts = store.artifacts(job_id)
    plan = json.loads(Path(artifacts["edit_plan"]).read_text(encoding="utf-8"))
    source = Path(artifacts["managed_original"])
    meta = json.loads(Path(artifacts["metadata_json"]).read_text(encoding="utf-8"))
    srt = Path(artifacts["captions_srt"]) if artifacts.get("captions_srt") else None
    planned_duration = plan["segments"][-1]["timeline_out"] if plan["segments"] else 0.0

    results = {}
    for variant in plan.get("variants", []):
        vertical = variant["name"] == "vertical"
        out = settings.paths.output_finals / f"{job_id}_final_{variant['name']}.mp4"
        render_variant(settings, source=source, plan=plan, out_path=out,
                       vertical=vertical,
                       burn_captions=plan.get("captions", {}).get("burn_in", True),
                       srt_path=srt, src_w=meta.get("width") or 1920,
                       src_h=meta.get("height") or 1080)
        rmeta = _verify_render(out, planned_duration)
        store.conn.execute(
            "INSERT INTO renders(id, job_id, kind, variant, path, duration_seconds,"
            " verified) VALUES (?,?,?,?,?,?,1)",
            (new_id("render"), job_id, "final", variant["name"], str(out),
             rmeta["duration_seconds"]))
        results[variant["name"]] = out.name
    # Point final_render at the vertical variant when present, else the first
    # rendered variant — never a hardcoded path that may not exist.
    preferred = settings.paths.output_finals / f"{job_id}_final_vertical.mp4"
    if not preferred.exists():
        first = next(iter(results.values()), None)
        if first is None:
            raise MediaError("render_final produced no variants")
        preferred = settings.paths.output_finals / first
    store.set_artifact(job_id, "final_render", preferred)
    return {"variants": results}
