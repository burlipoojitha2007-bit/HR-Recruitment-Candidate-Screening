@echo off
title HR Recruitment System - FastAPI Backend
echo ========================================================
echo Starting AI Recruitment Backend Server (FastAPI + SQLite)
echo ========================================================
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
