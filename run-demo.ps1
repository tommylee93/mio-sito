$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "backend"
$venvPython = Join-Path $backendDir ".venv\Scripts\python.exe"

if (-not (Test-Path $venvPython)) {
  Write-Host "[demo] Creo virtual environment backend..."
  python -m venv (Join-Path $backendDir ".venv")
  & $venvPython -m pip install -r (Join-Path $backendDir "requirements.txt")
}

Write-Host "[demo] Avvio backend FastAPI in una nuova finestra..."
$backendCmd = "Set-Location '$backendDir'; .\.venv\Scripts\Activate.ps1; uvicorn app:app --reload --host 127.0.0.1 --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Write-Host "[demo] Avvio frontend Vite (localhost:5173)..."
Set-Location $root
npm.cmd run dev
