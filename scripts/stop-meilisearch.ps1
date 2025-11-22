# PowerShell script to stop Meilisearch on Windows

Write-Host "🛑 Stopping Meilisearch..." -ForegroundColor Yellow

$processes = Get-Process -Name "meilisearch" -ErrorAction SilentlyContinue

if ($processes) {
    foreach ($process in $processes) {
        Stop-Process -Id $process.Id -Force
        Write-Host "✅ Stopped Meilisearch (PID: $($process.Id))" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  Meilisearch is not running" -ForegroundColor Yellow
}

