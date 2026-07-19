# Execute the independent Codex review of Content OS.
# Run from the repository root on the Windows workstation.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$resultsFile = "docs\reviews\CODEX_REVIEW_RESULTS.md"
$prompt = Get-Content -Raw "docs\reviews\CODEX_REVIEW_PROMPT.md"

# 1. Locate the Codex CLI (never guess flags — inspect help output first).
$codex = Get-Command codex -ErrorAction SilentlyContinue
$invoke = $null
if ($codex) {
    $invoke = { param($cliArgs) & codex @cliArgs }
} else {
    $fallback = "$env:APPDATA\npm\node_modules\@openai\codex\bin\codex.js"
    if (Test-Path $fallback) {
        $invoke = { param($cliArgs) & node $fallback @cliArgs }
        Write-Host "Using fallback CLI at $fallback"
    }
}
if (-not $invoke) {
    Write-Host "Codex CLI not found. Install it, then re-run this script." -ForegroundColor Yellow
    Write-Host "The repository remains ready for review; do NOT record a review as done."
    exit 1
}

& $invoke @("--version")
Write-Host "`n--- codex review --help (inspect before use) ---"
& $invoke @("review", "--help") 2>&1 | Tee-Object -Variable reviewHelp | Out-Host

$header = "# Codex review results`n`nExecuted: $(Get-Date -Format o)`n`n"
if ($LASTEXITCODE -eq 0 -and ($reviewHelp -match "review")) {
    Write-Host "Running: codex review (read-only first pass)"
    $output = & $invoke @("review") 2>&1 | Out-String
} else {
    Write-Host "codex review unavailable; using codex exec with the review prompt (read-only sandbox)"
    $output = $prompt | & $invoke @("exec", "--sandbox", "read-only", "-") 2>&1 | Out-String
}
Set-Content -Path $resultsFile -Value ($header + '```' + "`n" + $output + "`n" + '```') -Encoding UTF8
Write-Host "Review output captured to $resultsFile"
Write-Host "Next: classify findings into docs\reviews\CODEX_REVIEW_RESOLUTION.md, fix, re-verify, and request a second pass."
