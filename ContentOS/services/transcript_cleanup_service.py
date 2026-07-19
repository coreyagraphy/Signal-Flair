"""Transcript cleanup: editorial cleaning as a SEPARATE revision.

The raw ASR transcript is never modified. Cleaning produces
``transcript_clean.json`` (revision 1, kind 'clean') with filler tokens
flagged, proper nouns corrected from the Knowledge Base glossary, and
low-confidence words marked. It never invents speech.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from core.config import Settings
from core.job_store import JobStore, new_id

FILLERS = {"um", "uh", "erm", "uhh", "umm", "hmm", "mhm", "you know,", "like,"}
LOW_CONFIDENCE = 0.35


def load_glossary(settings: Settings) -> dict[str, str]:
    """word (lowercased) -> canonical spelling, from Knowledge_Base glossary."""
    path = settings.paths.knowledge / "brand" / "GLOSSARY.md"
    glossary: dict[str, str] = {}
    if not path.exists():
        return glossary
    for line in path.read_text(encoding="utf-8").splitlines():
        # Lines like: "signal flair -> Signal Flair"
        if "->" in line and not line.strip().startswith("#"):
            wrong, _, right = line.partition("->")
            wrong, right = wrong.strip(), right.strip()
            if wrong and right:
                glossary[wrong.lower()] = right
    return glossary


def clean_text(text: str, glossary: dict[str, str]) -> tuple[str, list[str]]:
    notes = []
    cleaned = text
    for filler in sorted(FILLERS, key=len, reverse=True):
        pattern = re.compile(rf"(?<!\w){re.escape(filler)}(?!\w)", re.IGNORECASE)
        if pattern.search(cleaned):
            cleaned = pattern.sub("", cleaned)
            notes.append(f"removed filler '{filler}'")
    for wrong, right in glossary.items():
        pattern = re.compile(rf"(?<!\w){re.escape(wrong)}(?!\w)", re.IGNORECASE)
        if pattern.search(cleaned):
            cleaned = pattern.sub(right, cleaned)
            notes.append(f"glossary: '{wrong}' -> '{right}'")
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    cleaned = re.sub(r"\s+([,.!?;:])", r"\1", cleaned)
    return cleaned, notes


def clean_transcript(transcript: dict, glossary: dict[str, str]) -> dict:
    out = json.loads(json.dumps(transcript))  # deep copy, raw preserved by caller
    out["kind"] = "clean"
    changes = []
    for seg in out["segments"]:
        original = seg.get("text", "")
        cleaned, notes = clean_text(original, glossary)
        if cleaned != original:
            seg["raw_text"] = original
            seg["text"] = cleaned
            changes.append({"segment": seg["id"], "notes": notes})
    low_conf = [w for w in out.get("words", [])
                if w.get("confidence", 1.0) < LOW_CONFIDENCE and w.get("word")]
    out["low_confidence_words"] = low_conf[:500]
    out["cleanup_changes"] = changes
    return out


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    artifacts = store.artifacts(job_id)
    raw = json.loads(Path(artifacts["transcript_json"]).read_text(encoding="utf-8"))
    glossary = load_glossary(settings)
    cleaned = clean_transcript(raw, glossary)
    job_dir = settings.paths.job_dir(job_id)
    out = job_dir / "transcript_clean.json"
    out.write_text(json.dumps(cleaned, indent=2, ensure_ascii=False), encoding="utf-8")
    store.set_artifact(job_id, "transcript_clean_json", out)
    store.conn.execute(
        "INSERT INTO transcripts(id, job_id, revision, kind, engine, engine_mode,"
        " language, path) VALUES (?,?,1,'clean',?,?,?,?)",
        (new_id("tr"), job_id, raw.get("engine", "unknown"),
         raw.get("engine_mode"), raw.get("language"), str(out)))
    return {"changes": len(cleaned.get("cleanup_changes", [])),
            "low_confidence_words": len(cleaned.get("low_confidence_words", []))}
