@echo off
setlocal

cd /d "%~dp0frontend"

echo [INFO] Installing frontend dependencies...
npm install

echo [INFO] Starting frontend on http://127.0.0.1:5173 ...
npm run dev

endlocal
