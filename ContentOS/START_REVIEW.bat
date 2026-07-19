@echo off
REM Serve the review UI for a job: START_REVIEW.bat job_abc123
cd /d "%~dp0"
if exist ".venv\Scripts\python.exe" (set PY=.venv\Scripts\python.exe) else (set PY=python)
if "%~1"=="" (
  echo Usage: START_REVIEW.bat ^<job_id^>
  %PY% contentos_cli.py status
  pause
  exit /b 1
)
start http://127.0.0.1:8765/review.html
%PY% contentos_cli.py review %1
pause
