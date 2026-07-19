#!/usr/bin/env python3
"""Content OS command-line interface.

Run `python contentos_cli.py --help` for the command list. Expected operator
errors print a readable message and exit nonzero; stack traces only appear
with CONTENTOS_DEBUG=1.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from core import pipeline
from core.config import Settings, load_settings
from core.database import migrate
from core.exceptions import ContentOSError
from core.job_store import JobStore
from core.logging import setup_logging
from services import (analytics_service, distribution_service, ingest_service,
                      render_service, research_service, review_service,
                      stage_registry, taste_service)
from services.quality_service import run_quality

DEBUG = os.environ.get("CONTENTOS_DEBUG", "") == "1"


def bootstrap() -> tuple[Settings, JobStore]:
    settings = load_settings()
    settings.paths.ensure()
    setup_logging(settings.paths.data_logs)
    migrate(settings.paths)
    stage_registry.register_all()
    return settings, JobStore(settings)


# --------------------------------------------------------------------------
def cmd_doctor(args) -> int:
    settings = load_settings()
    settings.paths.ensure()
    from core.proc import which
    checks: list[tuple[str, str, str]] = []  # (name, status, detail)

    for tool in ("ffmpeg", "ffprobe"):
        try:
            which(tool)
            checks.append((tool, "OK", "on PATH"))
        except ContentOSError as exc:
            checks.append((tool, "MISSING (required)", str(exc)))

    try:
        import faster_whisper  # noqa: F401
        checks.append(("faster-whisper", "OK", "installed"))
    except ImportError:
        checks.append(("faster-whisper", "missing (optional)",
                       "pip install faster-whisper — energy fallback will be used"))

    from adapters.llm.ollama_adapter import OllamaAdapter
    ok, reason = OllamaAdapter(settings.ollama_url, settings.ollama_model).available()
    checks.append(("ollama", "OK" if ok else "unreachable (optional)", reason))

    secrets = [("ANTHROPIC_API_KEY", settings.anthropic_api_key),
               ("OPENAI_API_KEY", settings.openai_api_key),
               ("PERPLEXITY_API_KEY", settings.perplexity_api_key),
               ("BRAVE_SEARCH_API_KEY", settings.brave_search_api_key),
               ("YOUTUBE_API_KEY", settings.youtube_api_key),
               ("ZERNIO_API_KEY", settings.zernio_api_key)]
    for name, value in secrets:
        checks.append((name, "configured" if value else "missing (optional)",
                       "value hidden" if value else "feature disabled without it"))

    checks.append(("premiere_mcp",
                   "enabled" if settings.premiere_mcp_enabled else "disabled (optional)",
                   settings.premiere_mcp_command or "no command configured"))
    checks.append(("distribution_dry_run",
                   "ON (safe)" if settings.distribution_dry_run else "OFF — live!",
                   "CONTENTOS_DISTRIBUTION_DRY_RUN"))
    try:
        migrate(settings.paths)
        checks.append(("database", "OK", "migrations applied"))
    except Exception as exc:
        checks.append(("database", "ERROR", str(exc)))

    width = max(len(c[0]) for c in checks) + 2
    print("Content OS doctor\n" + "=" * 40)
    failures = 0
    for name, status, detail in checks:
        print(f"{name:<{width}} {status:<22} {detail}")
        if "required" in status or status == "ERROR":
            failures += 1
    print("=" * 40)
    print("All required checks passed." if failures == 0 else
          f"{failures} required check(s) failed.")
    return 0 if failures == 0 else 1


def cmd_init(args) -> int:
    settings, _store = bootstrap()
    print(f"Initialized Content OS at {settings.paths.root}")
    print(f"Drop MP4/MOV files into: {settings.paths.input_inbox}")
    return 0


def cmd_ingest(args) -> int:
    settings, store = bootstrap()
    job_id = ingest_service.ingest_file(settings, store, Path(args.path),
                                        format_id=args.format, wait_stable=False)
    print(f"Created job {job_id}")
    if not args.no_process:
        stage = pipeline.advance(settings, store, job_id)
        print(f"Job {job_id} reached stage: {stage}")
    return 0


def cmd_batch(args) -> int:
    settings, store = bootstrap()
    directory = Path(args.directory)
    if not directory.is_dir():
        print(f"Not a directory: {directory}", file=sys.stderr)
        return 1
    count = 0
    for path in sorted(directory.iterdir()):
        if ingest_service.is_candidate(path):
            try:
                job_id = ingest_service.ingest_file(settings, store, path,
                                                    wait_stable=False)
                stage = pipeline.advance(settings, store, job_id)
                print(f"{path.name}: job {job_id} → {stage}")
                count += 1
            except ContentOSError as exc:
                print(f"{path.name}: {exc.code}: {exc}", file=sys.stderr)
    print(f"Processed {count} file(s)")
    return 0


def cmd_watch(args) -> int:
    settings, store = bootstrap()
    print(f"Watching {settings.paths.input_inbox} (Ctrl+C to stop)")
    try:
        while True:
            for job_id in ingest_service.scan_inbox(settings, store):
                stage = pipeline.advance(settings, store, job_id)
                print(f"job {job_id} → {stage}")
            # Also resume any pending jobs (crash recovery).
            for row in store.list_jobs(status="pending"):
                if row["stage"] not in ("awaiting_review", "analytics_pending",
                                        "approved", "failed"):
                    pipeline.advance(settings, store, row["id"])
            time.sleep(settings.ingest_poll_seconds * 2)
    except KeyboardInterrupt:
        print("\nStopped.")
    return 0


def cmd_process(args) -> int:
    settings, store = bootstrap()
    stage = pipeline.advance(settings, store, args.job_id)
    print(f"Job {args.job_id} reached stage: {stage}")
    job = store.get_job(args.job_id)
    return 0 if job and job["status"] != "failed" else 1


def cmd_retry(args) -> int:
    settings, store = bootstrap()
    stage = pipeline.retry(settings, store, args.job_id)
    job = store.get_job(args.job_id)
    print(f"Job {args.job_id} now at {stage} (status {job['status']})")
    return 0 if job["status"] != "failed" else 1


def cmd_status(args) -> int:
    settings, store = bootstrap()
    if args.job_id:
        job = store.get_job(args.job_id)
        if job is None:
            print(f"Unknown job {args.job_id}", file=sys.stderr)
            return 1
        print(json.dumps({k: job[k] for k in job.keys()}, indent=2, default=str))
        print("\nRecent events:")
        for event in store.events(args.job_id)[-12:]:
            print(f"  {event['created_at']} {event['event_type']} {event['detail_json']}")
        return 0
    jobs = store.list_jobs()
    if not jobs:
        print("No jobs yet. Drop a file into Input/inbox and run: "
              "python contentos_cli.py watch")
        return 0
    print(f"{'JOB':<22} {'STAGE':<22} {'STATUS':<9} {'ERROR'}")
    for job in jobs:
        print(f"{job['id']:<22} {job['stage']:<22} {job['status']:<9} "
              f"{job['error_code'] or ''}")
    return 0


def _single_stage(args, stage: str) -> int:
    settings, store = bootstrap()
    detail = pipeline.run_stage(settings, store, args.job_id, stage)
    print(json.dumps(detail, indent=2, default=str))
    return 0


def cmd_transcribe(args) -> int:
    return _single_stage(args, "transcribed")


def cmd_strategy(args) -> int:
    return _single_stage(args, "strategized")


def cmd_plan(args) -> int:
    return _single_stage(args, "edit_planned")


def cmd_render(args) -> int:
    return _single_stage(args, "draft_rendered")


def cmd_premiere_discover(args) -> int:
    settings, _store = bootstrap()
    from premiere.capability_discovery import discover, write_capabilities
    doc = discover(settings)
    path = write_capabilities(settings, doc)
    print(f"Status: {doc['status']} — {doc['reason']}")
    print(f"Capability map: {path}")
    return 0


def cmd_premiere_run(args) -> int:
    settings, store = bootstrap()
    from premiere import sequence_builder
    detail = sequence_builder.run(settings, store, args.job_id)
    print(json.dumps(detail, indent=2))
    return 0


def cmd_review(args) -> int:
    from review.review_server import serve
    serve(args.job_id, args.port)
    return 0


def cmd_feedback_complete(args) -> int:
    settings, store = bootstrap()
    payload = {}
    if args.file:
        payload = json.loads(Path(args.file).read_text(encoding="utf-8"))
    result = review_service.submit_feedback(
        settings, store, args.job_id,
        ratings=payload.get("ratings"),
        decision=payload.get("decision", args.decision),
        notes=payload.get("notes"))
    print(json.dumps(result, indent=2))
    if result["decision"] == "revision_requested":
        stage = pipeline.advance(settings, store, args.job_id)
        print(f"Rebuilt to stage: {stage}")
    return 0


def cmd_approve(args) -> int:
    settings, store = bootstrap()
    report = run_quality(settings, store, args.job_id, kind="draft")
    if not report["passed"] and not args.force:
        print(f"BLOCKED: {report['critical_failures']} critical quality gate "
              f"failure(s). See Output/reports/{args.job_id}_quality_report.md",
              file=sys.stderr)
        return 1
    result = review_service.submit_feedback(settings, store, args.job_id,
                                            ratings=None, decision="approved")
    detail = render_service.render_final(settings, store, args.job_id)
    store.transition(args.job_id, "final_rendered")
    dist = distribution_service.run(settings, store, args.job_id)
    store.transition(args.job_id, "distribution_prepared")
    print(json.dumps({"approved": True, "final": detail, "distribution": dist},
                     indent=2))
    return 0


def cmd_distribute(args) -> int:
    settings, store = bootstrap()
    results = distribution_service.execute(settings, store, args.job_id,
                                           dry_run=not args.live)
    job = store.get_job(args.job_id)
    if job["stage"] == "distribution_prepared":
        store.transition(args.job_id, "exported")
        store.transition(args.job_id, "analytics_pending")
    print(json.dumps(results, indent=2))
    return 0


def cmd_research(args) -> int:
    settings, store = bootstrap()
    evidence = research_service.research(settings, store, args.query or
                                         "content marketing local business")
    for ev in evidence:
        print(f"[{ev.provider}] {ev.title} (relevance {ev.relevance:.2f})")
        print(f"   {ev.evidence[:160]}")
    if not evidence:
        print("No evidence found. Add documents under Knowledge_Base/research "
              "or configure a research provider.")
    return 0


def cmd_taste(args) -> int:
    _settings, store = bootstrap()
    rules = taste_service.active_rules(store)
    for rule in rules:
        print(f"[{rule['polarity']:<8}] conf={rule['confidence']:.2f} "
              f"n={rule['evidence_count']} — {rule['rule_text']}")
    if not rules:
        print("No taste rules learned yet.")
    return 0


def cmd_analytics(args) -> int:
    _settings, store = bootstrap()
    if args.ingest:
        count = analytics_service.ingest_file(store, Path(args.ingest))
        print(f"Ingested {count} snapshot(s)")
    for rec in analytics_service.recommendations(store):
        print(json.dumps(rec))
    return 0


def cmd_codec_inventory(args) -> int:
    settings = load_settings()
    settings.paths.ensure()
    from services import capability_service
    caps = capability_service.collect_capabilities()
    json_path, report = capability_service.write_reports(settings, caps)
    families = capability_service.family_support(caps)
    supported = sum(1 for f in families.values() if f["supported"])
    print(f"FFmpeg: {caps['ffmpeg_version']}")
    print(f"Codec families supported: {supported}/{len(families)}")
    print(f"Inventory: {json_path}")
    print(f"Report: {report}")
    return 0


def cmd_mezzanine(args) -> int:
    settings, store = bootstrap()
    from services.proxy_service import make_mezzanine
    out = make_mezzanine(settings, store, args.job_id, profile=args.profile)
    print(f"Mezzanine created and verified: {out}")
    return 0


def cmd_assets(args) -> int:
    settings, store = bootstrap()
    from services import asset_library_service as als
    if args.action == "register":
        if not args.target:
            print("usage: assets register <folder>", file=sys.stderr)
            return 1
        lib_id = als.register_library(settings, store, Path(args.target))
        print(f"Registered library {lib_id}. Scan with: assets scan {lib_id}")
    elif args.action == "scan":
        results = als.scan(settings, store, library_id=args.target)
        print(json.dumps(results, indent=2))
    elif args.action == "list":
        for row in als.list_assets(store, asset_type=args.target):
            print(f"[{row['asset_type']:<14}] {row['availability']:<12} "
                  f"{row['relative_path']}")
    elif args.action == "report":
        path = als.write_report(settings, store, library_id=args.target)
        print(f"Report: {path}")
    return 0


def cmd_migrate(args) -> int:
    settings = load_settings()
    settings.paths.ensure()
    ran = migrate(settings.paths)
    print(f"Applied {len(ran)} migration(s): {ran or 'none pending'}")
    return 0


def cmd_validate(args) -> int:
    import validate_project
    return validate_project.main()


# --------------------------------------------------------------------------
def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="contentos",
                                     description="Content OS pipeline CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("doctor", help="check tools, providers, database").set_defaults(fn=cmd_doctor)
    sub.add_parser("init", help="create directories and database").set_defaults(fn=cmd_init)

    p = sub.add_parser("ingest", help="ingest one media file")
    p.add_argument("path")
    p.add_argument("--format", default="talking_head_short")
    p.add_argument("--no-process", action="store_true")
    p.set_defaults(fn=cmd_ingest)

    p = sub.add_parser("batch", help="ingest and process a directory")
    p.add_argument("directory")
    p.set_defaults(fn=cmd_batch)

    sub.add_parser("watch", help="watch Input/inbox continuously").set_defaults(fn=cmd_watch)

    for name, fn, help_text in [
        ("process", cmd_process, "advance a job through the pipeline"),
        ("retry", cmd_retry, "clear error and resume a failed job"),
        ("transcribe", cmd_transcribe, "run only the transcription stage"),
        ("strategy", cmd_strategy, "run only the strategy stage"),
        ("plan", cmd_plan, "run only the edit-plan stage"),
        ("render", cmd_render, "run only the draft render stage"),
        ("premiere-run", cmd_premiere_run, "build the Premiere package for a job"),
    ]:
        p = sub.add_parser(name, help=help_text)
        p.add_argument("job_id")
        p.set_defaults(fn=fn)

    p = sub.add_parser("status", help="list jobs, or show one job")
    p.add_argument("job_id", nargs="?")
    p.set_defaults(fn=cmd_status)

    sub.add_parser("premiere-discover",
                   help="probe the Premiere MCP server").set_defaults(fn=cmd_premiere_discover)

    p = sub.add_parser("review", help="serve the review UI for a job")
    p.add_argument("job_id")
    p.add_argument("--port", type=int, default=8765)
    p.set_defaults(fn=cmd_review)

    p = sub.add_parser("feedback-complete", help="finalize review feedback")
    p.add_argument("job_id")
    p.add_argument("--file", help="review JSON downloaded from review.html")
    p.add_argument("--decision", default="revision_requested",
                   choices=["approved", "revision_requested"])
    p.set_defaults(fn=cmd_feedback_complete)

    p = sub.add_parser("approve", help="approve, final-render, prep distribution")
    p.add_argument("job_id")
    p.add_argument("--force", action="store_true",
                   help="approve despite failed quality gates")
    p.set_defaults(fn=cmd_approve)

    p = sub.add_parser("distribute", help="execute publish plans (dry-run default)")
    p.add_argument("job_id")
    p.add_argument("--dry-run", action="store_true", default=True)
    p.add_argument("--live", action="store_true",
                   help="attempt live publishing (heavily guarded)")
    p.set_defaults(fn=cmd_distribute)

    p = sub.add_parser("research", help="run the research providers")
    p.add_argument("query", nargs="?")
    p.set_defaults(fn=cmd_research)

    sub.add_parser("taste", help="list learned taste rules").set_defaults(fn=cmd_taste)

    p = sub.add_parser("analytics", help="ingest/inspect analytics")
    p.add_argument("--ingest", help="JSON or CSV snapshot file")
    p.set_defaults(fn=cmd_analytics)

    sub.add_parser("migrate", help="apply database migrations").set_defaults(fn=cmd_migrate)
    sub.add_parser("validate", help="validate repository health").set_defaults(fn=cmd_validate)

    sub.add_parser("codec-inventory",
                   help="inventory the installed ffmpeg build's codecs"
                   ).set_defaults(fn=cmd_codec_inventory)

    p = sub.add_parser("mezzanine", help="generate a professional editing proxy")
    p.add_argument("job_id")
    p.add_argument("--profile", default="prores_proxy",
                   choices=["prores_proxy", "prores_422", "prores_422_hq",
                            "dnxhr_lb", "dnxhr_sq", "dnxhr_hqx"])
    p.set_defaults(fn=cmd_mezzanine)

    p = sub.add_parser("assets", help="creative asset library operations")
    p.add_argument("action", choices=["register", "scan", "list", "report"])
    p.add_argument("target", nargs="?",
                   help="folder path (register), library id (scan/report), "
                        "or type filter (list)")
    p.set_defaults(fn=cmd_assets)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return args.fn(args)
    except ContentOSError as exc:
        if DEBUG:
            raise
        print(f"error [{exc.code}]: {exc}", file=sys.stderr)
        return 2
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    sys.exit(main())
