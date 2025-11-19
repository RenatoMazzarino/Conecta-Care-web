-- Patient document & consent & audit log schema

-- Enums for documents
CREATE TYPE patient_document_type AS ENUM (
  'RG',
  'CPF',
  'CNH',
  'ComprovanteResidencia',
  'CarteirinhaPlano',
  'ContratoPrestacaoServicos',
  'AditivoContrato',
  'LaudoMedico',
  'RelatorioTecnico',
  'ReceitaMedica',
  'TermoConsentimento',
  'TermoResponsabilidade',
  'POA',
  'Outro'
);

CREATE TYPE patient_document_category AS ENUM (
  'Identificacao',
  'Financeiro',
  'Clinico',
  'Juridico',
  'Consentimento',
  'Outros'
);

CREATE TYPE patient_document_source AS ENUM (
  'upload',
  'integracao',
  'assinaturaDigital',
  'importacao'
);

-- Consent enums
CREATE TYPE patient_consent_type AS ENUM (
  'TratamentoDadosLGPD',
  'CompartilhamentoComOperadora',
  'CompartilhamentoComFamiliares',
  'EnvioComunicacoesWhatsApp',
  'AutorizacaoProcedimentoInvasivo',
  'AutorizacaoPublicacaoImagem',
  'Outro'
);

CREATE TYPE patient_consent_scope AS ENUM (
  'DadosClinicos',
  'DadosFinanceiros',
  'DadosAdministrativos',
  'EnvioComunicacoes',
  'CompartilhamentoComTerceiros',
  'Imagem',
  'Outros'
);

CREATE TYPE patient_consent_status AS ENUM ('Ativo', 'Revogado', 'Expirado');
CREATE TYPE patient_consent_channel AS ENUM ('AssinaturaDigital', 'Upload', 'Aplicativo', 'Manual');
CREATE TYPE patient_consent_granted_by AS ENUM ('Paciente', 'ResponsavelLegal', 'Tutor', 'Outro');

-- Audit enums
CREATE TYPE patient_audit_event_type AS ENUM (
  'view',
  'edit',
  'export',
  'download',
  'login_as_family',
  'status_change'
);

CREATE TYPE patient_audit_origin AS ENUM ('web', 'mobile', 'api', 'integration');

-- Documents table
CREATE TABLE patient_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  type patient_document_type NOT NULL,
  category patient_document_category NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_name text,
  mime_type text,
  file_hash text,
  uploaded_by uuid REFERENCES auth.users (id),
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  expires_at date,
  source patient_document_source NOT NULL DEFAULT 'upload',
  verified boolean NOT NULL DEFAULT false,
  verified_by uuid REFERENCES auth.users (id),
  verified_at timestamptz,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_patient_documents_patient ON patient_documents (patient_id);
CREATE INDEX idx_patient_documents_category ON patient_documents (category);
CREATE INDEX idx_patient_documents_verified ON patient_documents (verified);

-- Consents table
CREATE TABLE patient_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  type patient_consent_type NOT NULL,
  status patient_consent_status NOT NULL DEFAULT 'Ativo',
  scope patient_consent_scope[] NOT NULL DEFAULT '{}',
  channel patient_consent_channel NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  document_id uuid REFERENCES patient_documents (id) ON DELETE SET NULL,
  granted_by patient_consent_granted_by NOT NULL DEFAULT 'Paciente',
  granted_by_name text NOT NULL,
  granted_by_document text,
  related_legal_responsible_id uuid,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_patient_consents_patient ON patient_consents (patient_id);
CREATE INDEX idx_patient_consents_status ON patient_consents (status);
CREATE INDEX idx_patient_consents_type ON patient_consents (type);

-- Audit logs table
CREATE TABLE patient_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  type patient_audit_event_type NOT NULL,
  action text NOT NULL,
  user_id uuid REFERENCES auth.users (id),
  user_role text,
  event_time timestamptz NOT NULL DEFAULT now(),
  origin patient_audit_origin NOT NULL DEFAULT 'web',
  ip inet,
  changed_fields text[] DEFAULT '{}',
  old_value jsonb,
  new_value jsonb,
  meta jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_patient_audit_logs_patient ON patient_audit_logs (patient_id);
CREATE INDEX idx_patient_audit_logs_type ON patient_audit_logs (type);
CREATE INDEX idx_patient_audit_logs_time ON patient_audit_logs (event_time DESC);
