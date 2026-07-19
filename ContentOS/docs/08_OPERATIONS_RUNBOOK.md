# Operations runbook

## Daily use
1. `START_CONTENT_OS.bat` (watch worker).
2. Drop MP4/MOV files into `Input\inbox`. Watch the console or `app.py`.
3. When a job reaches `awaiting_review`: `START_REVIEW.bat <job_id>`.
4. Approve → `python contentos_cli.py approve <job_id>` (final renders +
   distribution prep), then `distribute <job_id>` for dry-run packages.

## When something fails
- `python contentos_cli.py status` — list; `status <job_id>` — events + error.
- `python contentos_cli.py retry <job_id>` — resumes from the failed stage.
- Codec-blocked jobs (`status: blocked`): read
  `Output\reports\<job>_codec_report.md` — it names the missing decoder or
  damage type and the recommended path. Originals are preserved in
  `Media\originals`; inbox rejects are quarantined in `Input\failed`.
- Database is `data\contentos.db` (WAL). Back it up by copying while no
  worker runs. `migrate` is idempotent.
- Full environment check: `python contentos_cli.py doctor` (exit 0 = healthy).

## Routine verification
`RUN_TESTS.bat`, or individually: `validate_project.py`, `pytest`,
`scripts/run_e2e.py`, `scripts/run_codec_matrix.py --quick`.
