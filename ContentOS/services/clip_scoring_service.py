"""Clip candidate detection and scoring (mandate section 15).

Builds contiguous candidate windows from transcript segments and scores them
across explainable dimensions. Scoring is deterministic and heuristic —
each dimension is recorded in the breakdown so a human (or an LLM pass)
can audit why a clip won. Never selects on loudness alone.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from core.config import Settings
from core.job_store import JobStore, new_id

HOOK_PATTERNS = [
    r"^(how|why|what|when|where|who)\b", r"\?$", r"^\d", r"\bnobody\b",
    r"\bsecret\b", r"\bmistake\b", r"\bstop\b", r"\bnever\b", r"\balways\b",
    r"\bhere'?s\b", r"\bthe truth\b", r"\bmost people\b",
]
SPECIFICITY_PATTERN = re.compile(r"\b\d[\d,.%$]*\b")
UNSUPPORTED_CLAIM = re.compile(
    r"\b(guarantee[ds]?|proven|#1|number one|best in the world|instantly)\b",
    re.IGNORECASE)


def _window_candidates(segments: list[dict], *, min_seconds: float,
                       max_seconds: float) -> list[dict]:
    """Contiguous windows of consecutive segments within duration bounds."""
    candidates = []
    n = len(segments)
    for i in range(n):
        text_parts, start = [], segments[i]["start"]
        for j in range(i, n):
            text_parts.append(segments[j].get("text", ""))
            end = segments[j]["end"]
            duration = end - start
            if duration > max_seconds:
                break
            if duration >= min_seconds:
                candidates.append({
                    "start": start, "end": end,
                    "text": " ".join(p for p in text_parts if p).strip(),
                    "first_segment": i, "last_segment": j,
                })
    return candidates


def score_candidate(candidate: dict, *, target_seconds: float,
                    avg_confidence: float = 1.0) -> dict:
    text = candidate["text"]
    duration = candidate["end"] - candidate["start"]
    first_sentence = re.split(r"(?<=[.!?])\s+", text, maxsplit=1)[0].lower()

    hook = min(1.0, sum(0.35 for p in HOOK_PATTERNS
                        if re.search(p, first_sentence, re.IGNORECASE)))
    words = text.split()
    clarity = 1.0 if len(words) >= 12 else len(words) / 12
    # Standalone meaning: penalize openings that depend on prior context.
    context_dependent = bool(re.match(
        r"^(so|and|but|because|which|that'?s why|as i said|like i said)\b",
        first_sentence))
    standalone = 0.3 if context_dependent else 1.0
    payoff = 1.0 if re.search(r"[.!?]$", text.strip()) else 0.5
    specificity = min(1.0, len(SPECIFICITY_PATTERN.findall(text)) * 0.4)
    quotability = min(1.0, sum(1 for s in re.split(r"(?<=[.!?])\s+", text)
                               if 4 <= len(s.split()) <= 14) * 0.25)
    length_fit = max(0.0, 1.0 - abs(duration - target_seconds) / target_seconds)
    transcript_confidence = max(0.0, min(1.0, avg_confidence))
    unsupported_penalty = 0.3 if UNSUPPORTED_CLAIM.search(text) else 0.0

    weights = {
        "hook": 0.22, "clarity": 0.12, "standalone": 0.16, "payoff": 0.12,
        "specificity": 0.10, "quotability": 0.08, "length_fit": 0.14,
        "transcript_confidence": 0.06,
    }
    dims = {"hook": hook, "clarity": clarity, "standalone": standalone,
            "payoff": payoff, "specificity": specificity,
            "quotability": quotability, "length_fit": length_fit,
            "transcript_confidence": transcript_confidence}
    score = sum(dims[k] * w for k, w in weights.items()) - unsupported_penalty
    return {"score": round(max(0.0, score) * 100, 1),
            "breakdown": {**{k: round(v, 3) for k, v in dims.items()},
                          "unsupported_claim_penalty": unsupported_penalty}}


def _dedupe_overlaps(scored: list[dict], max_keep: int = 8) -> list[dict]:
    """Keep best-scoring candidates, dropping heavy overlaps (duplicate penalty)."""
    kept: list[dict] = []
    for cand in sorted(scored, key=lambda c: c["score"], reverse=True):
        overlap = False
        for k in kept:
            inter = min(cand["end"], k["end"]) - max(cand["start"], k["start"])
            union = max(cand["end"], k["end"]) - min(cand["start"], k["start"])
            if union > 0 and inter / union > 0.5:
                overlap = True
                break
        if not overlap:
            kept.append(cand)
        if len(kept) >= max_keep:
            break
    return kept


def load_format(settings: Settings, format_id: str) -> dict:
    path = settings.paths.formats / f"{format_id}.json"
    return json.loads(path.read_text(encoding="utf-8"))


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    artifacts = store.artifacts(job_id)
    source = artifacts.get("transcript_clean_json") or artifacts["transcript_json"]
    transcript = json.loads(Path(source).read_text(encoding="utf-8"))
    job = store.get_job(job_id)
    fmt = load_format(settings, job["format_id"])

    min_s = fmt.get("min_duration_seconds", 20)
    max_s = fmt.get("max_duration_seconds", 60)
    target_s = fmt.get("target_duration_seconds", (min_s + max_s) / 2)
    no_speech = "no_speech_recognition" in transcript.get("flags", [])

    segments = [s for s in transcript.get("segments", []) if s["end"] > s["start"]]
    raw_candidates = _window_candidates(segments, min_seconds=min_s, max_seconds=max_s)

    if not raw_candidates and segments:
        # Source shorter than the format minimum: whole voiced range is the candidate.
        raw_candidates = [{"start": segments[0]["start"], "end": segments[-1]["end"],
                           "text": " ".join(s.get("text", "") for s in segments).strip(),
                           "first_segment": 0, "last_segment": len(segments) - 1}]

    scored = []
    for cand in raw_candidates:
        seg_conf = [s.get("confidence", 1.0) for s in
                    segments[cand["first_segment"]: cand["last_segment"] + 1]]
        avg_conf = sum(seg_conf) / len(seg_conf) if seg_conf else 1.0
        result = score_candidate(cand, target_seconds=target_s,
                                 avg_confidence=1.0 if no_speech else avg_conf)
        scored.append({**cand, **result})

    kept = _dedupe_overlaps(scored)
    for rank, cand in enumerate(kept):
        cand["id"] = new_id("clip")
        cand["selected"] = rank == 0
        cand["platform"] = fmt.get("platforms", ["youtube_short"])[0]
        cand["hook"] = re.split(r"(?<=[.!?])\s+", cand["text"], maxsplit=1)[0][:200]
        cand["target_duration"] = target_s
        if no_speech:
            cand["flags"] = ["scored_without_speech_text"]
        store.conn.execute(
            "INSERT INTO clip_candidates(id, job_id, start_seconds, end_seconds,"
            " platform, score, score_breakdown_json, transcript_text, hook, selected)"
            " VALUES (?,?,?,?,?,?,?,?,?,?)",
            (cand["id"], job_id, cand["start"], cand["end"], cand["platform"],
             cand["score"], json.dumps(cand["breakdown"]), cand["text"][:4000],
             cand["hook"], int(cand["selected"])))

    job_dir = settings.paths.job_dir(job_id)
    out = job_dir / "clip_candidates.json"
    out.write_text(json.dumps({"format": job["format_id"], "no_speech": no_speech,
                               "candidates": kept}, indent=2, ensure_ascii=False),
                   encoding="utf-8")
    store.set_artifact(job_id, "clip_candidates", out)
    return {"candidates": len(kept),
            "best_score": kept[0]["score"] if kept else None}
