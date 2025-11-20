// src/app/(app)/patients/actions.upsertAdminInfo.ts
"use server";

import { getSupabaseServerClient } from "@/server/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";
import { PatientAdminInfoZ as AdminInfoZ } from "@/schemas/patient.adminInfo";

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
