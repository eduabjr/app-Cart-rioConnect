# Script de Pull do Git
# Execute: npm run pull ou .\pull.ps1
# Repositório: https://github.com/eduabjr

$repoName = "app-Cart-rioConnect"
$repoUrl = "https://github.com/eduabjr/$repoName.git"

Write-Host "⬇️  Pull - CartórioConnect" -ForegroundColor Cyan
Write-Host "Repositório: https://github.com/eduabjr/$repoName" -ForegroundColor Gray
Write-Host ""

# Verificar se Git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não está instalado." -ForegroundColor Red
    exit 1
}

# Verificar se é um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "❌ Este diretório não é um repositório Git." -ForegroundColor Red
    Write-Host "Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    
    # Configurar remote
    $expectedRemote = $repoUrl
    Write-Host "Configurando remote: $expectedRemote" -ForegroundColor Yellow
    git remote add origin $expectedRemote
    Write-Host "✅ Repositório Git inicializado e remote configurado" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Repositório vazio. Use 'git pull origin main' após criar o repositório no GitHub." -ForegroundColor Yellow
    exit 0
}

# Verificar e configurar remote
$remote = git remote get-url origin 2>$null
$expectedRemote = $repoUrl

if (-not $remote) {
    Write-Host "⚠️  Remote não configurado." -ForegroundColor Yellow
    Write-Host "Configurando remote: $expectedRemote" -ForegroundColor Yellow
    git remote add origin $expectedRemote
    Write-Host "✅ Remote configurado" -ForegroundColor Green
} elseif ($remote -ne $expectedRemote) {
    Write-Host "⚠️  Remote atual: $remote" -ForegroundColor Yellow
    Write-Host "Atualizando para: $expectedRemote" -ForegroundColor Yellow
    git remote set-url origin $expectedRemote
    Write-Host "✅ Remote atualizado" -ForegroundColor Green
} else {
    Write-Host "✅ Remote configurado corretamente: $remote" -ForegroundColor Green
}

# Verificar branch
$branch = git branch --show-current
if (-not $branch) {
    Write-Host "⚠️  Nenhuma branch encontrada. Tentando pull da branch 'main'..." -ForegroundColor Yellow
    $branch = "main"
} else {
    Write-Host "✅ Branch atual: $branch" -ForegroundColor Green
}

Write-Host ""

# Pull
Write-Host "📥 Fazendo pull de $repoUrl ($branch)..." -ForegroundColor Yellow
git pull origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Pull concluído com sucesso!" -ForegroundColor Green
    Write-Host "📦 Repositório: https://github.com/eduabjr/$repoName" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer pull." -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o repositório existe: https://github.com/eduabjr/$repoName" -ForegroundColor White
    Write-Host "2. Verifique suas credenciais Git" -ForegroundColor White
    Write-Host "3. Tente manualmente: git pull origin $branch" -ForegroundColor White
    exit 1
}

Write-Host ""
