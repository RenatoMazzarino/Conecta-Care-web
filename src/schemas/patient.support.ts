import { z } from "zod";

// Schema para Responsável Legal
export const SupportResponsibleZ = z.object({
  name: z.string().min(2),
  relation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  document_id: z.string().optional(),
  document_url: z.string().url().optional(),
  is_legal_guardian: z.boolean().optional().default(false),
  permissions: z.object({
    view: z.boolean().default(true),
    authorize: z.boolean().default(false),
    medical_decisions: z.boolean().default(false),
  }).optional(),
  notes: z.string().optional(),
}).optional();

// Schema para Contato de Emergência
export const SupportEmergencyZ = z.object({
  name: z.string().min(2),
  relation: z.string().optional(),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  alternate_phone: z.string().optional(),
  is_primary: z.boolean().optional().default(true),
  notes: z.string().optional(),
}).optional();

// Schema para Membro da Rede de Apoio
export const SupportMemberZ = z.object({
  id: z.string().uuid().optional(),
  profile_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(2),
  relation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  permissions: z.array(z.enum(["view", "authorize", "receive_updates", "emergency_contact"])).optional().default([]),
  notifications_prefs: z.object({
    email: z.boolean().default(false),
    sms: z.boolean().default(false),
    whatsapp: z.boolean().default(false),
    push: z.boolean().default(false),
  }).optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Schema para Perfil de Rede de Apoio do Paciente
export const PatientSupportProfileZ = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  legal_responsible: SupportResponsibleZ,
  emergency_contact: SupportEmergencyZ,
  support_notes: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type SupportResponsible = z.infer<typeof SupportResponsibleZ>;
export type SupportEmergency = z.infer<typeof SupportEmergencyZ>;
export type SupportMember = z.infer<typeof SupportMemberZ>;
export type PatientSupportProfile = z.infer<typeof PatientSupportProfileZ>;
