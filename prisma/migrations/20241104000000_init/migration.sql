-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper schema for security-aware functions
CREATE SCHEMA IF NOT EXISTS app_private;

COMMENT ON SCHEMA app_private IS 'Private helper functions for JWT-based access control.';

-- Helper functions to read claims from Supabase JWT
CREATE OR REPLACE FUNCTION app_private.current_tenant_id()
RETURNS uuid
LANGUAGE SQL
STABLE
AS $$
  SELECT
    NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id', '')::uuid;
$$;

COMMENT ON FUNCTION app_private.current_tenant_id IS 'Extracts tenant_id from JWT claims (or NULL if absent).';

CREATE OR REPLACE FUNCTION app_private.current_app_role()
RETURNS text
LANGUAGE SQL
STABLE
AS $$
  SELECT
    COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'app_role', 'viewer');
$$;

COMMENT ON FUNCTION app_private.current_app_role IS 'Extracts app-specific role from JWT claims, defaults to viewer.';

CREATE OR REPLACE FUNCTION app_private.current_user_id()
RETURNS uuid
LANGUAGE SQL
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')::uuid;
$$;

COMMENT ON FUNCTION app_private.current_user_id IS 'Returns the authenticated user id (auth.uid()) or NULL.';

-- Enumerations
CREATE TYPE user_role AS ENUM ('admin', 'coordinator', 'professional', 'viewer');
CREATE TYPE shift_status AS ENUM ('scheduled', 'published', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE presence_state AS ENUM ('offline', 'online', 'on_break', 'unresponsive');
CREATE TYPE patient_status AS ENUM ('active', 'inactive', 'discharged', 'deceased');
CREATE TYPE supply_request_status AS ENUM ('pending', 'approved', 'denied', 'fulfilled', 'cancelled');

COMMENT ON TYPE user_role IS 'Application role assigned to a user within a tenant.';
COMMENT ON TYPE shift_status IS 'Lifecycle status of a shift (plantão).';
COMMENT ON TYPE presence_state IS 'Realtime presence state for professionals within a shift.';
COMMENT ON TYPE patient_status IS 'Administrative status for a patient record.';
COMMENT ON TYPE supply_request_status IS 'Workflow status for a supply / inventory request.';

-- Tenants
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE tenants IS 'Organisational boundary for multitenant deployments.';
COMMENT ON COLUMN tenants.id IS 'Tenant primary key.';
COMMENT ON COLUMN tenants.name IS 'Tenant friendly name (clinic, franchise, etc).';
COMMENT ON COLUMN tenants.slug IS 'Lowercase unique slug for tenant routing.';
COMMENT ON COLUMN tenants.created_at IS 'Creation timestamp.';
COMMENT ON COLUMN tenants.updated_at IS 'Last update timestamp.';

-- Application user profile mapped to Supabase auth.users
CREATE TABLE app_users (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants (id) ON DELETE SET NULL,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  phone_number text,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE app_users IS 'Application-level profile for each Supabase auth user.';
COMMENT ON COLUMN app_users.id IS 'Matches auth.users.id';
COMMENT ON COLUMN app_users.tenant_id IS 'Tenant that the user belongs to (if any).';
COMMENT ON COLUMN app_users.email IS 'Login email cached for quick access.';
COMMENT ON COLUMN app_users.display_name IS 'Display name for UI badges and logs.';
COMMENT ON COLUMN app_users.phone_number IS 'Optional phone for contact/escalation.';
COMMENT ON COLUMN app_users.role IS 'Role within the tenant for access control.';
COMMENT ON COLUMN app_users.created_at IS 'Creation timestamp.';
COMMENT ON COLUMN app_users.updated_at IS 'Last update timestamp.';

-- Patients
CREATE TABLE patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants (id) ON DELETE CASCADE,
  full_name text NOT NULL,
  date_of_birth date,
  document_id text,
  gender text,
  contact_email text,
  contact_phone text,
  address jsonb,
  clinical_summary jsonb,
  status patient_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE patients IS 'Patient master data, including contact and clinical summary metadata.';
COMMENT ON COLUMN patients.id IS 'Patient identifier (UUID).';
COMMENT ON COLUMN patients.tenant_id IS 'Tenant to which the patient belongs.';
COMMENT ON COLUMN patients.full_name IS 'Full legal name.';
COMMENT ON COLUMN patients.date_of_birth IS 'Date of birth (UTC).';
COMMENT ON COLUMN patients.document_id IS 'Primary national identifier (CPF/CNS etc).';
COMMENT ON COLUMN patients.gender IS 'Gender/identity descriptor.';
COMMENT ON COLUMN patients.contact_email IS 'Primary email for notifications.';
COMMENT ON COLUMN patients.contact_phone IS 'Primary phone / WhatsApp contact.';
COMMENT ON COLUMN patients.address IS 'Structured address + geo data (JSON).';
COMMENT ON COLUMN patients.clinical_summary IS 'High-level clinical summary (JSON).';
COMMENT ON COLUMN patients.status IS 'Administrative status (active, discharged etc).';
COMMENT ON COLUMN patients.created_at IS 'Creation timestamp.';
COMMENT ON COLUMN patients.updated_at IS 'Last update timestamp.';

-- Professionals
CREATE TABLE professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants (id) ON DELETE CASCADE,
  full_name text NOT NULL,
  registry_code text,
  specialties text[] NOT NULL DEFAULT ARRAY[]::text[],
  phone text,
  email text,
  avatar_url text,
  notes text,
  employment_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE professionals IS 'Care professionals attached to the tenant.';
COMMENT ON COLUMN professionals.registry_code IS 'Professional registry (COREN, CRM etc).';
COMMENT ON COLUMN professionals.specialties IS 'Array of specialties.';
COMMENT ON COLUMN professionals.employment_type IS 'Contract type (internal, external, etc).';

-- Shifts
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants (id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients (id) ON DELETE SET NULL,
  professional_id uuid REFERENCES professionals (id) ON DELETE SET NULL,
  created_by_id uuid NOT NULL REFERENCES app_users (id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status shift_status NOT NULL DEFAULT 'scheduled',
  location jsonb,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_shifts_tenant_start ON shifts (tenant_id, start_at);
CREATE INDEX idx_shifts_status ON shifts (status);

COMMENT ON TABLE shifts IS 'Scheduled plantões for patients, linked to professionals.';
COMMENT ON COLUMN shifts.created_by_id IS 'User who created the shift.';
COMMENT ON COLUMN shifts.status IS 'Lifecycle state of the shift.';
COMMENT ON COLUMN shifts.location IS 'Optional geo/route information.';
COMMENT ON COLUMN shifts.meta IS 'Additional shift metadata (JSON).';

-- Posts (shift feed)
CREATE TABLE shift_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants (id) ON DELETE CASCADE,
  shift_id uuid NOT NULL REFERENCES shifts (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES app_users (id) ON DELETE SET NULL,
  content text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  attachments jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_shift_created ON shift_posts (shift_id, created_at DESC);

COMMENT ON TABLE shift_posts IS 'Realtime post stream for coordination inside a shift.';
COMMENT ON COLUMN shift_posts.attachments IS 'Optional attachment metadata (files, media).';

-- Presence
CREATE TABLE shift_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants (id) ON DELETE CASCADE,
  shift_id uuid NOT NULL REFERENCES shifts (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES app_users (id) ON DELETE CASCADE,
  professional_id uuid REFERENCES professionals (id) ON DELETE SET NULL,
  state presence_state NOT NULL DEFAULT 'offline',
  last_seen timestamptz NOT NULL DEFAULT now(),
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_presence_shift_user UNIQUE (shift_id, user_id)
);

CREATE INDEX idx_presence_tenant_shift ON shift_presence (tenant_id, shift_id);

COMMENT ON TABLE shift_presence IS 'Realtime presence tracking for professionals during shifts.';

-- Inventory
CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants (id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients (id) ON DELETE SET NULL,
  name text NOT NULL,
  unit text NOT NULL,
  description text,
  stock int NOT NULL DEFAULT 0,
  min_stock int NOT NULL DEFAULT 0,
  max_stock int,
  last_audit_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_inventory_patient ON inventory_items (tenant_id, patient_id);

COMMENT ON TABLE inventory_items IS 'Tracked supplies allocated per patient or tenant.';
COMMENT ON COLUMN inventory_items.unit IS 'Measurement unit (box, ml, pcs).';
COMMENT ON COLUMN inventory_items.min_stock IS 'Threshold to trigger replenishment.';
COMMENT ON COLUMN inventory_items.max_stock IS 'Optional cap to avoid overstocking.';

-- Supply requests
CREATE TABLE supply_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants (id) ON DELETE CASCADE,
  shift_id uuid REFERENCES shifts (id) ON DELETE SET NULL,
  patient_id uuid REFERENCES patients (id) ON DELETE SET NULL,
  item_id uuid NOT NULL REFERENCES inventory_items (id) ON DELETE CASCADE,
  requester_id uuid NOT NULL REFERENCES app_users (id) ON DELETE SET NULL,
  quantity int NOT NULL DEFAULT 1,
  status supply_request_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_supply_requests_patient ON supply_requests (tenant_id, patient_id);

COMMENT ON TABLE supply_requests IS 'Workflow for requesting inventory replenishment.';

-- Audit logs
CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  tenant_id uuid REFERENCES tenants (id) ON DELETE SET NULL,
  entity text NOT NULL,
  entity_id text,
  action text NOT NULL,
  actor_id uuid REFERENCES app_users (id) ON DELETE SET NULL,
  context jsonb,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_entity ON audit_logs (tenant_id, entity, created_at DESC);

COMMENT ON TABLE audit_logs IS 'Immutable audit trail for create/update/delete operations and sensitive access.';

-- Updated_at trigger helper
CREATE OR REPLACE FUNCTION app_private.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION app_private.touch_updated_at IS 'Keeps the updated_at column in sync.';

-- Attach triggers for updated_at
CREATE TRIGGER trg_touch_tenants BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_app_users BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_patients BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_professionals BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_shifts BEFORE UPDATE ON shifts
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_shift_posts BEFORE UPDATE ON shift_posts
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_shift_presence BEFORE UPDATE ON shift_presence
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_inventory BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

CREATE TRIGGER trg_touch_supply_requests BEFORE UPDATE ON supply_requests
  FOR EACH ROW EXECUTE FUNCTION app_private.touch_updated_at();

-- Audit trigger
CREATE OR REPLACE FUNCTION app_private.log_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user uuid := app_private.current_user_id();
  v_tenant uuid := app_private.current_tenant_id();
  v_json jsonb;
  v_entity_id text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_json := to_jsonb(OLD);
    v_entity_id := COALESCE(OLD.id::text, OLD.entity_id::text);
  ELSE
    v_json := to_jsonb(NEW);
    v_entity_id := COALESCE(NEW.id::text, NEW.entity_id::text);
  END IF;

  INSERT INTO audit_logs (tenant_id, entity, entity_id, action, actor_id, context, payload, created_at)
  VALUES (
    COALESCE(v_tenant, v_json->>'tenant_id')::uuid,
    TG_TABLE_NAME,
    v_entity_id,
    TG_OP,
    v_user,
    jsonb_build_object('schema', TG_TABLE_SCHEMA),
    v_json,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

COMMENT ON FUNCTION app_private.log_audit IS 'Generic trigger to write row-level audit events.';

-- Attach audit triggers to critical tables
CREATE TRIGGER trg_audit_shifts
  AFTER INSERT OR UPDATE OR DELETE ON shifts
  FOR EACH ROW EXECUTE FUNCTION app_private.log_audit();

CREATE TRIGGER trg_audit_shift_posts
  AFTER INSERT OR UPDATE OR DELETE ON shift_posts
  FOR EACH ROW EXECUTE FUNCTION app_private.log_audit();

CREATE TRIGGER trg_audit_shift_presence
  AFTER INSERT OR UPDATE OR DELETE ON shift_presence
  FOR EACH ROW EXECUTE FUNCTION app_private.log_audit();

CREATE TRIGGER trg_audit_patients
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW EXECUTE FUNCTION app_private.log_audit();

CREATE TRIGGER trg_audit_supply_requests
  AFTER INSERT OR UPDATE OR DELETE ON supply_requests
  FOR EACH ROW EXECUTE FUNCTION app_private.log_audit();

-- RLS and realtime configuration are applied via sql/001_security_realtime.sql to keep baseline migrations idempotent.
