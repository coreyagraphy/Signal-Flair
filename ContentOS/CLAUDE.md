# CLAUDE.md — Content OS project context

Read AGENTS.md for the working rules. Quick orientation:

- **What this is**: local-first content pipeline (ingest → transcribe →
  strategize → edit-plan → render → review → distribute). Owner: Corey Ellis.
  Production target: Windows 11 + RTX 3090 + Premiere Pro + Ollama.
- **Repo layout**: core/ (persistence + pipeline), services/ (stages),
  adapters/ (optional providers), premiere/ (MCP integration), review/,
  schemas/, formats/, config/, Knowledge_Base/ (owner-editable, placeholders
  only — never invent brand facts), docs/ (INDEX.md).
- **State**: SQLite at data/contentos.db; jobs advance through the state
  machine in docs/02; artifacts on disk are the source of stage completion.
- **Current honest status**: docs/12_LIMITATIONS_AND_MANUAL_STEPS.md.
- **Verification battery**: `python validate_project.py && python -m pytest -q
  && python scripts/run_e2e.py`.
- Keep Signal Flair (the website in the repo root above) and Content OS
  separate — do not bleed code or branding between them.
