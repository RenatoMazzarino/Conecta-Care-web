-- Idempotent RLS + Realtime configuration

-- Enable RLS on core tables
ALTER TABLE IF EXISTS tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shift_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shift_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS supply_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS tenant_admin_manage ON tenants;
DROP POLICY IF EXISTS tenant_member_read ON tenants;

DROP POLICY IF EXISTS users_self_select ON app_users;
DROP POLICY IF EXISTS users_manage_admin ON app_users;

DROP POLICY IF EXISTS patients_select_same_tenant ON patients;
DROP POLICY IF EXISTS patients_write_roles ON patients;
DROP POLICY IF EXISTS patients_update_roles ON patients;

DROP POLICY IF EXISTS professionals_select_same_tenant ON professionals;
DROP POLICY IF EXISTS professionals_manage_admin ON professionals;

DROP POLICY IF EXISTS shifts_select_same_tenant ON shifts;
DROP POLICY IF EXISTS shifts_insert_roles ON shifts;
DROP POLICY IF EXISTS shifts_update_roles ON shifts;

DROP POLICY IF EXISTS posts_select_shift_members ON shift_posts;
DROP POLICY IF EXISTS posts_insert_members ON shift_posts;
DROP POLICY IF EXISTS posts_update_author_or_admin ON shift_posts;

DROP POLICY IF EXISTS presence_select_shift_members ON shift_presence;
DROP POLICY IF EXISTS presence_upsert_self ON shift_presence;
DROP POLICY IF EXISTS presence_admin_manage ON shift_presence;

DROP POLICY IF EXISTS inventory_select_same_tenant ON inventory_items;
DROP POLICY IF EXISTS inventory_manage_roles ON inventory_items;

DROP POLICY IF EXISTS supply_select_same_tenant ON supply_requests;
DROP POLICY IF EXISTS supply_insert_members ON supply_requests;
DROP POLICY IF EXISTS supply_update_admin ON supply_requests;

DROP POLICY IF EXISTS audit_select_admin ON audit_logs;

-- Re-create policies
CREATE POLICY tenant_admin_manage
  ON tenants
  FOR ALL
  USING (app_private.current_app_role() = 'admin')
  WITH CHECK (app_private.current_app_role() = 'admin');

CREATE POLICY tenant_member_read
  ON tenants
  FOR SELECT
  USING (id = app_private.current_tenant_id() OR app_private.current_app_role() = 'admin');

CREATE POLICY users_self_select
  ON app_users
  FOR SELECT
  USING (
    id = app_private.current_user_id()
    OR app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY users_manage_admin
  ON app_users
  FOR ALL
  USING (
    app_private.current_app_role() = 'admin'
    AND (tenant_id IS NULL OR tenant_id = app_private.current_tenant_id())
  )
  WITH CHECK (
    app_private.current_app_role() = 'admin'
    AND (tenant_id IS NULL OR tenant_id = app_private.current_tenant_id())
  );

CREATE POLICY patients_select_same_tenant
  ON patients
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

CREATE POLICY patients_write_roles
  ON patients
  FOR INSERT
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY patients_update_roles
  ON patients
  FOR UPDATE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY professionals_select_same_tenant
  ON professionals
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

CREATE POLICY professionals_manage_admin
  ON professionals
  FOR ALL
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  )
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY shifts_select_same_tenant
  ON shifts
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

CREATE POLICY shifts_insert_roles
  ON shifts
  FOR INSERT
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY shifts_update_roles
  ON shifts
  FOR UPDATE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY posts_select_shift_members
  ON shift_posts
  FOR SELECT
  USING (
    tenant_id = app_private.current_tenant_id()
    AND EXISTS (
      SELECT 1
      FROM shifts s
      WHERE s.id = shift_posts.shift_id
        AND s.tenant_id = app_private.current_tenant_id()
    )
  );

CREATE POLICY posts_insert_members
  ON shift_posts
  FOR INSERT
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND author_id = app_private.current_user_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator', 'professional')
  );

CREATE POLICY posts_update_author_or_admin
  ON shift_posts
  FOR UPDATE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND (
      author_id = app_private.current_user_id()
      OR app_private.current_app_role() IN ('admin', 'coordinator')
    )
  );

CREATE POLICY presence_select_shift_members
  ON shift_presence
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

CREATE POLICY presence_upsert_self
  ON shift_presence
  FOR ALL
  USING (
    tenant_id = app_private.current_tenant_id()
    AND user_id = app_private.current_user_id()
  )
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND user_id = app_private.current_user_id()
  );

CREATE POLICY presence_admin_manage
  ON shift_presence
  FOR ALL
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  )
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY inventory_select_same_tenant
  ON inventory_items
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

CREATE POLICY inventory_manage_roles
  ON inventory_items
  FOR ALL
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  )
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY supply_select_same_tenant
  ON supply_requests
  FOR SELECT
  USING (tenant_id = app_private.current_tenant_id());

CREATE POLICY supply_insert_members
  ON supply_requests
  FOR INSERT
  WITH CHECK (
    tenant_id = app_private.current_tenant_id()
    AND requester_id = app_private.current_user_id()
  );

CREATE POLICY supply_update_admin
  ON supply_requests
  FOR UPDATE
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

CREATE POLICY audit_select_admin
  ON audit_logs
  FOR SELECT
  USING (
    tenant_id = app_private.current_tenant_id()
    AND app_private.current_app_role() IN ('admin', 'coordinator')
  );

-- Realtime publication
ALTER TABLE IF EXISTS shift_posts REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS shift_presence REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS shifts REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE shift_posts';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE shift_presence';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE shifts';
  END IF;
END $$;
