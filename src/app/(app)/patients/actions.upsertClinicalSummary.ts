// src/app/(app)/patients/actions.upsertClinicalSummary.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/server/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";

const ClinicalSummaryZ = z.object({
  patient_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  summary: z.any(),
  meta: z.any().optional(),
});

export async function upsertClinicalSummary(payload: unknown) {
  const supabase = await getSupabaseServerClient();
  const tenantId = await getCurrentTenantId(supabase);

  const input =
    typeof payload === "object" && payload !== null ? payload : {};

  const data = ClinicalSummaryZ.parse({
    ...(input as Record<string, unknown>),
    tenant_id: tenantId,
  });

  const { error } = await supabase
    .from("patient_clinical_summaries")
    .upsert([{ ...data, updated_at: new Date().toISOString() }]);

  if (error) throw new Error(error.message);

  return { ok: true };
}
