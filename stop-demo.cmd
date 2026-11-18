@echo off
rem Stops ONLY the IIS Express process listening on port 8090 (the demo).
rem The Dashboard's IIS Express process (other port) is left running.
setlocal
set PORT=8090
set FOUND=
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  for /f "tokens=1" %%N in ('tasklist /FI "PID eq %%P" /NH') do (
    if /I "%%N"=="iisexpress.exe" (
      taskkill /PID %%P /F >nul && echo Demo detenida (PID %%P^).
      set FOUND=1
    ) else (
      echo [AVISO] El puerto %PORT% lo usa %%N ^(PID %%P^), no IIS Express. No se detiene.
      set FOUND=1
    )
  )
)
if not defined FOUND echo No hay nada escuchando en el puerto %PORT%.
