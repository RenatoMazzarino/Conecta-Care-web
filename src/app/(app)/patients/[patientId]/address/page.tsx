// src/app/(app)/patients/[patientId]/address/page.tsx
"use client";

import { useParams } from "next/navigation";

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
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        O formulário legado de endereço foi removido. Use a aba "Endereço" da ficha v2 (Sheets) para editar os dados
        diretamente no painel lateral.
      </div>
    </div>
  );
}
