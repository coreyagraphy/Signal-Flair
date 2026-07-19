"""Integration: real ffprobe/ffmpeg over synthetic media, captions, research."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import pytest

from services import media_probe_service

pytestmark = pytest.mark.skipif(shutil.which("ffmpeg") is None,
                                reason="ffmpeg not installed")


def test_probe_synthetic_media(synthetic_media):
    meta = media_probe_service.probe_media(synthetic_media)
    assert meta["has_video"] and meta["has_audio"]
    assert meta["width"] == 1280 and meta["height"] == 720
    assert 48 <= meta["duration_seconds"] <= 52
    assert meta["video_codec"] == "h264"


def test_probe_rejects_garbage(tmp_path):
    from core.exceptions import MediaError, SubprocessFailed
    junk = tmp_path / "junk.mp4"
    junk.write_bytes(b"not a video at all")
    with pytest.raises((MediaError, SubprocessFailed)):
        media_probe_service.probe_media(junk)


def test_silence_detection(synthetic_media, tmp_path):
    from adapters.transcription.energy_adapter import detect_silences
    from core.proc import run_command
    wav = tmp_path / "audio.wav"
    run_command(["ffmpeg", "-y", "-i", str(synthetic_media), "-vn", "-ac", "1",
                 "-ar", "16000", "-c:a", "pcm_s16le", str(wav)], timeout=300)
    silences, duration = detect_silences(wav, noise_db=-35.0,
                                         min_silence_seconds=0.5)
    assert duration > 45
    # The fixture has known gaps at ~12-14.5s and ~30-33s.
    assert any(s <= 13.0 <= e for s, e in silences)
    assert any(s <= 31.5 <= e for s, e in silences)


def test_fixture_transcription_adapter(synthetic_media, tmp_path):
    from adapters.transcription.fixture_adapter import FixtureAdapter
    wav = tmp_path / "synthetic_talking_head_asr16k.wav"
    wav.write_bytes(b"RIFF")  # adapter only needs the path for sidecar lookup
    shutil.copy2(synthetic_media.with_name("synthetic_talking_head.transcript.json"),
                 tmp_path / "synthetic_talking_head.transcript.json")
    result = FixtureAdapter().transcribe(wav)
    assert result["engine"] == "fixture"
    assert len(result["segments"]) == 10
    assert result["words"]


def test_research_local_docs(settings, store):
    from services.research_service import research
    docs = settings.paths.knowledge / "research"
    docs.mkdir(parents=True, exist_ok=True)
    (docs / "ai_search.md").write_text(
        "# AI search visibility\n\nLocal businesses are invisible to AI engines "
        "because their entity data is unclear.\n\nStructure beats keywords.",
        encoding="utf-8")
    evidence = research(settings, store, "ai search visibility", use_cache=False)
    assert evidence
    assert evidence[0].provider == "local_docs"
    assert evidence[0].content_sha256
    # Cached second run returns the same evidence.
    cached = research(settings, store, "ai search visibility")
    assert cached[0].evidence == evidence[0].evidence
    row = store.conn.execute("SELECT COUNT(*) AS c FROM research_sources").fetchone()
    assert row["c"] >= 1


def test_caption_outputs_parse(settings, store, synthetic_media, tmp_path):
    """SRT written by the caption engine must be well-formed."""
    from services.transcription_service import write_srt
    segs = [{"start": 0.0, "end": 1.5, "text": "It's a \"test\" & more"},
            {"start": 1.5, "end": 3.0, "text": "línea unicode ✓"}]
    srt = tmp_path / "t.srt"
    write_srt(segs, srt)
    content = srt.read_text(encoding="utf-8")
    assert "00:00:00,000 --> 00:00:01,500" in content
    assert "línea unicode ✓" in content
