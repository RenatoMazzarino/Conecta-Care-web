// src/app/(app)/patients/actions.upsertAdminInfo.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";

const AdminInfoZ = z.object({
  patient_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  status: z.string().optional(),
  admission_type: z.string().optional(),
  complexity: z.string().optional(),
  service_package: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  supervisor_id: z.string().uuid().optional(),
  escalista_id: z.string().uuid().optional(),
  nurse_responsible_id: z.string().uuid().optional(),
  frequency: z.string().optional(),
  operation_area: z.string().optional(),
  admission_source: z.string().optional(),
  contract_id: z.string().optional(),
  last_audit_date: z.coerce.date().optional(),
  last_audit_by: z.string().uuid().optional(),
  notes_internal: z.string().optional(),
  last_update_by: z.string().optional(),
  meta: z.any().optional(),
});

export async function upsertPatientAdminInfo(payload: unknown) {
  const supabase = await getSupabaseServerClient();
  const tenantId = await getCurrentTenantId(supabase);

  const input =
    typeof payload === "object" && payload !== null ? payload : {};

  const data = AdminInfoZ.parse({
    ...(input as Record<string, unknown>),
    tenant_id: tenantId,
  });

  const { error } = await supabase
    .from("patient_admin_info")
    .upsert([{ ...data, updated_at: new Date().toISOString() }]);

  if (error) throw new Error(error.message);

  return { ok: true };
}
