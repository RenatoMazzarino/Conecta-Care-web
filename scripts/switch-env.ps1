<#
 Script para alternar entre ambiente LOCAL e CLOUD.
 As credenciais reais ficam em scripts/env-presets.json (gitignored) para evitar chaves no repositório.
#>

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("local", "cloud")]
    [string]$Mode
)

$envFile = ".env.local.dev"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$presetsPath = Join-Path $scriptRoot "env-presets.json"

if (-not (Test-Path $presetsPath)) {
    Write-Host "⚠️  Não encontrei '$presetsPath'." -ForegroundColor Red
    Write-Host "Crie a partir de 'scripts/env-presets.example.json' e preencha suas chaves reais." -ForegroundColor Yellow
    exit 1
}

try {
    $presetsJson = Get-Content -Path $presetsPath -Raw
    $presets = ConvertFrom-Json -InputObject $presetsJson -AsHashtable
} catch {
    Write-Host "❌ Não consegui carregar '$presetsPath': $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

function Get-ModeFromFile {
    param([string]$filePath)
    if (-not (Test-Path $filePath)) {
        return $null
    }

    $modeMatch = Select-String -Path $filePath -Pattern "^# Mode:\s*(\w+)" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($modeMatch) {
        return $modeMatch.Matches.Groups[1].Value
    }

    $currentUrl = Select-String -Path $filePath -Pattern "^NEXT_PUBLIC_SUPABASE_URL=(.+)" -ErrorAction SilentlyContinue | ForEach-Object { $_.Matches.Groups[1].Value }
    if ($currentUrl -and $currentUrl -like "*127.0.0.1*") {
        return "local"
    }
    if ($currentUrl) {
        return "cloud"
    }
    return $null
}

function Write-PresetToFile {
    param(
        [string]$mode,
        [hashtable]$preset
    )

    $lines = @(
        "# Managed by scripts/switch-env.ps1",
        "# Mode: $mode",
        "# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    )

    foreach ($key in $preset.Keys | Sort-Object) {
        $value = $preset[$key]
        if ($null -eq $value -or $value -eq "") {
            continue
        }
        $lines += "$key=$value"
    }

    Set-Content -Path $envFile -Value ($lines -join [Environment]::NewLine)
}

if (-not $Mode) {
    $currentMode = Get-ModeFromFile -filePath $envFile
    if (-not $currentMode) {
        Write-Host "ℹ️  Nenhum modo detectado porque $envFile ainda não existe." -ForegroundColor Yellow
        Write-Host "Crie com: Copy-Item .env.template .env.local.dev" -ForegroundColor White
    } else {
        $targetMode = if ($currentMode -eq "local") { "cloud" } else { "local" }
        Write-Host "📍 Ambiente atual: $currentMode" -ForegroundColor Cyan
        Write-Host "➡️  Para mudar, rode: .\scripts\switch-env.ps1 -Mode $targetMode" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Uso:" -ForegroundColor White
    Write-Host "  .\scripts\switch-env.ps1 -Mode local   # Usar Supabase local (Docker)" -ForegroundColor Gray
    Write-Host "  .\scripts\switch-env.ps1 -Mode cloud   # Usar Supabase Cloud" -ForegroundColor Gray
    exit
}

if (-not $presets.ContainsKey($Mode)) {
    Write-Host "❌ Não existe preset '$Mode' em $presetsPath." -ForegroundColor Red
    exit 1
}

if (Test-Path $envFile) {
    $backupFile = "$envFile.backup"
    Copy-Item $envFile $backupFile -Force
    Write-Host "💾 Backup criado: $backupFile" -ForegroundColor Gray
}

Write-Host "🔄 Alternando para ambiente $Mode..." -ForegroundColor Cyan
Write-PresetToFile -mode $Mode -preset $presets[$Mode]

if ($Mode -eq "local") {
    Write-Host "✅ Configurado para LOCAL (Docker)!" -ForegroundColor Green
    Write-Host "   npx supabase status" -ForegroundColor Gray
} else {
    Write-Host "✅ Configurado para CLOUD (project nalwsuifppxvrikztwcz)!" -ForegroundColor Green
    Write-Host "   Dashboard: https://supabase.com/dashboard/project/nalwsuifppxvrikztwcz" -ForegroundColor Gray
}

Write-Host ""
Write-Host "♻️  Reinicie o servidor de desenvolvimento para aplicar as mudanças (npm run dev)." -ForegroundColor Cyan
