"""Unit tests: clip scoring, taste confidence, idempotency, manifest, mapper."""
from __future__ import annotations

import pytest

from core.exceptions import UnsupportedOperation
from premiere.tool_mapper import ToolMapper
from services.clip_scoring_service import score_candidate
from services.taste_service import (INITIAL_CONFIDENCE, active_rules,
                                    upsert_rule)


def test_hook_question_scores_higher():
    hooky = {"start": 0, "end": 38, "text":
             "Why do most people get this wrong? Here's the answer with 3 steps."}
    flat = {"start": 0, "end": 38, "text":
            "and so we continued the process as I said before it was fine"}
    s1 = score_candidate(hooky, target_seconds=38)
    s2 = score_candidate(flat, target_seconds=38)
    assert s1["score"] > s2["score"]
    assert s1["breakdown"]["hook"] > 0
    assert s2["breakdown"]["standalone"] < 1.0  # context-dependent opening


def test_unsupported_claim_penalized():
    claim = {"start": 0, "end": 38, "text":
             "We guarantee you will be number one, proven instantly."}
    clean = {"start": 0, "end": 38, "text":
             "We measure your visibility and fix what blocks it."}
    assert score_candidate(claim, target_seconds=38)["breakdown"][
        "unsupported_claim_penalty"] > 0
    assert score_candidate(clean, target_seconds=38)["breakdown"][
        "unsupported_claim_penalty"] == 0


def test_length_fit_prefers_target():
    short = {"start": 0, "end": 10, "text": "Quick point made here."}
    target = {"start": 0, "end": 38, "text": "Quick point made here."}
    assert score_candidate(target, target_seconds=38)["breakdown"]["length_fit"] > \
           score_candidate(short, target_seconds=38)["breakdown"]["length_fit"]


def test_taste_confidence_grows_with_evidence(store):
    rule_id = upsert_rule(store, rule_text="Preserve conversational pauses.",
                          polarity="positive")
    rules = {r["id"]: r for r in active_rules(store)}
    assert rules[rule_id]["confidence"] == pytest.approx(INITIAL_CONFIDENCE)
    # Same rule confirmed again → confidence grows, no duplicate row.
    again = upsert_rule(store, rule_text="preserve conversational pauses.",
                        polarity="positive")
    assert again == rule_id
    rules = {r["id"]: r for r in active_rules(store)}
    assert rules[rule_id]["confidence"] > INITIAL_CONFIDENCE
    assert rules[rule_id]["evidence_count"] == 2


def test_publish_idempotency(settings, store):
    asset = store.create_asset(original_path=settings.paths.root / "v.mp4",
                               sha256="f" * 64, size_bytes=10)
    job_id = store.create_job(asset_id=asset)
    store.conn.execute(
        "INSERT INTO publish_plans(id, job_id, platform, media_path,"
        " idempotency_key) VALUES ('p1', ?, 'tiktok', 'x.mp4', 'samekey')",
        (job_id,))
    with pytest.raises(Exception):
        store.conn.execute(
            "INSERT INTO publish_plans(id, job_id, platform, media_path,"
            " idempotency_key) VALUES ('p2', ?, 'tiktok', 'x.mp4', 'samekey')",
            (job_id,))


def test_tool_mapper_refuses_unmapped():
    mapper = ToolMapper({"status": "available",
                         "observed_tools": [{"name": "premiere_import"}],
                         "operation_map": {"import_media": "premiere_import",
                                           "create_bin": "ghost_tool"}})
    assert mapper.resolve("import_media") == "premiere_import"
    with pytest.raises(UnsupportedOperation):
        mapper.resolve("create_sequence")       # unmapped
    with pytest.raises(UnsupportedOperation):
        mapper.resolve("create_bin")            # mapped to unobserved tool


def test_tool_mapper_refuses_when_unavailable():
    mapper = ToolMapper({"status": "unavailable", "reason": "not configured"})
    with pytest.raises(UnsupportedOperation):
        mapper.resolve("health_check")


def test_manifest_schema_rejects_bad_plan(settings):
    from core.exceptions import ValidationFailed
    from premiere.manifest_builder import build_manifest
    good_plan = {
        "source_asset": "/x/video.mp4",
        "segments": [{"source_in": 0, "source_out": 5, "timeline_in": 0,
                      "timeline_out": 5, "order": 0}],
        "variants": [{"name": "vertical", "aspect": "9:16",
                      "width": 1080, "height": 1920}],
    }
    manifest = build_manifest(settings, job_id="job_x", edit_plan=good_plan)
    assert manifest["sequences"][0]["clips"]
    bad_plan = {**good_plan, "variants": []}
    with pytest.raises(ValidationFailed):
        build_manifest(settings, job_id="job_x", edit_plan=bad_plan)
