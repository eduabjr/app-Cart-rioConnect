# Script de Push para Git
# Execute: npm run push ou .\push.ps1
# Repositorio: https://github.com/eduabjr/app-Cart-rioConnect.git

param(
    [string]$message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

$repoName = "app-Cart-rioConnect"
$repoUrl = "https://github.com/eduabjr/$repoName.git"

Write-Host "Push - CartorioConnect" -ForegroundColor Cyan
Write-Host "Repositorio: $repoUrl" -ForegroundColor Gray
Write-Host ""

# Verificar se Git esta instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERRO: Git nao esta instalado." -ForegroundColor Red
    exit 1
}

# Verificar se e um repositorio Git
if (-not (Test-Path .git)) {
    Write-Host "ERRO: Este diretorio nao e um repositorio Git." -ForegroundColor Red
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    Write-Host "OK: Repositorio Git inicializado" -ForegroundColor Green
}

# Verificar e configurar remote
$remote = git remote get-url origin 2>$null
$expectedRemote = $repoUrl

if (-not $remote) {
    Write-Host "AVISO: Remote 'origin' nao configurado." -ForegroundColor Yellow
    Write-Host "Configurando remote: $expectedRemote" -ForegroundColor Yellow
    git remote add origin $expectedRemote
    Write-Host "OK: Remote 'origin' configurado" -ForegroundColor Green
} elseif ($remote -ne $expectedRemote) {
    Write-Host "AVISO: Remote 'origin' atual ($remote) e diferente do esperado." -ForegroundColor Yellow
    Write-Host "Atualizando para: $expectedRemote" -ForegroundColor Yellow
    git remote set-url origin $expectedRemote
    Write-Host "OK: Remote 'origin' atualizado" -ForegroundColor Green
} else {
    Write-Host "OK: Remote 'origin' configurado corretamente: $remote" -ForegroundColor Green
}

# Verificar branch
$branch = git branch --show-current
if (-not $branch) {
    Write-Host "AVISO: Nenhuma branch encontrada. Criando branch 'main'..." -ForegroundColor Yellow
    git checkout -b main
    $branch = "main"
} else {
    Write-Host "OK: Branch atual: $branch" -ForegroundColor Green
}

Write-Host ""

# Mostrar status antes de adicionar
Write-Host "Status atual:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Sempre adicionar todos os arquivos (incluindo nao rastreados)
Write-Host "Adicionando todos os arquivos..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Erro ao adicionar arquivos." -ForegroundColor Red
    exit 1
}

# Verificar se ha algo para commitar apos adicionar
$statusAfterAdd = git status --porcelain
if (-not $statusAfterAdd) {
    Write-Host "INFO: Nenhuma mudanca para commitar apos adicionar arquivos." -ForegroundColor Cyan
    Write-Host "Fazendo push mesmo assim..." -ForegroundColor Yellow
} else {
    # Commit
    Write-Host "Fazendo commit..." -ForegroundColor Yellow
    Write-Host "Mensagem: $message" -ForegroundColor Gray
    git commit -m $message
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Erro ao fazer commit." -ForegroundColor Red
        exit 1
    }
    Write-Host "OK: Commit realizado" -ForegroundColor Green
    Write-Host ""
}

# Push
Write-Host "Fazendo push para $repoUrl ($branch)..." -ForegroundColor Yellow

# Verificar se o upstream ja esta configurado
$upstream = git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null
if ($LASTEXITCODE -ne 0) {
    # Upstream nao configurado, usar --set-upstream
    Write-Host "Configurando upstream branch..." -ForegroundColor Gray
    git push --set-upstream origin $branch
} else {
    # Upstream ja configurado, push normal
    git push
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Erro ao fazer push." -ForegroundColor Red
    Write-Host ""
    Write-Host "Possiveis solucoes:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o repositorio existe: $repoUrl" -ForegroundColor White
    Write-Host "2. Verifique suas credenciais Git (git config --global user.name / user.email)" -ForegroundColor White
    Write-Host "3. Tente autenticar novamente (ex: git credential-manager erase)" -ForegroundColor White
    Write-Host "4. Tente manualmente: git push -u origin $branch" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "OK: Push concluido com sucesso!" -ForegroundColor Green
Write-Host "Repositorio: $repoUrl" -ForegroundColor Cyan
Write-Host ""
