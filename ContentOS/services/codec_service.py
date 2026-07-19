"""CodecCompatibilityService (codec addendum sections 1, 4, 5, 9, 10, 11).

A source is `codec_verified` only after: structural probe, decode samples at
the beginning / middle / end, timestamp inspection (VFR, negative/
non-monotonic timestamps), proxy generation, and independent proxy decode
verification. Failures are differentiated (unsupported codec vs corrupt vs
truncated vs DRM vs zero-byte) — never a generic "cannot play file".
"""
from __future__ import annotations

import json
import re
from fractions import Fraction
from pathlib import Path

from core.config import Settings
from core.exceptions import MediaError
from core.proc import run_command, which

# pix_fmt → (bit depth, chroma subsampling)
_PIX_FMT_INFO = {
    "yuv420p": (8, "4:2:0"), "yuvj420p": (8, "4:2:0"), "nv12": (8, "4:2:0"),
    "yuv422p": (8, "4:2:2"), "yuvj422p": (8, "4:2:2"),
    "yuv444p": (8, "4:4:4"), "yuvj444p": (8, "4:4:4"),
    "yuv420p10le": (10, "4:2:0"), "yuv422p10le": (10, "4:2:2"),
    "yuv444p10le": (10, "4:4:4"), "yuv422p12le": (12, "4:2:2"),
    "yuv444p12le": (12, "4:4:4"), "p010le": (10, "4:2:0"),
    "gbrp": (8, "4:4:4"), "rgb24": (8, "4:4:4"), "rgba": (8, "4:4:4"),
    "gbrpf32le": (32, "4:4:4"), "gbrap16le": (16, "4:4:4"),
}


def _rate(value: str | None) -> float | None:
    if not value or value in ("0/0", "N/A"):
        return None
    try:
        return float(Fraction(value))
    except (ValueError, ZeroDivisionError):
        return None


def full_probe(path: Path) -> dict:
    """Complete stream inventory — every stream, never just stream zero."""
    which("ffprobe")
    result = run_command([
        "ffprobe", "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", "-show_chapters", str(path),
    ], timeout=180, check=False)
    if result.returncode != 0:
        raise MediaError(_classify_probe_failure(path, result.stderr),
                         code=_failure_code(path, result.stderr))
    raw = json.loads(result.stdout)
    fmt = raw.get("format", {})
    streams = []
    for s in raw.get("streams", []):
        kind = s.get("codec_type")
        pix = s.get("pix_fmt")
        depth, chroma = _PIX_FMT_INFO.get(pix, (None, None))
        rotation = 0
        for sd in s.get("side_data_list", []) or []:
            if "rotation" in sd:
                rotation = int(sd["rotation"])
        r_rate = _rate(s.get("r_frame_rate"))
        avg_rate = _rate(s.get("avg_frame_rate"))
        streams.append({
            "index": s.get("index"), "type": kind,
            "codec": s.get("codec_name"), "codec_tag": s.get("codec_tag_string"),
            "profile": s.get("profile"), "level": s.get("level"),
            "pixel_format": pix, "bit_depth": depth or
                (int(s["bits_per_raw_sample"]) if s.get("bits_per_raw_sample",
                 "N/A") not in ("N/A", None) else None),
            "chroma_subsampling": chroma,
            "width": s.get("width"), "height": s.get("height"),
            "sample_aspect_ratio": s.get("sample_aspect_ratio"),
            "display_aspect_ratio": s.get("display_aspect_ratio"),
            "r_frame_rate": r_rate, "avg_frame_rate": avg_rate,
            "vfr_suspected": (kind == "video" and r_rate and avg_rate
                              and abs(r_rate - avg_rate) > 0.01),
            "time_base": s.get("time_base"),
            "start_time": s.get("start_time"),
            "duration": float(s["duration"]) if s.get("duration") else None,
            "rotation": rotation,
            "field_order": s.get("field_order"),
            "color_primaries": s.get("color_primaries"),
            "color_transfer": s.get("color_transfer"),
            "color_space": s.get("color_space"),
            "color_range": s.get("color_range"),
            "sample_rate": int(s["sample_rate"]) if s.get("sample_rate") else None,
            "channels": s.get("channels"),
            "channel_layout": s.get("channel_layout"),
            "disposition": {k: v for k, v in (s.get("disposition") or {}).items() if v},
            "tags": s.get("tags", {}),
        })
    hdr = any(s.get("color_transfer") in ("smpte2084", "arib-std-b67")
              for s in streams)
    return {
        "container": (fmt.get("format_name") or "").split(",")[0] or None,
        "container_long": fmt.get("format_long_name"),
        "duration_seconds": float(fmt.get("duration", 0) or 0),
        "size_bytes": int(fmt.get("size", 0) or 0),
        "bit_rate": int(fmt.get("bit_rate", 0) or 0),
        "start_time": float(fmt.get("start_time", 0) or 0),
        "streams": streams,
        "video_streams": [s for s in streams if s["type"] == "video"
                          and not s["disposition"].get("attached_pic")],
        "audio_streams": [s for s in streams if s["type"] == "audio"],
        "subtitle_streams": [s for s in streams if s["type"] == "subtitle"],
        "data_streams": [s for s in streams if s["type"] == "data"],
        "hdr": hdr,
        "encrypted": "encryption" in json.dumps(fmt.get("tags", {})).lower(),
    }


def _failure_code(path: Path, stderr: str) -> str:
    text = (stderr or "").lower()
    try:
        if path.stat().st_size == 0:
            return "zero_byte_file"
    except OSError:
        return "permission_failure"
    if "moov atom not found" in text:
        return "missing_moov_atom"
    if "invalid data found" in text:
        return "corrupt_container"
    if "permission denied" in text:
        return "permission_failure"
    if "drm" in text or "encrypted" in text:
        return "drm_protected"
    return "corrupt_container"


def _classify_probe_failure(path: Path, stderr: str) -> str:
    code = _failure_code(path, stderr)
    hints = {
        "zero_byte_file": "The file is empty (0 bytes).",
        "missing_moov_atom": "The MP4/MOV index (moov atom) is missing — usually "
                             "an interrupted recording or an unfinished copy. "
                             "Recovery tools like untrunc may help; the original "
                             "was not modified.",
        "corrupt_container": "The container structure could not be parsed.",
        "permission_failure": "The file could not be read (permissions/lock).",
        "drm_protected": "The file appears to be DRM-protected.",
    }
    return f"{hints.get(code, 'Unreadable media.')} ({path.name})"


def select_streams(probe: dict, *, audio_stream_index: int | None = None) -> dict:
    """Stream-selection policy: never blindly stream zero."""
    video = None
    for s in probe["video_streams"]:
        if s["disposition"].get("default"):
            video = s
            break
    if video is None and probe["video_streams"]:
        video = max(probe["video_streams"],
                    key=lambda s: (s.get("width") or 0) * (s.get("height") or 0))
    audio = None
    if audio_stream_index is not None:
        audio = next((s for s in probe["audio_streams"]
                      if s["index"] == audio_stream_index), None)
    if audio is None:
        for s in probe["audio_streams"]:
            if s["disposition"].get("default"):
                audio = s
                break
    if audio is None and probe["audio_streams"]:
        audio = max(probe["audio_streams"], key=lambda s: s.get("channels") or 0)
    return {"video": video, "audio": audio,
            "unselected": [s["index"] for s in probe["streams"]
                           if s not in (video, audio)]}


_ERROR_LINE = re.compile(r"(error|corrupt|invalid|missing reference)", re.IGNORECASE)

# Corruption markers — several (concealment, ac-tex, MB decode) are logged at
# WARNING level by ffmpeg, so decode samples listen at -v warning.
_CORRUPTION_LINE = re.compile(
    r"(conceal|damaged|ac-tex|corrupt|error while decoding|slice mismatch"
    r"|invalid data|missing reference|Frame parameters mismatch)",
    re.IGNORECASE)

# Audio-decoder resync noise expected after byte-seeking MPEG-PS/TS streams.
# Video corruption ("concealing", "error while decoding MB", "corrupt") never
# matches this and always counts as a real failure.
_BENIGN_SEEK_NOISE = re.compile(
    r"(Header missing"
    r"|\[aist#[^\]]*\] Error submitting packet to decoder: Invalid data"
    r"|\[mp2 @ |\[mp3float @ |\[aac @ [^\]]*\] Error submitting)", )


def decode_sample(path: Path, *, start: float, duration: float = 2.0,
                  hwaccel: str | None = None,
                  video_index: int | None = None) -> dict:
    """Decode a slice to null output; count real decode errors.

    The sample at t=0 is strict (-xerror, zero tolerated errors). Seeked
    samples tolerate a handful of error lines because byte-seek containers
    (MPEG-PS/TS) legitimately produce mid-GOP noise until the next I-frame —
    tolerated lines are recorded, never hidden.
    """
    seeked = start > 0.01
    # -v warning: concealment/damage markers are warning-level and would be
    # invisible at -v error, letting corrupt footage pass as verified.
    args = ["ffmpeg", "-hide_banner", "-v", "warning"]
    if not seeked:
        args += ["-xerror"]
    if hwaccel:
        args += ["-hwaccel", hwaccel]
    args += ["-ss", f"{max(0.0, start):.3f}", "-i", str(path),
             "-t", f"{duration:.3f}"]
    if video_index is not None:
        args += ["-map", f"0:{video_index}?", "-map", "0:a?"]
    args += ["-f", "null", "-"]
    result = run_command(args, timeout=300, check=False)
    error_lines = [l for l in result.stderr.splitlines()
                   if _CORRUPTION_LINE.search(l) or _ERROR_LINE.search(l)]
    # Audio-decoder resync noise is benign after a byte seek; any video
    # corruption marker fails the sample regardless of seek position.
    serious = [l for l in error_lines
               if not (seeked and _BENIGN_SEEK_NOISE.search(l))]
    ok = result.returncode == 0 and not serious
    return {"ok": ok,
            "returncode": result.returncode,
            "errors": (serious or error_lines)[:10],
            "tolerated_seek_noise": bool(seeked and error_lines and ok),
            "hwaccel": hwaccel or "software"}


def inspect_timestamps(path: Path, stream_index: int, *,
                       sample_packets: int = 400) -> dict:
    """Sample packet timestamps: negative / missing / non-monotonic / VFR."""
    result = run_command([
        "ffprobe", "-v", "error", "-select_streams", str(stream_index),
        "-show_entries", "packet=pts_time,dts_time",
        "-read_intervals", "%+#" + str(sample_packets),
        "-print_format", "json", str(path),
    ], timeout=120, check=False)
    issues, pts_list = [], []
    try:
        packets = json.loads(result.stdout).get("packets", [])
    except json.JSONDecodeError:
        return {"issues": ["timestamp probe unreadable"], "packets_sampled": 0}
    missing = 0
    for p in packets:
        pts = p.get("pts_time")
        if pts in (None, "N/A"):
            missing += 1
            continue
        pts_list.append(float(pts))
    if missing:
        issues.append(f"{missing} packets missing pts")
    if pts_list and min(pts_list) < -0.5:
        issues.append(f"negative timestamps (min {min(pts_list):.3f})")
    non_mono = sum(1 for i in range(1, len(pts_list))
                   if pts_list[i] < pts_list[i - 1] - 1e-6)
    if non_mono:
        issues.append(f"{non_mono} non-monotonic pts (may be B-frame reorder)")
    deltas = [pts_list[i] - pts_list[i - 1] for i in range(1, len(pts_list))
              if pts_list[i] > pts_list[i - 1]]
    vfr = False
    if len(deltas) > 10:
        avg = sum(deltas) / len(deltas)
        jitter = sum(1 for d in deltas if abs(d - avg) > avg * 0.2)
        vfr = jitter > len(deltas) * 0.1
    return {"issues": issues, "packets_sampled": len(packets),
            "vfr_detected": vfr}


def available_hwaccels() -> list[str]:
    result = run_command(["ffmpeg", "-hide_banner", "-hwaccels"],
                         timeout=30, check=False)
    return [l.strip() for l in result.stdout.splitlines()[1:] if l.strip()]


def verify_source(settings: Settings, path: Path, *, job_id: str | None = None,
                  probe: dict | None = None) -> dict:
    """Full decode-test ladder (stages A–E + decoder tiers 1–3).

    Proxy generation/verification (stages F–G) happens in proxy_service and
    its result is merged into the codec report there.
    """
    report: dict = {"file": path.name, "status": None, "warnings": [],
                    "decoder_ladder": []}
    # Stage A — structural probe (raises typed MediaError on failure)
    probe = probe or full_probe(path)
    report["probe"] = {k: probe[k] for k in
                       ("container", "duration_seconds", "hdr", "encrypted")}
    report["streams"] = probe["streams"]
    if probe["encrypted"]:
        report["status"] = "drm_protected"
        return report
    if not probe["video_streams"] and not probe["audio_streams"]:
        report["status"] = "no_decodable_streams"
        return report

    selection = select_streams(probe)
    report["stream_selection"] = {
        "video_index": selection["video"]["index"] if selection["video"] else None,
        "audio_index": selection["audio"]["index"] if selection["audio"] else None,
        "unselected": selection["unselected"],
    }
    video = selection["video"]
    duration = probe["duration_seconds"]

    # Decoder ladder: Tier 1 hardware (when present) → Tier 2 software.
    ladder: list[str | None] = []
    hw = available_hwaccels()
    if "cuda" in hw and video is not None:
        ladder.append("cuda")
    ladder.append(None)  # software

    sample_points = [0.0]
    if duration > 6:
        sample_points += [duration * 0.5, max(0.0, duration - 3.0)]
    chosen_mode = None
    for accel in ladder:
        results = [decode_sample(path, start=t, hwaccel=accel,
                                 video_index=video["index"] if video else None)
                   for t in sample_points]
        entry = {"mode": accel or "software",
                 "samples_ok": sum(1 for r in results if r["ok"]),
                 "samples": len(results),
                 "errors": [e for r in results for e in r["errors"]][:10]}
        report["decoder_ladder"].append(entry)
        if all(r["ok"] for r in results):
            chosen_mode = accel or "software"
            if any(r.get("tolerated_seek_noise") for r in results):
                report["warnings"].append(
                    "seek-point decode noise tolerated (mid-GOP seek in this "
                    "container); begin-of-file decode was strict and clean")
            break
    if chosen_mode is None:
        # Tier 3 — tolerant retry to distinguish damage from unsupported codec.
        tolerant = run_command(
            ["ffmpeg", "-hide_banner", "-v", "error", "-err_detect", "ignore_err",
             "-i", str(path), "-t", "3", "-f", "null", "-"],
            timeout=300, check=False)
        codec = video["codec"] if video else None
        from services.capability_service import collect_capabilities
        decoders = set()
        try:
            caps = collect_capabilities()
            decoders = set(caps["video_decoders"]) | set(caps["audio_decoders"])
        except Exception:
            pass
        if codec and decoders and codec not in decoders:
            report["status"] = "unsupported_codec"
            report["unsupported_stream"] = video
            report["missing_decoder"] = codec
            report["recommended_path"] = (
                f"No installed decoder for '{codec}'. Options: install an "
                "ffmpeg build with this decoder, or use the Premiere/Resolve "
                "fallback pathway to create a mezzanine (see "
                "docs/12_LIMITATIONS_AND_MANUAL_STEPS.md).")
        elif tolerant.returncode == 0:
            report["status"] = "damaged_frames"
            report["warnings"].append(
                "decodes only with error concealment — footage is damaged")
        else:
            report["status"] = "damaged"
        return report

    report["decoder_used"] = chosen_mode
    if chosen_mode != (ladder[0] or "software") and len(ladder) > 1:
        report["warnings"].append("hardware decode failed; software fallback used")

    # Stage E — timestamp inspection on the selected video stream.
    if video is not None:
        ts = inspect_timestamps(path, video["index"])
        report["timestamps"] = ts
        if ts.get("vfr_detected") or video.get("vfr_suspected"):
            report["vfr"] = True
            report["warnings"].append(
                "variable frame rate detected — proxy will be CFR-normalized "
                "with duration verification")
        for issue in ts.get("issues", []):
            report["warnings"].append(f"timestamps: {issue}")
    av_streams = probe["video_streams"] + probe["audio_streams"]
    durations = [s["duration"] for s in av_streams if s.get("duration")]
    if durations and max(durations) - min(durations) > 1.5:
        report["warnings"].append(
            f"audio/video duration mismatch ({min(durations):.2f}s vs "
            f"{max(durations):.2f}s)")

    hw_was_attempted = ladder[0] is not None
    if chosen_mode == "software" and hw_was_attempted:
        report["status"] = "codec_verified_software_fallback"
    else:
        report["status"] = "codec_verified"
    return report


def write_codec_report(settings: Settings, job_id: str, report: dict) -> Path:
    json_path = settings.paths.output_reports / f"{job_id}_codec_report.json"
    json_path.write_text(json.dumps(report, indent=2, default=str),
                         encoding="utf-8")
    md = settings.paths.output_reports / f"{job_id}_codec_report.md"
    v = next((s for s in report.get("streams", []) if s["type"] == "video"), {})
    a = next((s for s in report.get("streams", []) if s["type"] == "audio"), {})
    lines = [
        f"# Codec report — {job_id}", "",
        f"- File: `{report.get('file')}`",
        f"- **Status: {report.get('status')}**",
        f"- Container: {report.get('probe', {}).get('container')}",
        f"- Video: {v.get('codec')} {v.get('profile') or ''} "
        f"{v.get('width')}x{v.get('height')} {v.get('pixel_format') or ''} "
        f"({v.get('bit_depth')}-bit {v.get('chroma_subsampling') or ''})",
        f"- Frame rate: r={v.get('r_frame_rate')} avg={v.get('avg_frame_rate')}"
        f"{' (VFR)' if report.get('vfr') else ''}",
        f"- Color: {v.get('color_primaries')}/{v.get('color_transfer')}/"
        f"{v.get('color_space')} range={v.get('color_range')}"
        f"{' HDR' if report.get('probe', {}).get('hdr') else ''}",
        f"- Audio: {a.get('codec')} {a.get('sample_rate')}Hz "
        f"{a.get('channels')}ch ({a.get('channel_layout')})",
        f"- Decoder used: {report.get('decoder_used', 'n/a')}",
        f"- Proxy: {report.get('proxy_result', 'pending')}",
        f"- Audio extraction: {report.get('audio_extraction_result', 'pending')}",
        "", "## Warnings", "",
    ]
    lines += [f"- {w}" for w in report.get("warnings", [])] or ["- none"]
    if report.get("recommended_path"):
        lines += ["", "## Recommended action", "", report["recommended_path"]]
    md.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return json_path
