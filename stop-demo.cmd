@echo off
REM Stops ONLY the IIS Express process started with /port:<PORT> (default 8090).
REM The Dashboard's IIS Express (other port) is left running.
REM netstat shows PID 4 (http.sys) for IIS Express ports, so match the command line instead.
setlocal
set "PUERTO=%~1"
if "%PUERTO%"=="" set "PUERTO=8090"
powershell -NoProfile -Command ^
  "$p = Get-CimInstance Win32_Process -Filter \"Name='iisexpress.exe'\" | Where-Object { $_.CommandLine -match '/port:%PUERTO%(\s|$)' };" ^
  "if (-not $p) { 'No hay ninguna demo en ejecucion en el puerto %PUERTO%.'; exit 0 };" ^
  "foreach ($x in $p) { Stop-Process -Id $x.ProcessId -Force; 'Demo detenida (PID ' + $x.ProcessId + ').' }"
