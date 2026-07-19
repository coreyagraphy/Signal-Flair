# Content OS — Windows verification phase orchestrator.
#
# Automates the scriptable parts of the Windows phase:
#   -Step preflight   → docs\audit\WINDOWS_PREFLIGHT_REPORT.md
#   -Step import      → safe worktree retrieval + standalone repo at the
#                       canonical path + IMPORT_PROVENANCE.md
#   -Step install     → venv + dependencies + doctor
#   -Step verify      → validate_project, pytest, e2e, codec inventory+matrix
#   -Step gpu         → scripts\verify_gpu.py → RTX report skeleton
#   -Step assets      → FourEditors + Ocular scans + reports
#   -Step vettarey    → resolve the YOU_JUST_TOOK_A_L* source, hash it, ingest
#   -Step all         → everything above in order
#
# NOT automated here (require Claude Code / human on this machine):
# Premiere MCP bring-up + vertical slice, Resolve check, Windows refuter,
# Codex review (RUN_CODEX_REVIEW.ps1). See docs\WINDOWS_VERIFICATION_PLAYBOOK.md.
param(
    [ValidateSet("preflight","import","install","verify","gpu","assets","vettarey","all")]
    [string]$Step = "all",
    [string]$SignalFlairRepo = "C:\Users\corey\OneDrive\Desktop\signal-flair",
    [string]$Target = "C:\Users\corey\OneDrive\Desktop\ContentOS_Claude_Codex_Ready",
    [string]$Branch = "claude/content-os-implementation-2ypc8q",
    [string]$ExpectedCommit = "84a0ad2"
)
$ErrorActionPreference = "Stop"

function Step-Preflight {
    param([string]$RepoRoot)
    $report = Join-Path $RepoRoot "docs\audit\WINDOWS_PREFLIGHT_REPORT.md"
    New-Item -ItemType Directory -Force -Path (Split-Path $report) | Out-Null
    $lines = @("# Windows preflight report", "", "Generated: $(Get-Date -Format o)", "")
    $checks = [ordered]@{
        "pwd"          = { (Get-Location).Path }
        "powershell"   = { $PSVersionTable.PSVersion.ToString() }
        "windows"      = { (Get-ComputerInfo | Select-Object -ExpandProperty WindowsProductName) }
        "git"          = { (git --version) }
        "python"       = { (python --version 2>&1) }
        "node"         = { (node --version) }
        "npm"          = { (npm --version) }
        "ffmpeg"       = { (ffmpeg -version 2>&1 | Select-Object -First 1) }
        "ffprobe"      = { (ffprobe -version 2>&1 | Select-Object -First 1) }
        "hwaccels"     = { (ffmpeg -hide_banner -hwaccels 2>&1 | Select-Object -Skip 1) -join ", " }
        "nvidia-smi"   = { (nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>&1) }
        "ollama"       = { (ollama --version 2>&1) }
        "claude"       = { if (Get-Command claude -ErrorAction SilentlyContinue) { "present" } else { "absent" } }
        "codex"        = { if (Get-Command codex -ErrorAction SilentlyContinue) { "present" } else { "absent (check npm fallback)" } }
    }
    foreach ($name in $checks.Keys) {
        try { $value = & $checks[$name] } catch { $value = "UNAVAILABLE: $($_.Exception.Message)" }
        $lines += "- **$name**: $value"
    }
    foreach ($p in @($SignalFlairRepo, $Target,
                     "C:\Users\corey\OneDrive\Desktop\FourEditors",
                     "C:\Users\corey\OneDrive\Desktop\SoundDesign\Ocular",
                     "C:\Users\corey\OneDrive\Desktop\VettaRey",
                     "C:\Users\corey\Tools\premiere-mcp")) {
        $lines += "- **path** ``$p``: $(if (Test-Path $p) { 'EXISTS' } else { 'missing' })"
    }
    $lines += ""
    $lines += "_No secrets are recorded in this report._"
    Set-Content -Path $report -Value ($lines -join "`n") -Encoding UTF8
    Write-Host "Preflight report: $report" -ForegroundColor Green
}

function Step-Import {
    if (-not (Test-Path $SignalFlairRepo)) { throw "Signal-Flair repo not found at $SignalFlairRepo" }
    Push-Location $SignalFlairRepo
    try {
        git status --short | Out-Host
        git fetch --all --prune | Out-Host
        git show --stat $ExpectedCommit | Select-Object -First 5 | Out-Host

        $worktree = "C:\Users\corey\OneDrive\Desktop\contentos-import-worktree"
        if (Test-Path $worktree) {
            $worktree = "$worktree-$(Get-Date -Format yyyyMMdd-HHmmss)"
        }
        git worktree add $worktree $Branch
        $sourceDir = Join-Path $worktree "ContentOS"
        if (-not (Test-Path $sourceDir)) { throw "ContentOS missing in worktree" }

        if (Test-Path $Target) {
            Write-Host "Target exists — inspecting, NOT overwriting." -ForegroundColor Yellow
            if (Test-Path (Join-Path $Target ".git")) {
                Push-Location $Target; git status --short | Out-Host; Pop-Location
            }
            Write-Host "Compare and merge manually, or move the existing folder aside first."
            return
        }
        New-Item -ItemType Directory -Force -Path $Target | Out-Null
        Copy-Item -Path (Join-Path $sourceDir "*") -Destination $Target -Recurse -Force
        Push-Location $Target
        git init | Out-Null
        git add -A
        git commit -m "chore(repo): import verified Content OS implementation

Imported from coreyagraphy/Signal-Flair branch $Branch
(ContentOS/ subtree) for standalone Windows verification." | Out-Null
        git checkout -b claude/contentos-windows-verification-2026-07-19
        $fileCount = (git ls-files | Measure-Object).Count
        $srcCommit = (git -C $SignalFlairRepo rev-parse $Branch)
        $prov = @(
            "# Import provenance", "",
            "- Source repository: coreyagraphy/Signal-Flair ($SignalFlairRepo)",
            "- Source branch: $Branch",
            "- Source commit: $srcCommit (expected prefix: $ExpectedCommit)",
            "- Import date: $(Get-Date -Format o)",
            "- Imported directory: ContentOS/",
            "- Destination: $Target",
            "- Files imported: $fileCount",
            "- Method: git worktree at $worktree, content copy without .git", ""
        )
        New-Item -ItemType Directory -Force -Path "docs\audit" | Out-Null
        Set-Content -Path "docs\audit\IMPORT_PROVENANCE.md" -Value ($prov -join "`n") -Encoding UTF8
        git add docs\audit\IMPORT_PROVENANCE.md
        git commit -m "docs(audit): record import provenance" | Out-Null
        Pop-Location
        Write-Host "Standalone repository ready at $Target" -ForegroundColor Green
        Write-Host "NOTE: no remote is configured — create a new GitHub repo before pushing."
    } finally { Pop-Location }
}

function Get-Python { param([string]$RepoRoot)
    $venvPy = Join-Path $RepoRoot ".venv\Scripts\python.exe"
    if (Test-Path $venvPy) { return $venvPy } else { return "python" }
}

function Step-Install { param([string]$RepoRoot)
    Push-Location $RepoRoot
    try {
        powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Dev -Asr -Ui
        if (Test-Path "remotion") {
            Push-Location remotion; npm install --no-audit --no-fund; Pop-Location
        }
    } finally { Pop-Location }
}

function Step-Verify { param([string]$RepoRoot)
    Push-Location $RepoRoot
    $py = Get-Python $RepoRoot
    try {
        & $py validate_project.py; if ($LASTEXITCODE) { throw "validate failed" }
        & $py -m pytest -q;        if ($LASTEXITCODE) { throw "pytest failed" }
        & $py contentos_cli.py doctor
        & $py contentos_cli.py codec-inventory
        & $py scripts\run_e2e.py;  if ($LASTEXITCODE) { throw "e2e failed" }
        & $py scripts\run_codec_matrix.py
    } finally { Pop-Location }
}

function Step-Gpu { param([string]$RepoRoot)
    Push-Location $RepoRoot
    $py = Get-Python $RepoRoot
    try {
        & $py scripts\verify_gpu.py | Tee-Object -Variable gpuOut
        $report = "docs\audit\RTX_3090_TRANSCRIPTION_REPORT.md"
        @("# RTX 3090 transcription verification", "",
          "Generated: $(Get-Date -Format o)", "", '```', $gpuOut, '```', "",
          "Run a real transcription next:",
          '```', "python contentos_cli.py ingest <short-approved-video.mp4>", '```',
          "then paste the transcribed job's engine_mode/timings here from",
          "``python contentos_cli.py status <job_id>``.") |
            Set-Content -Path $report -Encoding UTF8
        Write-Host "GPU report skeleton: $report"
    } finally { Pop-Location }
}

function Step-Assets { param([string]$RepoRoot)
    Push-Location $RepoRoot
    $py = Get-Python $RepoRoot
    try {
        & $py contentos_cli.py assets scan "C:\Users\corey\OneDrive\Desktop\FourEditors" --name four_editors
        & $py contentos_cli.py assets report
        & $py contentos_cli.py assets scan "C:\Users\corey\OneDrive\Desktop\SoundDesign\Ocular" --name ocular_sound_design
        & $py contentos_cli.py assets report
    } finally { Pop-Location }
}

function Step-VettaRey { param([string]$RepoRoot)
    Push-Location $RepoRoot
    $py = Get-Python $RepoRoot
    try {
        New-Item -ItemType Directory -Force -Path "data\capabilities" | Out-Null
        & $py scripts\resolve_source.py --root "C:\Users\corey\OneDrive\Desktop\VettaRey" `
            --prefix "YOU_JUST_TOOK_A_L" --out "data\capabilities\vettarey_resolution.json"
        if ($LASTEXITCODE) { throw "No VettaRey source resolved — inspect data\capabilities\vettarey_resolution.json" }
        $resolution = Get-Content "data\capabilities\vettarey_resolution.json" | ConvertFrom-Json
        $primary = $resolution.primary
        Write-Host "Primary source: $primary" -ForegroundColor Green
        Write-Host "Ingesting (managed copy; original untouched)..."
        & $py contentos_cli.py ingest "$primary"
        & $py contentos_cli.py status
        Write-Host "After the run completes, re-hash the original:"
        Write-Host "  Get-FileHash -Algorithm SHA256 -LiteralPath `"$primary`""
        Write-Host "and confirm it matches the sha256 recorded in the resolution JSON."
    } finally { Pop-Location }
}

switch ($Step) {
    "preflight" { Step-Preflight -RepoRoot (Get-Location).Path }
    "import"    { Step-Import }
    "install"   { Step-Install -RepoRoot $Target }
    "verify"    { Step-Verify -RepoRoot $Target }
    "gpu"       { Step-Gpu -RepoRoot $Target }
    "assets"    { Step-Assets -RepoRoot $Target }
    "vettarey"  { Step-VettaRey -RepoRoot $Target }
    "all" {
        Step-Import
        Step-Preflight -RepoRoot $Target
        Step-Install -RepoRoot $Target
        Step-Verify -RepoRoot $Target
        Step-Gpu -RepoRoot $Target
        Step-Assets -RepoRoot $Target
        Step-VettaRey -RepoRoot $Target
        Write-Host "`nScripted phase complete. Remaining manual/AI-session steps:" -ForegroundColor Cyan
        Write-Host " 1. Premiere MCP bring-up + vertical slice (docs\05)"
        Write-Host " 2. Resolve fallback check (docs\WINDOWS_VERIFICATION_PLAYBOOK.md)"
        Write-Host " 3. Windows refuter subagent (Claude Code)"
        Write-Host " 4. Codex review: powershell -File RUN_CODEX_REVIEW.ps1"
    }
}
