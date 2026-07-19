"""Integration: sound placement, audio analysis, Remotion render, resolver."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parent.parent.parent

pytestmark = pytest.mark.skipif(shutil.which("ffmpeg") is None,
                                reason="ffmpeg not installed")


@pytest.fixture()
def sfx_file(tmp_path):
    from core.proc import run_command
    sfx = tmp_path / "riser.wav"
    run_command(["ffmpeg", "-y", "-f", "lavfi", "-i",
                 "sine=frequency=700:sample_rate=48000:duration=0.8",
                 str(sfx)], timeout=120)
    return sfx


def test_audio_analysis_metrics(sfx_file, tmp_path):
    from core.proc import run_command
    from services.audio_analysis_service import analyze_audio
    metrics = analyze_audio(sfx_file)
    assert metrics["analyzed"]
    assert metrics["integrated_lufs"] < 0
    assert metrics["true_peak_db"] < 3
    assert metrics["loop_or_oneshot"] in ("loop", "one_shot")

    # A tone padded with trailing silence classifies as one_shot.
    padded = tmp_path / "oneshot.wav"
    run_command(["ffmpeg", "-y", "-i", str(sfx_file), "-af",
                 "apad=pad_dur=1.5", str(padded)], timeout=120)
    padded_metrics = analyze_audio(padded)
    assert padded_metrics["trailing_silence_seconds"] > 0.5
    assert padded_metrics["loop_or_oneshot"] == "one_shot"


def test_sound_placement_preserves_video_and_duration(settings, synthetic_media,
                                                      sfx_file, tmp_path):
    from services.media_probe_service import probe_media
    from services.sound_placement_service import place_sound
    out = tmp_path / "with_sfx.mp4"
    result = place_sound(settings, draft=synthetic_media, sfx=sfx_file,
                         out_path=out, at_seconds=2.0, sfx_gain_db=-10.0)
    assert result["ducking"] is True
    meta = probe_media(out)
    src = probe_media(synthetic_media)
    assert meta["has_video"] and meta["has_audio"]
    assert abs(meta["duration_seconds"] - src["duration_seconds"]) < 0.5
    # Originals untouched.
    assert synthetic_media.exists() and sfx_file.exists()


def test_resolver_selects_most_complete(tmp_path):
    from core.proc import run_command
    from scripts.resolve_source import describe, find_candidates, select_primary
    root = tmp_path / "VettaRey"
    root.mkdir()
    for name, duration in [("YOU_JUST_TOOK_A_L_full.mp4", 8),
                           ("YOU_JUST_TOOK_A_L_clip.mp4", 3)]:
        run_command(["ffmpeg", "-y", "-f", "lavfi", "-i",
                     f"testsrc2=size=320x180:rate=30:duration={duration}",
                     "-f", "lavfi", "-i",
                     f"sine=frequency=440:sample_rate=48000:duration={duration}",
                     "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
                     "-shortest", str(root / name)], timeout=300)
    (root / "notes.txt").write_text("not a video")

    paths = find_candidates(root, "YOU_JUST_TOOK_A_L")
    assert len(paths) == 2
    described = [describe(p) for p in paths]
    assert all(d["probe_ok"] and d["sha256"] for d in described)
    primary = select_primary(described)
    assert primary["path"].endswith("YOU_JUST_TOOK_A_L_full.mp4")

    # Fuzzy fallback when underscores differ.
    fuzzy = find_candidates(root, "YOU JUST TOOK A L")
    assert len(fuzzy) == 2


@pytest.mark.skipif(
    not (REPO / "remotion" / "node_modules" / "remotion").exists()
    or shutil.which("node") is None,
    reason="remotion dependencies not installed")
def test_remotion_title_reveal_renders_with_alpha(settings, tmp_path,
                                                  monkeypatch):
    import os
    from services.remotion_service import available, render_title_reveal
    # The sandbox settings root has no remotion project — point service at repo.
    monkeypatch.setenv("CONTENTOS_ROOT", str(REPO))
    from core.config import load_settings
    repo_settings = load_settings()
    ok, reason = available(repo_settings)
    assert ok, reason
    browser = "/opt/pw-browsers/chromium"
    if Path(browser).exists():
        monkeypatch.setenv("CONTENTOS_BROWSER_EXECUTABLE", browser)
    out = tmp_path / "title.mov"
    result = render_title_reveal(repo_settings, title="TEST TITLE",
                                 subtitle="sub", out_path=out, timeout=900)
    assert Path(result["output"]).exists()
    assert result["alpha"], result
    assert result["resolution"] == "1920x1080"
    assert 2.5 < result["duration"] < 3.5


def test_remotion_unavailable_is_honest(settings):
    from core.exceptions import ProviderUnavailable
    from services.remotion_service import render_title_reveal
    # Sandbox root has no remotion project → must refuse, never fake.
    with pytest.raises(ProviderUnavailable):
        render_title_reveal(settings, title="X")
