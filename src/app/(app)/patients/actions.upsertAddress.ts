"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";

const AddressZ = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid(),
  patient_id: z.string().uuid(),

  cep: z.string().optional(),
  address_line: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  reference_point: z.string().optional(),

  geo_lat: z.coerce.number().optional(),
  geo_lng: z.coerce.number().optional(),
  zone_type: z.string().optional(),
  gatehouse_name: z.string().optional(),
  visit_hours: z.any().optional(),
  local_security: z.array(z.string()).optional(),
  facade_photo_url: z.string().url().optional(),

  residence_type: z.string().optional(),
  floor: z.coerce.number().optional(),
  internal_access: z.string().optional(),
  accessibility: z.any().optional(),
  stay_location: z.string().optional(),
  electric_infra: z.string().optional(),
  water_source: z.string().optional(),
  has_wifi: z.boolean().optional(),
  backup_power: z.string().optional(),
  adapted_bathroom: z.boolean().optional(),

  ambulance_access: z.string().optional(),
  parking: z.string().optional(),
  entry_procedure: z.string().optional(),
  avg_eta_min: z.coerce.number().optional(),
  works_or_obstacles: z.string().optional(),
  night_access_risk: z.string().optional(),

  pets: z.any().optional(),
  residents: z.any().optional(),
  caregivers: z.any().optional(),
  hygiene_rating: z.string().optional(),
  environmental_risk: z.array(z.string()).optional(),
  has_smokers: z.boolean().optional(),
  ventilation: z.string().optional(),
  noise_level: z.string().optional(),
  notes: z.string().optional(),
});

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
