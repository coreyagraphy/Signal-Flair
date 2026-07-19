#!/usr/bin/env python3
"""Codec test matrix (codec addendum section 12).

Generates synthetic samples for every container/codec pair the INSTALLED
ffmpeg can encode, runs each through the full CodecCompatibilityService
ladder, and writes docs/audit/CODEC_TEST_MATRIX.md. Real private camera
samples placed under tests/codec_samples_private/ (gitignored) are included
in the run but never committed.

Usage: python scripts/run_codec_matrix.py [--quick]
"""
from __future__ import annotations

import argparse
import json
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO))

from core.config import load_settings                      # noqa: E402
from core.proc import run_command, which                   # noqa: E402
from services import capability_service, codec_service     # noqa: E402

# (label, container ext, encoder args, audio encoder args, needs_encoders)
MATRIX = [
    ("H.264/mp4",      ".mp4",  ["-c:v", "libx264", "-pix_fmt", "yuv420p"],
     ["-c:a", "aac"], ["libx264", "aac"]),
    ("H.265/mp4",      ".mp4",  ["-c:v", "libx265", "-pix_fmt", "yuv420p"],
     ["-c:a", "aac"], ["libx265", "aac"]),
    ("MPEG-2/mpg",     ".mpg",  ["-c:v", "mpeg2video", "-q:v", "5"],
     ["-c:a", "mp2"], ["mpeg2video", "mp2"]),
    ("MPEG-4pt2/avi",  ".avi",  ["-c:v", "mpeg4", "-q:v", "5"],
     ["-c:a", "mp3"], ["mpeg4"]),
    ("ProRes/mov",     ".mov",  ["-c:v", "prores_ks", "-profile:v", "1",
                                 "-pix_fmt", "yuv422p10le"],
     ["-c:a", "pcm_s16le"], ["prores_ks"]),
    ("DNxHR/mov",      ".mov",  ["-c:v", "dnxhd", "-profile:v", "dnxhr_lb",
                                 "-pix_fmt", "yuv422p"],
     ["-c:a", "pcm_s16le"], ["dnxhd"]),
    ("VP9/webm",       ".webm", ["-c:v", "libvpx-vp9", "-b:v", "1M"],
     ["-c:a", "libopus"], ["libvpx-vp9", "libopus"]),
    ("VP8/webm",       ".webm", ["-c:v", "libvpx", "-b:v", "1M"],
     ["-c:a", "libvorbis"], ["libvpx", "libvorbis"]),
    ("AV1/mkv",        ".mkv",  ["-c:v", "libaom-av1", "-cpu-used", "8",
                                 "-b:v", "500k"],
     ["-c:a", "libopus"], ["libaom-av1"]),
    ("MJPEG/avi",      ".avi",  ["-c:v", "mjpeg", "-q:v", "5",
                                 "-pix_fmt", "yuvj420p"],
     ["-c:a", "pcm_s16le"], ["mjpeg"]),
    ("DV/avi",         ".avi",  ["-c:v", "dvvideo", "-s", "720x576",
                                 "-r", "25", "-pix_fmt", "yuv420p"],
     ["-c:a", "pcm_s16le"], ["dvvideo"]),
    ("H.264/mts",      ".mts",  ["-c:v", "libx264", "-pix_fmt", "yuv420p"],
     ["-c:a", "ac3"], ["libx264", "ac3"]),
    ("H.264-10bit/mkv", ".mkv", ["-c:v", "libx264", "-pix_fmt", "yuv420p10le"],
     ["-c:a", "flac"], ["libx264", "flac"]),
    ("HEVC-HLG/mp4",   ".mp4",  ["-c:v", "libx265", "-pix_fmt", "yuv420p10le",
                                 "-color_primaries", "bt2020",
                                 "-color_trc", "arib-std-b67",
                                 "-colorspace", "bt2020nc"],
     ["-c:a", "aac"], ["libx265"]),
    ("audio-only/flac", ".flac", None, ["-c:a", "flac"], ["flac"]),
    ("audio-only/wav", ".wav",  None, ["-c:a", "pcm_s16le"], []),
]

QUICK = {"H.264/mp4", "MPEG-2/mpg", "ProRes/mov", "DNxHR/mov", "MJPEG/avi",
         "audio-only/wav"}


def generate_sample(label: str, ext: str, vargs: list | None, aargs: list,
                    out_dir: Path) -> Path | None:
    safe = label.replace("/", "_").replace(".", "")
    out = out_dir / f"sample_{safe}{ext}"
    args = ["ffmpeg", "-y"]
    if vargs is not None:
        args += ["-f", "lavfi", "-i", "testsrc2=size=640x360:rate=30:duration=8"]
    args += ["-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000:duration=8"]
    if vargs is not None:
        args += vargs
    args += aargs + ["-shortest", str(out)]
    result = run_command(args, timeout=600, check=False)
    if result.returncode != 0 or not out.exists() or out.stat().st_size == 0:
        return None
    return out


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--quick", action="store_true",
                        help="run only the fast subset")
    ns = parser.parse_args()

    which("ffmpeg")
    settings = load_settings()
    settings.paths.ensure()
    caps = capability_service.collect_capabilities()
    encoders = set(caps["encoders"])

    work = Path(tempfile.mkdtemp(prefix="codec-matrix-"))
    rows = []
    for label, ext, vargs, aargs, needed in MATRIX:
        if ns.quick and label not in QUICK:
            continue
        if any(n not in encoders for n in needed):
            rows.append({"label": label, "generated": False,
                         "status": "encoder_not_installed",
                         "detail": f"needs {needed}"})
            continue
        sample = generate_sample(label, ext, vargs, aargs, work)
        if sample is None:
            rows.append({"label": label, "generated": False,
                         "status": "generation_failed", "detail": ""})
            continue
        try:
            report = codec_service.verify_source(settings, sample)
            rows.append({"label": label, "generated": True,
                         "status": report["status"],
                         "decoder": report.get("decoder_used"),
                         "warnings": report.get("warnings", []),
                         "detail": ""})
        except Exception as exc:
            rows.append({"label": label, "generated": True,
                         "status": "verify_error", "detail": str(exc)[:200]})

    # Include private real samples (never committed).
    private = REPO / "tests" / "codec_samples_private"
    media_exts = {".mp4", ".mov", ".mxf", ".mts", ".m2ts", ".ts", ".avi",
                  ".mkv", ".webm", ".mpg", ".mpeg", ".m4v", ".3gp", ".wmv",
                  ".wav", ".mp3", ".flac", ".m4a", ".aiff", ".aif"}
    if private.exists():
        for sample in sorted(private.iterdir()):
            if not sample.is_file() or sample.suffix.lower() not in media_exts:
                continue
            try:
                report = codec_service.verify_source(settings, sample)
                rows.append({"label": f"private:{sample.name}", "generated": True,
                             "status": report["status"],
                             "decoder": report.get("decoder_used"),
                             "warnings": report.get("warnings", []), "detail": ""})
            except Exception as exc:
                rows.append({"label": f"private:{sample.name}", "generated": True,
                             "status": "verify_error", "detail": str(exc)[:200]})

    report_path = REPO / "docs" / "audit" / "CODEC_TEST_MATRIX.md"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Codec test matrix", "",
        f"- Executed: {datetime.now(timezone.utc).isoformat()}",
        f"- Machine: `{caps['machine']}` ({caps['platform']})",
        f"- FFmpeg: `{caps['ffmpeg_version']}`",
        f"- Mode: {'quick subset' if ns.quick else 'full matrix'}", "",
        "Synthetic samples are generated by the installed ffmpeg and verified "
        "through the complete decode-test ladder (probe → begin/middle/end "
        "decode → timestamps → status). Real private samples under "
        "`tests/codec_samples_private/` are included when present and never "
        "committed. Premiere/Resolve import columns require the Windows "
        "workstation and are recorded as untested here.", "",
        "| Sample | Generated | Ladder status | Decoder | Notes |",
        "|---|---|---|---|---|",
    ]
    verified = 0
    for row in rows:
        icon = "✅" if str(row["status"]).startswith("codec_verified") else "⚠️"
        if str(row["status"]).startswith("codec_verified"):
            verified += 1
        notes = row.get("detail") or "; ".join(row.get("warnings", []))[:120]
        lines.append(f"| {row['label']} | {'yes' if row['generated'] else 'no'} "
                     f"| {icon} {row['status']} | {row.get('decoder', '')} "
                     f"| {notes} |")
    lines += ["", f"**{verified}/{len(rows)} samples codec-verified.** "
              "Unverified rows show the exact reason — encoder missing from "
              "this build, generation failure, or a real decode problem.", ""]
    report_path.write_text("\n".join(lines), encoding="utf-8")
    (settings.paths.data / "capabilities").mkdir(parents=True, exist_ok=True)
    (settings.paths.data / "capabilities" / "codec_matrix_results.json").write_text(
        json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Matrix written to {report_path} — {verified}/{len(rows)} verified")
    return 0 if verified > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
