@echo off
title AI Recruitment System - Complete Application Launcher
echo ========================================================
echo Launching AI-Powered HR Recruitment & Candidate Screening
echo ========================================================
echo.
echo Starting Backend on http://localhost:8000 ...
start "Backend - FastAPI" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo Starting Frontend on http://localhost:5173 ...
set "PATH=C:\Users\Dharma\nodejs;%PATH%"
start "Frontend - Vite React" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo.
pause
