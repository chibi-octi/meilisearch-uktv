# PowerShell script to download and start Meilisearch on Windows

Write-Host "🚀 Starting Meilisearch setup for Windows..." -ForegroundColor Cyan

$meilisearchVersion = "1.7.4"
$downloadUrl = "https://github.com/meilisearch/meilisearch/releases/download/v$meilisearchVersion/meilisearch-windows-amd64.exe"
$meilisearchExe = "meilisearch.exe"
$meilisearchPath = Join-Path $PSScriptRoot ".." $meilisearchExe

# Check if Meilisearch is already running
$process = Get-Process -Name "meilisearch" -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "✅ Meilisearch is already running (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "   Access it at: http://127.0.0.1:7700" -ForegroundColor Yellow
    exit 0
}

# Check if executable exists
if (Test-Path $meilisearchPath) {
    Write-Host "✅ Found Meilisearch executable" -ForegroundColor Green
} else {
    Write-Host "📥 Downloading Meilisearch v$meilisearchVersion..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $meilisearchPath -UseBasicParsing
        Write-Host "✅ Download complete" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download Meilisearch" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Alternative: Download manually from:" -ForegroundColor Yellow
        Write-Host "   https://github.com/meilisearch/meilisearch/releases" -ForegroundColor Cyan
        Write-Host "   Place meilisearch.exe in the project root and run this script again" -ForegroundColor Yellow
        exit 1
    }
}

# Start Meilisearch
Write-Host "🚀 Starting Meilisearch..." -ForegroundColor Cyan
$process = Start-Process -FilePath $meilisearchPath -ArgumentList "--http-addr", "127.0.0.1:7700" -PassThru -WindowStyle Hidden

# Wait a moment for it to start
Start-Sleep -Seconds 2

# Check if it's running
$process = Get-Process -Name "meilisearch" -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "✅ Meilisearch started successfully!" -ForegroundColor Green
    Write-Host "   Process ID: $($process.Id)" -ForegroundColor Yellow
    Write-Host "   Access it at: http://127.0.0.1:7700" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 To stop Meilisearch, run:" -ForegroundColor Cyan
    Write-Host "   Stop-Process -Name meilisearch" -ForegroundColor White
} else {
    Write-Host "❌ Failed to start Meilisearch" -ForegroundColor Red
    Write-Host "   Please check the error messages above" -ForegroundColor Yellow
    exit 1
}

