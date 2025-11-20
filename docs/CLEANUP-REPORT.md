## Clean-up Report

- **Arquivos excluídos**
  - Removido `src/components/shifts/shift-details-dialog.tsx` (substituído pelo `ShiftMonitorSheet`).
  - Removido `src/components/shifts/publish-vacancy-dialog.tsx` (absorvido pelo `VacancyManagerDialog`).

- **Bibliotecas / ícones**
  - Substituídas importações de `lucide-react` por `@phosphor-icons/react` em componentes de pacientes v2 (`tab-address.tsx`, `tab-administrative.tsx`, `tab-financial.tsx`, `tab-general.tsx`, `tab-team.tsx`), monitor de plantões (`ShiftMonitorSheet.tsx`) e gestão de plantões (`shift-management.tsx`).
  - Dependências do projeto inalteradas; somente troca de fontes de ícones nos componentes.

- **Campos de banco mapeados para TypeScript**
  - `Patient` agora contempla colunas e JSONBs do Supabase: `tenantId`, `fullName`, `recordStatus`, `phones/emails` JSONB, `communicationOptOut`, `identityVerification`, `duplicateCandidates`, `accessLogSummary`, `lastViewedAt`, `createdBy/updatedBy`, além de estruturas derivadas para `patient_addresses`, `patient_admin_info`, `patient_financial_info`, `patient_intelligence`, `patient_operational_links`, `patient_documents`, `patient_consents` e `patient_audit_logs`.
  - `Shift` aceita os status do banco (`scheduled | published | assigned | in_progress | completed | cancelled`) mantendo apenas aliases legados marcados como legacy.
  - `patient.financial` schema (`PatientFinancialZ`) passa a normalizar `invoice_history` com `default([])`.
  - `PatientPersonalZ` aceita metadados (`access_log_summary`, `last_viewed_at`, `created_by`, `updated_by`) e ignora o campo `pronouns` ao persistir.

- **Componentes migrados para Phosphor**
  - Paciente v2: abas de Endereço/Ambiente, Geral, Administrativo, Financeiro e Time.
  - Shifts: `ShiftMonitorSheet` e `shift-management` (inclui monitor no lugar do diálogo legado).

- **Outras ações**
  - Página `patients/[id]/page.tsx` agora busca o paciente no Supabase (com relacionamentos) e mapeia o payload para `Patient`, com fallback para mocks.
  - Bordas exageradas normalizadas para `rounded-lg`/`rounded-md` em dialogs e dashboards de plantões (`VacancyManagerDialog`, `ShiftMonitorSheet`, `schedule-dashboard`, `ui/sidebar`).
