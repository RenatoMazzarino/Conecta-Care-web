// src/schemas/patient.clinicalSummary.ts
import { z } from "zod";

export const PatientClinicalSummaryZ = z.object({
  patient_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  summary: z.any(),
  meta: z.any().optional(),
});
