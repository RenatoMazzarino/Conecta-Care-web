# Exemplo de pedido preenchido — BLOCO 5 (Financeiro)

## Metadados
- request_id: bloco-5-financeiro
- title: "Adicionar tabela patient_financial_info + RLS e API de upsert"
- priority: high
- actor: renato@example.com
- date: 2025-11-05
 - auto_execute: no
 - target_env: staging
 - credentials_provided: no
 - required_approval: human-review

## Escopo e objetivo (resumo)
- Criar a tabela `public.patient_financial_info` com índices, trigger de `updated_at`, habilitar RLS e políticas para isolar por `tenant_id`. Adicionar Zod schema e uma server action para upsert. NÃO executar a SQL em produção sem aprovação humana.

## Artefatos esperados
- [x] SQL file in `sql/005_add_patient_financial_info.sql`
- [ ] Prisma migration / instructions
- [x] Zod schema in `src/schemas/patient.financial.ts`
- [x] Server action in `src/app/(app)/patients/actions.upsertFinancialInfo.ts`
- [x] Unit tests in `src/__tests__/patient.financial.test.ts`
- [x] Documentation/notes in `docs/` and PR description

## Riscos e pré-condições
- Riscos: alteração em RLS e criação de triggers; necessidade de tenant isolation; possivel necessidade de atualizar dados existentes (mapeamento entre modelos antigos e novo esquema).
- Pré-condições: ter backup do banco; confirmar que `tenants` existe (se não, a SQL criará); executar em staging antes de produção; aprovação humana obrigatória para aplicação em produção → NO

## Passos que o agente deve executar (o que gerar)
1. Criar `sql/005_add_patient_financial_info.sql` contendo o bloco SQL completo (extensão pgcrypto, função current_tenant, create table, índices, trigger, RLS policies). Incluir header com objetivo, riscos, rollback sugerido e comando para executar na UI do Supabase.
2. Criar `src/schemas/patient.financial.ts` com o conteúdo Zod (snake_case). Exportar `PatientFinancialZ`.
3. Criar `src/app/(app)/patients/actions.upsertFinancialInfo.ts` (server action) que: valida payload com `PatientFinancialZ`, obtém `supabase` server client, upsert na tabela `patient_financial_info`, retorna { ok: true } ou throw Error.
4. Criar testes unitários em `src/__tests__/patient.financial.test.ts` que validem parsing do Zod e o comportamento do action com supabase mock.
5. Rodar `npm run typecheck` e `npm run db:generate` localmente; anexar saída no PR.
6. Abrir PR draft em branch `agent/bloco-5-financeiro` com checklist e marcar revisores humanos.

## Conteúdos sugeridos para os artefatos (resumos)

SQL (resumo, colocar completo em `sql/005_add_patient_financial_info.sql`):

-- create extension if not exists pgcrypto;
-- create or replace function public.current_tenant() ...
-- create table if not exists public.tenants (...);
-- create table if not exists public.patient_financial_info (...);
-- create trigger trg_pfi_updated_at ...;
-- enable RLS and create policies financial_select_same_tenant, financial_insert_same_tenant, financial_update_same_tenant;

Zod schema (arquivo: `src/schemas/patient.financial.ts`):

export const InvoiceHistoryZ = z.object({ date: z.coerce.date(), value: z.coerce.number(), status: z.enum(['Pago','Pendente','Cancelado']), method: z.string().optional(), proofUrl: z.string().url().optional() });

export const PatientFinancialZ = z.object({ id: z.string().uuid().optional(), patient_id: z.string().uuid(), tenant_id: z.string().uuid(), bond_type: z.enum(['Plano de Saúde','Particular','Convênio','SUS','Parceria']).optional(), insurer: z.string().optional(), plan_name: z.string().optional(), card_number: z.string().optional(), validity: z.coerce.date().optional(), monthly_fee: z.coerce.number().optional(), due_day: z.coerce.number().min(1).max(31).optional(), payment_method: z.enum(['Boleto','PIX','Débito','Transferência','Faturamento','Outro']).optional(), billing_status: z.enum(['Em dia','Atrasado','Em negociação','Inadimplente','Isento']).optional(), last_payment_date: z.coerce.date().optional(), last_payment_amount: z.coerce.number().optional(), financial_contact: z.string().optional(), observations: z.string().optional(), invoice_history: z.array(InvoiceHistoryZ).optional(), created_at: z.string().optional(), updated_at: z.string().optional() });

Server action (arquivo: `src/app/(app)/patients/actions.upsertFinancialInfo.ts`) — resumo:

"use server";
import { PatientFinancialZ } from '@/schemas/patient.financial';
import { getSupabaseServerClient } from '@/lib/supabaseServerClient';
export async function upsertPatientFinancial(payload: unknown) { const data = PatientFinancialZ.parse(payload); const supabase = await getSupabaseServerClient(); const { id, ...rest } = data as any; const rows = id ? [{ id, ...rest, updated_at: new Date().toISOString() }] : [{ ...rest, created_at: new Date().toISOString() }]; const { error } = await supabase.from('patient_financial_info').upsert(rows, { onConflict: 'id' }); if (error) throw new Error(error.message); return { ok: true }; }

Testes sugeridos (arquivo: `src/__tests__/patient.financial.test.ts`):
- Teste que `PatientFinancialZ.parse` aceita payloads válidos.
- Teste que a server action chama `supabase.from('patient_financial_info').upsert` com os campos corretos (mock supabase client).

Notas para o mantenedor (incluir no PR):
- Backup do banco antes de aplicar; executar em staging; conferir tenants; executar SQL no Supabase SQL Editor; verificar counts e policies pós-aplicação.
