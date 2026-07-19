"""Edit-plan engine with conservative dead-air analysis (mandate 14 & 16).

Silence removal philosophy: preserve natural pauses; remove only clearly
excessive dead air, with padding handles, never cutting inside a word, and
every cut explained in a cut report with confidence and evidence.
"""
from __future__ import annotations

import json
from pathlib import Path

from adapters.transcription.energy_adapter import detect_silences
from core.config import Settings
from core.job_store import JobStore, new_id
from core.validation import validate_artifact


def _protected_ranges(store: JobStore, job_id: str) -> list[tuple[float, float]]:
    """Ranges protected from cuts by reviewer notes (note_type='protect')."""
    rows = store.conn.execute(
        "SELECT rn.timestamp_seconds, rn.end_seconds FROM review_notes rn"
        " JOIN reviews r ON r.id = rn.review_id"
        " WHERE r.job_id = ? AND rn.note_type = 'protect'", (job_id,)).fetchall()
    return [(r["timestamp_seconds"] or 0.0, r["end_seconds"] or (r["timestamp_seconds"] or 0.0) + 1.0)
            for r in rows]


def _word_safe(cut_start: float, cut_end: float, words: list[dict],
               pad: float = 0.05) -> bool:
    """A cut is word-safe when no word straddles either cut boundary."""
    for w in words:
        ws, we = w.get("start", 0), w.get("end", 0)
        if ws - pad < cut_start < we + pad:
            return False
        if ws - pad < cut_end < we + pad:
            return False
    return True


def analyze_cuts(settings: Settings, *, wav_path: Path, clip_start: float,
                 clip_end: float, words: list[dict],
                 protected: list[tuple[float, float]],
                 sentence_ends: list[float]) -> list[dict]:
    """Return removable dead-air cuts inside [clip_start, clip_end]."""
    min_sil = settings.minimum_removable_silence_ms / 1000
    pre_pad = settings.pre_cut_padding_ms / 1000
    post_pad = settings.post_cut_padding_ms / 1000
    min_gap = settings.minimum_gap_between_cuts_ms / 1000

    silences, _dur = detect_silences(
        wav_path, noise_db=settings.silence_noise_floor_db,
        min_silence_seconds=max(0.3, min_sil / 2))

    cuts: list[dict] = []
    last_cut_end = -1e9
    for s_start, s_end in silences:
        s_start, s_end = max(s_start, clip_start), min(s_end, clip_end)
        length = s_end - s_start
        if length < min_sil:
            continue  # a natural pause — keep it
        cut_start = s_start + pre_pad
        cut_end = s_end - post_pad
        if cut_end - cut_start < 0.2:
            continue
        reasons, confidence = [f"dead air {length:.2f}s ≥ {min_sil:.2f}s"], 0.8

        if cut_start - last_cut_end < min_gap:
            continue  # avoid machine-gun cuts
        conflict = next(((ps, pe) for ps, pe in protected
                         if cut_start < pe and cut_end > ps), None)
        if conflict:
            cuts.append({"start": round(cut_start, 3), "end": round(cut_end, 3),
                         "action": "flagged", "reason": "protected range conflict",
                         "confidence": 0.0, "protected_conflict": list(conflict)})
            continue
        if settings.protect_sentence_endings and any(
                abs(s_start - se) < 0.4 for se in sentence_ends):
            # A pause right after a sentence ends is usually intentional.
            keep = settings.maximum_natural_pause_ms / 1000
            if length < min_sil + keep:
                continue
            cut_start = s_start + keep
            reasons.append("kept post-sentence beat")
            confidence = 0.6
        if words and not _word_safe(cut_start, cut_end, words):
            cuts.append({"start": round(cut_start, 3), "end": round(cut_end, 3),
                         "action": "flagged", "reason": "cut would land inside a word",
                         "confidence": 0.0})
            continue
        cuts.append({"start": round(cut_start, 3), "end": round(cut_end, 3),
                     "action": "remove", "reason": "; ".join(reasons),
                     "confidence": confidence,
                     "audio_evidence": {"silence_start": round(s_start, 3),
                                        "silence_end": round(s_end, 3)}})
        last_cut_end = cut_end
    return cuts


def build_segments(clip_start: float, clip_end: float, cuts: list[dict],
                   min_clip_seconds: float) -> list[dict]:
    """Timeline segments = clip range minus removed cuts, chronological order."""
    removals = sorted([c for c in cuts if c["action"] == "remove"],
                      key=lambda c: c["start"])
    segments = []
    cursor = clip_start
    for cut in removals:
        if cut["start"] - cursor >= min_clip_seconds:
            segments.append({"source_in": round(cursor, 3),
                             "source_out": round(cut["start"], 3)})
        cursor = max(cursor, cut["end"])
    if clip_end - cursor >= min_clip_seconds or not segments:
        segments.append({"source_in": round(cursor, 3),
                         "source_out": round(clip_end, 3)})
    timeline = 0.0
    for i, seg in enumerate(segments):
        seg["order"] = i
        seg["timeline_in"] = round(timeline, 3)
        timeline += seg["source_out"] - seg["source_in"]
        seg["timeline_out"] = round(timeline, 3)
        seg["reorder_reason"] = None  # chronology preserved (mandate section 16)
    return segments


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    artifacts = store.artifacts(job_id)
    candidates = json.loads(Path(artifacts["clip_candidates"]).read_text(encoding="utf-8"))
    selected = next((c for c in candidates["candidates"] if c.get("selected")), None)
    if selected is None:
        selected = candidates["candidates"][0] if candidates["candidates"] else None
    if selected is None:
        raise ValueError("No clip candidates available to plan")

    transcript_path = artifacts.get("transcript_clean_json") or artifacts["transcript_json"]
    transcript = json.loads(Path(transcript_path).read_text(encoding="utf-8"))
    words = [w for w in transcript.get("words", [])
             if selected["start"] <= w.get("start", 0) <= selected["end"]]
    sentence_ends = [s["end"] for s in transcript.get("segments", [])
                     if (s.get("text") or "").rstrip().endswith((".", "!", "?"))]

    wav = Path(artifacts.get("audio_master_wav") or artifacts["audio_asr_wav"])
    protected = _protected_ranges(store, job_id)
    cuts = analyze_cuts(settings, wav_path=wav, clip_start=selected["start"],
                        clip_end=selected["end"], words=words,
                        protected=protected, sentence_ends=sentence_ends)
    segments = build_segments(selected["start"], selected["end"], cuts,
                              settings.minimum_clip_duration_ms / 1000)

    job = store.get_job(job_id)
    plan = {
        "plan_id": new_id("plan"),
        "job_id": job_id,
        "format_id": job["format_id"],
        "revision": 0,
        "source_asset": artifacts["managed_original"],
        "clip": {"start": selected["start"], "end": selected["end"],
                 "candidate_id": selected.get("id"), "score": selected.get("score")},
        "segments": segments,
        "cuts": cuts,
        "captions": {"srt": artifacts.get("captions_srt"),
                     "vtt": artifacts.get("captions_vtt"),
                     "burn_in": True},
        "audio": {"normalize": True, "target_lufs": -16.0, "true_peak_db": -1.5},
        "variants": [
            {"name": "horizontal", "aspect": "16:9", "width": 1920, "height": 1080},
            {"name": "vertical", "aspect": "9:16", "width": 1080, "height": 1920,
             "reframe": "center_crop"},
        ],
        "broll_placeholders": [],
        "markers": [{"time": 0.0, "label": "hook", "note": selected.get("hook", "")}],
        "notes": ["Chronology preserved; no reordering.",
                  f"{sum(1 for c in cuts if c['action'] == 'remove')} dead-air cuts, "
                  f"{sum(1 for c in cuts if c['action'] == 'flagged')} flagged for review."],
    }
    validate_artifact(plan, "edit_plan.schema.json", settings.paths)

    job_dir = settings.paths.job_dir(job_id)
    out = job_dir / "edit_plan.json"
    out.write_text(json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8")

    report = job_dir / "cut_report.md"
    lines = [f"# Cut report — {job_id}", "",
             f"Clip: {selected['start']:.2f}s → {selected['end']:.2f}s", ""]
    for cut in cuts:
        lines.append(f"- [{cut['action']}] {cut['start']:.2f}–{cut['end']:.2f}s — "
                     f"{cut['reason']} (confidence {cut['confidence']:.2f})")
    if not cuts:
        lines.append("_No removable dead air found — nothing cut._")
    report.write_text("\n".join(lines) + "\n", encoding="utf-8")

    store.set_artifact(job_id, "edit_plan", out)
    store.set_artifact(job_id, "cut_report", report)
    store.conn.execute(
        "INSERT INTO edit_plans(id, job_id, revision, path) VALUES (?,?,0,?)",
        (plan["plan_id"], job_id, str(out)))
    return {"segments": len(segments),
            "cuts_removed": sum(1 for c in cuts if c["action"] == "remove"),
            "cuts_flagged": sum(1 for c in cuts if c["action"] == "flagged")}
