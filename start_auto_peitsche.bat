@echo off
echo === Auto-Peitsche Setup und Start ===
echo.

:: Prüfen ob Python da ist
python --version >nul 2>&1
if errorlevel 1 (
    echo [FEHLER] Python nicht gefunden! Bitte Python installieren.
    pause
    exit /b 1
)

:: Dependencies installieren
echo Installiere Abhängigkeiten...
pip install -r requirements_auto.txt -q

echo.
echo Starte Auto-Peitsche...
echo.

:: Als Admin starten (keyboard library braucht das manchmal)
python auto_peitsche.py

pause
