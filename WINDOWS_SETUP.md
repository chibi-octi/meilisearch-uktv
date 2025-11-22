# Meilisearch Setup for Windows

## Option 1: Download Meilisearch Binary (Easiest for Windows)

1. **Download Meilisearch:**
   - Go to: https://github.com/meilisearch/meilisearch/releases
   - Download `meilisearch-windows-amd64.exe` (or the latest Windows release)
   - Save it to a folder (e.g., `C:\meilisearch\`)

2. **Run Meilisearch:**
   ```powershell
   # Navigate to where you saved the file
   cd C:\meilisearch
   
   # Run Meilisearch
   .\meilisearch-windows-amd64.exe
   ```

3. **Keep it running** - Leave this terminal window open while you use the app.

## Option 2: Install Docker Desktop for Windows

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Download and install Docker Desktop for Windows

2. **Start Docker Desktop** (wait for it to fully start)

3. **Run Meilisearch:**
   ```powershell
   docker run -d --name meilisearch -p 7700:7700 getmeili/meilisearch:latest
   ```

## Option 3: Use WSL2 (Windows Subsystem for Linux)

If you have WSL2 installed:

```bash
# In WSL2 terminal
curl -L https://install.meilisearch.com | sh
./meilisearch
```

## After Starting Meilisearch

1. **Verify it's running:**
   - Open browser: http://127.0.0.1:7700
   - You should see Meilisearch welcome page

2. **Run the setup script:**
   ```powershell
   npm run setup-meilisearch
   ```

3. **Start your app:**
   ```powershell
   npm run dev
   ```

## Quick PowerShell Script

Save this as `start-meilisearch.ps1`:

```powershell
# Check if Meilisearch is already running
$response = try { Invoke-WebRequest -Uri "http://127.0.0.1:7700/health" -TimeoutSec 2 } catch { $null }

if ($response) {
    Write-Host "Meilisearch is already running!" -ForegroundColor Green
} else {
    Write-Host "Starting Meilisearch..." -ForegroundColor Yellow
    
    # Option 1: If you have the binary
    if (Test-Path ".\meilisearch.exe") {
        Start-Process -FilePath ".\meilisearch.exe" -WindowStyle Minimized
        Write-Host "Meilisearch started!" -ForegroundColor Green
    }
    # Option 2: If you have Docker
    elseif (Get-Command docker -ErrorAction SilentlyContinue) {
        docker run -d --name meilisearch -p 7700:7700 getmeili/meilisearch:latest
        Write-Host "Meilisearch started in Docker!" -ForegroundColor Green
    }
    else {
        Write-Host "Please install Meilisearch or Docker first!" -ForegroundColor Red
    }
}

Start-Sleep -Seconds 2
Write-Host "Running setup script..." -ForegroundColor Yellow
npm run setup-meilisearch
```
