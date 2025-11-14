# Database Schemas Reference

Esta pasta contém schemas de referência completos do banco de dados.

## Arquivos

### `combined-schema-baseline.sql`
**Origem:** Arquivo `_ON` gerado pelo Codex assistant  
**Data:** 11/11/2025 02:02:05  
**Descrição:** Schema completo combinado que inclui:
- `sql/000_init.sql` - Tabelas, tipos, funções helper
- `sql/001_security_realtime.sql` - Row Level Security policies
- `sql/002_trigger_user_profiles.sql` - Trigger de criação de perfil

**Conteúdo:**
- 10 tabelas principais: tenants, app_users, patients, professionals, shifts, shift_posts, shift_presence, inventory_items, supply_requests, audit_logs
- 5 enums: user_role, shift_status, presence_state, patient_status, supply_request_status
- Funções JWT: current_tenant_id(), current_app_role(), current_user_id()
- Triggers: updated_at, audit logging
- Policies RLS completas para todas as tabelas

**Uso:**
- Referência rápida do schema completo
- Documentação das decisões de arquitetura
- Backup da estrutura inicial

## Migrations Oficiais

Os schemas oficiais versionados estão em:
- `supabase/migrations/20251111020500_baseline.sql`
- `supabase/migrations/20251113232442_remote_schema.sql`
- `supabase/migrations/20251113235106_remote_schema.sql`

Use as migrations para aplicar mudanças ao banco. Os arquivos aqui são apenas **referência/documentação**.
