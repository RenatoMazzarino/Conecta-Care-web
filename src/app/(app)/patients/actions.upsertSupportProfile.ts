"use server";

import { PatientSupportProfileZ } from "@/schemas/patient.support";
import { getSupabaseServerClient } from "@/server/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";

export async function upsertSupportProfile(payload: unknown) {
  const supabase = await getSupabaseServerClient();
  const tenantId = await getCurrentTenantId(supabase);

  const input =
    typeof payload === "object" && payload !== null ? payload : {};

  const parsed = PatientSupportProfileZ.parse({
    ...(input as Record<string, unknown>),
    tenant_id: tenantId,
  });

  const { id, ...data } = parsed;
  const timestamp = new Date().toISOString();

  const record = id
    ? { id, ...data, updated_at: timestamp }
    : { ...data, created_at: timestamp };

  const { data: upserted, error } = await supabase
    .from("patient_support_profiles")
    .upsert([record], { onConflict: "patient_id,tenant_id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return upserted;
}
