@echo off
REM Alias for the watch worker (same process handles ingest + pipeline).
cd /d "%~dp0"
if exist ".venv\Scripts\python.exe" (set PY=.venv\Scripts\python.exe) else (set PY=python)
%PY% contentos_cli.py watch
pause
