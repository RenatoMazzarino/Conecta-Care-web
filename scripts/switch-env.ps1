# Script para alternar entre ambiente LOCAL e CLOUD

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("local", "cloud")]
    [string]$Mode
)

$envFile = ".env.local"

# Se não especificou modo, detectar atual e sugerir troca
if (-not $Mode) {
    if (Test-Path $envFile) {
        $currentUrl = Select-String -Path $envFile -Pattern "NEXT_PUBLIC_SUPABASE_URL=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value }
        
        if ($currentUrl -like "*127.0.0.1*") {
            Write-Host "📍 Ambiente atual: LOCAL (Docker)" -ForegroundColor Cyan
            $suggestedMode = "cloud"
            $suggestion = "trocar para CLOUD"
        } else {
            Write-Host "📍 Ambiente atual: CLOUD (nalwsuifppxvrikztwcz.supabase.co)" -ForegroundColor Cyan
            $suggestedMode = "local"
            $suggestion = "trocar para LOCAL"
        }
        
        Write-Host "💡 Para $suggestion, execute: .\scripts\switch-env.ps1 -Mode $suggestedMode" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Uso:" -ForegroundColor White
        Write-Host "  .\scripts\switch-env.ps1 -Mode local   # Usar Supabase local (Docker)" -ForegroundColor Gray
        Write-Host "  .\scripts\switch-env.ps1 -Mode cloud   # Usar Supabase Cloud" -ForegroundColor Gray
        exit
    } else {
        Write-Host "❌ Arquivo $envFile não encontrado!" -ForegroundColor Red
        exit 1
    }
}

# Fazer backup
$backupFile = "$envFile.backup"
Copy-Item $envFile $backupFile -Force
Write-Host "💾 Backup criado: $backupFile" -ForegroundColor Gray

# Trocar configuração
if ($Mode -eq "local") {
    Write-Host "🔄 Alternando para ambiente LOCAL (Docker)..." -ForegroundColor Cyan
    
    $content = @"
# Supabase LOCAL (Docker) - para desenvolvimento local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
"@
    
    Set-Content -Path $envFile -Value $content
    
    Write-Host "✅ Configurado para LOCAL!" -ForegroundColor Green
    Write-Host "   URL: http://127.0.0.1:54321" -ForegroundColor Gray
    Write-Host "   Studio: http://127.0.0.1:54323" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  Certifique-se que o Supabase local está rodando:" -ForegroundColor Yellow
    Write-Host "   npx supabase status" -ForegroundColor White
    
} elseif ($Mode -eq "cloud") {
    Write-Host "🔄 Alternando para ambiente CLOUD..." -ForegroundColor Cyan
    
    $content = @"
# Supabase CLOUD - conecta ao projeto remoto
NEXT_PUBLIC_SUPABASE_URL=https://nalwsuifppxvrikztwcz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbHdzdWlmcHB4dnJpa3p0d2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDQ4MDEsImV4cCI6MjA3Nzg4MDgwMX0.Df38w_daCMA9Tln2Tp0pyok-wUNIeikOe26sQx3dd8w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbHdzdWlmcHB4dnJpa3p0d2N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMwNDgwMSwiZXhwIjoyMDc3ODgwODAxfQ.J9yZRXY3ErtbYQnb9mQ4SLiT2SyAHTNP49NGj5B4lGY
"@
    
    Set-Content -Path $envFile -Value $content
    
    Write-Host "✅ Configurado para CLOUD!" -ForegroundColor Green
    Write-Host "   URL: https://nalwsuifppxvrikztwcz.supabase.co" -ForegroundColor Gray
    Write-Host "   Dashboard: https://supabase.com/dashboard/project/nalwsuifppxvrikztwcz" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🔄 Reinicie o servidor de desenvolvimento para aplicar as mudanças:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
