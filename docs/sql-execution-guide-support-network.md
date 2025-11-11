# Bloco 6 - Rede de Apoio: Guia de Execução SQL

## Resumo
Este documento descreve como executar a migração SQL para o Bloco 6 - Rede de Apoio no Supabase.

## Arquivo SQL
`sql/003_add_patient_support_network.sql`

## O Que Este Script Cria

### Tabelas
1. **`patient_support_profiles`** - Perfil 1:1 com paciente/tenant
   - Responsável legal (JSONB)
   - Contato de emergência (JSONB)
   - Notas sobre a rede de apoio
   
2. **`patient_support_members`** - Membros da rede ampliada (N:1 com profile)
   - Dados do membro (nome, relação, contato)
   - Permissões (array: view, authorize, receive_updates, emergency_contact)
   - Preferências de notificação (JSONB)
   - Status ativo/inativo

### Recursos de Segurança
- **RLS (Row Level Security)** habilitado em ambas as tabelas
- **Policies** baseadas em `app_private.current_tenant_id()`
- Isolamento completo entre tenants
- Validação de profile_id em members (deve pertencer ao mesmo tenant)

### Outros Recursos
- Índices em tenant_id, patient_id, profile_id
- Triggers para atualização automática de `updated_at`
- Constraints de unicidade (1 profile por patient/tenant)
- Comments completos em tabelas e colunas

## Pré-Requisitos

1. Acesso ao Supabase SQL Editor
2. Projeto staging configurado
3. Credenciais com permissão de DDL
4. Backup do banco (recomendado)

## Execução em Staging

### Passo 1: Backup
Antes de executar, faça um backup do banco de dados:
```bash
supabase db dump > backup-before-support-network.sql
```

### Passo 2: Executar SQL
1. Abrir Supabase Dashboard → SQL Editor
2. Copiar todo o conteúdo de `sql/003_add_patient_support_network.sql`
3. Colar no editor
4. Clicar em "Run" ou pressionar Ctrl+Enter
5. Aguardar execução completa

### Passo 3: Validar Tabelas
```sql
-- Verificar que as tabelas foram criadas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'patient_support%';
```

Resultado esperado:
```
table_name                    | table_type
------------------------------|------------
patient_support_profiles      | BASE TABLE
patient_support_members       | BASE TABLE
```

### Passo 4: Validar Índices
```sql
-- Verificar índices criados
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename LIKE 'patient_support%';
```

Resultado esperado:
```
indexname                           | tablename
------------------------------------|---------------------------
patient_support_profiles_pkey       | patient_support_profiles
idx_support_profiles_patient        | patient_support_profiles
idx_support_profiles_tenant         | patient_support_profiles
unique_patient_tenant_support_...   | patient_support_profiles
patient_support_members_pkey        | patient_support_members
idx_support_members_profile         | patient_support_members
idx_support_members_tenant          | patient_support_members
```

### Passo 5: Validar Triggers
```sql
-- Verificar triggers criados
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgname LIKE '%support%';
```

Resultado esperado:
```
tgname                                   | tgrelid
-----------------------------------------|---------------------------
trg_patient_support_profiles_updated_at  | patient_support_profiles
trg_patient_support_members_updated_at   | patient_support_members
```

### Passo 6: Validar RLS Policies
```sql
-- Verificar policies RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename LIKE 'patient_support%';
```

Resultado esperado (8 policies):
```
support_profiles_select_same_tenant
support_profiles_insert_roles
support_profiles_update_roles
support_profiles_delete_roles
support_members_select_same_tenant
support_members_insert_roles
support_members_update_roles
support_members_delete_roles
```

## Testes de RLS

### Teste 1: Inserir Profile (deve funcionar)
```sql
-- Simular usuário com tenant_id válido
SET request.jwt.claims = '{"tenant_id": "00000000-0000-0000-0000-000000000001", "app_role": "admin"}';

INSERT INTO patient_support_profiles (patient_id, tenant_id, support_notes)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'Test support profile'
);
```

### Teste 2: Ler Profiles do Mesmo Tenant (deve retornar dados)
```sql
SET request.jwt.claims = '{"tenant_id": "00000000-0000-0000-0000-000000000001", "app_role": "viewer"}';

SELECT * FROM patient_support_profiles;
```

### Teste 3: Ler Profiles de Outro Tenant (deve retornar vazio)
```sql
SET request.jwt.claims = '{"tenant_id": "99999999-9999-9999-9999-999999999999", "app_role": "viewer"}';

SELECT * FROM patient_support_profiles;
-- Resultado esperado: 0 rows
```

### Teste 4: Inserir Member Válido
```sql
SET request.jwt.claims = '{"tenant_id": "00000000-0000-0000-0000-000000000001", "app_role": "admin"}';

-- Primeiro obter o profile_id do teste anterior
INSERT INTO patient_support_members (profile_id, tenant_id, name, relation)
VALUES (
  '<profile_id_do_teste_1>',
  '00000000-0000-0000-0000-000000000001',
  'John Doe',
  'Son'
);
```

### Teste 5: Validar Isolamento entre Tenants (members)
```sql
-- Tentar inserir member com profile de outro tenant (deve falhar)
SET request.jwt.claims = '{"tenant_id": "99999999-9999-9999-9999-999999999999", "app_role": "admin"}';

INSERT INTO patient_support_members (profile_id, tenant_id, name)
VALUES (
  '<profile_id_do_teste_1>',
  '99999999-9999-9999-9999-999999999999',
  'Unauthorized Member'
);
-- Resultado esperado: RLS violation error
```

## Limpeza de Testes
```sql
-- Limpar dados de teste
DELETE FROM patient_support_members WHERE name IN ('John Doe', 'Unauthorized Member');
DELETE FROM patient_support_profiles WHERE support_notes = 'Test support profile';
```

## Rollback

Se algo der errado, execute:

```sql
DROP TABLE IF EXISTS public.patient_support_members CASCADE;
DROP TABLE IF EXISTS public.patient_support_profiles CASCADE;
```

**ATENÇÃO:** Isso apagará TODOS os dados das tabelas!

## Execução em Produção

⚠️ **IMPORTANTE**: Não executar em produção sem:
1. ✅ Validação completa em staging
2. ✅ Testes de RLS executados e aprovados
3. ✅ Backup recente do banco de produção
4. ✅ Aprovação humana do responsável
5. ✅ Janela de manutenção agendada (se necessário)

### Checklist Pré-Produção
- [ ] Script executado e validado em staging
- [ ] Todos os testes de RLS passaram
- [ ] Backup de produção criado e verificado
- [ ] Aprovação documentada
- [ ] Plano de rollback testado
- [ ] Monitoramento configurado

### Execução
1. Fazer backup do banco de produção
2. Executar o mesmo SQL de staging
3. Executar todas as validações (passos 3-6)
4. Executar testes básicos de RLS
5. Monitorar logs por 15-30 minutos
6. Validar que aplicação continua funcionando normalmente

## Troubleshooting

### Erro: "relation already exists"
**Causa:** Tabela já existe  
**Solução:** Script é idempotente, pode ignorar ou verificar se tabela está correta

### Erro: "function set_updated_at already exists"
**Causa:** Função já existe  
**Solução:** Script verifica antes de criar, pode ignorar

### Erro: "permission denied"
**Causa:** Usuário sem permissões DDL  
**Solução:** Usar usuário com permissões de superuser ou schema owner

### RLS bloqueando operações legítimas
**Causa:** Claims JWT não configurados ou incorretos  
**Solução:** Verificar que `app_private.current_tenant_id()` retorna UUID válido

## Suporte

Para problemas ou dúvidas:
1. Verificar este guia primeiro
2. Consultar logs do Supabase
3. Executar queries de validação
4. Contatar equipe de desenvolvimento

---
**Última atualização:** 2025-11-06  
**Versão:** 003  
**Autor:** Agente Automático
