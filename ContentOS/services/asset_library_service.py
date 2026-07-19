"""AssetLibraryService: register, scan, classify, preview and route external
creative asset folders (e.g. the Four Editors pack) without ever moving,
renaming, or committing the originals.

OneDrive online-only placeholders are detected via Windows file attributes
(FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS / OFFLINE) and are cataloged, not
treated as corrupt. Hydration is never triggered implicitly — content
hashing and probing are skipped for online-only files.
"""
from __future__ import annotations

import json
import os
import stat as stat_module
from datetime import datetime, timezone
from pathlib import Path

from core.config import Settings
from core.hashing import sha256_file
from core.job_store import JobStore, new_id
from core.logging import get_logger
from core.paths import safe_name

log = get_logger("contentos.assets")

# Windows attribute flags marking cloud placeholders.
_FILE_ATTRIBUTE_OFFLINE = 0x1000
_FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS = 0x400000
_FILE_ATTRIBUTE_RECALL_ON_OPEN = 0x40000

EXTENSION_TYPES: dict[str, str] = {
    ".wav": "audio", ".mp3": "audio", ".aiff": "audio", ".aif": "audio",
    ".flac": "audio", ".m4a": "audio",
    ".cube": "lut", ".look": "lut",
    ".mogrt": "mogrt", ".prfpset": "premiere_preset",
    ".aep": "after_effects", ".aet": "after_effects",
    ".mov": "video", ".mp4": "video", ".mxf": "video", ".webm": "video",
    ".avi": "video",
    ".png": "image", ".jpg": "image", ".jpeg": "image", ".webp": "image",
    ".svg": "image", ".psd": "design", ".ai": "design",
    ".otf": "font", ".ttf": "font",
    ".json": "data", ".xml": "data", ".csv": "data",
}

ROUTING = {
    "audio": "direct", "lut": "direct", "image": "direct", "video": "direct",
    "mogrt": "premiere", "premiere_preset": "premiere",
    "after_effects": "after_effects", "design": "after_effects",
    "font": "direct", "data": "direct", "unknown": "unknown",
}

APP_DEPENDENCY = {
    "mogrt": "Adobe Premiere Pro (Essential Graphics)",
    "premiere_preset": "Adobe Premiere Pro",
    "after_effects": "Adobe After Effects",
    "design": "Adobe Photoshop/Illustrator",
}

# Filename keywords → refined asset subtype.
_KEYWORD_SUBTYPES = [
    (("sfx", "sound effect", "whoosh", "swoosh", "impact", "riser", "boom"),
     "sound_effect"),
    (("music", "track", "song", "loop", "bpm"), "music"),
    (("transition",), "transition"),
    (("overlay", "leak", "light leak"), "overlay"),
    (("grain", "film grain", "dust"), "film_grain"),
    (("logo",), "logo"),
    (("broll", "b-roll"), "broll"),
]


def detect_availability(path: Path) -> str:
    try:
        st = path.stat()
    except PermissionError:
        return "permission_denied"
    except OSError:
        return "missing"
    attrs = getattr(st, "st_file_attributes", 0)
    if attrs & (_FILE_ATTRIBUTE_OFFLINE | _FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS |
                _FILE_ATTRIBUTE_RECALL_ON_OPEN):
        return "online_only"
    if not os.access(path, os.R_OK):
        return "permission_denied"
    return "local"


def classify(path: Path) -> str:
    base_type = EXTENSION_TYPES.get(path.suffix.lower(), "unknown")
    name = path.name.lower() + " " + "/".join(p.lower() for p in path.parts[-3:-1])
    if base_type in ("audio", "video", "image"):
        for keywords, subtype in _KEYWORD_SUBTYPES:
            if any(k in name for k in keywords):
                return subtype
    if base_type == "audio":
        return "sound_effect" if path.stat().st_size < 3_000_000 else "music"
    if base_type == "video":
        return "overlay" if "overlay" in name else "broll"
    return base_type


def _probe_media(path: Path) -> dict:
    """Light probe for media assets; empty dict on failure (asset stays
    cataloged as unreadable rather than crashing the scan)."""
    from services.codec_service import full_probe
    try:
        probe = full_probe(path)
    except Exception:
        return {}
    v = probe["video_streams"][0] if probe["video_streams"] else {}
    a = probe["audio_streams"][0] if probe["audio_streams"] else {}
    return {
        "duration_seconds": probe["duration_seconds"] or None,
        "width": v.get("width"), "height": v.get("height"),
        "frame_rate": v.get("avg_frame_rate"),
        "sample_rate": a.get("sample_rate"), "channels": a.get("channels"),
        "codec": v.get("codec") or a.get("codec"),
        "has_alpha": 1 if (v.get("pixel_format") or "").endswith("a") else 0,
    }


def _lut_size(path: Path) -> int | None:
    try:
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines()[:50]:
            if line.strip().upper().startswith("LUT_3D_SIZE"):
                return int(line.split()[-1])
    except (OSError, ValueError):
        pass
    return None


def register_library(settings: Settings, store: JobStore, root: Path) -> str:
    root = root.expanduser()
    existing = store.conn.execute(
        "SELECT id FROM asset_libraries WHERE root_path = ?",
        (str(root),)).fetchone()
    if existing:
        return existing["id"]
    lib_id = new_id("lib")
    store.conn.execute(
        "INSERT INTO asset_libraries(id, root_path, name) VALUES (?,?,?)",
        (lib_id, str(root), root.name))
    return lib_id


MAX_HASH_BYTES = 2 * 1024**3  # skip full-hash of enormous files


def scan(settings: Settings, store: JobStore, library_id: str | None = None,
         *, max_files: int | None = None, generate_previews: bool = True) -> dict:
    libs = store.conn.execute(
        "SELECT * FROM asset_libraries" +
        (" WHERE id = ?" if library_id else ""),
        (library_id,) if library_id else ()).fetchall()
    if not libs:
        return {"error": "no registered libraries; use: assets register <folder>"}
    totals = {"scanned": 0, "new": 0, "online_only": 0, "unreadable": 0,
              "by_type": {}}
    for lib in libs:
        root = Path(lib["root_path"])
        store.conn.execute(
            "UPDATE asset_libraries SET scan_status = 'scanning' WHERE id = ?",
            (lib["id"],))
        if not root.exists():
            store.conn.execute(
                "UPDATE asset_libraries SET scan_status = 'root_missing'"
                " WHERE id = ?", (lib["id"],))
            totals[lib["id"]] = "root_missing"
            continue
        count = 0
        for path in sorted(root.rglob("*")):
            if not path.is_file() or path.name.startswith("."):
                continue
            count += 1
            if max_files and count > max_files:
                break
            totals["scanned"] += 1
            rel = str(path.relative_to(root))
            availability = detect_availability(path)
            asset_type = classify(path) if availability == "local" else \
                EXTENSION_TYPES.get(path.suffix.lower(), "unknown")
            size = path.stat().st_size if availability != "missing" else None

            digest = None
            media = {}
            lut = None
            if availability == "local":
                if size and size <= MAX_HASH_BYTES:
                    try:
                        digest = sha256_file(path)
                    except OSError:
                        availability = "unreadable"
                if asset_type in ("sound_effect", "music", "broll", "overlay",
                                  "film_grain", "transition", "video", "audio"):
                    media = _probe_media(path)
                    if not media and path.suffix.lower() in (
                            ".mp4", ".mov", ".mxf", ".webm", ".avi", ".wav",
                            ".mp3", ".flac", ".m4a", ".aiff", ".aif"):
                        availability = "unreadable"
                        totals["unreadable"] += 1
                if asset_type == "lut" and path.suffix.lower() == ".cube":
                    lut = _lut_size(path)
            else:
                totals["online_only"] += availability == "online_only"

            routing = ROUTING.get(asset_type,
                                  ROUTING.get(EXTENSION_TYPES.get(
                                      path.suffix.lower(), "unknown"), "unknown"))
            if asset_type in ("sound_effect", "music", "overlay", "film_grain",
                              "broll", "lut", "image", "logo", "transition"):
                routing = "direct"

            preview = None
            if generate_previews and availability == "local":
                preview = _make_preview(settings, path, asset_type)

            asset_id = new_id("cas")
            store.conn.execute(
                "INSERT INTO creative_assets(id, library_id, relative_path,"
                " filename, extension, asset_type, size_bytes, sha256,"
                " duration_seconds, width, height, frame_rate, sample_rate,"
                " channels, has_alpha, codec, lut_size, routing,"
                " app_dependency, availability, preview_path, last_verified_at)"
                " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                " ON CONFLICT(library_id, relative_path) DO UPDATE SET"
                "  asset_type = excluded.asset_type,"
                "  size_bytes = excluded.size_bytes,"
                "  sha256 = COALESCE(excluded.sha256, creative_assets.sha256),"
                "  availability = excluded.availability,"
                "  preview_path = COALESCE(excluded.preview_path,"
                "                          creative_assets.preview_path),"
                "  last_verified_at = excluded.last_verified_at",
                (asset_id, lib["id"], rel, path.name, path.suffix.lower(),
                 asset_type, size, digest, media.get("duration_seconds"),
                 media.get("width"), media.get("height"),
                 media.get("frame_rate"), media.get("sample_rate"),
                 media.get("channels"), media.get("has_alpha"),
                 media.get("codec"), lut, routing,
                 APP_DEPENDENCY.get(asset_type),
                 availability, str(preview) if preview else None,
                 datetime.now(timezone.utc).isoformat()))
            totals["by_type"][asset_type] = totals["by_type"].get(asset_type, 0) + 1
        store.conn.execute(
            "UPDATE asset_libraries SET scan_status = 'scanned',"
            " last_scanned_at = datetime('now') WHERE id = ?", (lib["id"],))
    return totals


def _make_preview(settings: Settings, path: Path, asset_type: str) -> Path | None:
    """Waveforms for audio, thumbnails for images/video. Never executes
    project files (.aep/.mogrt/...) to preview them."""
    from core.proc import run_command
    preview_dir = settings.paths.data_cache / "asset_previews"
    preview_dir.mkdir(parents=True, exist_ok=True)
    out = preview_dir / f"{safe_name(path.stem)}_{path.stat().st_size}.png"
    if out.exists():
        return out
    try:
        if asset_type in ("sound_effect", "music", "audio"):
            run_command(["ffmpeg", "-y", "-i", str(path),
                         "-filter_complex", "showwavespic=s=480x120",
                         "-frames:v", "1", str(out)], timeout=120, check=False)
        elif asset_type in ("broll", "overlay", "film_grain", "transition",
                            "video", "image", "logo"):
            run_command(["ffmpeg", "-y", "-i", str(path), "-vf", "scale=320:-2",
                         "-frames:v", "1", str(out)], timeout=120, check=False)
        else:
            return None
    except Exception:
        return None
    return out if out.exists() and out.stat().st_size > 0 else None


def list_assets(store: JobStore, asset_type: str | None = None) -> list[dict]:
    sql = "SELECT * FROM creative_assets WHERE disabled = 0"
    params: tuple = ()
    if asset_type:
        sql += " AND asset_type = ?"
        params = (asset_type,)
    return [dict(r) for r in store.conn.execute(sql + " ORDER BY relative_path",
                                                params)]


def write_report(settings: Settings, store: JobStore,
                 library_id: str | None = None) -> Path:
    libs = store.conn.execute("SELECT * FROM asset_libraries").fetchall()
    lib = next((l for l in libs if not library_id or l["id"] == library_id), None)
    rows = store.conn.execute(
        "SELECT * FROM creative_assets" +
        (" WHERE library_id = ?" if lib else ""),
        (lib["id"],) if lib else ()).fetchall()
    by_type: dict[str, int] = {}
    dupes: dict[str, list[str]] = {}
    total_size = 0
    for r in rows:
        by_type[r["asset_type"]] = by_type.get(r["asset_type"], 0) + 1
        total_size += r["size_bytes"] or 0
        if r["sha256"]:
            dupes.setdefault(r["sha256"], []).append(r["relative_path"])
    duplicates = {k: v for k, v in dupes.items() if len(v) > 1}

    name = safe_name(lib["name"] if lib else "all_libraries").upper()
    report = settings.paths.root / "docs" / "audit" / f"{name}_ASSET_LIBRARY_REPORT.md"
    report.parent.mkdir(parents=True, exist_ok=True)
    counts = {
        "online_only": sum(1 for r in rows if r["availability"] == "online_only"),
        "unreadable": sum(1 for r in rows if r["availability"] == "unreadable"),
        "premiere": sum(1 for r in rows if r["routing"] == "premiere"),
        "after_effects": sum(1 for r in rows if r["routing"] == "after_effects"),
        "direct": sum(1 for r in rows if r["routing"] == "direct"),
        "unknown": sum(1 for r in rows if r["asset_type"] == "unknown"),
    }
    lines = [
        f"# Asset library report — {lib['name'] if lib else 'all libraries'}", "",
        f"- Root: `{lib['root_path'] if lib else 'multiple'}`",
        f"- Generated: {datetime.now(timezone.utc).isoformat()}",
        f"- Total assets: {len(rows)} · total size: {total_size / 1e9:.2f} GB",
        f"- OneDrive online-only placeholders: {counts['online_only']}",
        f"- Unreadable files: {counts['unreadable']}",
        f"- Duplicate groups: {len(duplicates)}", "",
        "## By type", "", "| Type | Count |", "|---|---|",
    ]
    lines += [f"| {t} | {c} |" for t, c in sorted(by_type.items())]
    lines += ["", "## Routing", "",
              f"- Usable directly (FFmpeg pipeline): {counts['direct']}",
              f"- Requires Premiere Pro: {counts['premiere']}",
              f"- Requires After Effects / other app: {counts['after_effects']}",
              f"- Unknown — needs owner review: {counts['unknown']}", ""]
    if duplicates:
        lines += ["## Duplicates", ""]
        for paths in list(duplicates.values())[:30]:
            lines.append("- " + " == ".join(f"`{p}`" for p in paths))
    report.write_text("\n".join(lines) + "\n", encoding="utf-8")

    inv = settings.paths.data / "capabilities" / \
        f"{safe_name(lib['name'] if lib else 'all').lower()}_asset_inventory.json"
    inv.parent.mkdir(parents=True, exist_ok=True)
    inv.write_text(json.dumps([dict(r) for r in rows], indent=2, default=str),
                   encoding="utf-8")
    return report


def select_assets(store: JobStore, *, asset_type: str, limit: int = 5,
                  keywords: list[str] | None = None) -> list[dict]:
    """Conservative asset selection: only local, enabled, dependency-free
    assets; each result carries an explicit reason. Never picks effects just
    because they exist — callers must have an editorial slot to fill."""
    rows = list_assets(store, asset_type=asset_type)
    picks = []
    for row in rows:
        if row["availability"] != "local" or row["protected_from_auto_use"]:
            continue
        if row["routing"] not in ("direct",):
            continue  # premiere/AE-dependent assets need the verified adapter
        reason = f"type match: {asset_type}"
        score = 0.5
        if keywords:
            hits = [k for k in keywords
                    if k.lower() in row["relative_path"].lower()]
            if hits:
                score += 0.1 * len(hits)
                reason += f"; keywords: {', '.join(hits)}"
        picks.append({**row, "selection_reason": reason,
                      "confidence": min(0.9, score),
                      "requires_owner_approval": True})
    picks.sort(key=lambda p: p["confidence"], reverse=True)
    return picks[:limit]
