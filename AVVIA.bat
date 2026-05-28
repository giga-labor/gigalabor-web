@echo off
title GiGa Labor - Server locale
color 0B
echo.
echo  ==========================================
echo   GiGa Labor - Avvio server locale
echo   http://localhost:8080
echo  ==========================================
echo.

cd /d "%~dp0"

:: Node.js (preferito - apre il browser automaticamente)
where node >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo  [OK] Node.js trovato. Avvio server...
    echo  Premi Ctrl+C per fermare.
    echo.
    node server.js
    goto :end
)

:: Fallback: Python 3
where python >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo  [OK] Python trovato. Avvio server su porta 8080...
    echo  Premi Ctrl+C per fermare.
    echo.
    start http://localhost:8080
    python -m http.server 8080
    goto :end
)

:: Fallback: Python come py
where py >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo  [OK] Python (py) trovato. Avvio server su porta 8080...
    echo  Premi Ctrl+C per fermare.
    echo.
    start http://localhost:8080
    py -m http.server 8080
    goto :end
)

:: Nessun runtime trovato
echo  [ERRORE] Node.js e Python non trovati.
echo.
echo  Installa uno dei due e riprova:
echo   - Node.js : https://nodejs.org
echo   - Python  : https://python.org
echo.
pause
exit /b 1

:end
pause
