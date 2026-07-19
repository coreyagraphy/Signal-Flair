@echo off
REM Start the Content OS watch-folder pipeline.
cd /d "%~dp0"
if exist ".venv\Scripts\python.exe" (set PY=.venv\Scripts\python.exe) else (set PY=python)
%PY% contentos_cli.py watch
pause
