@echo off
title Store Rating Platform Runner
echo ====================================================
echo Starting Store Rating Platform (FullStack Challenge)
echo ====================================================

start "Backend Server (Port 5000)" cmd /k "cd /d %~dp0backend && npm start"
start "Frontend App (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers have been launched!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo ====================================================
timeout /t 5
start http://localhost:3000
