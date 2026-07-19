#!/usr/bin/env python3
"""End-to-end verification against a throwaway CONTENTOS_ROOT sandbox.

Generates synthetic media, runs the entire pipeline to awaiting_review,
approves, renders finals, prepares distribution, executes a dry run, and
prints every artifact produced. Exit code 0 only when everything verifies.
"""
from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO))


def main() -> int:
    sandbox = Path(tempfile.mkdtemp(prefix="contentos-e2e-"))
    os.environ["CONTENTOS_ROOT"] = str(sandbox)
    os.environ["CONTENTOS_TRANSCRIPTION_ADAPTER"] = "auto"
    os.environ["CONTENTOS_LLM_ADAPTER"] = "template"

    # Sandbox needs config/formats/schemas/kb/migrations from the repo.
    for rel in ("config", "formats", "schemas", "database", "Knowledge_Base",
                "review", "premiere"):
        src = REPO / rel
        if src.exists():
            shutil.copytree(src, sandbox / rel, dirs_exist_ok=True)

    from core.config import load_settings
    from core.database import migrate, reset_connection_cache
    from core import pipeline
    from core.job_store import JobStore
    from services import distribution_service, ingest_service, render_service, stage_registry
    from services.quality_service import run_quality
    import scripts.generate_test_media as gen

    settings = load_settings()
    settings.paths.ensure()
    migrate(settings.paths)
    stage_registry.register_all()
    store = JobStore(settings)

    fixtures = sandbox / "fixtures"
    fixtures.mkdir(exist_ok=True)
    video = gen.main(fixtures)

    inbox_copy = settings.paths.input_inbox / video.name
    shutil.copy2(video, inbox_copy)
    shutil.copy2(video.with_name("synthetic_talking_head.transcript.json"),
                 settings.paths.input_inbox / "synthetic_talking_head.transcript.json")
    # The fixture adapter looks for the sidecar near the ASR wav; also place
    # it next to the managed original mirror in Media/audio.
    shutil.copy2(video.with_name("synthetic_talking_head.transcript.json"),
                 settings.paths.media_audio / "placeholder.tmp")
    (settings.paths.media_audio / "placeholder.tmp").unlink()

    print("== ingest ==")
    job_id = ingest_service.ingest_file(settings, store, inbox_copy, wait_stable=False)
    # Sidecar for fixture adapter, named after job wav stem.
    shutil.copy2(video.with_name("synthetic_talking_head.transcript.json"),
                 settings.paths.media_audio / f"{job_id}.transcript.json")

    print("== pipeline to awaiting_review ==")
    stage = pipeline.advance(settings, store, job_id)
    job = store.get_job(job_id)
    if stage != "awaiting_review" or job["status"] == "failed":
        print(f"FAILED at {stage}: {job['error_code']} {job['error_message']}")
        return 1

    print("== quality gates ==")
    report = run_quality(settings, store, job_id)
    print(json.dumps({"passed": report["passed"],
                      "critical_failures": report["critical_failures"]}, indent=2))
    if not report["passed"]:
        return 1

    print("== approve + final render ==")
    from services import review_service
    review_service.submit_feedback(settings, store, job_id, ratings={"overall": 96},
                                   decision="approved")
    render_service.render_final(settings, store, job_id)
    store.transition(job_id, "final_rendered")
    distribution_service.run(settings, store, job_id)
    store.transition(job_id, "distribution_prepared")

    print("== distribution dry run ==")
    results = distribution_service.execute(settings, store, job_id, dry_run=True)
    for r in results:
        print(f"  {r['platform']}: {r['status']}")
    store.transition(job_id, "exported")
    store.transition(job_id, "analytics_pending")

    print("\n== artifacts ==")
    for key, path in sorted(store.artifacts(job_id).items()):
        exists = Path(path).exists()
        print(f"  [{'ok' if exists else 'MISSING'}] {key}: {path}")
        if not exists:
            return 1

    final_job = store.get_job(job_id)
    print(f"\nFinal stage: {final_job['stage']} (status {final_job['status']})")
    print(f"Sandbox: {sandbox}")
    ok = final_job["stage"] == "analytics_pending"
    reset_connection_cache()
    print("E2E: PASS" if ok else "E2E: FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
