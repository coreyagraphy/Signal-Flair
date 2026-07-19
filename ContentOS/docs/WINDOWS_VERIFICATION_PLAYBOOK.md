# Windows verification playbook

The Windows phase mandate (installation → real hardware → Premiere → asset
scans → VettaRey footage → refuter → Codex) **must run on the workstation**.
This build session ran in the remote Linux container, so it prepared the
machinery and this playbook instead of fabricating Windows results.

## Fastest path

Open **Claude Code on the Windows workstation** (desktop app or CLI) in
`C:\Users\corey\OneDrive\Desktop\signal-flair`, paste the Windows phase
mandate, and let it drive. The scripted 80% is one command:

```powershell
git fetch origin claude/content-os-implementation-2ypc8q
git worktree add ..\contentos-import-worktree claude/content-os-implementation-2ypc8q
powershell -ExecutionPolicy Bypass -File ..\contentos-import-worktree\ContentOS\scripts\windows_phase.ps1 -Step all
```

`windows_phase.ps1` performs, in order, stopping on failure:
1. **import** — safe worktree retrieval of commit `84a0ad2`+, standalone repo
   at `C:\Users\corey\OneDrive\Desktop\ContentOS_Claude_Codex_Ready`, new git
   history, verification branch, `IMPORT_PROVENANCE.md`. Never overwrites an
   existing target; never touches Signal-Flair working state.
2. **preflight** — tool/GPU/path inventory → `docs\audit\WINDOWS_PREFLIGHT_REPORT.md`.
3. **install** — `install.ps1 -Dev -Asr -Ui` + Remotion `npm install`.
4. **verify** — validate_project, full pytest, doctor, codec-inventory
   (real Windows ffmpeg build), run_e2e, full codec matrix.
5. **gpu** — `verify_gpu.py` → RTX report skeleton (complete it after the
   first real transcription).
6. **assets** — scans FourEditors (`four_editors`) and Ocular
   (`ocular_sound_design`) read-only, with OneDrive placeholder detection,
   audio loudness/silence/loop analysis, previews, and reports.
7. **vettarey** — resolves `YOU_JUST_TOOK_A_L*` in the VettaRey folder
   (prefix + fuzzy fallback, probe-based selection of the most complete
   camera original), records SHA-256/size/mtime to
   `data\capabilities\vettarey_resolution.json`, ingests a managed copy, and
   prints the post-run hash command to prove the original is unchanged.

Individual steps re-run with `-Step <name>`.

## Remaining steps that need judgment (Claude Code session on Windows)

- **RTX transcription proof**: after `-Step vettarey`, check
  `python contentos_cli.py status <job_id>` — the transcript row records the
  real engine/mode (`cuda-float16` expected). Paste timings into
  `docs\audit\RTX_3090_TRANSCRIPTION_REPORT.md`. If the fixture or energy
  adapter ran instead, faster-whisper isn't installed correctly — fix before
  claiming an RTX test.
- **Premiere MCP**: docs/05 steps 1–5 (inspect → discover → hand-map →
  vertical slice with synthetic media → controlled VettaRey test). Record
  every call in `docs\premiere\PREMIERE_VERTICAL_SLICE_REPORT.md`.
- **Sound placement test**: pick an Ocular candidate
  (`python contentos_cli.py assets list sound_effect`), then use
  `services.sound_placement_service.place_selected_asset` (or ask the
  session) to mix it into the VettaRey draft with ducking; verify dialogue
  stays dominant.
- **Remotion on Windows**: `cd remotion && npm install && npm run render --
  --composition TitleReveal --out ..\Output\graphics\title.mov` — the
  composition is already proven (ProRes 4444 + alpha) in the build container.
- **Resolve fallback**: check for `fusionscript`/Resolve scripting; record
  honestly in `docs\audit\DAVINCI_RESOLVE_FALLBACK_REPORT.md` (template: if
  not installed, the adapter stays unsupported — do not fake it).
- **Windows refuter**: spawn a fresh adversarial subagent against the real
  results → `docs\agents\AGENT_G_WINDOWS_REFUTER_REPORT.md`; fix P0/P1.
- **Codex**: only after everything above —
  `powershell -ExecutionPolicy Bypass -File RUN_CODEX_REVIEW.ps1`.

## Report checklist (what "done" produces)

- WINDOWS_PREFLIGHT_REPORT.md · IMPORT_PROVENANCE.md ·
  WINDOWS_REPOSITORY_RECONCILIATION.md
- RTX_3090_TRANSCRIPTION_REPORT.md (real run data)
- REAL_CAMERA_CODEC_MATRIX.md + real_camera_codec_matrix.json
- FOUR_EDITORS_ASSET_LIBRARY_REPORT.md + OCULAR_SOUND_LIBRARY_REPORT.md
- REMOTION_VERTICAL_SLICE_REPORT.md (Windows re-render)
- PREMIERE_MCP_CAPABILITY_REPORT.md + PREMIERE_VERTICAL_SLICE_REPORT.md
- DAVINCI_RESOLVE_FALLBACK_REPORT.md
- WINDOWS_REAL_MEDIA_E2E_REPORT.md + VETTAREY_REAL_FOOTAGE_REPORT.md
- AGENT_G_WINDOWS_REFUTER_REPORT.md · CODEX_REVIEW_RESULTS.md + RESOLUTION
