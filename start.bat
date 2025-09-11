@echo off
echo Starting Heavy Metal SIH Application...
echo.

echo Installing dependencies...
call npm run install-all

echo.
echo Starting development servers...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:8000
echo.

call npm run dev