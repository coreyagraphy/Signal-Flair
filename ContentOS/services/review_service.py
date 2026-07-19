"""Director review: package generation, ratings, revision flow.

The 'awaiting_review' stage writes a static review package (review.html +
draft copies + notes template). Feedback lands in the database (authoritative)
via the review server or the CLI; finalizing feedback creates a durable
revision request, extracts candidate taste rules, and invalidates only the
affected stages.
"""
from __future__ import annotations

import html
import json
import shutil
from pathlib import Path

from core.config import Settings
from core.job_store import JobStore, new_id
from core.state_machine import STAGES

from . import quality_service, taste_service

RATING_DIMENSIONS = ["hook", "pacing", "clarity", "caption_quality",
                     "visual_interest", "brand_fit", "platform_fit",
                     "audio_quality", "editing_quality", "overall"]


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    """Stage runner for 'awaiting_review'. Also runs draft quality gates."""
    quality = quality_service.run_quality(settings, store, job_id, kind="draft")
    artifacts = store.artifacts(job_id)
    review_dir = settings.paths.data_review / job_id
    review_dir.mkdir(parents=True, exist_ok=True)

    drafts = {}
    for variant in ("horizontal", "vertical"):
        key = f"draft_{variant}"
        if artifacts.get(key) and Path(artifacts[key]).exists():
            dest = review_dir / Path(artifacts[key]).name
            if not dest.exists():
                shutil.copy2(artifacts[key], dest)
            drafts[variant] = dest.name

    template = Path(settings.paths.root) / "review" / "review_template.html"
    page = template.read_text(encoding="utf-8") if template.exists() else "<html><body>{JOB_ID}</body></html>"
    cut_report = ""
    if artifacts.get("cut_report") and Path(artifacts["cut_report"]).exists():
        cut_report = Path(artifacts["cut_report"]).read_text(encoding="utf-8")
    page = (page.replace("{JOB_ID}", html.escape(job_id))
                .replace("{DRAFT_HORIZONTAL}", html.escape(drafts.get("horizontal", "")))
                .replace("{DRAFT_VERTICAL}", html.escape(drafts.get("vertical", "")))
                .replace("{QUALITY_SUMMARY}",
                         html.escape(f"{'PASSED' if quality['passed'] else 'FAILED'} "
                                     f"({quality['critical_failures']} critical failures)"))
                .replace("{CUT_REPORT}", html.escape(cut_report)))
    review_html = review_dir / "review.html"
    review_html.write_text(page, encoding="utf-8")

    review_id = new_id("rev")
    store.conn.execute(
        "INSERT INTO reviews(id, job_id, decision) VALUES (?,?, 'open')",
        (review_id, job_id))
    (review_dir / "notes_template.json").write_text(json.dumps({
        "review_id": review_id,
        "ratings": {dim: None for dim in RATING_DIMENSIONS},
        "notes": [{"timestamp_seconds": 0.0, "end_seconds": None,
                   "note_type": "note|remove|protect|caption|graphic|framing|audio",
                   "text": "example — delete me"}],
        "decision": "approved | revision_requested",
    }, indent=2), encoding="utf-8")

    store.set_artifact(job_id, "review_package", review_html)
    return {"review_id": review_id, "review_dir": str(review_dir),
            "quality_passed": quality["passed"]}


def open_review(store: JobStore, job_id: str) -> str | None:
    row = store.conn.execute(
        "SELECT id FROM reviews WHERE job_id = ? AND decision = 'open'"
        " ORDER BY created_at DESC LIMIT 1", (job_id,)).fetchone()
    return row["id"] if row else None


def add_note(store: JobStore, review_id: str, *, timestamp: float,
             end: float | None, note_type: str, text: str) -> None:
    allowed = {"note", "remove", "protect", "caption", "graphic", "framing", "audio"}
    if note_type not in allowed:
        note_type = "note"
    store.conn.execute(
        "INSERT INTO review_notes(review_id, timestamp_seconds, end_seconds,"
        " note_type, text) VALUES (?,?,?,?,?)",
        (review_id, timestamp, end, note_type, text[:4000]))


def submit_feedback(settings: Settings, store: JobStore, job_id: str, *,
                    ratings: dict | None, decision: str,
                    notes: list[dict] | None = None) -> dict:
    """Finalize feedback: durable review event → revision request → taste rules."""
    review_id = open_review(store, job_id)
    if review_id is None:
        review_id = new_id("rev")
        store.conn.execute(
            "INSERT INTO reviews(id, job_id, decision) VALUES (?,?, 'open')",
            (review_id, job_id))
    for note in notes or []:
        add_note(store, review_id, timestamp=float(note.get("timestamp_seconds") or 0),
                 end=note.get("end_seconds"),
                 note_type=note.get("note_type", "note"),
                 text=str(note.get("text", "")))

    overall = None
    clean_ratings = {}
    for dim in RATING_DIMENSIONS:
        val = (ratings or {}).get(dim)
        if val is not None:
            clean_ratings[dim] = max(1, min(100, int(val)))
    overall = clean_ratings.get("overall")

    decision = decision if decision in ("approved", "revision_requested") else "revision_requested"
    store.conn.execute(
        "UPDATE reviews SET overall_score = ?, ratings_json = ?, decision = ?"
        " WHERE id = ?",
        (overall, json.dumps(clean_ratings), decision, review_id))
    store.add_event(job_id, "review_submitted",
                    {"review_id": review_id, "decision": decision,
                     "overall": overall})

    learned = taste_service.learn_from_review(store, review_id, job_id)

    if decision == "approved":
        store.transition(job_id, "approved")
        return {"review_id": review_id, "decision": decision,
                "taste_rules_learned": learned}

    # Revision: invalidate only affected stages, preserve prior draft.
    note_rows = store.conn.execute(
        "SELECT note_type FROM review_notes WHERE review_id = ?", (review_id,)).fetchall()
    note_types = {r["note_type"] for r in note_rows}
    invalidated = ["draft_rendered", "premiere_prepared", "awaiting_review"]
    if note_types & {"remove", "protect", "framing"}:
        invalidated.insert(0, "edit_planned")
    if "caption" in note_types:
        invalidated.insert(0, "captioned")
    invalidated.sort(key=STAGES.index)

    _preserve_prior_draft(settings, store, job_id)
    rr_id = new_id("rr")
    store.conn.execute(
        "INSERT INTO revision_requests(id, job_id, review_id,"
        " invalidated_stages_json, status) VALUES (?,?,?,?, 'open')",
        (rr_id, job_id, review_id, json.dumps(invalidated)))
    store.transition(job_id, "revision_requested")
    store.transition(job_id, invalidated[0])
    return {"review_id": review_id, "decision": decision,
            "revision_request": rr_id, "invalidated": invalidated,
            "taste_rules_learned": learned}


def _preserve_prior_draft(settings: Settings, store: JobStore, job_id: str) -> None:
    artifacts = store.artifacts(job_id)
    archive = settings.paths.job_dir(job_id) / "prior_drafts"
    archive.mkdir(exist_ok=True)
    for variant in ("horizontal", "vertical"):
        path = artifacts.get(f"draft_{variant}")
        if path and Path(path).exists():
            n = len(list(archive.glob(f"*_{variant}.mp4")))
            shutil.copy2(path, archive / f"rev{n}_{variant}.mp4")
