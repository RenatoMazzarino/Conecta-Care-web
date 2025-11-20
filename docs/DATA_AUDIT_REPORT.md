# Data Audit Report - Fase 1 (Conecta Care)

## Tabela de Discrepancias
| Entidade | Campo/Status | Definicao SQL | Definicao TS | Acao Recomendada |
| :--- | :--- | :--- | :--- | :--- |
| Patient | status (patient_status) | Enum `('active','inactive','discharged','deceased')` em `patients.status` | Campo `recordStatus: 'active' | 'inactive' | 'deceased'` (nao usa PatientRecordStatus nem aceita `discharged`) | Renomear para `status` e tipar como `PatientRecordStatus` alinhado ao enum do banco |
| Patient | document_id, gender, contact_email, contact_phone | Colunas text em `patients` para identidade/contato | Ausentes; TS espera `cpf/rg` e arrays `phones[]/emails[]` em JSON | Incluir campos mapeando 1:1 ou alterar modelo de persistencia/migracao para refletir a estrutura usada no front |
| Patient | address | `patients.address jsonb` livre (nenhum schema imposto) | Tipo `address?: PatientAddress` com dezenas de campos (id, cep, geoLat...) que pressupoe tabela dedicada | Ajustar shape para o JSON salvo em `patients.address` ou criar tabela/migracao `patient_addresses` que persista esses campos |
| Patient | financial (JSON) / PatientFinancialInfo | Inexistente em `patients` ou tabela separada | Campo `financial` no Patient e tipo `PatientFinancialInfo` (plano, mensalidade, fatura) | **ERRO CRITICO:** Criar armazenamento (tabela ou coluna jsonb) ou remover/adequar o tipo para refletir o que existe |
| Shift | created_by_id, location, meta | `shifts` exige `created_by_id uuid` e possui `location jsonb`, `meta jsonb` | Tipo `Shift` nao inclui esses campos e adiciona campos de UI (`ownerId`, `dayKey`, `shiftType`, `isUrgent`, `progress`, `checkIn/out`, etc.) sem coluna no banco | Alinhar o tipo ao schema real e isolar campos somente-UI em um view-model separado |

## Campos Orfaos (presentes no types.ts sem destino no banco)
- Patient: cns, cpf, cpfStatus, rg, rgIssuer, rgDigitalUrl, nationalId, sexAtBirth, genderIdentity, civilStatus, nationality, placeOfBirth, pronouns, photoUrl, displayName, name, initials, preferredLanguage, preferredContactMethod, riskFlags, duplicateCandidates, lastViewedAt, createdBy, updatedBy, phones, emails, externalIds, identityVerification, documentValidation, sensitiveDataConsent, photoConsent, communicationOptOut, accessLogSummary, emergencyContacts, legalGuardian, domicile, adminData, financial, clinicalSummaryMeta, documentsCollection, changeLog, accessLog, smartFields, pending_documents, consent_status, last_visit_date, next_visit_date.
- Shift: ownerId, dayKey, shiftType, isUrgent, progress, checkIn, checkOut, checkInStatus, checkOutStatus, hasNotification.
- Tipos sem tabela nos migrations lidos: PatientAddress, PatientAdminInfo, PatientFinancialInfo, PatientSupportNetwork, PatientClinicalSummary (apenas `patients.address` e `patients.clinical_summary` em JSON existem).

## Tabelas sem Tipagem no types.ts
- Nenhuma identificada nas fontes de verdade: `patient_intelligence`, `patient_operational_links`, `payment_transactions`, `patient_documents`, `patient_consents`, `patient_audit_logs` e demais tabelas novas possuem tipos correspondentes.
