# Meilisearch Startup Script for Windows
Write-Host "🚀 Meilisearch Startup Script" -ForegroundColor Cyan
Write-Host ""

# Check if Meilisearch is already running
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:7700/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Meilisearch is already running!" -ForegroundColor Green
    Write-Host ""
    exit 0
} catch {
    Write-Host "ℹ️  Meilisearch is not running. Let's start it..." -ForegroundColor Yellow
    Write-Host ""
}

# Check if meilisearch.exe exists in current directory
if (Test-Path ".\meilisearch.exe") {
    Write-Host "📦 Found meilisearch.exe in current directory" -ForegroundColor Green
    Write-Host "🚀 Starting Meilisearch..." -ForegroundColor Yellow
    Start-Process -FilePath ".\meilisearch.exe" -WindowStyle Normal
    Write-Host "✅ Meilisearch started! Waiting for it to be ready..." -ForegroundColor Green
    Start-Sleep -Seconds 3
    
    # Wait for Meilisearch to be ready
    $maxAttempts = 10
    $attempt = 0
    while ($attempt -lt $maxAttempts) {
        try {
            $health = Invoke-WebRequest -Uri "http://127.0.0.1:7700/health" -TimeoutSec 2 -ErrorAction Stop
            Write-Host "✅ Meilisearch is ready!" -ForegroundColor Green
            Write-Host ""
            exit 0
        } catch {
            $attempt++
            Start-Sleep -Seconds 1
        }
    }
    Write-Host "⚠️  Meilisearch started but may not be ready yet. Please check manually." -ForegroundColor Yellow
} elseif (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "🐳 Docker found. Starting Meilisearch in Docker..." -ForegroundColor Cyan
    
    # Check if container already exists
    $existingContainer = docker ps -a --filter "name=meilisearch" --format "{{.Names}}" 2>$null
    if ($existingContainer -eq "meilisearch") {
        Write-Host "📦 Found existing container. Starting it..." -ForegroundColor Yellow
        docker start meilisearch 2>$null
    } else {
        Write-Host "🚀 Creating new Meilisearch container..." -ForegroundColor Yellow
        docker run -d --name meilisearch -p 7700:7700 getmeili/meilisearch:latest
    }
    
    Write-Host "✅ Meilisearch started in Docker!" -ForegroundColor Green
    Write-Host "   Access it at: http://127.0.0.1:7700" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Meilisearch binary not found and Docker is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please choose one of these options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Download Meilisearch binary" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://github.com/meilisearch/meilisearch/releases" -ForegroundColor White
    Write-Host "   2. Download: meilisearch-windows-amd64.exe" -ForegroundColor White
    Write-Host "   3. Rename it to: meilisearch.exe" -ForegroundColor White
    Write-Host "   4. Place it in this directory: $PWD" -ForegroundColor White
    Write-Host "   5. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Install Docker Desktop" -ForegroundColor Cyan
    Write-Host "   1. Download: https://www.docker.com/products/docker-desktop/" -ForegroundColor White
    Write-Host "   2. Install and start Docker Desktop" -ForegroundColor White
    Write-Host "   3. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}

