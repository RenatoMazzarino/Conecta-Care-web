// src/app/(app)/patients/actions.upsertFinancialInfo.ts
"use server";

import { PatientFinancialZ } from "@/schemas/patient.financial";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";

export async function upsertPatientFinancial(payload: unknown) {
  const supabase = await getSupabaseServerClient();
  const tenantId = await getCurrentTenantId(supabase);

  const input =
    typeof payload === "object" && payload !== null ? payload : {};

  const data = PatientFinancialZ.parse({
    ...(input as Record<string, unknown>),
    tenant_id: tenantId,
  });

  const { id, ...rest } = data;
  const rows = id
    ? [{ id, ...rest, updated_at: new Date().toISOString() }]
    : [{ ...rest, created_at: new Date().toISOString() }];

  const { error } = await supabase
    .from("patient_financial_info")
    .upsert(rows, { onConflict: "id" });

  if (error) throw new Error(error.message);
  return { ok: true };
}
