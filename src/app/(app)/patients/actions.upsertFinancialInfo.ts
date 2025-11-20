// src/app/(app)/patients/actions.upsertFinancialInfo.ts
"use server";

import { PatientFinancialProfileZ } from "@/schemas/patient.financial";
import { getSupabaseServerClient } from "@/server/supabaseServerClient";

export async function upsertPatientFinancial(payload: unknown) {
  const supabase = await getSupabaseServerClient();

  const input = typeof payload === "object" && payload !== null ? payload : {};
  const data = PatientFinancialProfileZ.parse({
    patient_id: (input as Record<string, unknown>).patient_id ?? (input as Record<string, unknown>).patientId,
    bond_type: (input as Record<string, unknown>).bond_type ?? (input as Record<string, unknown>).bondType,
    insurer_name: (input as Record<string, unknown>).insurer_name ?? (input as Record<string, unknown>).insurerName,
    plan_name: (input as Record<string, unknown>).plan_name ?? (input as Record<string, unknown>).planName,
    insurance_card_number:
      (input as Record<string, unknown>).insurance_card_number ??
      (input as Record<string, unknown>).insuranceCardNumber,
    insurance_card_validity:
      (input as Record<string, unknown>).insurance_card_validity ??
      (input as Record<string, unknown>).insuranceCardValidity,
    monthly_fee: (input as Record<string, unknown>).monthly_fee ?? (input as Record<string, unknown>).monthlyFee,
    billing_due_day: (input as Record<string, unknown>).billing_due_day ?? (input as Record<string, unknown>).billingDueDay,
    payment_method: (input as Record<string, unknown>).payment_method ?? (input as Record<string, unknown>).paymentMethod,
    financial_responsible_name:
      (input as Record<string, unknown>).financial_responsible_name ??
      (input as Record<string, unknown>).financialResponsibleName,
    financial_responsible_contact:
      (input as Record<string, unknown>).financial_responsible_contact ??
      (input as Record<string, unknown>).financialResponsibleContact,
    billing_status: (input as Record<string, unknown>).billing_status ?? (input as Record<string, unknown>).billingStatus,
    notes: (input as Record<string, unknown>).notes ?? (input as Record<string, unknown>).billingNotes,
  });

  const row = {
    patient_id: data.patient_id,
    bond_type: data.bond_type ?? null,
    insurer_name: data.insurer_name ?? null,
    plan_name: data.plan_name ?? null,
    insurance_card_number: data.insurance_card_number ?? null,
    insurance_card_validity: data.insurance_card_validity ?? null,
    monthly_fee: data.monthly_fee ?? null,
    billing_due_day: data.billing_due_day ?? null,
    payment_method: data.payment_method ?? null,
    financial_responsible_name: data.financial_responsible_name ?? null,
    financial_responsible_contact: data.financial_responsible_contact ?? null,
    billing_status: data.billing_status ?? null,
    notes: data.notes ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("patient_financial_profiles")
    .upsert(row, { onConflict: "patient_id" });

  if (error) throw new Error(error.message);
  return { ok: true };
}
