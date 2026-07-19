"""Unit tests: caption segmentation, word-safe cuts, protected pauses."""
from __future__ import annotations

import pytest

from services.caption_service import (CaptionStyle, build_cues_from_segments,
                                      build_cues_from_words)
from services.edit_plan_service import _word_safe, build_segments


def _words(text: str, start: float = 0.0, step: float = 0.3) -> list[dict]:
    out = []
    t = start
    for token in text.split():
        out.append({"start": round(t, 3), "end": round(t + step, 3),
                    "word": token, "confidence": 0.9})
        t += step
    return out


def test_cues_respect_line_length():
    style = CaptionStyle(max_chars_per_line=20, max_lines=2)
    cues = build_cues_from_words(
        _words("this is a fairly long sentence that must wrap across cues "
               "because it exceeds the character budget easily"), style)
    assert cues
    for cue in cues:
        for line in cue["text"].split("\n"):
            assert len(line) <= 20


def test_cues_monotonic_and_min_duration():
    style = CaptionStyle(min_cue_seconds=0.7)
    cues = build_cues_from_words(_words("one two three. four five six. seven"), style)
    for i in range(1, len(cues)):
        assert cues[i]["start"] >= cues[i - 1]["end"] - 0.011
    for cue in cues:
        assert cue["end"] - cue["start"] >= 0.3


def test_reading_speed_extends_duration():
    style = CaptionStyle(max_chars_per_second=10)
    cues = build_cues_from_words(_words("supercalifragilistic words galore here",
                                        step=0.05), style)
    for cue in cues:
        chars = len(cue["text"].replace("\n", " "))
        assert (cue["end"] - cue["start"]) >= chars / 10 - 0.011


def test_segment_fallback_when_no_words():
    style = CaptionStyle()
    cues = build_cues_from_segments(
        [{"start": 0, "end": 2, "text": "hello there"},
         {"start": 2, "end": 4, "text": ""}], style)
    assert len(cues) == 1  # empty text dropped


def test_word_safe_cut_detection():
    words = [{"start": 1.0, "end": 1.5, "word": "hello"},
             {"start": 2.0, "end": 2.4, "word": "world"}]
    assert _word_safe(1.6, 1.9, words)          # cut in the gap: safe
    assert not _word_safe(1.2, 1.9, words)      # start inside "hello": unsafe
    assert not _word_safe(1.6, 2.2, words)      # end inside "world": unsafe
    assert not _word_safe(0.9, 2.5, words)      # words swallowed whole: unsafe


def test_build_segments_preserves_chronology_and_min_duration():
    cuts = [{"start": 5.0, "end": 7.0, "action": "remove"},
            {"start": 9.0, "end": 9.4, "action": "flagged"}]
    segments = build_segments(0.0, 12.0, cuts, min_clip_seconds=0.8)
    assert [s["order"] for s in segments] == list(range(len(segments)))
    assert segments[0]["source_in"] == 0.0
    assert segments[0]["source_out"] == 5.0
    assert segments[1]["source_in"] == 7.0   # flagged cut NOT removed
    assert segments[-1]["source_out"] == 12.0
    # Timeline is continuous.
    for i in range(1, len(segments)):
        assert abs(segments[i]["timeline_in"] - segments[i - 1]["timeline_out"]) < 1e-6


def test_build_segments_never_empty():
    segments = build_segments(0.0, 1.0, [{"start": 0.0, "end": 1.0,
                                          "action": "remove", "reason": "x"}],
                              min_clip_seconds=0.8)
    assert segments  # always at least one segment survives


def test_short_fragments_kept_by_skipping_cut():
    # A 0.5s hook fragment before dead air must survive: the cut is skipped,
    # not the speech (Agent G finding 5).
    cuts = [{"start": 0.5, "end": 3.0, "action": "remove", "reason": "dead air"}]
    segments = build_segments(0.0, 10.0, cuts, min_clip_seconds=0.8)
    assert segments[0]["source_in"] == 0.0
    assert segments[-1]["source_out"] == 10.0
    total = sum(s["source_out"] - s["source_in"] for s in segments)
    assert total == pytest.approx(10.0)          # nothing lost
    assert cuts[0]["action"] == "skipped"        # and it's explained


def test_segment_cues_respect_max_lines():
    style = CaptionStyle(max_chars_per_line=20, max_lines=2)
    long_text = "word " * 40
    cues = build_cues_from_segments(
        [{"start": 0.0, "end": 10.0, "text": long_text.strip()}], style)
    assert len(cues) > 1                          # long segment split up
    for cue in cues:
        assert len(cue["text"].split("\n")) <= 2  # never more than max_lines
    assert cues[-1]["end"] <= 10.0 + 1e-6
