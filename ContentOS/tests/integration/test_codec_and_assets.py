"""Integration: codec compatibility service + asset library (addendum)."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import pytest

pytestmark = pytest.mark.skipif(shutil.which("ffmpeg") is None,
                                reason="ffmpeg not installed")


# ---- capability inventory -------------------------------------------------
def test_capability_inventory(settings):
    from services import capability_service
    caps = capability_service.collect_capabilities()
    assert caps["demuxers"] and caps["video_decoders"] and caps["audio_decoders"]
    assert "h264" in caps["video_decoders"]
    families = capability_service.family_support(caps)
    assert families["H.264/AVC"]["supported"]
    # Vendor-SDK formats are honestly unsupported without an SDK.
    assert not families["Blackmagic RAW"]["supported"]
    json_path, report = capability_service.write_reports(settings, caps)
    assert json_path.exists() and report.exists()
    assert "Blackmagic RAW" in report.read_text(encoding="utf-8")


# ---- codec verification ---------------------------------------------------
def test_full_probe_all_streams(synthetic_media):
    from services.codec_service import full_probe, select_streams
    probe = full_probe(synthetic_media)
    assert probe["video_streams"] and probe["audio_streams"]
    v = probe["video_streams"][0]
    assert v["codec"] == "h264"
    assert v["bit_depth"] == 8
    assert v["chroma_subsampling"] == "4:2:0"
    sel = select_streams(probe)
    assert sel["video"]["index"] == v["index"]


def test_verify_source_passes_good_media(settings, synthetic_media):
    from services.codec_service import verify_source
    report = verify_source(settings, synthetic_media)
    assert report["status"] in ("codec_verified",
                                "codec_verified_software_fallback")
    ladder = report["decoder_ladder"]
    assert ladder and ladder[-1]["samples_ok"] == ladder[-1]["samples"]


def test_verify_source_differentiates_failures(settings, tmp_path):
    from core.exceptions import MediaError
    from services.codec_service import full_probe

    empty = tmp_path / "empty.mp4"
    empty.write_bytes(b"")
    with pytest.raises(MediaError) as exc:
        full_probe(empty)
    assert exc.value.code == "zero_byte_file"

    junk = tmp_path / "junk.mp4"
    junk.write_bytes(b"\x00" * 4096)
    with pytest.raises(MediaError) as exc:
        full_probe(junk)
    assert exc.value.code in ("corrupt_container", "missing_moov_atom")


def test_truncated_mp4_reports_moov(settings, synthetic_media, tmp_path):
    from core.exceptions import MediaError
    from services.codec_service import full_probe
    data = synthetic_media.read_bytes()
    truncated = tmp_path / "truncated.mp4"
    truncated.write_bytes(data[: len(data) // 20])
    with pytest.raises(MediaError) as exc:
        full_probe(truncated)
    assert exc.value.code in ("missing_moov_atom", "corrupt_container")


def test_prores_and_dnxhr_decode(settings, tmp_path):
    """Professional intermediates the installed build can generate must
    codec-verify through the ladder."""
    from core.proc import run_command
    from services.codec_service import verify_source
    for label, args, ext in [
        ("prores", ["-c:v", "prores_ks", "-profile:v", "1",
                    "-pix_fmt", "yuv422p10le"], ".mov"),
        ("dnxhr", ["-c:v", "dnxhd", "-profile:v", "dnxhr_lb",
                   "-pix_fmt", "yuv422p"], ".mov"),
    ]:
        out = tmp_path / f"sample_{label}{ext}"
        run_command(["ffmpeg", "-y", "-f", "lavfi", "-i",
                     "testsrc2=size=640x360:rate=30:duration=6",
                     "-f", "lavfi", "-i",
                     "sine=frequency=440:sample_rate=48000:duration=6",
                     *args, "-c:a", "pcm_s16le", "-shortest", str(out)],
                    timeout=300)
        report = verify_source(settings, out)
        assert report["status"].startswith("codec_verified"), (label, report)


def test_mezzanine_generation(settings, store, synthetic_media):
    from services import ingest_service, media_probe_service
    from services.proxy_service import make_mezzanine
    inbox = settings.paths.input_inbox / synthetic_media.name
    shutil.copy2(synthetic_media, inbox)
    job_id = ingest_service.ingest_file(settings, store, inbox, wait_stable=False)
    from core import pipeline
    from services import stage_registry
    stage_registry.register_all()
    pipeline.advance(settings, store, job_id, target="analyzed")
    out = make_mezzanine(settings, store, job_id, profile="dnxhr_lb")
    assert out.exists()
    relink = json.loads((out.parent / (out.name + ".relink.json")).read_text())
    assert relink["original"].endswith(".mp4")


# ---- asset library --------------------------------------------------------
@pytest.fixture()
def asset_folder(tmp_path, synthetic_media):
    from core.proc import run_command
    lib = tmp_path / "FourEditorsTest"
    (lib / "SFX").mkdir(parents=True)
    (lib / "LUTs").mkdir()
    (lib / "Templates").mkdir()
    (lib / "Overlays").mkdir()
    run_command(["ffmpeg", "-y", "-f", "lavfi", "-i",
                 "sine=frequency=800:sample_rate=48000:duration=1",
                 str(lib / "SFX" / "whoosh_01.wav")], timeout=120)
    (lib / "LUTs" / "cinematic.cube").write_text(
        "TITLE \"test\"\nLUT_3D_SIZE 2\n0 0 0\n1 0 0\n0 1 0\n1 1 0\n"
        "0 0 1\n1 0 1\n0 1 1\n1 1 1\n", encoding="utf-8")
    (lib / "Templates" / "title_pack.mogrt").write_bytes(b"PK\x03\x04fake")
    shutil.copy2(synthetic_media, lib / "Overlays" / "grain_overlay.mp4")
    return lib


def test_asset_scan_classify_and_report(settings, store, asset_folder):
    from services import asset_library_service as als
    lib_id = als.register_library(settings, store, asset_folder)
    assert als.register_library(settings, store, asset_folder) == lib_id  # idempotent
    totals = als.scan(settings, store, library_id=lib_id)
    assert totals["scanned"] == 4
    assert totals["by_type"].get("sound_effect") == 1
    assert totals["by_type"].get("lut") == 1
    assert totals["by_type"].get("mogrt") == 1

    assets = {a["filename"]: a for a in als.list_assets(store)}
    assert assets["cinematic.cube"]["lut_size"] == 2
    assert assets["title_pack.mogrt"]["routing"] == "premiere"
    assert assets["title_pack.mogrt"]["app_dependency"].startswith("Adobe Premiere")
    assert assets["whoosh_01.wav"]["routing"] == "direct"
    assert assets["whoosh_01.wav"]["duration_seconds"] == pytest.approx(1.0, abs=0.2)
    assert assets["whoosh_01.wav"]["availability"] == "local"
    # Audio preview (waveform) generated.
    assert assets["whoosh_01.wav"]["preview_path"]
    assert Path(assets["whoosh_01.wav"]["preview_path"]).exists()

    report = als.write_report(settings, store, library_id=lib_id)
    text = report.read_text(encoding="utf-8")
    assert "Requires Premiere Pro: 1" in text
    assert "sound_effect" in text

    # Rescan is idempotent (upsert, no duplicate rows).
    als.scan(settings, store, library_id=lib_id)
    assert len(als.list_assets(store)) == 4


def test_asset_selection_conservative(settings, store, asset_folder):
    from services import asset_library_service as als
    lib_id = als.register_library(settings, store, asset_folder)
    als.scan(settings, store, library_id=lib_id)
    picks = als.select_assets(store, asset_type="sound_effect",
                              keywords=["whoosh"])
    assert len(picks) == 1
    assert picks[0]["requires_owner_approval"]
    assert "whoosh" in picks[0]["selection_reason"]
    # Premiere-dependent assets are never auto-selected.
    assert als.select_assets(store, asset_type="mogrt") == []


def test_seek_noise_tolerated_but_corruption_still_fails(settings, tmp_path):
    """MPEG-PS byte-seek audio resync noise is benign; real mid-file video
    corruption must still fail verification."""
    from core.proc import run_command
    from services.codec_service import verify_source
    mpg = tmp_path / "clean.mpg"
    run_command(["ffmpeg", "-y", "-f", "lavfi", "-i",
                 "testsrc2=size=640x360:rate=30:duration=8",
                 "-f", "lavfi", "-i",
                 "sine=frequency=440:sample_rate=48000:duration=8",
                 "-c:v", "mpeg2video", "-q:v", "5", "-c:a", "mp2",
                 "-shortest", str(mpg)], timeout=300)
    clean = verify_source(settings, mpg)
    assert clean["status"].startswith("codec_verified")

    # Corrupt a large chunk in the middle of the video data.
    data = bytearray(mpg.read_bytes())
    mid = len(data) // 2
    data[mid: mid + 120_000] = b"\xde\xad" * 60_000
    bad = tmp_path / "corrupt_mid.mpg"
    bad.write_bytes(bytes(data))
    damaged = verify_source(settings, bad)
    assert not damaged["status"].startswith("codec_verified"), damaged["status"]
