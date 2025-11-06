# AGENT Operational Rules (regras detalhadas para agentes de IA)

Este documento descreve regras operacionais, fluxos e convenções para agentes/automações que atuarão neste repositório. Siga-as estritamente — mudanças sensíveis (DB, RLS, deploy) exigem aprovação humana.

Resumo curto
- Objetivo: permitir que um agente proponha, implemente e documente mudanças técnicas (código, migrations, docs), mantendo segurança, auditabilidade e capacidade de rollback.

Regras obrigatórias (curto)
1. Nunca commitar secrets (ex.: `SUPABASE_SERVICE_ROLE_KEY`, chaves privadas). Use secrets do CI ou peça ao mantenedor para configurar.
2. Mudanças no schema/RLS/triggers devem incluir migration SQL em `supabase/supabase/migrations` (ou `sql/`), atualização do Prisma (`npm run db:pull` + `npm run db:generate`) e um plano de deploy/rollback no PR. Não mesclar sem revisão humana.
3. Sempre execute `npm run typecheck` e `npm run db:generate` antes de abrir PRs que alterem TS/DB.
4. Para infra (edge functions, migrations): abra PR como draft, descreva comandos de deploy, riscos e rollback.
5. Não execute deploys para produção sem confirmação explícita do mantenedor humano.

Fluxo de trabalho passo-a-passo (padrão para tarefas do agente)
1. Reconhecimento: ler `README.md`, `package.json`, `sql/*`, `prisma/seed.ts`, `supabase/functions/*`, `src/server/*` e `.github/` (ex.: PR template, AGENT.md).
2. Branch: criar branch com padrão `agent/<issue-or-task>-short-desc` (ex.: `agent/fix-auth-token-expiry`).
3. Implementação: faça mudanças pequenas e isoladas; prefira commits pequenos e revertíveis.
4. Testes locais: executar `npm install`, `npm run typecheck`, `npm run dev` (se aplicável). Se alterar Prisma schema, rodar `npm run db:generate` e validar tipos.
5. Migration: se alterar schema, crie migration SQL e adicione em `supabase/supabase/migrations` (ou `sql/`), documente instruções de execução (psql / supabase cli) no PR.
6. Atualizar estado: execute `node ./scripts/update_repo_state.js --actor "YourAgent" --message "Breve resumo" --files "file1,file2"` (ou use Ctrl+Shift+B). Isso adiciona um snapshot em `.github/REPO_STATE.md`.
7. PR: abra PR com título claro, marque como `draft` se incerto, cole checklist (uso do template automático é recomendado).

Conveniências de branch/PR e mensagens de commit
- Branch: `agent/<yyyyMMdd>-<short-desc>` ou `agent/<issue>-<short>`.
- Commit: comece com escopo/ação: `fix(auth): ajustar refresh token logic` ou `feat(inventory): add minStock field`.
- PR title: `[agent] <curta descrição>` e adicione no corpo o `--message` usado no `update_repo_state` para correlacionar.

Checklist mínimo (deve ser preenchido antes de pedir merge)
- [ ] `npm run typecheck` passou
- [ ] `npm run lint` passou (se aplicável)
- [ ] `npm run db:generate` passou (se mudou schema)
- [ ] Migration SQL incluída em `supabase/supabase/migrations` ou `sql/` (se aplicável)
- [ ] Notas de deploy/rollback incluídas no PR
- [ ] Verificado se nenhum secret foi adicionado
- [ ] `scripts/update_repo_state.js` executado e `.github/REPO_STATE.md` atualizado

Regras específicas para alterações no banco (RLS / triggers / migrations)
- Sempre criar migration SQL idempotente e comentar impacto (compatibilidade com dados existentes).
- Teste localmente em DB de desenvolvimento antes de propor o PR.
- Após aplicar SQL no remoto (procedimento humano), execute: `npm run db:pull` e `npm run db:generate` e atualize o PR com qualquer tipo gerado novo.
- Nunca mesclar migrações que alterem RLS/triggers sem revisão humana e plano de rollback.

Seed e Service Role Key
- `prisma/seed.ts` usa a Admin API do Supabase e requer `SUPABASE_SERVICE_ROLE_KEY`. Não rode o seed em ambiente público. Se um agente precisar rodar seed, peça ao mantenedor para executar em ambiente seguro ou use CI com secret.

Uso do comando de atualização de estado (central da verdade)
- Propósito: manter `.github/REPO_STATE.md` com entradas timestamped que resumem mudanças, arquivos e contexto — usado por agentes futuros para consulta rápida.
- Exemplo (PowerShell):
```powershell
node .\\scripts\\update_repo_state.js --actor "AutoAgent" --message "Corrige schema pacientes" --files "prisma/migrations/20251105_add_field.sql,src/server/patients.ts"
```
- O script tenta detectar arquivos alterados via `git` automaticamente se `--files` não for passado.

Atalho VS Code
- Existe tarefa de workspace `Update Repo State`. Pressione Ctrl+Shift+B (Windows) e escolha `Update Repo State` — o VS Code irá pedir `actor`, `message` e `files`.

Segurança e tratamento de secrets
- Nunca commitar secrets em código. Faça scanning rápido em PRs (procurar por `SUPABASE_SERVICE_ROLE_KEY`, `PRIVATE_KEY` etc.) e bloqueie PR que contenham secrets.
- Use CI secrets (GitHub Actions secrets) para executar passos sensitivos (deploys, seeds). O agente pode sugerir o comando, mas a execução deve ser realizada por um humano ou pipeline autorizado.

Quando o agente pode agir sem permissão humana
- Correções pequenas, refactors não-destrutivos, atualizações de dependências com verificação automática e testes locais passando.

Quando exigir aprovação humana (bloqueio explícito)
- Mudanças em `sql/` que alterem RLS, triggers, permissões.
- Deploy de migrations e edge functions para produção.
- Modificações no auth/claims/tenant model.
- Operações que requerem `SUPABASE_SERVICE_ROLE_KEY` em texto claro.

Rollback e plano de contingência
- Para migrações: documente um SQL de rollback quando viável (ex.: `ALTER TABLE DROP COLUMN`), ou documente como restaurar a partir de backup.
- Para edge functions: manter versão antiga e instruções para reverter deploy (`supabase functions deploy --project-ref <ref> <old-dir>`).

Integração com GitHub Actions
- Existe workflow `CI Checks` que roda `npm run typecheck` e `npm run db:generate` em PRs. O agente deve confiar nesses checks e só pedir merge quando estiverem verdes.

Escalonamento e comunicação
- Se o agente encontrar incertezas (impacto em RLS, dados sensíveis, falta de env vars), abra um draft PR e marque `@maintainers` na descrição pedindo revisão humana.

Notas finais
- Sempre registre entradas em `.github/REPO_STATE.md` após alterações significativas.
- Preserve histórico: commits pequenos e mensagens claras ajudam auditoria automática.
- Se desejar, posso adicionar automações adicionais: criar branch + abrir PR automaticamente (requer GitHub token) ou checar PRs por secrets.

FIM
