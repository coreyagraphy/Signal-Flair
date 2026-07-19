"""FFmpeg build capability inventory (codec addendum section 3).

Records exactly what the INSTALLED ffmpeg can demux/decode — never assumed
from documentation. Written to data/capabilities/ffmpeg_capabilities.json and
docs/audit/INSTALLED_CODEC_CAPABILITY_REPORT.md.
"""
from __future__ import annotations

import json
import platform
import re
from datetime import datetime, timezone
from pathlib import Path

from core.config import Settings
from core.proc import run_command, which


def _lines(args: list[str]) -> list[str]:
    result = run_command(args, timeout=60, check=False)
    return (result.stdout or result.stderr).splitlines()


def collect_capabilities() -> dict:
    which("ffmpeg")
    version_line = _lines(["ffmpeg", "-version"])[0]
    buildconf = [l.strip() for l in _lines(["ffmpeg", "-buildconf"])
                 if l.strip().startswith("--")]

    demuxers = []
    for line in _lines(["ffmpeg", "-hide_banner", "-demuxers"]):
        m = re.match(r"^\s*D\s+(\S+)\s", line)
        if m:
            demuxers.append(m.group(1))

    video_decoders, audio_decoders, subtitle_decoders = [], [], []
    for line in _lines(["ffmpeg", "-hide_banner", "-decoders"]):
        m = re.match(r"^\s*([VAS])[F.][S.][X.][B.][D.]\s+(\S+)\s", line)
        if m:
            kind, name = m.group(1), m.group(2)
            {"V": video_decoders, "A": audio_decoders,
             "S": subtitle_decoders}[kind].append(name)

    encoders = []
    for line in _lines(["ffmpeg", "-hide_banner", "-encoders"]):
        m = re.match(r"^\s*[VAS][F.][S.][X.][B.][D.]\s+(\S+)\s", line)
        if m:
            encoders.append(m.group(1))

    hwaccels = [l.strip() for l in
                _lines(["ffmpeg", "-hide_banner", "-hwaccels"])[1:] if l.strip()]

    pix_fmts = []
    for line in _lines(["ffmpeg", "-hide_banner", "-pix_fmts"]):
        m = re.match(r"^[IOH.]{5}\s+(\S+)\s+(\d+)\s+(\d+)", line)
        if m:
            pix_fmts.append(m.group(1))

    return {
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "machine": platform.node(),
        "platform": platform.platform(),
        "ffmpeg_version": version_line,
        "build_configuration": buildconf,
        "demuxers": demuxers,
        "video_decoders": video_decoders,
        "audio_decoders": audio_decoders,
        "subtitle_decoders": subtitle_decoders,
        "encoders": encoders,
        "hwaccels": hwaccels,
        "pix_fmts": pix_fmts,
    }


# Codec families Content OS cares about → decoder names to look for.
FAMILY_DECODERS = {
    "H.264/AVC": ["h264", "h264_cuvid"],
    "H.265/HEVC": ["hevc", "hevc_cuvid"],
    "MPEG-2": ["mpeg2video"],
    "MPEG-4 Part 2": ["mpeg4"],
    "Apple ProRes": ["prores"],
    "Avid DNxHD/DNxHR": ["dnxhd"],
    "GoPro CineForm": ["cfhd"],
    "AV1": ["libdav1d", "libaom-av1", "av1"],
    "VP8": ["vp8", "libvpx"],
    "VP9": ["vp9", "libvpx-vp9"],
    "Motion JPEG": ["mjpeg"],
    "DV/DVCPRO": ["dvvideo"],
    "OpenEXR": ["exr"],
    "Blackmagic RAW": [],   # needs vendor SDK — ffmpeg cannot decode
    "RED R3D": [],          # needs vendor SDK
    "ARRIRAW": [],          # needs vendor SDK
    "PCM": ["pcm_s16le", "pcm_s24le"],
    "AAC": ["aac"],
    "MP3": ["mp3", "mp3float"],
    "FLAC": ["flac"],
    "ALAC": ["alac"],
    "AC-3": ["ac3"],
    "E-AC-3": ["eac3"],
    "Opus": ["opus", "libopus"],
    "Vorbis": ["vorbis", "libvorbis"],
    "WMA": ["wmav2"],
}


def family_support(caps: dict) -> dict[str, dict]:
    installed = set(caps["video_decoders"]) | set(caps["audio_decoders"])
    out = {}
    for family, decoders in FAMILY_DECODERS.items():
        found = [d for d in decoders if d in installed]
        if not decoders:
            out[family] = {"supported": False,
                           "reason": "requires vendor SDK/decoder ffmpeg does not ship"}
        elif found:
            out[family] = {"supported": True, "decoders": found}
        else:
            out[family] = {"supported": False,
                           "reason": f"none of {decoders} in installed build"}
    return out


def write_reports(settings: Settings, caps: dict) -> tuple[Path, Path]:
    cap_dir = settings.paths.data / "capabilities"
    cap_dir.mkdir(parents=True, exist_ok=True)
    json_path = cap_dir / "ffmpeg_capabilities.json"
    json_path.write_text(json.dumps(caps, indent=2), encoding="utf-8")

    families = family_support(caps)
    report = settings.paths.root / "docs" / "audit" / "INSTALLED_CODEC_CAPABILITY_REPORT.md"
    report.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Installed codec capability report", "",
        f"- Collected: {caps['collected_at']}",
        f"- Machine: `{caps['machine']}` ({caps['platform']})",
        f"- FFmpeg: `{caps['ffmpeg_version']}`",
        f"- Demuxers: {len(caps['demuxers'])} · video decoders: "
        f"{len(caps['video_decoders'])} · audio decoders: "
        f"{len(caps['audio_decoders'])}",
        f"- Hardware acceleration: {', '.join(caps['hwaccels']) or 'none'}", "",
        "This inventory reflects the ffmpeg build on THIS machine only. "
        "Re-run `python contentos_cli.py codec-inventory` after any ffmpeg "
        "change or on a new machine.", "",
        "## Codec family support", "",
        "| Family | Supported | Detail |", "|---|---|---|",
    ]
    for family, info in families.items():
        detail = ", ".join(info.get("decoders", [])) or info.get("reason", "")
        lines.append(f"| {family} | {'✅' if info['supported'] else '❌'} | {detail} |")
    lines += ["", "## Known missing capabilities", ""]
    missing = [f for f, i in families.items() if not i["supported"]]
    lines += [f"- {f}: {families[f]['reason']}" for f in missing] or ["- none"]
    report.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return json_path, report
