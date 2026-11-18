@echo off
REM ---------------------------------------------------------------------
REM  Levanta la demo visual en IIS Express con la raiz del repo como raiz
REM  web, en http://localhost:8090/ (o el puerto del primer argumento).
REM  Adaptado de dev-local.cmd del Dashboard: sitio estatico, sin
REM  Web.config local con credenciales, sin Admin ni SQL.
REM
REM    dev-local.cmd            ->  http://localhost:8090/
REM    dev-local.cmd 8095       ->  http://localhost:8095/
REM
REM  /path genera una configuracion temporal de IIS Express: no toca el
REM  applicationhost.config ni el sitio del Dashboard. No pide admin.
REM  Detener: Q en esta ventana, o stop-demo.cmd [puerto].
REM ---------------------------------------------------------------------
setlocal

set "PUERTO=%~1"
if "%PUERTO%"=="" set "PUERTO=8090"

REM  Si ya hay algo escuchando en el puerto (p. ej. un IIS Express de un
REM  arranque anterior, o el Dashboard), el nuevo no arranca y seguiria
REM  contestando el viejo. Se corta con el aviso.
netstat -ano -p tcp | findstr /C:":%PUERTO% " | findstr /C:"LISTENING" >nul && goto :puertoOcupado

set "IISEXPRESS=%ProgramFiles%\IIS Express\iisexpress.exe"
if not exist "%IISEXPRESS%" set "IISEXPRESS=%ProgramFiles(x86)%\IIS Express\iisexpress.exe"
if not exist "%IISEXPRESS%" (
  echo No se encontro iisexpress.exe.
  exit /b 1
)

if not exist "%~dp0Web.config" (
  echo Falta Web.config en la raiz del repo.
  exit /b 1
)

REM  %~dp0 termina en "\": pasado tal cual a /path: esa barra final
REM  escaparia la comilla de cierre (HTTP 500.19 en el Dashboard). Se
REM  quita la barra final y se pasa la raiz limpia.
set "RAIZ=%~dp0"
if "%RAIZ:~-1%"=="\" set "RAIZ=%RAIZ:~0,-1%"

echo Sirviendo "%RAIZ%" en http://localhost:%PUERTO%/
echo Pulse Q en esta ventana (o ejecute stop-demo.cmd %PUERTO%) para detener.
"%IISEXPRESS%" /path:"%RAIZ%" /port:%PUERTO% /systray:false

endlocal
exit /b

:puertoOcupado
echo ERROR: el puerto %PUERTO% ya esta en uso. Revise que proceso lo usa
echo        (netstat -ano ^| findstr :%PUERTO%) o use otro puerto:
echo          dev-local.cmd 8095
echo        No se cierra nada automaticamente: podria ser el Dashboard.
exit /b 1
