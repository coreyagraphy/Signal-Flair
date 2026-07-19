# Content OS Windows installer. Run from the repository root:
#   powershell -ExecutionPolicy Bypass -File scripts\install.ps1 [-Dev] [-Asr] [-Ui]
# No administrator privileges required. Never prints secrets.
param(
    [switch]$Dev,
    [switch]$Asr,
    [switch]$Ui
)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "== Content OS installer ==" -ForegroundColor Cyan

# 1. Python virtual environment
$venv = Join-Path $root ".venv"
if (-not (Test-Path $venv)) {
    Write-Host "Creating virtual environment..."
    python -m venv $venv
}
$py = Join-Path $venv "Scripts\python.exe"
& $py -m pip install --upgrade pip setuptools wheel | Out-Null

# 2. Runtime dependencies
Write-Host "Installing runtime dependencies..."
& $py -m pip install -r requirements.txt
if ($Dev) { & $py -m pip install -r requirements-dev.txt }
if ($Ui)  { & $py -m pip install streamlit }
if ($Asr) {
    Write-Host "Installing faster-whisper (GPU support requires NVIDIA CUDA libraries)..."
    & $py -m pip install faster-whisper
}

# 3. Tool checks (report, don't fail)
foreach ($tool in @("ffmpeg", "ffprobe")) {
    if (Get-Command $tool -ErrorAction SilentlyContinue) {
        Write-Host "OK: $tool found" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $tool — install FFmpeg and add it to PATH (winget install Gyan.FFmpeg)" -ForegroundColor Yellow
    }
}
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
    Write-Host "OK: NVIDIA GPU detected" -ForegroundColor Green
} else {
    Write-Host "NOTE: nvidia-smi not found — transcription will use CPU fallback" -ForegroundColor Yellow
}
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "OK: Ollama installed" -ForegroundColor Green
} else {
    Write-Host "NOTE: Ollama not found — strategy generation will use template fallback" -ForegroundColor Yellow
}

# 4. Initialize
& $py contentos_cli.py init
& $py contentos_cli.py doctor
Write-Host "Done. Start with START_CONTENT_OS.bat" -ForegroundColor Cyan
