# REPO STATE — central de verdade

Este arquivo é atualizado por `scripts/update_repo_state.js` para manter um histórico conciso do estado do repositório.

Cada entrada contém timestamp, actor, mensagem e um snapshot de arquivos importantes (migrations, funções, seed, etc.).

(Entradas serão adicionadas automaticamente quando o script for executado.)

## 2025-11-06T00:20:13.137Z
actor: LocalTest
message: smoke test update

### snapshot
- repo: nextn 0.1.0
- node scripts present: true
- dev server script: next dev --turbopack -p 9003
- supabase project-ref: nalwsuifppxvrikztwcz
- supabase migrations (count): 1
  - 20251105232715_remote_commit.sql
- prisma migrations (count): 1
- edge functions: checkin, post_to_shift, shift_status
- seed script present: true

### README excerpt (first 6 lines)

# Conecta Care – Supabase Backend

Stack atual: **Supabase (Postgres + Realtime + Edge Functions)** com Prisma, RLS habilitado e documentação via Dataedo. Firebase foi removido por completo.

---


---