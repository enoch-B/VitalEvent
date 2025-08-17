@echo off
echo Starting VEIMS Backend Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo Warning: .env file not found
    echo Please copy env.example to .env and configure your settings
    echo.
)

REM Create required directories
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Initialize database
echo Initializing database...
npm run db:migrate
if %errorlevel% neq 0 (
    echo Warning: Database migration failed
    echo.
)

REM Start the server
echo Starting server...
echo.
echo Server will be available at: http://localhost:5000
echo Health check: http://localhost:5000/health
echo API base: http://localhost:5000/api/v1
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
