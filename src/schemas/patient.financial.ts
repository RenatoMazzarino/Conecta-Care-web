import { z } from 'zod';

export const InvoiceHistoryZ = z.object({
  date: z.coerce.date(),
  value: z.coerce.number(),
  status: z.enum(['Pago', 'Pendente', 'Cancelado']),
  method: z.string().optional(),
  proofUrl: z.string().url().optional(),
});

export const PatientFinancialZ = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  tenant_id: z.string().uuid(),

  bond_type: z.enum(['Plano de Saúde','Particular','Convênio','SUS','Parceria']).optional(),
  insurer: z.string().optional(),
  plan_name: z.string().optional(),
  card_number: z.string().optional(),
  validity: z.coerce.date().optional(),

  monthly_fee: z.coerce.number().optional(),
  due_day: z.coerce.number().min(1).max(31).optional(),
  payment_method: z.enum(['Boleto','PIX','Débito','Transferência','Faturamento','Outro']).optional(),
  billing_status: z.enum(['Em dia','Atrasado','Em negociação','Inadimplente','Isento']).optional(),
  last_payment_date: z.coerce.date().optional(),
  last_payment_amount: z.coerce.number().optional(),

  financial_contact: z.string().optional(),
  observations: z.string().optional(),
  invoice_history: z.array(InvoiceHistoryZ).optional(),

  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type PatientFinancial = z.infer<typeof PatientFinancialZ>;
// src/schemas/patient.financial.ts
