# Conecta Care – Supabase Backend

Stack atual: **Supabase (Postgres + Realtime + Edge Functions)** com Prisma, RLS habilitado e documentação via Dataedo. Firebase foi removido por completo.

---

## 1. Passo a passo rápido

1. **Criar `.env.local.dev`**
   ```powershell
   Copy-Item .env.template .env.local.dev
   ```
   - Substitua `PASSWORD_URL_ENCODED` pela senha do Postgres (URL-encoded: `@` → `%40`, etc.).
   - Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` em código cliente.

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Linkar o projeto Supabase**
   ```bash
   npm run sb:link
   ```
   (usa o `project-ref` nalwsuifppxvrikztwcz).

4. **Sincronizar Prisma com o banco existente**
   ```bash
   npx prisma migrate resolve --applied 20241104000000_init   # 1ª vez apenas
   npm run db:pull
   npm run db:generate
   ```

5. **Aplicar RLS/Reatime se necessário**
   ```bash
   psql "$DATABASE_URL" -f sql/001_security_realtime.sql
   psql "$DATABASE_URL" -f sql/002_trigger_user_profiles.sql
   ```
   (ou use `supabase db remote commit --file ...`).

6. **Seed opcional para dados de demonstração**
   ```bash
   npm run db:seed
   ```

7. **Deploy das Edge Functions**
   ```bash
   npm run sb:functions:deploy
   ```

8. **Rodar o app**
   ```bash
   npm run dev
   ```

---

## 2. Scripts úteis (`package.json`)

| Script | Descrição |
| --- | --- |
| `npm run db:pull` | Introspecção do schema atual do Postgres |
| `npm run db:generate` | Geração do cliente Prisma |
| `npm run db:migrate` | Executa migrações pendentes (deploy) |
| `npm run db:seed` | Popula dados mínimos (requer Service Role) |
| `npm run studio` | Abre o Prisma Studio |
| `npm run sb:link` | Conecta CLI ao projeto Supabase |
| `npm run sb:functions:deploy` | Faz deploy das edge functions existentes |

---

## 3. Configuração de segurança

- `sql/001_security_realtime.sql`: habilita RLS, recria policies e garante réplica/Realtime (`shift_posts`, `shift_presence`, `shifts`).
- `sql/002_trigger_user_profiles.sql`: sincroniza `auth.users` → `public.user_profiles`.
- As policies assumem que os JWT incluem `tenant_id`, `app_role` e `sub`. Preencha esses claims via `app_metadata`.
- Service Role Key **apenas** em ambientes seguros (backend, CI, seed).

---

## 4. Seed

`prisma/seed.ts` usa a Admin API do Supabase para criar:
- Tenant “Conecta Care”;
- Usuário admin (`admin@conecta-care.test`, password `SEED_ADMIN_PASSWORD` se definido);
- Paciente, profissional, shift, post, presença, item de inventário e supply request.

Não cria tabelas, extensões ou estruturas – apenas dados.

---

## 5. Edge Functions disponíveis

| Função | Endpoint | Uso |
| --- | --- | --- |
| `checkin` | `/functions/v1/checkin` | Atualiza presença do usuário em um shift |
| `post_to_shift` | `/functions/v1/post_to_shift` | Cria post no mural do shift |
| `shift_status` | `/functions/v1/shift_status` | Atualiza o status do shift |

Exemplo de chamada (fetch):
```ts
await fetch('https://nalwsuifppxvrikztwcz.supabase.co/functions/v1/checkin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`, // token do usuário logado
  },
  body: JSON.stringify({ shiftId, state: 'online' }),
});
```

---

## 6. Realtime – snippet de teste

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function subscribeToShiftRealtime(shiftId: string) {
  const channel = supabase
    .channel(`shift:${shiftId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'shift_posts', filter: `shift_id=eq.${shiftId}` },
      (payload) => console.log('Post event', payload)
   ﻿# Conecta Care – Web & Supabase

   Aplicação Next.js integrada ao Supabase (Postgres, Auth, Storage e Edge Functions). O fluxo oficial é **desenvolver no ambiente local (Docker)** e sincronizar com o projeto cloud `nalwsuifppxvrikztwcz` quando necessário.

   ## 🚀 Como começar

   1. **Variáveis de ambiente**
      ```powershell
      Copy-Item .env.template .env.local.dev
      ```
      - A seção "Local Supabase" já traz as chaves padrão exibidas por `npx supabase start`.
      - Ajuste a seção "Cloud" se for apontar direto para o projeto remoto.

   2. **Instalar dependências**
      ```powershell
      npm install
      ```

   3. **(Opcional) Iniciar Supabase local**
      ```powershell
      npx supabase start
      ```
      Consulte `docs/supabase-workflow.md` para o ciclo completo Local ↔ Cloud.

   4. **Selecionar ambiente rapidamente**
      ```powershell
      .\scripts\switch-env.ps1          # mostra modo atual
      .\scripts\switch-env.ps1 -Mode local
      .\scripts\switch-env.ps1 -Mode cloud
      ```

   5. **Rodar a aplicação**
      ```powershell
      npm run dev
      ```
      A interface abre em http://localhost:9003.

   ## 📜 Scripts principais (`package.json`)

   | Script | Descrição |
   | --- | --- |
   | `npm run dev` | Next.js + Turbopack em `:9003` |
   | `npm run build` / `npm run start` | Build e execução em modo produção |
   | `npm run lint` / `npm run typecheck` | Garantias de qualidade |
   | `npm run genkit:dev` / `npm run genkit:watch` | Flows Genkit/AI |
   | `npm run sb:link` | Conecta Supabase CLI ao projeto `nalwsuifppxvrikztwcz` |
   | `npm run sb:functions:deploy` | Deploy das Edge Functions (`supabase/functions/*`) |

   Scripts legados do Prisma foram removidos—toda a gestão de banco passa pelas migrations do Supabase.

   ## 🗂️ Estrutura resumida

   ```
    .on(
     app/                 # App Router (rotas públicas + painel)
     components/          # UI (dashboard, patients, shifts, etc.)
     hooks/, lib/, server/ # lógica compartilhada e server actions
   supabase/
     migrations/          # Fonte da verdade do schema
     functions/           # Edge Functions (checkin, post_to_shift, shift_status)
      'postgres_changes',
     supabase-workflow.md # Passo a passo Local ↔ Cloud
     SYNC-STATUS.md       # Situação atual das migrations
     schemas/             # Referências completas (combined + legacy SQL)
     CLEANUP-REPORT.md    # Histórico desta faxina estrutural
   scripts/
     switch-env.ps1, test-supabase-connectivity.ps1, debug-headless.js
   ```

   ## 🧱 Banco de dados
   - Execute `npx supabase db pull` para trazer alterações cloud.
   - Gere novas migrations com `npx supabase db diff -f <nome>`.
   - Referências completas em `docs/schemas/` e no arquivo consolidado `docs/backend.json`.

   ## 🔐 Segurança e boas práticas
   - `.env*` (incluindo `.env.local.dev`) e artefatos Supabase CLI (`supabase/.temp`, `.branches`) estão ignorados por padrão.
   - Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente.
   - Utilize `scripts/test-supabase-connectivity.ps1` se desconfiar de bloqueios de rede.
   - Documentação complementar: `docs/supabase-workflow.md` e `docs/SYNC-STATUS.md`.

   Com isso o repositório fica enxuto, sem duplicidades (Prisma/sql legacy), e pronto para continuar evoluindo o produto. Bons builds! 💙
      { event: '*', schema: 'public', table: 'shift_presence', filter: `shift_id=eq.${shiftId}` },
      (payload) => console.log('Presence event', payload)
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}
```

Execute em um componente React ou script Node (com `SUPABASE_URL/ANON_KEY` configurados).

---

## 7. Documentação (Dataedo)

1. Usar `DATABASE_URL` com usuário read-only.
2. Importar banco **postgres** / schema `public`.
3. Habilitar importação de comentários (`COMMENT ON ...` já está no SQL base).
4. Reimportar sempre que rodar novas migrações.

---

## 8. Checklist de segurança

- RLS ativo e validado (`sql/001_security_realtime.sql`).
- Trigger de perfis (`sql/002_trigger_user_profiles.sql`).
- Supabase Auth responsável por e-mail/senha e OAuth (Google).
- Edge Functions autenticadas via Bearer token.
- Senhas e chaves sensíveis fora do Git (usar secrets/CI).

Com isso o backend Supabase está pronto para uso em produção, mantendo auditoria, políticas e realtime alinhados com o front.***
