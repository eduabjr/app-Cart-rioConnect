Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APLICATIVO DE CONSULTA DE CARTORIOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Iniciando aplicativo..." -ForegroundColor Green
npm run dev

