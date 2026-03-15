@echo off
TITLE Roblox Audio Server
color 0e

echo =======================================================
echo          STARTING ROBLOX YOUTUBE SERVER
echo =======================================================
echo.
echo Make sure you have already run '1_Install_Server.bat'!
echo Keep this window open while playing Roblox.
echo.

cd Server
node server.js

IF %ERRORLEVEL% NEQ 0 (
    color 0c
    echo.
    echo [ERROR] The server closed unexpectedly!
    echo Did you forget to run '1_Install_Server.bat' first?
    echo Did you get a missing module error?
    echo.
    pause
    exit
)
pause
