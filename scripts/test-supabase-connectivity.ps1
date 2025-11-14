# Script para testar e corrigir problemas de conectividade com Supabase Cloud

Write-Host "🔍 Testando conectividade com Supabase Cloud..." -ForegroundColor Cyan

# 1. Teste de DNS
Write-Host "`n1️⃣ Testando resolução DNS..." -ForegroundColor Yellow
$hostname = "aws-1-us-east-1.pooler.supabase.com"
try {
    $resolved = [System.Net.Dns]::GetHostAddresses($hostname)
    Write-Host "✅ DNS OK: $hostname -> $($resolved[0].IPAddressToString)" -ForegroundColor Green
} catch {
    Write-Host "❌ DNS FALHOU: Não conseguiu resolver $hostname" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Teste de conectividade API
Write-Host "`n2️⃣ Testando API do Supabase..." -ForegroundColor Yellow
$apiHost = "nalwsuifppxvrikztwcz.supabase.co"
try {
    $response = Test-NetConnection -ComputerName $apiHost -Port 443 -WarningAction SilentlyContinue
    if ($response.TcpTestSucceeded) {
        Write-Host "✅ API acessível: $apiHost :443" -ForegroundColor Green
    } else {
        Write-Host "❌ API inacessível: Porta 443 bloqueada" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao testar conexão: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Verificar DNS configurado
Write-Host "`n3️⃣ Servidores DNS configurados:" -ForegroundColor Yellow
$dnsServers = Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object { $_.ServerAddresses.Count -gt 0 }
foreach ($adapter in $dnsServers) {
    Write-Host "   Interface: $($adapter.InterfaceAlias)" -ForegroundColor Gray
    foreach ($dns in $adapter.ServerAddresses) {
        Write-Host "      DNS: $dns" -ForegroundColor Gray
    }
}

# 4. Sugestões de correção
Write-Host "`n💡 Sugestões de correção:" -ForegroundColor Cyan
Write-Host "   A. Trocar DNS para Cloudflare (1.1.1.1) ou Google (8.8.8.8)" -ForegroundColor White
Write-Host "   B. Desabilitar VPN temporariamente" -ForegroundColor White
Write-Host "   C. Verificar antivírus/firewall (Windows Defender, etc)" -ForegroundColor White
Write-Host "   D. Limpar cache DNS: ipconfig /flushdns" -ForegroundColor White

# 5. Oferecer trocar DNS automaticamente
Write-Host "`n❓ Deseja tentar trocar DNS para Cloudflare (1.1.1.1) automaticamente?" -ForegroundColor Yellow
Write-Host "   (Requer privilégios de administrador)" -ForegroundColor Gray
$choice = Read-Host "   Digite S para Sim ou N para Não"

if ($choice -eq "S" -or $choice -eq "s") {
    try {
        # Pega a interface de rede ativa
        $activeAdapter = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.MediaType -eq "802.3" } | Select-Object -First 1
        
        if ($activeAdapter) {
            Write-Host "`n🔧 Configurando DNS da interface: $($activeAdapter.Name)" -ForegroundColor Cyan
            Set-DnsClientServerAddress -InterfaceAlias $activeAdapter.Name -ServerAddresses ("1.1.1.1", "1.0.0.1")
            Write-Host "✅ DNS alterado para Cloudflare! Testando novamente..." -ForegroundColor Green
            
            # Limpa cache DNS
            ipconfig /flushdns | Out-Null
            
            # Testa novamente
            Start-Sleep -Seconds 2
            $resolved = [System.Net.Dns]::GetHostAddresses($hostname)
            Write-Host "✅ DNS agora resolve: $hostname -> $($resolved[0].IPAddressToString)" -ForegroundColor Green
        } else {
            Write-Host "❌ Não encontrou adaptador de rede ativo" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Erro ao alterar DNS (precisa executar como Admin?): $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n👍 OK, não alterando DNS." -ForegroundColor Gray
}

Write-Host "`n✨ Teste concluído!" -ForegroundColor Cyan
