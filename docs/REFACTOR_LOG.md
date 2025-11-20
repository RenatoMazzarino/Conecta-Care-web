# Refactor Log

- **Tipos e enums**
  - `Shift.status` agora aceita apenas `scheduled | published | assigned | in_progress | completed | cancelled`. Componentes de escala (`shift-management`, grid/mobile views, mocks) foram mapeados para esses valores.
  - `PatientFinancialInfo` ganhou campo `meta` para armazenar dados adicionais do frontend.
  - `PaymentTransactionStatus` tipado e `Transaction` ajustado para refletir `payment_transactions` (`provider`, `amount`, `status`, `dueDate`, `paidAt`, `metadata`), com mocks e página financeira alinhados.
  - `Shift` passou a incluir campos opcionais usados no frontend (patientId, shiftType, dayKey, progress, etc.) para compatibilizar UI x schema.
- **Ícones e visual**
  - Migrados todos os ícones de `ShiftMonitorSheet` e dos cards de dashboard para `@phosphor-icons/react`.
  - Ajustada geometria (rounded-lg/md) em componentes de escala e mantido `--radius` em `0.375rem`.
- **Código removido**
  - Componentes legados de pacientes: `ficha-cadastral.tsx`, `ficha-clinica.tsx`, `ficha-endereco.tsx`, `ficha-financeira.tsx`, `ficha-administrativa.tsx`, `patient-details-panel.tsx`, `patient-forms.tsx`.
  - Diálogos legados de escala removidos: `src/components/shifts/direct-assignment-dialog.tsx`, `shift-details-dialog.tsx`, `publish-vacancy-dialog.tsx`.
  - Páginas de cadastro/endereço passaram a exibir aviso orientando uso da ficha v2 (Sheets).
- **Dados e mocks**
  - `initialShifts` migrado para os novos status.
  - `mockTransactions` remodelado para o formato de `payment_transactions` (status paid/pending/overdue/cancelled).
