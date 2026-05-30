@echo off
setlocal enabledelayedexpansion

REM Run backend and frontend in separate command windows.
start "FlowBoard API" cmd /k cd /d %~dp0apps\api ^&^& npm install ^&^& npm run start:dev

timeout /t 2 /nobreak > nul
start "FlowBoard Web" cmd /k cd /d %~dp0apps\web ^&^& npm install ^&^& npm run dev

timeout /t 8 /nobreak > nul
start "" "http://192.168.40.48:3000"

echo.
echo Backend and frontend should now be starting in new windows.
echo The browser should open automatically. If not, open this URL in Chrome:
echo http://192.168.40.48:3000
pause
