-- ============================================
-- B6 - Rede de Apoio (Support Network)
-- Objetivo: Dados de responsável legal, emergência e rede ampliada por paciente
-- Riscos: PII (dados de familiares); RLS por tenant; manter updated_at; FK em patients/tenants
-- Rollback: Ver instruções no final deste arquivo
-- Execução: Supabase SQL Editor (staging) -> validar -> produção com aprovação humana
-- Nota: NÃO alterar app_private.current_tenant_id()
-- Versão: 003
-- Data: 2025-11-05
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Função set_updated_at (reutilizar se existir)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'set_updated_at' AND n.nspname = 'public'
  ) THEN
    EXECUTE $$CREATE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $func$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
    $func$;$$;
  END IF;
END $$;

-- ============================================
-- Tabela: patient_support_profiles
-- Relação 1:1 com patient/tenant
-- ============================================
CREATE TABLE IF NOT EXISTS public.patient_support_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients (id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES public.tenants (id) ON DELETE CASCADE,
  
  -- Responsável Legal
  legal_responsible jsonb,
  
  -- Contato de Emergência
  emergency_contact jsonb,
  
  -- Notas gerais sobre a rede de apoio
  support_notes text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Constraint de unicidade: 1 profile por patient/tenant
  CONSTRAINT unique_patient_tenant_support_profile UNIQUE (patient_id, tenant_id)
);

COMMENT ON TABLE public.patient_support_profiles IS 'Perfil de rede de apoio do paciente (responsável legal, emergência, notas).';
COMMENT ON COLUMN public.patient_support_profiles.patient_id IS 'Referência ao paciente.';
COMMENT ON COLUMN public.patient_support_profiles.tenant_id IS 'Tenant ao qual o perfil pertence.';
COMMENT ON COLUMN public.patient_support_profiles.legal_responsible IS 'Dados do responsável legal (JSON).';
COMMENT ON COLUMN public.patient_support_profiles.emergency_contact IS 'Dados do contato de emergência (JSON).';
COMMENT ON COLUMN public.patient_support_profiles.support_notes IS 'Notas gerais sobre a rede de apoio.';

-- Índices
CREATE INDEX IF NOT EXISTS idx_support_profiles_patient ON public.patient_support_profiles (patient_id);
CREATE INDEX IF NOT EXISTS idx_support_profiles_tenant ON public.patient_support_profiles (tenant_id);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trg_patient_support_profiles_updated_at ON public.patient_support_profiles;
CREATE TRIGGER trg_patient_support_profiles_updated_at
  BEFORE UPDATE ON public.patient_support_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- Tabela: patient_support_members
-- Relação N:1 com profile (rede ampliada)
-- ============================================
CREATE TABLE IF NOT EXISTS public.patient_support_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.patient_support_profiles (id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES public.tenants (id) ON DELETE CASCADE,
  
  -- Dados do membro
  name text NOT NULL,
  relation text,
  phone text,
  email text,
  
  -- Permissões
  permissions text[] DEFAULT ARRAY[]::text[],
  
  -- Preferências de notificações
  notifications_prefs jsonb,
  
  -- Notas específicas sobre este membro
  notes text,
  
  -- Status ativo/inativo
  is_active boolean NOT NULL DEFAULT true,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.patient_support_members IS 'Membros da rede de apoio ampliada (familiares, cuidadores).';
COMMENT ON COLUMN public.patient_support_members.profile_id IS 'Referência ao perfil de suporte do paciente.';
COMMENT ON COLUMN public.patient_support_members.tenant_id IS 'Tenant ao qual o membro pertence.';
COMMENT ON COLUMN public.patient_support_members.name IS 'Nome do membro da rede de apoio.';
COMMENT ON COLUMN public.patient_support_members.relation IS 'Relação com o paciente (ex: filho, cônjuge).';
COMMENT ON COLUMN public.patient_support_members.permissions IS 'Array de permissões (view, authorize, etc).';
COMMENT ON COLUMN public.patient_support_members.notifications_prefs IS 'Preferências de notificação (JSON).';
COMMENT ON COLUMN public.patient_support_members.is_active IS 'Indica se o membro está ativo.';

-- Índices
CREATE INDEX IF NOT EXISTS idx_support_members_profile ON public.patient_support_members (profile_id);
CREATE INDEX IF NOT EXISTS idx_support_members_tenant ON public.patient_support_members (tenant_id);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trg_patient_support_members_updated_at ON public.patient_support_members;
CREATE TRIGGER trg_patient_support_members_updated_at
  BEFORE UPDATE ON public.patient_support_members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- RLS Policies
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.patient_support_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_support_members ENABLE ROW LEVEL SECURITY;

-- Drop policies existentes (idempotente)
DROP POLICY IF EXISTS support_profiles_select_same_tenant ON public.patient_support_profiles;
DROP POLICY IF EXISTS support_profiles_insert_roles ON public.patient_support_profiles;
DROP POLICY IF EXISTS support_profiles_update_roles ON public.patient_support_profiles;
DROP POLICY IF EXISTS support_profiles_delete_roles ON public.patient_support_profiles;

DROP POLICY IF EXISTS support_members_select_same_tenant ON public.patient_support_members;
DROP POLICY IF EXISTS support_members_insert_roles ON public.patient_support_members;
DROP POLICY IF EXISTS support_members_update_roles ON public.patient_support_members;
DROP POLICY IF EXISTS support_members_delete_roles ON public.patient_support_members;

-- Policies para patient_support_profiles
CREATE POLICY support_profiles_select_same_tenant
  ON public.patient_support_profiles
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

CREATE POLICY support_profiles_insert_roles
  ON public.patient_support_profiles
  FOR INSERT
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY support_profiles_update_roles
  ON public.patient_support_profiles
  FOR UPDATE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY support_profiles_delete_roles
  ON public.patient_support_profiles
  FOR DELETE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

-- Policies para patient_support_members
-- Nota: Valida que o profile_id pertence ao mesmo tenant via EXIST
CREATE POLICY support_members_select_same_tenant
  ON public.patient_support_members
  FOR SELECT
  USING (
    tenant_id = app_private.current_tenant_id()
    AND EXISTS (
      SELECT 1
      FROM public.patient_support_profiles p
      WHERE p.id = patient_support_members.profile_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY support_members_insert_roles
  ON public.patient_support_members
  FOR INSERT
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
    AND EXISTS (
      SELECT 1
      FROM public.patient_support_profiles p
      WHERE p.id = profile_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY support_members_update_roles
  ON public.patient_support_members
  FOR UPDATE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
    AND EXISTS (
      SELECT 1
      FROM public.patient_support_profiles p
      WHERE p.id = patient_support_members.profile_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY support_members_delete_roles
  ON public.patient_support_members
  FOR DELETE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
    AND EXISTS (
      SELECT 1
      FROM public.patient_support_profiles p
      WHERE p.id = patient_support_members.profile_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

-- ============================================
-- INSTRUÇÕES DE EXECUÇÃO
-- ============================================
-- 1. Copiar este arquivo SQL completo
-- 2. Abrir Supabase SQL Editor no projeto staging
-- 3. Colar e executar o script completo
-- 4. Validar:
--    - Tabelas criadas: SELECT * FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'patient_support%';
--    - Índices criados: SELECT indexname FROM pg_indexes WHERE tablename LIKE 'patient_support%';
--    - Triggers criados: SELECT tgname FROM pg_trigger WHERE tgname LIKE '%support%';
--    - Policies criadas: SELECT policyname FROM pg_policies WHERE tablename LIKE 'patient_support%';
-- 5. Testar RLS:
--    - Inserir dados como usuário do tenant A
--    - Tentar ler dados como usuário do tenant B (deve retornar vazio)
-- 6. Após validação em staging, aplicar em produção com aprovação humana
--
-- ============================================
-- ROLLBACK (em caso de necessidade)
-- ============================================
-- DROP TABLE IF EXISTS public.patient_support_members CASCADE;
-- DROP TABLE IF EXISTS public.patient_support_profiles CASCADE;
-- 
-- NOTA: Não deletar public.set_updated_at() se for usada por outras tabelas.
-- Para verificar: SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgfoid::regproc::text = 'public.set_updated_at()';
