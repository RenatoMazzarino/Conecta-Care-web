## Objetivo
Fornecer instruções curtas, acionáveis e específicas para agentes de IA (Copilot/agents) que vão editar, gerar e submeter mudanças neste repositório.

## Visão geral rápida do projeto
- Frontend: Next.js 15 (app router). Dev server: `npm run dev` (porta 9003).
- Backend/DB: Supabase (Postgres + Realtime + Edge Functions) + Prisma para client/seed.
- Migrações: há dois lugares de migrations — `supabase/supabase/migrations` (migrations SQL para Supabase) e `prisma/migrations` (se houver). O fluxo predominante: aplicar SQL via Supabase e sincronizar Prisma com `prisma db pull` + `prisma generate`.

## Comandos de desenvolvimento importantes (rápido)
- Instalar dependências: `npm install`.
- Rodar local: `npm run dev` (usa Turbopack; porta 9003).
- Typecheck: `npm run typecheck` (tsc --noEmit).
- Prisma: `npm run db:pull`, `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`.
- Supabase CLI / Functions: `npm run sb:link` (linka ao project-ref nalwsuifppxvrikztwcz) e `npm run sb:functions:deploy`.

## Padrões e convenções do repositório
- Separação server/client: coloque lógica que exige chaves ou acesso direto ao banco em `src/server/*` (ex.: `src/server/supabaseServerClient.ts`). Exportadores leves para código cliente vivem em `src/lib/*`.
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` para client; `SUPABASE_SERVICE_ROLE_KEY` só em backend/CI.
- SQL de segurança e triggers: `sql/001_security_realtime.sql` e `sql/002_trigger_user_profiles.sql` — mudanças aqui exigem um plano de deploy no Supabase remoto.
- Edge Functions: código em `supabase/functions/*`; faça deploy com `npm run sb:functions:deploy`.

## Pontos de integração críticos (onde olhar primeiro)
- `README.md` — guia de setup e comandos essenciais.
- `package.json` — scripts (dev, db:*, sb:*).
- `src/server/supabaseServerClient.ts` e `src/lib/supabaseEnv.ts` — como carregamos e validamos env vars do Supabase.
- `prisma/seed.ts` — exemplo do shape de dados criado pela seed (usa Admin API do Supabase).
- `sql/` — policies e triggers que controlam RLS (muito sensível).
- `supabase/supabase/migrations` e `supabase/functions` — mudanças de infra (migrations e edge functions).

## Fluxo recomendado para alterar schema / migrations
1. Criar a alteração SQL em `supabase/supabase/migrations` ou um arquivo em `sql/` (dependendo do que for alterado).
2. Validar localmente (se possível) contra um banco de dev.
3. Executar `psql "$DATABASE_URL" -f sql/<file>.sql` ou usar `supabase db remote commit` para commitar no remoto.
4. Rodar `npm run db:pull` e `npm run db:generate` para manter o Prisma atualizado.
5. Incluir migração SQL e atualizar `prisma` (se aplicável) no mesmo PR; documente o impacto.

## Checklist mínimo para PRs que envolvem DB / segurança
- Atualizar ou adicionar migration SQL em `supabase/supabase/migrations` ou `sql/`.
- Executar localmente `npm run typecheck` e `npm run lint` (se lint estiver configurado).
- Executar `npm run db:generate` e garantir que não há erros de tipagem do Prisma.
- Incluir notas no PR sobre: passos de deploy (p.ex. executar `psql` ou `supabase db remote commit`), riscos, e rollback mínimo.
- NÃO mesclar migrations que alterem RLS ou triggers sem revisão humana e plano de rollback.

## Como rodar e depurar localmente
- Rodar dev: `npm run dev` (porta 9003). Se usar PowerShell, `cp .env.example .env` funciona como alias de `Copy-Item`.
- Ver variáveis supabase: `src/lib/supabaseEnv.ts` lança erro se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` estiverem ausentes.
- Para debugar Edge Functions localmente, veja `supabase` CLI config em `supabase/supabase/config.toml`.

## Exemplos práticos (trechos úteis)
- Chamar Edge Function (client):
  fetch('https://nalwsuifppxvrikztwcz.supabase.co/functions/v1/checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ shiftId }),
  });

- Subscrição Realtime (ver `README.md` snippet): usar `supabase.channel(...)` para `shift_posts` e `shift_presence`.

## Snippets de referência (úteis para agentes)

Pequeno trecho de políticas RLS e publicação Realtime (do `sql/001_security_realtime.sql`):

```sql
-- Exemplo: política que permite leitura apenas para mesmos tenants
CREATE POLICY patients_select_same_tenant
  ON patients
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

-- Forçar REPLICA IDENTITY FULL para tabelas usadas em realtime
ALTER TABLE IF EXISTS shift_posts REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE shift_posts';
  END IF;
END $$;
```

Pequeno trecho do `prisma/seed.ts` que demonstra uso da Service Role Key para criar usuário via Admin API e upsert do perfil:

```ts
// valida presença da Service Role Key (nunca em client)
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to seed auth users.');
}

// cria usuário via Admin API
const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { method: 'POST', headers: { Authorization: `Bearer ${serviceRoleKey}` }, body: JSON.stringify({ email, password }) });

// garante profile no banco (upsert)
await prisma.user_profiles.upsert({ where: { auth_user_id: authUserId }, update: { email, name }, create: { id: randomUUID(), auth_user_id: authUserId, email, name } });
```

## Restrições e responsabilidades do agente (regras operacionais)
- Nunca: commitar `SUPABASE_SERVICE_ROLE_KEY` ou qualquer secret em arquivos versionados.
- Nunca: aplicar mudanças destrutivas no banco de produção sem aprovação humana explícita.
- Sempre: criar um PR (draft se incerto) com descrição clara, arquivos de migração e um plano de deploy/rollback.
- Sempre: executar `npm run typecheck` e `npm run db:generate` antes de criar PR que altera tipos/DB.

## Pontos de atenção / edge cases
- RLS depende de claims JWT (`tenant_id`, `app_role`, `sub`) — confirmar que changes em autenticação atualizam políticas.
- Seeds (`prisma/seed.ts`) usam Admin API: requer `SUPABASE_SERVICE_ROLE_KEY` no ambiente (CI/locals seguros).
- Migrations SQL podem precisar de permissões/roles específicos (ex.: criar extension). Documente pré-requisitos.

## Onde adicionar documentação adicional
- Se criar novas integrações (ex.: serviços externos, filas), adicione instruções em `docs/` e um resumo curto no `README.md`.

## Notas finais e contato
- Preserve e mescle conteúdo existente se houver outra versão de `.github/copilot-instructions.md`.
- Se quiser, posso: gerar um `AGENT.md` com regras operacionais, adicionar um checklist PR automático ou criar exemplos de migração/rollback para este repo.
