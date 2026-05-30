@echo off
setlocal enabledelayedexpansion

REM Run backend and frontend in separate command windows.
start "FlowBoard API" cmd /k cd /d %~dp0apps\api ^&^& npm install ^&^& npm run start:dev

timeout /t 2 /nobreak > nul
start "FlowBoard Web" cmd /k cd /d %~dp0apps\web ^&^& npm install ^&^& npm run dev

timeout /t 8 /nobreak > nul
start "FlowBoard Tunnel" cmd /k ngrok http 3000

echo.
echo Backend, frontend, and ngrok should now be starting.
echo If ngrok opens correctly, it will display a public HTTPS URL for the site.
echo If the browser does not open automatically, open the URL shown in the ngrok window.
pause
