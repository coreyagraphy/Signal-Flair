#!/usr/bin/env python3
"""Resolve a source video from a filename prefix (VettaRey acceptance test).

Usage:
  python scripts/resolve_source.py --root "<folder>" --prefix "YOU_JUST_TOOK_A_L"

Finds matching video files, probes each, records SHA-256 + size + mtime, and
selects the most complete camera-original (longest duration, then highest
resolution, then largest file). Never modifies, moves, or renames anything.
Prints a JSON report and writes it beside the job data for the pipeline run.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.hashing import sha256_file          # noqa: E402
from services.codec_service import full_probe  # noqa: E402

VIDEO_EXTENSIONS = {".mp4", ".mov", ".mxf", ".mts", ".m2ts", ".avi", ".mkv"}


def find_candidates(root: Path, prefix: str) -> list[Path]:
    exact = [p for p in root.rglob("*") if p.is_file()
             and p.suffix.lower() in VIDEO_EXTENSIONS
             and p.stem.upper().startswith(prefix.upper())]
    if exact:
        return sorted(exact)
    # Fallback: fuzzy token match (e.g. spaces/underscores differ).
    tokens = [t for t in re.split(r"[_\s]+", prefix) if t]
    pattern = ".*".join(re.escape(t) for t in tokens)
    rx = re.compile(pattern, re.IGNORECASE)
    return sorted(p for p in root.rglob("*") if p.is_file()
                  and p.suffix.lower() in VIDEO_EXTENSIONS
                  and rx.search(p.name))


def describe(path: Path, *, hash_file: bool = True) -> dict:
    st = path.stat()
    entry = {"path": str(path), "size_bytes": st.st_size,
             "modified": st.st_mtime}
    if hash_file:
        entry["sha256"] = sha256_file(path)
    try:
        probe = full_probe(path)
        v = probe["video_streams"][0] if probe["video_streams"] else {}
        entry.update({
            "duration_seconds": probe["duration_seconds"],
            "container": probe["container"],
            "video_codec": v.get("codec"), "profile": v.get("profile"),
            "width": v.get("width"), "height": v.get("height"),
            "bit_depth": v.get("bit_depth"),
            "chroma": v.get("chroma_subsampling"),
            "frame_rate": v.get("avg_frame_rate"),
            "vfr_suspected": v.get("vfr_suspected"),
            "color_transfer": v.get("color_transfer"),
            "probe_ok": True,
        })
    except Exception as exc:
        entry.update({"probe_ok": False, "probe_error": str(exc)})
    return entry


def select_primary(candidates: list[dict]) -> dict | None:
    usable = [c for c in candidates if c.get("probe_ok")]
    if not usable:
        return None
    usable.sort(key=lambda c: (c.get("duration_seconds") or 0,
                               (c.get("width") or 0) * (c.get("height") or 0),
                               c.get("size_bytes") or 0), reverse=True)
    return usable[0]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--prefix", required=True)
    parser.add_argument("--no-hash", action="store_true",
                        help="skip SHA-256 (faster for a first look)")
    parser.add_argument("--out", help="write the JSON report here")
    ns = parser.parse_args()

    root = Path(ns.root)
    if not root.is_dir():
        print(json.dumps({"error": f"root not found: {root}"}))
        return 1
    paths = find_candidates(root, ns.prefix)
    report = {"root": str(root), "prefix": ns.prefix,
              "matches": [describe(p, hash_file=not ns.no_hash) for p in paths]}
    primary = select_primary(report["matches"])
    report["primary"] = primary["path"] if primary else None
    report["selection_reason"] = (
        "longest duration, then highest resolution, then largest file "
        "among probe-verified matches" if primary else
        "no probe-verified match found")
    text = json.dumps(report, indent=2)
    print(text)
    if ns.out:
        Path(ns.out).write_text(text, encoding="utf-8")
    return 0 if primary else 1


if __name__ == "__main__":
    sys.exit(main())
