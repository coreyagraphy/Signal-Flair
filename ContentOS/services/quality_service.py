"""Automated quality gates (mandate section 28).

Critical gate failures block approval. Reports are written as JSON + MD
under Output/reports.
"""
from __future__ import annotations

import json
from pathlib import Path

from core.config import Settings
from core.job_store import JobStore, new_id

from . import media_probe_service


def _gate(name: str, passed: bool, detail: str, critical: bool = True) -> dict:
    return {"gate": name, "passed": bool(passed), "critical": critical,
            "detail": detail}


def check_render(path: Path, *, expected_duration: float) -> list[dict]:
    gates = []
    exists = path.exists() and path.stat().st_size > 0
    gates.append(_gate("output_exists", exists, str(path)))
    if not exists:
        return gates
    try:
        meta = media_probe_service.probe_media(path)
    except Exception as exc:
        gates.append(_gate("output_readable", False, str(exc)))
        return gates
    gates.append(_gate("output_readable", True, "ffprobe ok"))
    gates.append(_gate("video_stream", meta["has_video"], meta.get("video_codec") or ""))
    gates.append(_gate("audio_stream", meta["has_audio"], meta.get("audio_codec") or ""))
    duration = meta["duration_seconds"]
    plausible = expected_duration <= 0 or \
        abs(duration - expected_duration) <= max(2.0, expected_duration * 0.15)
    gates.append(_gate("duration_plausible", plausible,
                       f"got {duration:.2f}s, planned {expected_duration:.2f}s"))
    gates.append(_gate("resolution_known", bool(meta["width"] and meta["height"]),
                       f"{meta['width']}x{meta['height']}", critical=False))
    return gates


def check_captions(captions_json: Path) -> list[dict]:
    gates = []
    if not captions_json.exists():
        return [_gate("captions_exist", False, str(captions_json))]
    data = json.loads(captions_json.read_text(encoding="utf-8"))
    cues = data.get("cues", [])
    gates.append(_gate("captions_exist", True, f"{len(cues)} cues"))
    monotonic = all(cues[i]["start"] >= cues[i - 1]["end"] - 0.01
                    for i in range(1, len(cues)))
    gates.append(_gate("caption_timing_monotonic", monotonic,
                       "cues are ordered and non-overlapping"))
    slow = [c for c in cues
            if (c["end"] - c["start"]) > 0 and
            len(c["text"].replace("\n", " ")) / (c["end"] - c["start"]) > 30]
    gates.append(_gate("caption_reading_speed", len(slow) == 0,
                       f"{len(slow)} cues exceed 30 chars/sec", critical=False))
    long_lines = [c for c in cues
                  if any(len(line) > 46 for line in c["text"].split("\n"))]
    gates.append(_gate("caption_line_length", len(long_lines) == 0,
                       f"{len(long_lines)} cues exceed 46 chars/line", critical=False))
    return gates


def check_edit_plan(plan_path: Path) -> list[dict]:
    gates = []
    if not plan_path.exists():
        return [_gate("edit_plan_exists", False, str(plan_path))]
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    segments = plan.get("segments", [])
    gates.append(_gate("edit_plan_exists", True, f"{len(segments)} segments"))
    negatives = [s for s in segments if s["source_out"] <= s["source_in"]]
    gates.append(_gate("no_negative_durations", len(negatives) == 0,
                       f"{len(negatives)} bad segments"))
    overlaps = 0
    ordered = sorted(segments, key=lambda s: s["timeline_in"])
    for i in range(1, len(ordered)):
        if ordered[i]["timeline_in"] < ordered[i - 1]["timeline_out"] - 0.01:
            overlaps += 1
    gates.append(_gate("no_timeline_overlaps", overlaps == 0, f"{overlaps} overlaps"))
    flagged = [c for c in plan.get("cuts", []) if c.get("action") == "flagged"]
    gates.append(_gate("no_unresolved_flagged_cuts", len(flagged) == 0,
                       f"{len(flagged)} cuts flagged for review", critical=False))
    return gates


def run_quality(settings: Settings, store: JobStore, job_id: str,
                *, kind: str = "draft") -> dict:
    artifacts = store.artifacts(job_id)
    plan_path = Path(artifacts["edit_plan"])
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    expected = plan["segments"][-1]["timeline_out"] if plan.get("segments") else 0.0

    gates: list[dict] = []
    gates += check_edit_plan(plan_path)
    if artifacts.get("captions_json"):
        gates += check_captions(Path(artifacts["captions_json"]))
    for variant in ("horizontal", "vertical"):
        key = f"{'draft' if kind == 'draft' else 'final'}_{variant}"
        if artifacts.get(key):
            for g in check_render(Path(artifacts[key]), expected_duration=expected):
                g["gate"] = f"{variant}_{g['gate']}"
                gates.append(g)

    critical_failures = [g for g in gates if not g["passed"] and g["critical"]]
    passed = len(critical_failures) == 0
    report = {"job_id": job_id, "kind": kind, "passed": passed,
              "critical_failures": len(critical_failures), "gates": gates}

    json_path = settings.paths.output_reports / f"{job_id}_quality_report.json"
    json_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    md_path = settings.paths.output_reports / f"{job_id}_quality_report.md"
    lines = [f"# Quality report — {job_id} ({kind})", "",
             f"**{'PASSED' if passed else 'FAILED'}** — "
             f"{len(critical_failures)} critical failures", ""]
    for g in gates:
        icon = "✅" if g["passed"] else ("❌" if g["critical"] else "⚠️")
        lines.append(f"- {icon} `{g['gate']}` — {g['detail']}")
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    store.set_artifact(job_id, "quality_report", json_path)
    store.conn.execute(
        "INSERT INTO quality_reports(id, job_id, passed, critical_failures, path)"
        " VALUES (?,?,?,?,?)",
        (new_id("qr"), job_id, int(passed), len(critical_failures), str(json_path)))
    return report
