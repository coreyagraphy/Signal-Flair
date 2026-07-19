"""Taste Database: durable preferences with confidence and repeat evidence.

One comment is a low-confidence candidate rule (0.3). Confidence grows only
when later reviews repeat the theme; rules become 'active' for retrieval at
>= 0.3 but are weighted by confidence downstream. Nothing becomes permanent
universal taste from a single remark.
"""
from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone

from core.job_store import JobStore, new_id

# Heuristic extraction: note keywords -> candidate rule text.
_PATTERNS: list[tuple[str, str, str]] = [
    (r"\b(too many|too much)\b.*\bcut", "Use fewer cuts; preserve natural flow.", "negative"),
    (r"\bcaption", "Caption treatment needs adjusting per review notes.", "negative"),
    (r"\b(pause|breath)", "Preserve conversational pauses.", "positive"),
    (r"\bhook\b.*\b(weak|slow|boring)", "Open with stronger movement in the first seconds.", "negative"),
    (r"\b(zoom|punch[- ]?in)", "Use fewer generic zoom punches.", "negative"),
    (r"\bmusic\b.*\b(loud|distract)", "Keep music lower under speech.", "negative"),
    (r"\b(fake urgency|salesy|cheesy)", "Do not use fake urgency or cheesy elements.", "negative"),
    (r"\btext\b.*\b(small|tiny)", "Keep on-screen text large enough for mobile.", "negative"),
]

INITIAL_CONFIDENCE = 0.3
CONFIRM_INCREMENT = 0.2
MAX_CONFIDENCE = 0.95
REVIEW_AFTER_DAYS = 90


def active_rules(store: JobStore, *, format_id: str | None = None,
                 platform: str | None = None) -> list[dict]:
    rows = store.conn.execute(
        "SELECT * FROM taste_rules WHERE active = 1"
        " AND (format_id IS NULL OR format_id = ?)"
        " AND (platform IS NULL OR platform = ?)"
        " ORDER BY confidence DESC",
        (format_id, platform)).fetchall()
    return [dict(r) for r in rows]


def upsert_rule(store: JobStore, *, rule_text: str, polarity: str,
                source_review_id: str | None = None,
                format_id: str | None = None, platform: str | None = None) -> str:
    now = datetime.now(timezone.utc)
    review_after = (now + timedelta(days=REVIEW_AFTER_DAYS)).isoformat()
    existing = store.conn.execute(
        "SELECT id, confidence, evidence_count FROM taste_rules"
        " WHERE lower(rule_text) = lower(?)", (rule_text,)).fetchone()
    if existing:
        new_conf = min(MAX_CONFIDENCE, existing["confidence"] + CONFIRM_INCREMENT)
        store.conn.execute(
            "UPDATE taste_rules SET confidence = ?, evidence_count = evidence_count + 1,"
            " last_confirmed_at = ?, review_after = ?, active = 1 WHERE id = ?",
            (new_conf, now.isoformat(), review_after, existing["id"]))
        return existing["id"]
    rule_id = new_id("taste")
    store.conn.execute(
        "INSERT INTO taste_rules(id, rule_text, scope, format_id, platform, polarity,"
        " confidence, evidence_count, source_review_id, review_after)"
        " VALUES (?,?,?,?,?,?,?,1,?,?)",
        (rule_id, rule_text, "global", format_id, platform, polarity,
         INITIAL_CONFIDENCE, source_review_id, review_after))
    return rule_id


def learn_from_review(store: JobStore, review_id: str, job_id: str) -> list[str]:
    """Extract candidate taste rules from review notes. Returns rule ids."""
    job = store.get_job(job_id)
    format_id = job["format_id"] if job else None
    notes = store.conn.execute(
        "SELECT text FROM review_notes WHERE review_id = ?", (review_id,)).fetchall()
    learned = []
    for note in notes:
        text = (note["text"] or "").lower()
        for pattern, rule_text, polarity in _PATTERNS:
            if re.search(pattern, text):
                learned.append(upsert_rule(store, rule_text=rule_text,
                                           polarity=polarity,
                                           source_review_id=review_id,
                                           format_id=format_id))
    return learned


def autopilot_eligible(store: JobStore, format_id: str, *, min_score: int,
                       approval_count: int) -> tuple[bool, list[str]]:
    """Explainable autopilot eligibility (mandate section 24)."""
    reasons = []
    rows = store.conn.execute(
        "SELECT r.overall_score FROM reviews r JOIN jobs j ON j.id = r.job_id"
        " WHERE j.format_id = ? AND r.decision = 'approved'"
        " AND r.overall_score IS NOT NULL ORDER BY r.created_at DESC LIMIT ?",
        (format_id, approval_count)).fetchall()
    if len(rows) < approval_count:
        reasons.append(f"only {len(rows)}/{approval_count} scored approvals")
    elif rows:
        avg = sum(r["overall_score"] for r in rows) / len(rows)
        if avg < min_score:
            reasons.append(f"recent average {avg:.1f} < required {min_score}")
    open_critical = store.conn.execute(
        "SELECT COUNT(*) AS c FROM reviews r JOIN jobs j ON j.id = r.job_id"
        " WHERE j.format_id = ? AND r.decision = 'open'", (format_id,)).fetchone()
    if open_critical["c"]:
        reasons.append(f"{open_critical['c']} unresolved review(s)")
    failed_gates = store.conn.execute(
        "SELECT COUNT(*) AS c FROM quality_reports q JOIN jobs j ON j.id = q.job_id"
        " WHERE j.format_id = ? AND q.passed = 0"
        " AND q.created_at > datetime('now', '-30 days')", (format_id,)).fetchone()
    if failed_gates["c"]:
        reasons.append(f"{failed_gates['c']} failed quality gate(s) in last 30 days")
    return (not reasons, reasons)
