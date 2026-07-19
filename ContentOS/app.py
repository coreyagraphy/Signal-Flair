#!/usr/bin/env python3
"""Content OS control panel (Streamlit).

Run: streamlit run app.py
Requires `pip install streamlit` (optional dependency). All state shown here
is read from the durable SQLite database — Streamlit session state is never
authoritative.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

try:
    import streamlit as st
except ImportError:  # pragma: no cover
    print("Streamlit is not installed. Install with: pip install streamlit")
    sys.exit(1)

from core import pipeline
from core.config import load_settings
from core.database import migrate
from core.job_store import JobStore
from core.proc import which
from services import stage_registry, taste_service

st.set_page_config(page_title="Content OS", layout="wide")

# Readable, light, roomy — per operator experience requirements.
st.markdown("""<style>
  html, body, [class*="css"] { font-size: 18px !important; }
  .stMetric label { font-size: 1rem !important; }
</style>""", unsafe_allow_html=True)


@st.cache_resource
def bootstrap():
    settings = load_settings()
    settings.paths.ensure()
    migrate(settings.paths)
    stage_registry.register_all()
    return settings


settings = bootstrap()
store = JobStore(settings)

st.title("Content OS")

# ---- system health -------------------------------------------------------
cols = st.columns(5)
def _tool_ok(tool: str) -> bool:
    try:
        which(tool)
        return True
    except Exception:
        return False

with cols[0]:
    st.metric("FFmpeg", "OK" if _tool_ok("ffmpeg") else "MISSING")
with cols[1]:
    try:
        import faster_whisper  # noqa: F401
        st.metric("Whisper", "installed")
    except ImportError:
        st.metric("Whisper", "fallback")
with cols[2]:
    from adapters.llm.ollama_adapter import OllamaAdapter
    ok, _ = OllamaAdapter(settings.ollama_url, settings.ollama_model).available()
    st.metric("Ollama", "OK" if ok else "offline")
with cols[3]:
    st.metric("Premiere MCP", "enabled" if settings.premiere_mcp_enabled else "disabled")
with cols[4]:
    st.metric("Distribution", "DRY RUN" if settings.distribution_dry_run else "LIVE")

# ---- job queue -----------------------------------------------------------
st.header("Jobs")
jobs = store.list_jobs()
if not jobs:
    st.info(f"No jobs yet. Drop MP4/MOV files into {settings.paths.input_inbox} "
            "and run START_CONTENT_OS.bat")
else:
    st.dataframe([{"job": j["id"], "stage": j["stage"], "status": j["status"],
                   "retries": j["retry_count"], "error": j["error_code"] or "",
                   "updated": j["updated_at"]} for j in jobs],
                 use_container_width=True)

    selected = st.selectbox("Inspect job", [j["id"] for j in jobs])
    if selected:
        job = store.get_job(selected)
        artifacts = store.artifacts(selected)
        left, right = st.columns(2)
        with left:
            st.subheader("Timeline")
            for event in store.events(selected)[-20:]:
                st.text(f"{event['created_at']}  {event['event_type']}  "
                        f"{event['detail_json'][:120]}")
            if job["status"] == "failed":
                st.error(f"{job['error_code']}: {job['error_message']}")
                if st.button("Retry job"):
                    pipeline.retry(settings, store, selected)
                    st.rerun()
            elif job["stage"] not in ("awaiting_review", "analytics_pending"):
                if st.button("Advance pipeline"):
                    pipeline.advance(settings, store, selected)
                    st.rerun()
        with right:
            st.subheader("Artifacts")
            for key, path in sorted(artifacts.items()):
                exists = Path(path).exists()
                st.text(f"{'✅' if exists else '❌'} {key}: {path}")
            draft = artifacts.get("draft_vertical") or artifacts.get("draft_horizontal")
            if draft and Path(draft).exists():
                st.subheader("Draft playback")
                st.video(draft)
            transcript = artifacts.get("transcript_json")
            if transcript and Path(transcript).exists():
                with st.expander("Transcript"):
                    data = json.loads(Path(transcript).read_text(encoding="utf-8"))
                    st.caption(f"engine: {data.get('engine')} "
                               f"({data.get('engine_mode')})")
                    for seg in data.get("segments", [])[:50]:
                        st.text(f"[{seg['start']:.1f}–{seg['end']:.1f}] {seg['text']}")

# ---- taste rules ---------------------------------------------------------
st.header("Taste rules")
rules = taste_service.active_rules(store)
if rules:
    st.dataframe([{"rule": r["rule_text"], "polarity": r["polarity"],
                   "confidence": r["confidence"], "evidence": r["evidence_count"]}
                  for r in rules], use_container_width=True)
else:
    st.caption("No taste rules learned yet — they accumulate from review feedback.")
