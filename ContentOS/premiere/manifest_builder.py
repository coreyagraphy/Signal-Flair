"""Build a server-neutral Premiere manifest from an edit plan."""
from __future__ import annotations

import json
from pathlib import Path

from core.config import Settings
from core.validation import validate_against

MANIFEST_VERSION = "1.0"


def build_manifest(settings: Settings, *, job_id: str, edit_plan: dict,
                   asset_sha256: str | None = None,
                   frame_rate: float = 30.0,
                   captions_srt: str | None = None) -> dict:
    asset_id = "src0"
    sequences = []
    for variant in edit_plan.get("variants", []):
        clips = [{
            "asset_id": asset_id,
            "source_in": seg["source_in"],
            "source_out": seg["source_out"],
            "timeline_in": seg["timeline_in"],
            "track": 1,
        } for seg in edit_plan["segments"]]
        if variant.get("reframe") == "center_crop":
            for clip in clips:
                clip["transform"] = {
                    "reframe": "center_crop",
                    "manual_reframe_required": bool(
                        variant.get("manual_reframe_required")),
                    "note": variant.get("reframe_note",
                                        "replace with tracked keyframes when "
                                        "auto-reframe adapter has run")}
        sequences.append({
            "name": f"{job_id}_{variant['name']}",
            "width": variant["width"], "height": variant["height"],
            "frame_rate": frame_rate,
            "clips": clips,
            "captions": {"srt": captions_srt, "mode": "sidecar"},
            "markers": edit_plan.get("markers", []),
            "export": {"format": "h264", "preset": "match_source_high"},
        })
    manifest = {
        "manifest_version": MANIFEST_VERSION,
        "job_id": job_id,
        "project_name": f"ContentOS_{job_id}",
        "source_assets": [{"asset_id": asset_id,
                           "path": edit_plan["source_asset"],
                           **({"sha256": asset_sha256} if asset_sha256 else {})}],
        "sequences": sequences,
        "notes": edit_plan.get("notes", []),
    }
    schema_path = Path(__file__).parent / "premiere_manifest.schema.json"
    validate_against(manifest, schema_path)
    return manifest


def write_manifest(settings: Settings, job_id: str, manifest: dict) -> Path:
    out_dir = settings.paths.output_premiere / job_id
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / "premiere_manifest.json"
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False),
                    encoding="utf-8")
    return path
