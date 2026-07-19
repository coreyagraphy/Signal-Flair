# Environment doctor wrapper.
$root = Split-Path -Parent $PSScriptRoot
$py = Join-Path $root ".venv\Scripts\python.exe"
if (-not (Test-Path $py)) { $py = "python" }
& $py (Join-Path $root "contentos_cli.py") doctor
exit $LASTEXITCODE
