// src/schemas/patient.financial.ts
import { z } from "zod";

export const PatientFinancialProfileZ = z.object({
  patient_id: z.string().uuid(),
  bond_type: z.enum(["Plano de Saúde", "Particular", "Convênio", "Público"]).optional(),
  insurer_name: z.string().optional(),
  plan_name: z.string().optional(),
  insurance_card_number: z.string().optional(),
  insurance_card_validity: z.coerce.date().optional(),
  monthly_fee: z.coerce.number().optional(),
  billing_due_day: z.coerce.number().min(1).max(31).optional(),
  payment_method: z.string().optional(),
  financial_responsible_name: z.string().optional(),
  financial_responsible_contact: z.string().optional(),
  billing_status: z.enum(["active", "suspended", "defaulting"]).optional(),
  notes: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
