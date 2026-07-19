"""Sound-design placement: mix a selected SFX into a draft with dialogue
protection (gain staging + sidechain ducking). The original SFX file and the
input draft are never modified — output is a new file, verified with ffprobe.
"""
from __future__ import annotations

import json
from pathlib import Path

from core.config import Settings
from core.exceptions import MediaError
from core.job_store import JobStore
from core.proc import expect_output_file, run_command, which

from . import media_probe_service


def place_sound(settings: Settings, *, draft: Path, sfx: Path, out_path: Path,
                at_seconds: float = 0.0, sfx_gain_db: float = -12.0,
                duck_dialogue: bool = True) -> dict:
    """Overlay one SFX onto a draft's audio track.

    - sfx_gain_db keeps effects under dialogue by default (-12 dB)
    - duck_dialogue sidechain-compresses the SFX against the dialogue bus so
      speech always wins when both are active
    """
    which("ffmpeg")
    if not draft.exists() or not sfx.exists():
        raise MediaError(f"Missing input: {draft if not draft.exists() else sfx}")

    delay_ms = max(0, int(at_seconds * 1000))
    fc = (f"[1:a]volume={sfx_gain_db}dB,"
          f"adelay={delay_ms}|{delay_ms}[sfx];")
    if duck_dialogue:
        # Dialogue [0:a] keys the compressor squeezing the SFX under speech.
        fc += ("[sfx][0:a]sidechaincompress=threshold=0.05:ratio=8:"
               "attack=5:release=250[ducked];"
               "[0:a][ducked]amix=inputs=2:duration=first:"
               "dropout_transition=0[aout]")
    else:
        fc += "[0:a][sfx]amix=inputs=2:duration=first[aout]"

    run_command([
        "ffmpeg", "-y", "-i", str(draft), "-i", str(sfx),
        "-filter_complex", fc,
        "-map", "0:v", "-map", "[aout]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        str(out_path),
    ], timeout=3600)
    expect_output_file(out_path, "sound-placed draft")

    meta = media_probe_service.probe_media(out_path)
    if not meta["has_audio"] or not meta["has_video"]:
        raise MediaError("Sound placement produced a broken file")
    src_meta = media_probe_service.probe_media(draft)
    drift = abs(meta["duration_seconds"] - src_meta["duration_seconds"])
    if drift > 0.5:
        raise MediaError(f"Sound placement changed duration by {drift:.2f}s")
    return {"output": str(out_path), "at_seconds": at_seconds,
            "sfx_gain_db": sfx_gain_db, "ducking": duck_dialogue,
            "duration": meta["duration_seconds"]}


def place_selected_asset(settings: Settings, store: JobStore, job_id: str, *,
                         asset_id: str, at_seconds: float = 0.0,
                         reason: str = "") -> dict:
    """Place a cataloged sound asset into the job's draft and record usage."""
    row = store.conn.execute("SELECT * FROM creative_assets WHERE id = ?",
                             (asset_id,)).fetchone()
    if row is None:
        raise MediaError(f"Unknown asset {asset_id}")
    if row["availability"] != "local":
        raise MediaError(f"Asset {row['filename']} is {row['availability']}, "
                         "not locally available")
    lib = store.conn.execute("SELECT root_path FROM asset_libraries WHERE id = ?",
                             (row["library_id"],)).fetchone()
    sfx = Path(lib["root_path"]) / row["relative_path"]
    artifacts = store.artifacts(job_id)
    draft_key = "draft_vertical" if artifacts.get("draft_vertical") else "draft_horizontal"
    if not artifacts.get(draft_key):
        raise MediaError(f"Job {job_id} has no rendered draft yet")
    draft = Path(artifacts[draft_key])
    out = settings.paths.output_drafts / f"{job_id}_{draft_key}_sfx.mp4"
    result = place_sound(settings, draft=draft, sfx=sfx, out_path=out,
                         at_seconds=at_seconds)
    store.set_artifact(job_id, f"{draft_key}_with_sfx", out)
    store.conn.execute(
        "INSERT INTO asset_usage(asset_id, job_id, context, reason, confidence)"
        " VALUES (?,?,?,?,?)",
        (asset_id, job_id, json.dumps({"at_seconds": at_seconds,
                                       "draft": draft_key}),
         reason or "operator-selected sound placement", 0.8))
    return result
