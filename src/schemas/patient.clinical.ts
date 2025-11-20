// src/schemas/patient.clinical.ts
import { z } from "zod";

export const PatientDiagnosisZ = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  code: z.string().optional().nullable(),
  system: z.string().optional().nullable(),
  description: z.string().min(1),
  is_primary: z.boolean().optional(),
  diagnosed_at: z.string().optional().nullable(),
  resolved_at: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const PatientAllergyZ = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  substance: z.string().min(1),
  reaction: z.string().optional().nullable(),
  severity: z.string().optional().nullable(),
  recorded_at: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const PatientDeviceZ = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  device_type: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  placed_at: z.string().optional().nullable(),
  removed_at: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
