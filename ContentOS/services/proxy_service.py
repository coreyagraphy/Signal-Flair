"""Analysis proxy + audio extraction stage.

Produces:
  proxy_video   — H.264 720p-max analysis proxy (skips re-encode when the
                  source already fits the analysis profile)
  audio_asr_wav — 16 kHz mono PCM for ASR
  audio_master_wav — 48 kHz PCM master for audio work
"""
from __future__ import annotations

import json
from pathlib import Path

from core.config import Settings
from core.job_store import JobStore
from core.proc import expect_output_file, run_command, which


def _needs_reencode(meta: dict) -> bool:
    if meta.get("video_codec") != "h264":
        return True
    if (meta.get("height") or 9999) > 720:
        return True
    if (meta.get("rotation") or 0) != 0:
        return True
    return False


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    which("ffmpeg")
    artifacts = store.artifacts(job_id)
    source = Path(artifacts["managed_original"])
    meta = json.loads(Path(artifacts["metadata_json"]).read_text(encoding="utf-8"))
    job_dir = settings.paths.job_dir(job_id)

    proxy = settings.paths.media_proxies / f"{job_id}_proxy.mp4"
    if _needs_reencode(meta):
        run_command([
            "ffmpeg", "-y", "-i", str(source),
            "-vf", "scale=-2:'min(720,ih)'",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-ar", "48000", "-b:a", "128k",
            "-movflags", "+faststart",
            str(proxy),
        ], timeout=3600)
    else:
        run_command(["ffmpeg", "-y", "-i", str(source), "-c", "copy",
                     "-movflags", "+faststart", str(proxy)], timeout=600)
    expect_output_file(proxy, "analysis proxy")
    store.set_artifact(job_id, "proxy_video", proxy)

    detail = {"proxy": proxy.name, "reencoded": _needs_reencode(meta)}

    if meta.get("has_audio"):
        asr_wav = settings.paths.media_audio / f"{job_id}_asr16k.wav"
        run_command(["ffmpeg", "-y", "-i", str(source), "-vn",
                     "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(asr_wav)],
                    timeout=1800)
        expect_output_file(asr_wav, "ASR wav")
        store.set_artifact(job_id, "audio_asr_wav", asr_wav)

        master_wav = settings.paths.media_audio / f"{job_id}_master48k.wav"
        run_command(["ffmpeg", "-y", "-i", str(source), "-vn",
                     "-ar", "48000", "-c:a", "pcm_s16le", str(master_wav)],
                    timeout=1800)
        expect_output_file(master_wav, "master wav")
        store.set_artifact(job_id, "audio_master_wav", master_wav)
        detail["audio"] = True
    else:
        # No audio stream: write an explicit silent ASR wav so downstream
        # stages have a real file and the condition is visible, not hidden.
        asr_wav = settings.paths.media_audio / f"{job_id}_asr16k.wav"
        duration = max(0.1, float(meta.get("duration_seconds") or 1.0))
        run_command(["ffmpeg", "-y", "-f", "lavfi",
                     "-i", "anullsrc=channel_layout=mono:sample_rate=16000",
                     "-t", f"{duration:.3f}", "-c:a", "pcm_s16le", str(asr_wav)],
                    timeout=600)
        store.set_artifact(job_id, "audio_asr_wav", asr_wav)
        detail["audio"] = False
    return detail
