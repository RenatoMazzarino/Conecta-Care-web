-- Patient social and clinical normalization

-- Emergency contacts (1:N)
CREATE TABLE IF NOT EXISTS patient_emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text,
  phone text,
  email text,
  is_legal_representative boolean DEFAULT false,
  can_view boolean DEFAULT true,
  can_authorize boolean DEFAULT false,
  can_clinical boolean DEFAULT false,
  can_financial boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_patient ON patient_emergency_contacts (patient_id);

-- Notification preferences per contact (1:N)
CREATE TABLE IF NOT EXISTS patient_contact_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES patient_emergency_contacts (id) ON DELETE CASCADE,
  channel text NOT NULL,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_notifications_contact ON patient_contact_notifications (contact_id);

-- Legal guardians (1:N to allow history/rotations)
CREATE TABLE IF NOT EXISTS patient_legal_guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  name text NOT NULL,
  document_type text,
  document_number text,
  contact text,
  valid_until date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_legal_guardians_patient ON patient_legal_guardians (patient_id);

-- Diagnoses (structured instead of JSON)
CREATE TABLE IF NOT EXISTS patient_diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  code text,
  system text DEFAULT 'ICD-10',
  description text NOT NULL,
  is_primary boolean DEFAULT false,
  diagnosed_at date,
  resolved_at date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_patient ON patient_diagnoses (patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_status ON patient_diagnoses (status);

-- Allergies (structured instead of JSON)
CREATE TABLE IF NOT EXISTS patient_allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  substance text NOT NULL,
  reaction text,
  severity text,
  recorded_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_allergies_patient ON patient_allergies (patient_id);
CREATE INDEX IF NOT EXISTS idx_allergies_status ON patient_allergies (status);

-- Devices in use (ventilators, catheters, etc.)
CREATE TABLE IF NOT EXISTS patient_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  device_type text NOT NULL,
  description text,
  status text DEFAULT 'active',
  placed_at date,
  removed_at date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_devices_patient ON patient_devices (patient_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON patient_devices (status);

-- Triggers to keep updated_at in sync
CREATE TRIGGER trg_touch_emergency_contacts
  BEFORE UPDATE ON patient_emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_contact_notifications
  BEFORE UPDATE ON patient_contact_notifications
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_legal_guardians
  BEFORE UPDATE ON patient_legal_guardians
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_diagnoses
  BEFORE UPDATE ON patient_diagnoses
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_allergies
  BEFORE UPDATE ON patient_allergies
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_devices
  BEFORE UPDATE ON patient_devices
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

-- RLS
ALTER TABLE patient_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_contact_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_legal_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_devices ENABLE ROW LEVEL SECURITY;

-- Policies: tenant-bound via patients
CREATE POLICY emergency_contacts_select ON patient_emergency_contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_emergency_contacts.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY emergency_contacts_write ON patient_emergency_contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_emergency_contacts.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
    AND app_private.current_app_role() IN ('admin','coordinator')
  );

CREATE POLICY contact_notifications_select ON patient_contact_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patient_emergency_contacts c
      JOIN patients p ON p.id = c.patient_id
      WHERE c.id = patient_contact_notifications.contact_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY contact_notifications_write ON patient_contact_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patient_emergency_contacts c
      JOIN patients p ON p.id = c.patient_id
      WHERE c.id = patient_contact_notifications.contact_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
    AND app_private.current_app_role() IN ('admin','coordinator')
  );

CREATE POLICY legal_guardians_select ON patient_legal_guardians
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_legal_guardians.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY legal_guardians_write ON patient_legal_guardians
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_legal_guardians.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
    AND app_private.current_app_role() IN ('admin','coordinator')
  );

CREATE POLICY diagnoses_select ON patient_diagnoses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_diagnoses.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY diagnoses_write ON patient_diagnoses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_diagnoses.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
    AND app_private.current_app_role() IN ('admin','coordinator')
  );

CREATE POLICY allergies_select ON patient_allergies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_allergies.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY allergies_write ON patient_allergies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_allergies.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
    AND app_private.current_app_role() IN ('admin','coordinator')
  );

CREATE POLICY devices_select ON patient_devices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_devices.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY devices_write ON patient_devices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_devices.patient_id
        AND p.tenant_id = app_private.current_tenant_id()
    )
    AND app_private.current_app_role() IN ('admin','coordinator')
  );
