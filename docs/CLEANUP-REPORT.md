# 🧹 Relatório de Limpeza e Reorganização do Repositório

**Data da Análise:** 13 de novembro de 2025  
**Status:** Identificados 15+ itens para limpeza/reorganização

---

## 📋 Sumário Executivo

### Estatísticas
- **Total de arquivos analisados:** 207
- **Arquivos duplicados:** 3
- **Arquivos obsoletos:** 8+
- **Arquivos para realocação:** 4
- **Pastas para consolidação:** 2
- **Variáveis de ambiente:** 5 arquivos (precisa limpeza)

---

## 🔴 CRÍTICO - Ação Imediata Necessária

### 1. Pasta `sql/` - OBSOLETA E DUPLICADA ❌
**Localização:** `/sql/`  
**Status:** ⚠️ **REMOVER**

**Arquivos:**
- `sql/000_init.sql`
- `sql/001_security_realtime.sql`  
- `sql/002_trigger_user_profiles.sql`

**Problema:** 
- Estes arquivos foram **consolidados** nas migrations do Supabase
- Migrations oficiais em: `supabase/migrations/20251111020500_baseline.sql`
- Manter duplicados causa confusão sobre "fonte da verdade"

**Ação Recomendada:**
```powershell
# Mover para backup/documentação
Move-Item sql/ docs/schemas/legacy-sql-backup/
# OU deletar completamente
Remove-Item sql/ -Recurse -Force
```

---

### 2. Scripts Supabase Duplicados ⚠️
**Localização:** `/scripts/`

**Arquivos Obsoletos:**
- ✅ `scripts/supabase-start.ps1` - Use: `npx supabase start`
- ✅ `scripts/supabase-stop.ps1` - Use: `npx supabase stop`
- ✅ `scripts/supabase-status.ps1` - Use: `npx supabase status`

**Problema:**
- Scripts replicam comandos nativos do Supabase CLI
- Adiciona camada desnecessária de complexidade
- Usuários devem usar CLI diretamente

**Manter:**
- ✅ `scripts/switch-env.ps1` - Útil para alternar local/cloud
- ✅ `scripts/test-supabase-connectivity.ps1` - Diagnóstico customizado
- ⚠️ `scripts/debug-headless.js` - Verificar se está em uso

**Ação Recomendada:**
```powershell
Remove-Item scripts/supabase-start.ps1
Remove-Item scripts/supabase-stop.ps1
Remove-Item scripts/supabase-status.ps1
```

---

### 3. Arquivos de Variáveis de Ambiente - CONSOLIDAR 🔐
**Localização:** Root `/`

**Arquivos Existentes:**
1. `.env` - ⚠️ **NÃO DEVERIA EXISTIR** (deve estar em .gitignore)
2. `.env.local.dev` - ✅ Ambiente atual (local/cloud, ignorado)
3. `.env.local.backup` - ⚠️ Backup temporário
4. `.env.template` - ✅ Template único (local + cloud)

**Problemas:**
- `.env` não está no `.gitignore` - **RISCO DE SEGURANÇA**
- `.env.local.backup` é temporário - deve ser removido
- Nome dos arquivos não deixava claro qual é template x runtime

**Ação Recomendada:**
```powershell
# 1. Adicionar .env ao .gitignore
Add-Content .gitignore "`n# Environment files`n.env`n.env.local.backup"

# 2. Remover backup temporário
Remove-Item .env.local.backup

# 3. Consolidar examples
# Manter apenas `.env.template` com valores base (local + cloud)
# ✅ Status: `.env.local.dev` = runtime; `.env.template` = template único.
```

---

### 4. Cliente Supabase Duplicado - INCONSISTÊNCIA 🔄
**Localização:** `/src/lib/` vs `/src/server/`

**Arquivos:**
- `src/lib/supabaseServerClient.ts` - Re-exporta de `/server/`
- `src/server/supabaseServerClient.ts` - Implementação real

**Problema:**
- Imports inconsistentes:
  - 5 arquivos importam de `@/lib/supabaseServerClient`
  - 1 arquivo importa de `@/server/supabaseServerClient`
- Camada de indireção desnecessária

**Ação Recomendada:**
**Opção A (Recomendada):** Padronizar imports para `@/server/`
```typescript
// Todos os arquivos devem usar:
import { getSupabaseServerClient } from "@/server/supabaseServerClient";
```

**Opção B:** Remover re-export em `/lib/` e atualizar imports

---

### 5. Backend.json Duplicado 📄
**Localização:** 
- `docs/backend.json` (395 linhas)
- `src/docs/backend.json` (470 linhas)

**Diferenças:**
- Versão em `src/docs/` tem campo adicional: `salutation`
- Ambos definem schema JSON do Patient

**Problema:**
- Não está claro qual é a "fonte da verdade"
- Pasta `src/docs/` é incomum (docs devem estar em `/docs/`)

**Ação Recomendada:**
```powershell
# Consolidar para /docs/ (fora do src)
# Comparar diferenças e mesclar
Move-Item src/docs/backend.json docs/backend-complete.json
Remove-Item src/docs/ -Recurse
```

---

### 6. Prisma - NÃO ESTÁ SENDO USADO ⚠️
**Localização:** `/prisma/`

**Arquivos:**
- `prisma/schema.prisma` - Define models (Shift, InventoryItem, etc)
- `prisma/seed.ts` - Seed de dados
- `prisma/migrations/20241104000000_init/migration.sql`

**Problema:**
- **ZERO imports** de `@prisma/client` no código
- Projeto usa **Supabase diretamente** (não Prisma)
- Migrations do Prisma **conflitam** com migrations do Supabase
- Adiciona dependência desnecessária

**Perguntas:**
1. Prisma foi usado no passado e migrado para Supabase?
2. Há planos de usar Prisma no futuro?

**Ação Recomendada:**
**Se NÃO for usar Prisma:**
```powershell
# Backup primeiro
Move-Item prisma/ docs/archived/prisma-backup/

# Remover dependências do package.json
npm uninstall prisma @prisma/client

# Atualizar .gitignore (remover referências ao Prisma)
```

**Se PLANEJA usar Prisma:**
- Sincronizar `schema.prisma` com Supabase schema
- Gerar client: `npx prisma generate`
- Integrar Prisma nas queries

---

## 🟡 MÉDIA PRIORIDADE - Reorganização

### 7. Arquivos .vscode - Organizar 📝
**Localização:** `/.vscode/`

**Arquivos:**
- ✅ `settings.json` - Configurações do workspace
- ✅ `tasks.json` - Tasks de build/run
- ✅ `launch.json` - Debug configs
- ❓ `user-settings-k8s-backup.json` - Backup de settings?
- ✅ `README.md` - Documentação

**Problema:**
- `user-settings-k8s-backup.json` parece ser backup manual
- Nome confuso (user settings não devem estar no workspace)

**Ação Recomendada:**
```powershell
# Se não for necessário, remover
Remove-Item .vscode/user-settings-k8s-backup.json
```

---

### 8. Documentação Supabase - Consolidar 📚
**Localização:** `/docs/`

**Arquivos:**
- ✅ `docs/supabase-workflow.md` - Workflow local↔cloud
- ❓ `docs/supabase-remote-only.md` - Workflow apenas cloud?
- ✅ `docs/SYNC-STATUS.md` - Status atual
- ✅ `docs/k8s-setup.md` - Setup Kubernetes

**Problema:**
- `supabase-remote-only.md` pode ser redundante/desatualizado
- Não sabemos se ainda é relevante

**Ação Recomendada:**
1. Revisar conteúdo de `supabase-remote-only.md`
2. Se obsoleto: remover
3. Se útil: mesclar com `supabase-workflow.md` como seção

---

### 9. Supabase .temp/ - Adicionar ao .gitignore 🗂️
**Localização:** `/supabase/.temp/`

**Arquivos:**
- `project-ref`
- `cli-latest`
- `gotrue-version`
- `postgres-version`
- `rest-version`
- `storage-version`
- `storage-migration`
- `pooler-url`

**Problema:**
- Arquivos temporários do Supabase CLI
- **NÃO** devem ser commitados no Git
- Mudam frequentemente

**Ação Recomendada:**
```powershell
# Adicionar ao .gitignore
Add-Content .gitignore "`n# Supabase temporary files`nsupabase/.temp/`nsupabase/.branches/"
```

---

### 10. Supabase .branches/ - Adicionar ao .gitignore
**Localização:** `/supabase/.branches/`

**Problema:**
- Estado interno do Supabase CLI
- Não deve ser versionado

**Ação (já incluída acima)**

---

## 🟢 BAIXA PRIORIDADE - Melhorias

### 11. README.md - Atualizar Documentação 📖
**Sugestões:**
- Adicionar seção de setup do Supabase
- Link para `docs/supabase-workflow.md`
- Documentar estrutura de pastas
- Comandos principais (dev, build, test)

---

### 12. .env.template - Melhorar Template
**Sugestão:**
```env
# Conecta Care - Environment Variables Template

# === Supabase Configuration ===
# Para desenvolvimento LOCAL (Docker):
# NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>

# Para produção CLOUD:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<cloud-anon-key>

# Service role (apenas server-side):
# SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# === Database (se usar Prisma) ===
# DATABASE_URL=postgresql://...
# DATABASE_DIRECT_URL=postgresql://...

# === AI/Genkit ===
# GOOGLE_GENAI_API_KEY=your-api-key

# === Analytics (opcional) ===
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 📊 Estrutura Recomendada Final

```
Conecta-Care-web/
├── .github/                    # GitHub configs (CI/CD)
├── .next/                      # Build output (ignorado)
├── .vscode/                    # VS Code workspace settings
│   ├── settings.json
│   ├── tasks.json
│   ├── launch.json
│   └── README.md
├── docs/                       # Documentação
│   ├── schemas/                # Database schemas
│   │   ├── README.md
│   │   └── combined-schema-baseline.sql
│   ├── archived/               # Arquivos antigos (se necessário)
│   │   ├── prisma-backup/
│   │   └── legacy-sql-backup/
│   ├── api.md
│   ├── blueprint.md
│   ├── backend.json            # Consolidado
│   ├── k8s-setup.md
│   ├── SYNC-STATUS.md
│   └── supabase-workflow.md    # Consolidado
├── node_modules/               # Dependências (ignorado)
├── scripts/                    # Scripts úteis
│   ├── switch-env.ps1          # ✅ Manter
│   └── test-supabase-connectivity.ps1  # ✅ Manter
├── src/                        # Código fonte
│   ├── ai/                     # AI/Genkit flows
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── hooks/                  # React hooks
│   ├── lib/                    # Utilities
│   ├── schemas/                # Zod/validation schemas
│   ├── server/                 # Server-only code
│   ├── auth.ts
│   └── middleware.ts
├── supabase/                   # Supabase project
│   ├── functions/              # Edge Functions
│   ├── migrations/             # Database migrations
│   └── config.toml
├── .env.template               # Template completo
├── .env.local.dev              # Ambiente atual (ignorado)
├── .gitignore
├── components.json
├── eslint.config.cjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

**REMOVIDO:**
- ❌ `sql/` (migrado para migrations)
- ❌ `prisma/` (não está sendo usado)
- ❌ `src/docs/` (consolidado em /docs/)
- ❌ `.env` (risco de segurança)
- ❌ `.env.local.backup` (temporário)
- ❌ Scripts redundantes do Supabase

---

## ✅ Checklist de Ações

### Ações Imediatas (Críticas)
- [ ] Remover ou mover pasta `sql/` para `docs/schemas/legacy-sql-backup/`
- [ ] Deletar scripts redundantes: `supabase-{start,stop,status}.ps1`
- [ ] Adicionar `.env` ao `.gitignore`
- [ ] Remover `.env.local.backup`
- [ ] Adicionar `supabase/.temp/` e `supabase/.branches/` ao `.gitignore`
- [ ] Decidir sobre Prisma: remover ou integrar completamente
- [ ] Consolidar `backend.json` (remover duplicata em `src/docs/`)
- [ ] Padronizar imports de `supabaseServerClient`

### Ações Secundárias (Melhorias)
- [ ] Revisar e consolidar docs do Supabase
- [ ] Atualizar README.md principal
- [ ] Melhorar template `.env.template`
- [ ] Remover `user-settings-k8s-backup.json` se desnecessário
- [ ] Documentar estrutura de pastas no README

### Ações Futuras (Opcional)
- [ ] Adicionar CI/CD para validar estrutura
- [ ] Criar script de setup automatizado
- [ ] Adicionar pre-commit hooks para validações

---

## 🎯 Impacto Estimado

**Remoções:**
- ~10 arquivos obsoletos/duplicados
- ~2 pastas desnecessárias
- Redução de ~15-20% no tamanho do repositório
- Redução de confusão para novos desenvolvedores

**Melhorias:**
- Estrutura mais clara e organizada
- Única "fonte da verdade" para schemas
- Variáveis de ambiente seguras e bem documentadas
- Imports consistentes

---

## 📝 Notas Finais

**Antes de executar qualquer ação de remoção:**
1. ✅ Fazer backup do repositório
2. ✅ Commitar estado atual
3. ✅ Criar branch para limpeza: `git checkout -b chore/cleanup-repository`
4. ✅ Testar após cada mudança
5. ✅ Fazer commit incremental

**Comando para criar branch de limpeza:**
```bash
git checkout -b chore/cleanup-repository
git add -A
git commit -m "chore: backup before repository cleanup"
```

---

**Quer que eu execute alguma dessas ações agora?** 🚀
