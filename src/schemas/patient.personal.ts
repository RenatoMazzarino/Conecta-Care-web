import { z } from "zod";

export const PhoneZ = z.object({
  type: z.enum(["mobile","home","work"]).optional().default("mobile"),
  number: z.string().min(8),
  verified: z.boolean().optional().default(false),
  preferred: z.boolean().optional().default(false),
});

export const EmailZ = z.object({
  email: z.string().email(),
  verified: z.boolean().optional().default(false),
  preferred: z.boolean().optional().default(false),
});

export const EmergencyContactZ = z.object({
  name: z.string().min(2),
  relation: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  isLegalRepresentative: z.boolean().optional().default(false),
  permissions: z.object({
    view: z.boolean().default(true),
    authorize: z.boolean().default(false),
  }).optional(),
  documentUrl: z.string().url().optional(),
});

export const PatientPersonalZ = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid(),
  full_name: z.string().min(2),
  display_name: z.string().optional(),
  pronouns: z.string().optional(),
  photo_url: z.string().url().optional(),
  photo_consent: z.any().optional(),

  cpf: z.string().optional(),
  cpf_status: z.enum(["valid","invalid","unknown"]).optional(),
  rg: z.string().optional(),
  rg_issuer: z.string().optional(),
  rg_digital_url: z.string().url().optional(),
  cns: z.string().optional(),
  national_id: z.string().optional(),
  document_validation: z.any().optional(),

  date_of_birth: z.coerce.date().optional(),
  sex_at_birth: z.enum(["M","F","Other","Unknown"]).optional(),
  gender_identity: z.string().optional(),
  civil_status: z.string().optional(),
  nationality: z.string().optional(),
  place_of_birth: z.string().optional(),
  preferred_language: z.string().optional(),

  phones: z.array(PhoneZ).optional(),
  emails: z.array(EmailZ).optional(),
  preferred_contact_method: z.enum(["phone","whatsapp","email"]).optional(),
  communication_opt_out: z.any().optional(),

  emergency_contacts: z.array(EmergencyContactZ).optional(),
  legal_guardian: z.any().optional(),

  external_ids: z.any().optional(),
  identity_verification: z.any().optional(),
  duplicate_candidates: z.array(z.string().uuid()).optional(),
  risk_flags: z.array(z.string()).optional(),
  sensitive_data_consent: z.any().optional(),
  record_status: z.enum(["active","inactive","deceased"]).optional(),
});
