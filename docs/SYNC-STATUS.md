# Status da Sincronização Supabase Local ↔ Cloud

**Data:** 13 de novembro de 2025  
**Status:** ✅ **RESOLVIDO E SINCRONIZADO**

---

## 🎯 Resumo

O ambiente está completamente configurado e sincronizado:
- ✅ Supabase Local rodando (Docker)
- ✅ Conectividade com Cloud funcionando
- ✅ Migrations sincronizadas (Local ↔ Cloud)
- ✅ Scripts de automação criados

---

## 🔧 Problemas Resolvidos

### 1. Erro de DNS/Conectividade
**Problema:**
```
hostname resolving error (lookup aws-1-us-east-1.pooler.supabase.com: operation was canceled)
```

**Causa:** DNS temporário/latência de rede  
**Solução:** 
- Aguardar resolução automática
- Diagnosticar com `Test-NetConnection`
- Script criado: `scripts/test-supabase-connectivity.ps1`

**Status:** ✅ Resolvido - Conectividade estável

---

### 2. Erro de Autenticação
**Problema:**
```
failed SASL auth (FATAL: password authentication failed for user "postgres")
```

**Causa:** Credenciais antigas salvas no CLI  
**Solução:**
```powershell
Remove-Item -Path "$env:APPDATA\supabase" -Recurse -Force
npx supabase login --no-browser
```

**Status:** ✅ Resolvido - Login funcionando

---

### 3. Erros nas Migrations
**Problema 1:** Drop function antes de drop trigger
```sql
ERROR: cannot drop function handle_new_auth_user() because other objects depend on it
```

**Solução:** Mover `drop trigger` antes de `drop function`

**Problema 2:** Set default antes de alterar tipo da coluna
```sql
ERROR: column "status" is of type shift_status but default expression is of type text
```

**Solução:** Trocar ordem - primeiro `set data type`, depois `set default`

**Status:** ✅ Resolvido - Migrations aplicadas com sucesso

---

### 4. Conflito de Versões PostgreSQL
**Problema:**
```
WARNING: Local database version differs from the linked project.
```

**Solução:** Atualizar `supabase/config.toml`:
```toml
[db]
major_version = 17  # Era 15
```

**Status:** ✅ Resolvido - Versões alinhadas

---

## 📊 Estado Atual das Migrations

| Migration | Local | Remote | Timestamp |
|-----------|-------|--------|-----------|
| 20251111020500_baseline.sql | ✅ | ✅ | 2025-11-11 02:05:00 |
| 20251113232442_remote_schema.sql | ✅ | ✅ | 2025-11-13 23:24:42 |
| 20251113235106_remote_schema.sql | ✅ | ✅ | 2025-11-13 23:51:06 |

**Verificado com:**
```powershell
npx supabase migration list
npx supabase db push --dry-run  # Remote database is up to date ✅
```

---

## 🌐 URLs Disponíveis

### Local (Desenvolvimento)
- **API:** http://127.0.0.1:54321
- **Studio:** http://127.0.0.1:54323
- **GraphQL:** http://127.0.0.1:54321/graphql/v1
- **Database:** postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Mailpit:** http://127.0.0.1:54324

### Cloud (Produção)
- **API:** https://nalwsuifppxvrikztwcz.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/nalwsuifppxvrikztwcz
- **Database:** aws-1-us-east-1.pooler.supabase.com:5432

---

## 🛠️ Scripts Criados

### 1. Alternar entre Local e Cloud
```powershell
.\scripts\switch-env.ps1 -Mode local   # Usar ambiente local
.\scripts\switch-env.ps1 -Mode cloud   # Usar ambiente cloud
.\scripts\switch-env.ps1               # Ver ambiente atual
```

### 2. Testar Conectividade
```powershell
.\scripts\test-supabase-connectivity.ps1
```

---

## 📋 Comandos Úteis

### Gerenciar Ambiente Local
```powershell
# Iniciar
npx supabase start

# Parar
npx supabase stop

# Status
npx supabase status

# Resetar (limpar dados)
npx supabase db reset
```

### Sincronizar Local ↔ Cloud
```powershell
# Puxar mudanças da cloud
npx supabase db pull

# Enviar mudanças para cloud
npx supabase db push

# Ver diferenças sem aplicar
npx supabase db push --dry-run

# Listar migrations
npx supabase migration list
```

### Desenvolvimento
```powershell
# Iniciar servidor dev Next.js
npm run dev

# Executar migrations localmente
npx supabase migration up

# Criar nova migration
npx supabase migration new nome_da_migration
```

---

## 🔄 Workflow de Desenvolvimento

### Opção 1: Trabalhar 100% Local (Recomendado para dev)
1. `npx supabase start`
2. `.\scripts\switch-env.ps1 -Mode local`
3. `npm run dev`
4. Desenvolver/testar localmente
5. Quando finalizar: `npx supabase db push` (enviar para cloud)

### Opção 2: Sincronização Bidirecional
1. `npx supabase db pull` (baixar mudanças da cloud)
2. `npx supabase start` (aplicar localmente)
3. Desenvolver/testar
4. `npx supabase db push` (enviar mudanças)

---

## ✅ Checklist de Validação

- [x] Docker Desktop rodando
- [x] Supabase CLI autenticado
- [x] Supabase local inicializado
- [x] Projeto linkado à cloud (`nalwsuifppxvrikztwcz`)
- [x] Migrations sincronizadas (3 migrations aplicadas)
- [x] `.env.local` configurado
- [x] Conectividade cloud funcionando (DNS + Pooler + API)
- [x] Scripts de automação criados
- [x] PostgreSQL versão 17 (local e cloud alinhados)

---

## 🎓 Lições Aprendidas

1. **DNS/Rede:** Problemas de conectividade podem ser temporários - diagnosticar antes de desistir
2. **Migrations:** Ordem importa - drops devem respeitar dependências
3. **Enum Types:** Converter tipo antes de alterar default
4. **Credenciais:** CLI pode ter cache de senhas - limpar `$env:APPDATA\supabase` resolve
5. **Containers:** Conflitos de nome podem persistir - `docker rm -f` limpa tudo

---

## 🚀 Próximos Passos

1. ✅ Testar extensão Supabase no VS Code
2. ✅ Iniciar servidor dev: `npm run dev`
3. ⏳ Criar seed.sql com dados de teste (opcional)
4. ⏳ Configurar CI/CD para migrations automáticas (opcional)

---

**Ambiente pronto para desenvolvimento! 🎉**
