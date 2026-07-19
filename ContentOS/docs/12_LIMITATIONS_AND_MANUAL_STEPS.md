# Limitations and manual steps — the honest list

## Environment facts about this build
Built and verified in a remote Linux container. Everything Windows-,
GPU-, Premiere-, or account-bound below is code-complete but NOT yet
executed in its real environment. Nothing on this list is claimed as done.

## Needs the Windows workstation (Corey or a local session)

**One-command start**: docs/WINDOWS_VERIFICATION_PLAYBOOK.md +
`scripts/windows_phase.ps1 -Step all` automate items 1-4, 6-7 below plus
the VettaRey source resolution/ingest.
1. **Clone/pull the branch** into
   `C:\Users\corey\OneDrive\Desktop\ContentOS_Claude_Codex_Ready`
   (the repo lives at `ContentOS/` inside `coreyagraphy/Signal-Flair`,
   branch `claude/content-os-implementation-2ypc8q`).
2. `powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Dev -Asr -Ui`
3. `python contentos_cli.py doctor` and `codec-inventory` — produces the
   real Windows capability reports (this repo ships the Linux-container ones,
   honestly labeled with the machine they ran on).
4. `python scripts\verify_gpu.py` — RTX 3090 + faster-whisper CUDA check.
5. Premiere MCP bring-up — docs/05, steps 1–5 (inspection → discovery →
   hand-mapping → vertical slice). Until then every job still gets the full
   editable fallback package.
6. `python contentos_cli.py assets register "C:\Users\corey\OneDrive\Desktop\FourEditors"`
   then `assets scan` and `assets report` — generates
   `docs/audit/FOUREDITORS_ASSET_LIBRARY_REPORT.md` from the real folder
   (unreachable from this container; contents were not assumed).
7. Drop real camera/phone/social samples into `tests\codec_samples_private\`
   and run `python scripts\run_codec_matrix.py` for the real-footage matrix.

## Needs credentials / accounts
- Ollama running locally for generated strategy (else labeled heuristic).
- API keys for external research providers — AND client implementations
  (interfaces exist; clients deliberately unwritten until docs are verified).
- Zernio / YouTube live publishing — same: credentials + verified client +
  explicit dry-run opt-out + per-plan approval.

## Not implemented (stated plainly)
- ~~Remotion rendering route~~ IMPLEMENTED 2026-07-19: title-reveal
  compositions render to ProRes 4444 with alpha (proven in the build
  container); Windows re-render is one playbook command.
- DaVinci Resolve fallback adapter.
- Subject-tracked auto-reframe (vertical drafts use center crop; the manifest
  records where tracked keyframes belong).
- External research API clients, live distribution clients (see above).
- Streamlit UI has not been driven in this container (streamlit absent);
  its data layer is the same tested job store.

## Known behavioral limits
- Very dense speech can undercut caption reading-speed targets (reported by
  the quality gate, non-critical).
- Energy-fallback transcripts contain no words, so caption/strategy stages
  operate in a reduced, clearly-flagged mode.
- OneDrive placeholder detection relies on Windows file attributes; on other
  OSes cloud placeholders read as local files.
