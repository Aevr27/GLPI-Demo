@echo off
rem Stops ONLY the IIS Express process started with /port:8090 (this demo).
rem The Dashboard's IIS Express process (other port / config) is left running.
rem Note: netstat shows PID 4 (http.sys) for IIS Express ports, so we match the command line instead.
powershell -NoProfile -Command ^
  "$p = Get-CimInstance Win32_Process -Filter \"Name='iisexpress.exe'\" | Where-Object { $_.CommandLine -match '/port:8090(\s|$)' };" ^
  "if (-not $p) { 'No hay ninguna demo en ejecucion en el puerto 8090.'; exit 0 };" ^
  "foreach ($x in $p) { Stop-Process -Id $x.ProcessId -Force; 'Demo detenida (PID ' + $x.ProcessId + ').' }"
