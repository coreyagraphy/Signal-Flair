"""Premiere preparation stage.

Always produces the editable fallback package under Output/premiere/<job_id>:
manifest, captions, source map, edit-decision report, and step-by-step manual
instructions. When the MCP server is enabled AND capable, it additionally
drives the verified vertical slice and logs every real call.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

from core.config import Settings
from core.exceptions import UnsupportedOperation
from core.job_store import JobStore
from core.logging import get_logger

from .capability_discovery import load_capabilities
from .manifest_builder import build_manifest, write_manifest
from .tool_mapper import ToolMapper
from .transport import client_from_settings

log = get_logger("contentos.premiere.sequence")


def _write_fallback_instructions(out_dir: Path, manifest: dict) -> Path:
    lines = [
        "# Manual Premiere build instructions", "",
        "The Premiere MCP integration was unavailable, so this package contains",
        "everything needed to build the sequence by hand:", "",
        "1. Create a new Premiere project named "
        f"`{manifest.get('project_name', 'ContentOS')}`.",
        "2. Import the source file(s) listed in `source_map.json`.",
    ]
    step = 3
    for seq in manifest["sequences"]:
        lines.append(f"{step}. Create sequence `{seq['name']}` at "
                     f"{seq['width']}x{seq['height']} @ {seq['frame_rate']}fps.")
        step += 1
        for clip in seq["clips"]:
            lines.append(
                f"{step}. Insert source {clip['source_in']:.2f}s–{clip['source_out']:.2f}s "
                f"at timeline {clip['timeline_in']:.2f}s (track {clip.get('track', 1)}).")
            step += 1
        if seq.get("captions", {}).get("srt"):
            lines.append(f"{step}. Import captions from `captions.srt` as sidecar.")
            step += 1
    lines += [f"{step}. Export H.264 using the settings in `export_settings.json`.", ""]
    path = out_dir / "FALLBACK_INSTRUCTIONS.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    artifacts = store.artifacts(job_id)
    edit_plan = json.loads(Path(artifacts["edit_plan"]).read_text(encoding="utf-8"))
    meta = json.loads(Path(artifacts["metadata_json"]).read_text(encoding="utf-8"))
    asset = store.get_asset(store.get_job(job_id)["asset_id"])

    manifest = build_manifest(
        settings, job_id=job_id, edit_plan=edit_plan,
        asset_sha256=asset["sha256"] if asset else None,
        frame_rate=meta.get("frame_rate") or 30.0,
        captions_srt="captions.srt" if artifacts.get("captions_srt") else None)
    manifest_path = write_manifest(settings, job_id, manifest)
    out_dir = manifest_path.parent

    if artifacts.get("captions_srt"):
        shutil.copy2(artifacts["captions_srt"], out_dir / "captions.srt")
    (out_dir / "source_map.json").write_text(json.dumps({
        "src0": {"path": artifacts["managed_original"],
                 "sha256": asset["sha256"] if asset else None}}, indent=2),
        encoding="utf-8")
    (out_dir / "export_settings.json").write_text(json.dumps({
        "format": "h264", "preset": "match_source_high",
        "audio": {"codec": "aac", "bitrate_kbps": 192}}, indent=2), encoding="utf-8")
    if artifacts.get("cut_report"):
        shutil.copy2(artifacts["cut_report"], out_dir / "edit_decision_report.md")

    store.set_artifact(job_id, "premiere_manifest", manifest_path)
    store.set_artifact(job_id, "premiere_package", out_dir)

    capabilities = load_capabilities(settings)
    mapper = ToolMapper(capabilities)
    execution_log: list[dict] = []
    mcp_status = "fallback_only"

    if settings.premiere_mcp_enabled and mapper.available:
        client = None
        try:
            client = client_from_settings(settings)
            client.start()
            for operation, arguments in _vertical_slice_calls(manifest, artifacts):
                tool = mapper.resolve(operation)  # raises UnsupportedOperation
                result = client.call_tool(tool, arguments)
                execution_log.append({"operation": operation, "tool": tool,
                                      "arguments": arguments, "result": result})
            mcp_status = "executed"
        except UnsupportedOperation as exc:
            execution_log.append({"unsupported": str(exc)})
            mcp_status = "partial_unsupported"
        except Exception as exc:
            execution_log.append({"error": str(exc)})
            mcp_status = "failed"
        finally:
            if client is not None:
                client.close()
    else:
        execution_log.append({
            "skipped": capabilities.get("reason", "Premiere MCP disabled")})

    (out_dir / "mcp_execution_log.json").write_text(
        json.dumps({"status": mcp_status, "log": execution_log}, indent=2),
        encoding="utf-8")
    _write_fallback_instructions(out_dir, manifest)
    return {"manifest": manifest_path.name, "mcp_status": mcp_status,
            "sequences": len(manifest["sequences"])}


def _vertical_slice_calls(manifest: dict, artifacts: dict):
    """The minimum proven vertical slice (mandate 26), as internal operations."""
    yield "health_check", {}
    yield "create_project", {"name": manifest["project_name"]}
    yield "create_bin", {"name": "ContentOS"}
    for asset in manifest["source_assets"]:
        yield "import_media", {"path": asset["path"]}
    seq = manifest["sequences"][0]
    yield "create_sequence", {"name": seq["name"], "width": seq["width"],
                              "height": seq["height"],
                              "frame_rate": seq["frame_rate"]}
    for clip in seq["clips"]:
        yield "insert_source_range", {"asset": clip["asset_id"],
                                      "source_in": clip["source_in"],
                                      "source_out": clip["source_out"],
                                      "timeline_in": clip["timeline_in"]}
    if seq.get("captions", {}).get("srt"):
        yield "import_captions", {"srt": seq["captions"]["srt"]}
    yield "save_project", {}
    yield "export_sequence", {"sequence": seq["name"],
                              "settings": seq.get("export", {})}
