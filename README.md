# Conecta Care – Supabase Backend

Stack atual: **Supabase (Postgres + Realtime + Edge Functions)** com Prisma, RLS habilitado e documentação via Dataedo. Firebase foi removido por completo.

---

## 1. Passo a passo rápido

1. **Criar `.env`**
   ```bash
   cp .env.example .env
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
    )
    .on(
      'postgres_changes',
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
