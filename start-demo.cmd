@echo off
rem Serves this folder with the existing IIS Express at http://localhost:8090
rem Uses /path mode: IIS Express generates a temporary config in %TEMP%;
rem the Dashboard's applicationhost.config is NOT touched. No admin rights needed.
setlocal
set PORT=8090
set SITE=%~dp0
if "%SITE:~-1%"=="\" set SITE=%SITE:~0,-1%

set IISX=%ProgramFiles%\IIS Express\iisexpress.exe
if not exist "%IISX%" set IISX=%ProgramFiles(x86)%\IIS Express\iisexpress.exe
if not exist "%IISX%" (
  echo [ERROR] IIS Express no encontrado.
  exit /b 1
)

netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul
if not errorlevel 1 (
  echo [ERROR] El puerto %PORT% ya esta en uso. Revise con: netstat -ano ^| findstr :%PORT%
  exit /b 1
)

echo Sirviendo "%SITE%" en http://localhost:%PORT%/
echo Pulse Q en esta ventana (o ejecute stop-demo.cmd) para detener.
"%IISX%" /path:"%SITE%" /port:%PORT% /systray:false
