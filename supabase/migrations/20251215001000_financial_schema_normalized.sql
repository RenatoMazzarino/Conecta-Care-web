-- Normalized financial profile schema

-- 1. Tabela de Perfil Financeiro (Configuração do Contrato)
CREATE TABLE IF NOT EXISTS patient_financial_profiles (
  patient_id uuid PRIMARY KEY REFERENCES patients (id) ON DELETE CASCADE,
  
  -- Vínculo e Plano
  bond_type text CHECK (bond_type IN ('Plano de Saúde', 'Particular', 'Convênio', 'Público')),
  insurer_name text, -- Ex: Unimed
  plan_name text,    -- Ex: Especial
  insurance_card_number text,
  insurance_card_validity date,
  
  -- Regras de Cobrança
  monthly_fee numeric(10, 2) DEFAULT 0,
  billing_due_day integer CHECK (billing_due_day BETWEEN 1 AND 31),
  payment_method text, -- Boleto, PIX, etc.
  
  -- Responsável Financeiro (Dados snapshot ou link)
  financial_responsible_name text,
  financial_responsible_contact text, -- Email ou Telefone
  
  -- Metadados
  billing_status text DEFAULT 'active' CHECK (billing_status IN ('active', 'suspended', 'defaulting')),
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Index para relatórios rápidos (Ex: Quem deve pagar dia 10?)
CREATE INDEX idx_financial_billing_day ON patient_financial_profiles (billing_due_day);
CREATE INDEX idx_financial_insurer ON patient_financial_profiles (insurer_name);

-- 3. Trigger para atualizar updated_at
CREATE TRIGGER trg_touch_financial_profile
  BEFORE UPDATE ON patient_financial_profiles
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

-- 4. RLS (Segurança)
ALTER TABLE patient_financial_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY financial_read_tenant ON patient_financial_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_financial_profiles.patient_id AND p.tenant_id = app_private.current_tenant_id())
  );

CREATE POLICY financial_write_admin ON patient_financial_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_financial_profiles.patient_id AND p.tenant_id = app_private.current_tenant_id())
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );
