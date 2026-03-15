@echo off
TITLE Roblox Audio Server Setup
color 0b

echo =======================================================
echo          ROBLOX YOUTUBE AUDIO SERVER SETUP
echo =======================================================
echo.
echo Checking for Node.js installation...
node -v >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (
    color 0c
    echo [ERROR] Node.js is NOT installed on this computer!
    echo To use this script, you must download Node.js.
    echo Please visit https://nodejs.org and install the LTS version.
    echo.
    pause
    exit
)

echo [OK] Node.js is installed.
echo.
echo Downloading required libraries (this may take a minute)...
cd Server
call npm install
echo.
echo =======================================================
color 0a
echo [SUCCESS] All libraries downloaded successfully!
echo You can now close this window and run '2_Start_Server.bat'.
echo =======================================================
pause
