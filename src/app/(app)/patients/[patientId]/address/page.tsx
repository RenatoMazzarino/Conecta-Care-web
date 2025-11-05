// src/app/(app)/patients/[patientId]/address/page.tsx
"use client";

import { useParams } from "next/navigation";
import { PatientAddressForm } from "@/components/patients/patient-forms";

export default function PatientAddressPage() {
  const params = useParams<{ patientId: string }>();
  const patientId = params?.patientId;

  if (!patientId) {
    return (
      <div className="p-6 max-w-2xl">
        <p className="text-sm text-red-600">Paciente invalido na URL.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Endereco do Paciente</h1>
      <p className="text-sm mb-4">Paciente: {patientId}</p>

      <PatientAddressForm patientId={patientId} />
    </div>
  );
}
