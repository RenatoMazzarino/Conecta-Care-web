// src/schemas/patient.social.ts
import { z } from "zod";

export const PatientContactNotificationZ = z.object({
  id: z.string().uuid().optional(),
  contact_id: z.string().uuid(),
  channel: z.string().min(2),
  enabled: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const PatientEmergencyContactZ = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  name: z.string().min(1),
  relationship: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  is_legal_representative: z.boolean().default(false),
  can_view: z.boolean().default(true),
  can_authorize: z.boolean().default(false),
  can_clinical: z.boolean().default(false),
  can_financial: z.boolean().default(false),
  notifications: z.array(PatientContactNotificationZ).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const PatientLegalGuardianZ = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  name: z.string().min(1),
  document_type: z.string().optional().nullable(),
  document_number: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  valid_until: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
