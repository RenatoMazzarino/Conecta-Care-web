"use server";

import { PatientPersonalZ } from "@/schemas/patient.personal";
import { getSupabaseServerClient } from "@/server/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";

export async function upsertPatientPersonal(payload: unknown) {
  const supabase = await getSupabaseServerClient();
  const tenantId = await getCurrentTenantId(supabase);

  const input =
    typeof payload === "object" && payload !== null ? payload : {};

  const parsed = PatientPersonalZ.parse({
    ...(input as Record<string, unknown>),
    tenant_id: tenantId,
  });

  const { id, pronouns: _legacyPronouns, ...data } = parsed;
  const timestamp = new Date().toISOString();

  const record = id
    ? { id, ...data, updated_at: timestamp }
    : { ...data, created_at: timestamp };

  const { data: upserted, error } = await supabase
    .from("patients")
    .upsert([record], { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return upserted;
}
