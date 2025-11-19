-- Patient intelligence & operational integrations plus security/telemetry schema

-- 11.2 patient_intelligence
CREATE TABLE IF NOT EXISTS patient_intelligence (
  patient_id uuid PRIMARY KEY REFERENCES patients (id) ON DELETE CASCADE,
  readmission_risk_score numeric(4,2),
  readmission_risk_label text,
  readmission_risk_source text,
  readmission_risk_updated_at timestamptz,
  care_adherence_score numeric(4,2),
  care_adherence_label text,
  care_adherence_updated_at timestamptz,
  family_satisfaction_score numeric(4,2),
  family_satisfaction_label text,
  family_satisfaction_source text,
  family_satisfaction_updated_at timestamptz,
  incidents_last_30_days integer,
  last_incident_at date,
  extra_insights jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11.3 patient_operational_links
CREATE TABLE IF NOT EXISTS patient_operational_links (
  patient_id uuid PRIMARY KEY REFERENCES patients (id) ON DELETE CASCADE,
  contract_id uuid,
  roster_id uuid,
  inventory_profile_id uuid,
  public_protocol_url text,
  public_protocol_token text,
  public_protocol_created_at timestamptz,
  external_crm_id text,
  external_emr_id text,
  access_log_ref text,
  extra_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 13.x Roles & memberships
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid NOT NULL,
  role_id uuid NOT NULL REFERENCES roles (id),
  granted_at timestamptz DEFAULT now(),
  granted_by uuid,
  scope text DEFAULT 'global',
  metadata jsonb DEFAULT '{}'::jsonb,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS patient_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  relationship text,
  permissions jsonb NOT NULL,
  invited_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS data_export_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  requested_by_user uuid NOT NULL,
  request_type text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  result_location text,
  reason_rejected text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 14) Telemetry
CREATE TABLE IF NOT EXISTS app_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  event_name text NOT NULL,
  user_id uuid,
  patient_id uuid REFERENCES patients (id) ON DELETE CASCADE,
  source text,
  user_role text,
  context jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 15) Integrations
CREATE TABLE IF NOT EXISTS integration_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  provider text NOT NULL,
  config jsonb NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS whatsapp_message_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients (id) ON DELETE SET NULL,
  to_phone text NOT NULL,
  template_name text,
  direction text NOT NULL,
  message_type text NOT NULL,
  body_preview text,
  status text NOT NULL,
  provider_msg_id text,
  error_code text,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS signature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients (id) ON DELETE CASCADE,
  document_id uuid REFERENCES patient_documents (id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_request_id text,
  status text NOT NULL,
  signers jsonb NOT NULL,
  callback_payload jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS routing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients (id) ON DELETE CASCADE,
  from_location jsonb NOT NULL,
  to_location jsonb NOT NULL,
  provider text NOT NULL,
  distance_km numeric(8,2),
  eta_minutes integer,
  mode text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients (id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_tx_id text,
  amount numeric(10,2),
  currency text DEFAULT 'BRL',
  status text NOT NULL,
  method text,
  due_date date,
  paid_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ocr_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES patient_documents (id) ON DELETE CASCADE,
  provider text NOT NULL,
  status text NOT NULL,
  extracted_data jsonb,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS frontend_error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  context jsonb,
  message text,
  stack text,
  severity text,
  created_at timestamptz DEFAULT now()
);
