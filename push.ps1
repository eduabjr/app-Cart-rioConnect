# Script de Push para Git
# Execute: npm run push ou .\push.ps1
# Repositório: https://github.com/eduabjr

param(
    [string]$message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

$repoName = "app-Cart-rioConnect"
$repoUrl = "https://github.com/eduabjr/$repoName.git"

Write-Host "🚀 Push - CartórioConnect" -ForegroundColor Cyan
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
    Write-Host "✅ Repositório Git inicializado" -ForegroundColor Green
}

# Verificar e configurar remote
$remote = git remote get-url origin 2>$null
$expectedRemote = $repoUrl

if (-not $remote) {
    Write-Host "⚠️  Remote não configurado." -ForegroundColor Yellow
    Write-Host "Configurando remote: $expectedRemote" -ForegroundColor Yellow
    git remote add origin $expectedRemote
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Remote configurado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Remote já existe, atualizando URL..." -ForegroundColor Yellow
        git remote set-url origin $expectedRemote
        Write-Host "✅ Remote atualizado" -ForegroundColor Green
    }
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
    Write-Host "⚠️  Nenhuma branch encontrada. Criando branch 'main'..." -ForegroundColor Yellow
    git checkout -b main
    $branch = "main"
} else {
    Write-Host "✅ Branch atual: $branch" -ForegroundColor Green
}

Write-Host ""

# Verificar se há mudanças
$status = git status --porcelain
if (-not $status) {
    Write-Host "ℹ️  Nenhuma mudança para commitar." -ForegroundColor Cyan
    Write-Host "Fazendo push mesmo assim..." -ForegroundColor Yellow
} else {
    # Mostrar status
    Write-Host "📝 Mudanças detectadas:" -ForegroundColor Yellow
    git status --short
    Write-Host ""

    # Adicionar todas as mudanças
    Write-Host "➕ Adicionando arquivos..." -ForegroundColor Yellow
    git add .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao adicionar arquivos." -ForegroundColor Red
        exit 1
    }

    # Commit
    Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
    Write-Host "Mensagem: $message" -ForegroundColor Gray
    git commit -m $message
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao fazer commit." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Commit realizado" -ForegroundColor Green
    Write-Host ""
}

# Push
Write-Host "📤 Fazendo push para $repoUrl ($branch)..." -ForegroundColor Yellow

# Verificar se o upstream já está configurado
$upstream = git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>$null
if ($LASTEXITCODE -ne 0) {
    # Upstream não configurado, usar --set-upstream
    Write-Host "Configurando upstream branch..." -ForegroundColor Gray
    git push --set-upstream origin $branch
} else {
    # Upstream já configurado, push normal
    git push
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer push." -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o repositório existe: https://github.com/eduabjr/$repoName" -ForegroundColor White
    Write-Host "2. Verifique suas credenciais Git" -ForegroundColor White
    Write-Host "3. Se for a primeira vez, tente: git push --set-upstream origin $branch" -ForegroundColor White
    Write-Host "4. Verifique se você tem permissão para fazer push no repositório" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "✅ Push concluído com sucesso!" -ForegroundColor Green
Write-Host "📦 Repositório: https://github.com/eduabjr/$repoName" -ForegroundColor Cyan
Write-Host ""
