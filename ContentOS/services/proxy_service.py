"""Proxy + audio extraction stage (codec addendum sections 4F/4G, 6, 7, 8, 9).

Produces the normalized review proxy (MP4/H.264 yuv420p 8-bit, AAC-LC 48 kHz,
faststart, ≤720p, full source duration), CFR-normalized when the source is
VFR, with an independent decode verification pass. HDR sources get an
explicit, recorded tone-mapping transform for the SDR review proxy — the
original is never modified. Professional editing proxies / mezzanines
(ProRes, DNxHR) are generated on demand via ``make_mezzanine``.
"""
from __future__ import annotations

import json
from pathlib import Path

from core.config import Settings
from core.exceptions import MediaError
from core.job_store import JobStore
from core.proc import expect_output_file, run_command, which

from . import codec_service

REVIEW_PROXY_MAX_HEIGHT = 720

# Verified locally-encodable mezzanine profiles (ffmpeg prores_ks / dnxhd).
MEZZANINE_PROFILES = {
    "prores_proxy":  ["-c:v", "prores_ks", "-profile:v", "0", "-pix_fmt", "yuv422p10le"],
    "prores_422":    ["-c:v", "prores_ks", "-profile:v", "2", "-pix_fmt", "yuv422p10le"],
    "prores_422_hq": ["-c:v", "prores_ks", "-profile:v", "3", "-pix_fmt", "yuv422p10le"],
    "dnxhr_lb":      ["-c:v", "dnxhd", "-profile:v", "dnxhr_lb", "-pix_fmt", "yuv422p"],
    "dnxhr_sq":      ["-c:v", "dnxhd", "-profile:v", "dnxhr_sq", "-pix_fmt", "yuv422p"],
    "dnxhr_hqx":     ["-c:v", "dnxhd", "-profile:v", "dnxhr_hqx", "-pix_fmt", "yuv422p10le"],
}


def _needs_reencode(meta: dict) -> bool:
    if meta.get("video_codec") != "h264":
        return True
    if (meta.get("height") or 9999) > REVIEW_PROXY_MAX_HEIGHT:
        return True
    if (meta.get("rotation") or 0) != 0:
        return True
    if meta.get("pixel_format") not in ("yuv420p", "yuvj420p"):
        return True
    if meta.get("audio_codec") not in ("aac", None):
        return True
    return False


def _verify_proxy(proxy: Path, source_duration: float) -> dict:
    """Stage G — independent probe AND decode test of the generated proxy."""
    meta = codec_service.full_probe(proxy)
    if not meta["video_streams"]:
        raise MediaError(f"Proxy has no video stream: {proxy.name}")
    drift = abs(meta["duration_seconds"] - source_duration)
    if source_duration > 1 and drift > max(0.5, source_duration * 0.02):
        raise MediaError(
            f"Proxy duration {meta['duration_seconds']:.2f}s deviates from "
            f"source {source_duration:.2f}s — timing not preserved")
    duration = meta["duration_seconds"]
    points = [0.0] + ([duration * 0.5, max(0.0, duration - 2.0)]
                      if duration > 6 else [])
    for t in points:
        result = codec_service.decode_sample(proxy, start=t)
        if not result["ok"]:
            raise MediaError(f"Proxy failed decode verification at {t:.1f}s: "
                             f"{result['errors'][:2]}")
    return {"verified": True, "duration": meta["duration_seconds"],
            "drift_seconds": round(drift, 3)}


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    which("ffmpeg")
    artifacts = store.artifacts(job_id)
    source = Path(artifacts["managed_original"])
    meta = json.loads(Path(artifacts["metadata_json"]).read_text(encoding="utf-8"))
    codec_report_path = Path(artifacts["codec_report"])
    codec_report = json.loads(codec_report_path.read_text(encoding="utf-8"))
    vfr = bool(codec_report.get("vfr"))
    hdr = bool(codec_report.get("probe", {}).get("hdr"))
    duration = float(meta.get("duration_seconds") or 0)

    sel = codec_report.get("stream_selection", {})
    video_map = f"0:{sel['video_index']}" if sel.get("video_index") is not None else "0:v:0"
    audio_map = f"0:{sel['audio_index']}" if sel.get("audio_index") is not None else None

    proxy = settings.paths.media_proxies / f"{job_id}_proxy.mp4"
    transform_notes = []
    if _needs_reencode(meta) or vfr or hdr:
        def build_args(with_tonemap: bool) -> list[str]:
            vf = [f"scale=-2:'min({REVIEW_PROXY_MAX_HEIGHT},ih)'"]
            if with_tonemap:
                # Explicit, recorded viewing transform (not a creative grade).
                vf.insert(0, "zscale=t=linear:npl=100,tonemap=hable,"
                             "zscale=p=bt709:t=bt709:m=bt709:r=tv")
            args = ["ffmpeg", "-y", "-i", str(source), "-map", video_map]
            if audio_map:
                args += ["-map", audio_map]
            args += ["-vf", ",".join(vf),
                     "-c:v", "libx264", "-preset", "fast", "-crf", "23",
                     "-pix_fmt", "yuv420p"]
            if vfr:
                fps = meta.get("frame_rate") or 30
                args += ["-vsync", "cfr", "-r", f"{fps:.6g}"]
            args += ["-c:a", "aac", "-ar", "48000", "-b:a", "128k",
                     "-movflags", "+faststart", str(proxy)]
            return args

        if vfr:
            transform_notes.append(
                f"VFR→CFR normalization at {meta.get('frame_rate') or 30:.6g} fps "
                "(duration verified below)")
        if hdr:
            from core.exceptions import SubprocessFailed
            try:
                run_command(build_args(with_tonemap=True), timeout=3600)
                transform_notes.append(
                    "HDR→SDR viewing transform: zscale linear + hable tonemap "
                    "+ bt709 (recorded; original untouched)")
            except SubprocessFailed:
                # zscale/tonemap missing from this build — rebuild the whole
                # command without the transform and say so honestly.
                run_command(build_args(with_tonemap=False), timeout=3600)
                transform_notes.append(
                    "zscale/tonemap unavailable in this ffmpeg build — proxy "
                    "is UN-tonemapped; colors may look flat")
        else:
            run_command(build_args(with_tonemap=False), timeout=3600)
        reencoded = True
    else:
        run_command(["ffmpeg", "-y", "-i", str(source), "-c", "copy",
                     "-movflags", "+faststart", str(proxy)], timeout=600)
        reencoded = False
    expect_output_file(proxy, "review proxy")
    proxy_check = _verify_proxy(proxy, duration)
    store.set_artifact(job_id, "proxy_video", proxy)

    detail = {"proxy": proxy.name, "reencoded": reencoded, **proxy_check,
              "transforms": transform_notes}

    audio_result = "no_audio_stream"
    if meta.get("has_audio"):
        asr_wav = settings.paths.media_audio / f"{job_id}_asr16k.wav"
        args = ["ffmpeg", "-y", "-i", str(source)]
        if audio_map:
            args += ["-map", audio_map]
        run_command(args + ["-vn", "-ac", "1", "-ar", "16000",
                            "-c:a", "pcm_s16le", str(asr_wav)], timeout=1800)
        expect_output_file(asr_wav, "ASR wav")
        store.set_artifact(job_id, "audio_asr_wav", asr_wav)

        master_wav = settings.paths.media_audio / f"{job_id}_master48k.wav"
        args = ["ffmpeg", "-y", "-i", str(source)]
        if audio_map:
            args += ["-map", audio_map]
        run_command(args + ["-vn", "-ar", "48000", "-c:a", "pcm_s16le",
                            str(master_wav)], timeout=1800)
        expect_output_file(master_wav, "master wav")
        store.set_artifact(job_id, "audio_master_wav", master_wav)
        audio_result = "extracted"
        detail["audio"] = True
    else:
        asr_wav = settings.paths.media_audio / f"{job_id}_asr16k.wav"
        run_command(["ffmpeg", "-y", "-f", "lavfi",
                     "-i", "anullsrc=channel_layout=mono:sample_rate=16000",
                     "-t", f"{max(0.1, duration):.3f}",
                     "-c:a", "pcm_s16le", str(asr_wav)], timeout=600)
        store.set_artifact(job_id, "audio_asr_wav", asr_wav)
        detail["audio"] = False

    # Stage F/G results merged back into the codec report (addendum section 4).
    codec_report["proxy_result"] = f"verified (drift {proxy_check['drift_seconds']}s)"
    codec_report["audio_extraction_result"] = audio_result
    codec_report["proxy_transforms"] = transform_notes
    codec_service.write_codec_report(settings, job_id, codec_report)
    return detail


def make_mezzanine(settings: Settings, store: JobStore, job_id: str,
                   profile: str = "prores_proxy") -> Path:
    """Generate a professional editing proxy / mezzanine.

    The proxy-original relationship is recorded so Premiere can relink.
    """
    if profile not in MEZZANINE_PROFILES:
        raise MediaError(f"Unknown mezzanine profile '{profile}'. "
                         f"Available: {', '.join(MEZZANINE_PROFILES)}")
    artifacts = store.artifacts(job_id)
    source = Path(artifacts["managed_original"])
    meta = json.loads(Path(artifacts["metadata_json"]).read_text(encoding="utf-8"))
    ext = ".mov" if profile.startswith("prores") else ".mxf"
    out = settings.paths.media_proxies / f"{job_id}_mezzanine_{profile}{ext}"
    args = ["ffmpeg", "-y", "-i", str(source)]
    args += MEZZANINE_PROFILES[profile]
    if profile.startswith("dnxhr") or profile.startswith("dnxhd"):
        args += ["-c:a", "pcm_s16le"]
    else:
        args += ["-c:a", "pcm_s16le"]
    args.append(str(out))
    run_command(args, timeout=7200)
    expect_output_file(out, f"mezzanine {profile}")
    _verify_proxy(out, float(meta.get("duration_seconds") or 0))
    relink = out.with_suffix(out.suffix + ".relink.json")
    relink.write_text(json.dumps({
        "original": str(source), "mezzanine": str(out), "profile": profile,
        "note": "conform back to the original for final quality when the "
                "original is decodable downstream"}, indent=2), encoding="utf-8")
    store.set_artifact(job_id, f"mezzanine_{profile}", out)
    return out
