# Content OS

Local-first, model-neutral content operating system: drop raw video into a
folder and get codec-verified ingest, local transcription, captions, an
evidence-grounded strategy brief, conservative dead-air editing, scored clip
candidates, rendered horizontal + vertical drafts with burned captions, a
Premiere-ready package, a review interface that learns your taste, and
dry-run distribution packages — all without a clip-generation subscription.

## Install (Windows 11)
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Dev -Asr -Ui
python contentos_cli.py doctor
```
Only Python + FFmpeg are required. faster-whisper (GPU transcription),
Streamlit (dashboard), Ollama (generation), and API keys are optional —
everything degrades gracefully without them (`.env.example` documents all
settings; never commit `.env`).

## Use
1. **Start**: double-click `START_CONTENT_OS.bat` (or `python contentos_cli.py watch`).
2. **Drop videos** (MP4/MOV) into `Input\inbox`. Batch: `python contentos_cli.py batch <dir>`.
3. **Watch jobs**: `python contentos_cli.py status` or `streamlit run app.py`.
4. **Review a draft**: `START_REVIEW.bat <job_id>` → browser opens → scrub,
   add timestamp notes, rate 1–100, Approve or Request revision. (Offline:
   download the notes JSON, then `python contentos_cli.py feedback-complete <job_id> --file <json>`.)
5. **Approve**: `python contentos_cli.py approve <job_id>` — runs quality
   gates, renders finals, prepares distribution.
6. **Premiere**: every job gets `Output\premiere\<job_id>\` (manifest,
   captions, instructions). For live Premiere control see
   `docs/05_PREMIERE_MCP_INTEGRATION.md`.
7. **Distribute (dry run)**: `python contentos_cli.py distribute <job_id>` →
   packages land in `Output\social\`. Live publishing stays off until
   explicitly enabled (docs/07).
8. **Recover from failure**: `python contentos_cli.py retry <job_id>` —
   resumes from the failed stage; see `docs/08_OPERATIONS_RUNBOOK.md`.
9. **Run tests**: `RUN_TESTS.bat` or `python -m pytest`.
10. **Asset packs**: `python contentos_cli.py assets register "<folder>"`,
    then `assets scan` / `assets report`.

Full documentation: [`docs/INDEX.md`](docs/INDEX.md). Honest limitations:
[`docs/12_LIMITATIONS_AND_MANUAL_STEPS.md`](docs/12_LIMITATIONS_AND_MANUAL_STEPS.md).
