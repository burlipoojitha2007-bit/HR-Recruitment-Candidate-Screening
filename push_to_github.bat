@echo off
title Push HR Recruitment System to GitHub
echo ====================================================================
echo  GitHub Push Utility for burlipoojitha2007-bit
echo  Repository: HR-Recruitment-Candidate-Screening
echo ====================================================================
echo.
echo Checking Git status...
git status
echo.
echo Staging and committing all project files...
git add .
git commit -m "Complete AI-Powered HR Recruitment & Screening System"
git branch -M main
echo.
echo --------------------------------------------------------------------
echo Attempting to push to GitHub...
echo (If a browser window or login prompt appears, sign in as burlipoojitha2007-bit)
echo --------------------------------------------------------------------
echo.

git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================================================
    echo Notice: Push failed because Windows is currently signed in as another user.
    echo Clearing old cached credentials and retrying...
    echo ====================================================================
    cmdkey /delete:LegacyGeneric:target=git:https://github.com
    echo.
    echo Please sign into your GitHub account (burlipoojitha2007-bit) in the window that appears:
    git push -u origin main
)

echo.
echo ====================================================================
echo Done! Please check https://github.com/burlipoojitha2007-bit/HR-Recruitment-Candidate-Screening
echo ====================================================================
pause
