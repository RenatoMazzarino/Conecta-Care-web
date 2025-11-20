// src/schemas/patient.adminInfo.ts
import { z } from "zod";

export const PatientAdminInfoZ = z.object({
  patient_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  status: z.string().optional(),
  admission_type: z.string().optional(),
  complexity: z.string().optional(),
  service_package: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  supervisor_id: z.string().uuid().optional(),
  escalista_id: z.string().uuid().optional(),
  nurse_responsible_id: z.string().uuid().optional(),
  frequency: z.string().optional(),
  operation_area: z.string().optional(),
  admission_source: z.string().optional(),
  contract_id: z.string().optional(),
  last_audit_date: z.coerce.date().optional(),
  last_audit_by: z.string().uuid().optional(),
  notes_internal: z.string().optional(),
  last_update_by: z.string().optional(),
  meta: z.any().optional(),
});
