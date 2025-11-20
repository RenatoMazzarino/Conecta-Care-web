"use server";

import { getSupabaseServerClient } from "@/server/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";
import { PatientAddressZ as AddressZ } from "@/schemas/patient.address";

export async function upsertPatientAddress(payload: unknown) {
  const supabase = await getSupabaseServerClient();
  const tenantId = await getCurrentTenantId(supabase);

  const input =
    typeof payload === "object" && payload !== null ? payload : {};

  const parsed = AddressZ.parse({
    ...(input as Record<string, unknown>),
    tenant_id: tenantId,
  });

  const { id, ...rest } = parsed;
  const timestamp = new Date().toISOString();

  const record = id
    ? { id, ...rest, updated_at: timestamp }
    : { ...rest, created_at: timestamp };

  const { data, error } = await supabase
    .from("patient_addresses")
    .upsert([record], { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
