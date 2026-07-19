"""Remotion integration: render programmatic graphics as standard media.

Renders happen through the local Node project in ``remotion/`` — never a paid
service. Availability is reported honestly: no Node or no installed
dependencies means "unavailable", not a fake render. Outputs are verified
with ffprobe before being cataloged as artifacts.
"""
from __future__ import annotations

import json
import os
import shutil as _shutil
from pathlib import Path

from core.config import Settings
from core.exceptions import MediaError, ProviderUnavailable
from core.job_store import JobStore
from core.proc import run_command

from . import media_probe_service


def remotion_dir(settings: Settings) -> Path:
    return settings.paths.root / "remotion"


def available(settings: Settings) -> tuple[bool, str]:
    node = _shutil.which("node")
    if not node:
        return False, "Node.js is not installed"
    rd = remotion_dir(settings)
    if not (rd / "render.mjs").exists():
        return False, f"remotion project missing at {rd}"
    if not (rd / "node_modules" / "remotion").exists():
        return False, ("remotion dependencies not installed — run "
                       f"`npm install` in {rd}")
    return True, "node + remotion project ready"


def render_title_reveal(settings: Settings, *, title: str, subtitle: str = "",
                        accent_color: str = "#ff5a1f",
                        text_color: str = "#ffffff",
                        vertical: bool = False,
                        codec: str = "prores",
                        out_path: Path | None = None,
                        timeout: int = 900) -> dict:
    ok, reason = available(settings)
    if not ok:
        raise ProviderUnavailable(f"Remotion unavailable: {reason}")
    composition = "TitleRevealVertical" if vertical else "TitleReveal"
    ext = ".mov" if codec == "prores" else ".mp4"
    out = out_path or (settings.paths.output / "graphics" /
                       f"title_reveal_{'v' if vertical else 'h'}{ext}")
    out.parent.mkdir(parents=True, exist_ok=True)
    props = {"title": title, "subtitle": subtitle,
             "accentColor": accent_color, "textColor": text_color}
    result = run_command([
        "node", str(remotion_dir(settings) / "render.mjs"),
        "--composition", composition,
        "--out", str(out),
        "--codec", codec,
        "--props", json.dumps(props),
    ], timeout=timeout, cwd=remotion_dir(settings))
    try:
        payload = json.loads(result.stdout.strip().splitlines()[-1])
    except (json.JSONDecodeError, IndexError):
        payload = {}
    if not out.exists() or out.stat().st_size == 0:
        raise MediaError(f"Remotion render produced no output at {out}")

    meta = media_probe_service.probe_media(out)
    if not meta["has_video"]:
        raise MediaError("Remotion output has no video stream")
    has_alpha = "yuva" in (meta.get("pixel_format") or "") or \
        (meta.get("pixel_format") or "").endswith("a")
    return {"output": str(out), "composition": composition, "codec": codec,
            "duration": meta["duration_seconds"],
            "resolution": f"{meta['width']}x{meta['height']}",
            "pixel_format": meta.get("pixel_format"),
            "alpha": has_alpha, "props": props,
            "render_info": payload}


def add_to_manifest(settings: Settings, store: JobStore, job_id: str,
                    render_result: dict) -> None:
    """Record a rendered graphic against the job for Premiere packaging."""
    store.set_artifact(job_id, "remotion_title_reveal", render_result["output"])
    store.add_event(job_id, "remotion_graphic_rendered", {
        "composition": render_result["composition"],
        "output": render_result["output"],
        "alpha": render_result["alpha"]})
