"""Transcription stage: adapter selection, artifact writing, honest fallback.

Adapter order for ``auto``: fixture sidecar (if present) → faster-whisper →
energy fallback. The engine and mode actually used are stored on the
transcript row — a silent downgrade is impossible.
"""
from __future__ import annotations

import json
from pathlib import Path

from adapters.transcription.base import TranscriptionAdapter
from adapters.transcription.energy_adapter import EnergyAdapter
from adapters.transcription.faster_whisper_adapter import FasterWhisperAdapter
from adapters.transcription.fixture_adapter import FixtureAdapter
from core.config import Settings
from core.exceptions import ProviderUnavailable
from core.job_store import JobStore, new_id
from core.logging import get_logger

log = get_logger("contentos.transcribe")


def _srt_time(t: float) -> str:
    ms = int(round(t * 1000))
    h, rem = divmod(ms, 3600_000)
    m, rem = divmod(rem, 60_000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _vtt_time(t: float) -> str:
    return _srt_time(t).replace(",", ".")


def write_srt(segments: list[dict], path: Path) -> None:
    lines = []
    for i, seg in enumerate(segments, start=1):
        lines += [str(i), f"{_srt_time(seg['start'])} --> {_srt_time(seg['end'])}",
                  seg.get("text", "") or "", ""]
    path.write_text("\n".join(lines), encoding="utf-8")


def write_vtt(segments: list[dict], path: Path) -> None:
    lines = ["WEBVTT", ""]
    for seg in segments:
        lines += [f"{_vtt_time(seg['start'])} --> {_vtt_time(seg['end'])}",
                  seg.get("text", "") or "", ""]
    path.write_text("\n".join(lines), encoding="utf-8")


def build_adapters(settings: Settings) -> list[TranscriptionAdapter]:
    choice = settings.transcription_adapter
    whisper = FasterWhisperAdapter(
        model_name=settings.whisper_model, device=settings.whisper_device,
        compute_type=settings.whisper_compute_type,
        cpu_fallback=settings.whisper_cpu_fallback)
    energy = EnergyAdapter(noise_db=settings.silence_noise_floor_db)
    fixture = FixtureAdapter()
    if choice == "faster_whisper":
        return [whisper]
    if choice == "fixture":
        return [fixture]
    if choice == "energy":
        return [energy]
    return [fixture, whisper, energy]  # auto


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    artifacts = store.artifacts(job_id)
    wav = Path(artifacts["audio_asr_wav"])
    job_dir = settings.paths.job_dir(job_id)

    transcript = None
    errors = []
    for adapter in build_adapters(settings):
        try:
            transcript = adapter.transcribe(
                wav, language=settings.whisper_language or None)
            break
        except ProviderUnavailable as exc:
            errors.append(f"{adapter.name}: {exc}")
            continue
    if transcript is None:
        raise ProviderUnavailable(
            "No transcription adapter succeeded: " + " | ".join(errors))

    out_json = job_dir / "transcript.json"
    out_json.write_text(json.dumps(transcript, indent=2, ensure_ascii=False),
                        encoding="utf-8")
    (job_dir / "transcript.txt").write_text(
        "\n".join(s.get("text", "") for s in transcript["segments"]),
        encoding="utf-8")
    write_srt(transcript["segments"], job_dir / "transcript.srt")
    write_vtt(transcript["segments"], job_dir / "transcript.vtt")
    (job_dir / "words.json").write_text(
        json.dumps(transcript.get("words", []), indent=2, ensure_ascii=False),
        encoding="utf-8")

    store.set_artifact(job_id, "transcript_json", out_json)
    store.set_artifact(job_id, "transcript_srt", job_dir / "transcript.srt")
    store.set_artifact(job_id, "transcript_vtt", job_dir / "transcript.vtt")
    store.set_artifact(job_id, "words_json", job_dir / "words.json")

    store.conn.execute(
        "INSERT INTO transcripts(id, job_id, revision, kind, engine, engine_mode,"
        " language, path) VALUES (?,?,0,'raw',?,?,?,?)",
        (new_id("tr"), job_id, transcript["engine"], transcript["engine_mode"],
         transcript.get("language"), str(out_json)))

    detail = {"engine": transcript["engine"], "mode": transcript["engine_mode"],
              "segments": len(transcript["segments"]),
              "words": len(transcript.get("words", [])),
              "flags": transcript.get("flags", [])}
    if errors:
        detail["fallback_chain"] = errors
    log.info("Transcribed job %s with %s (%s)", job_id, transcript["engine"],
             transcript["engine_mode"])
    return detail
