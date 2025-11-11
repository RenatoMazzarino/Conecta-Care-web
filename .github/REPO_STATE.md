# REPO_STATE — Histórico de ações automáticas

Este arquivo deve ser atualizado por agentes/automações (ou manualmente) sempre que alterações de infraestrutura, banco de dados, ou mudanças de schema forem propostas ou aplicadas.

Formato (exemplo):

- id: bloco-5-financeiro-2025-11-05-01
  request_id: bloco-5-financeiro
  actor: agent/auto-runner
  branch: agent/bloco-5-financeiro
  commits:
    - sha: <sha1>
      message: "chore(agent): add financial schema and server action"
  files_added:
    - sql/005_add_patient_financial_info.sql
    - src/schemas/patient.financial.ts
    - src/app/(app)/patients/actions.upsertFinancialInfo.ts
  environment: staging
  credentials_used: SUPABASE_SERVICE_ROLE_KEY (name only)
  result: pending | success | failed
  summary: |
    - created SQL file with RLS/policies
    - validated Zod schema
    - attempted apply on staging: error (foreign key missing)
    - action: reverted and alerted humans
  timestamp: 2025-11-05T12:34:56Z

Use entradas do tipo acima para manter histórico. Agentes devem anexar logs e links para o PR/CI run quando aplicável.
