@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo === music-sep first-time setup ===
echo Project: %cd%
echo.

where python >nul 2>&1
if errorlevel 1 (
    echo Python was not found on PATH. Install Python 3.10+ and try again.
    exit /b 1
)

if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment: venv
    python -m venv venv
    if errorlevel 1 exit /b 1
)

call "%~dp0venv\Scripts\activate.bat"

echo Upgrading pip...
python -m pip install --upgrade pip
if errorlevel 1 exit /b 1

echo.
echo Installing dependencies from requirements.txt...
pip install -r requirements.txt
if errorlevel 1 exit /b 1

echo.
echo Prefetching Demucs weights ^(may download on first run^)...
python -c "import demucs_runner; demucs_runner.load_pipeline(); print('Demucs ready.')"
if errorlevel 1 (
    echo Demucs prefetch failed. Weights will download on first Separate in the app.
)

echo.
echo Setup finished.
echo Start the app with: run.bat
echo.
exit /b 0
