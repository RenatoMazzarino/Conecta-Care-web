// src/app/(app)/patients/new/page.tsx
"use client";

export default function NewPatientPage() {
  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Cadastro de Pacientes</h1>
      <p className="text-sm text-muted-foreground">
        O fluxo legado de cadastro foi desativado. Utilize as telas v2 de pacientes (Sheets) para criação e edição de
        registros diretamente na ficha do paciente.
      </p>
      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        Acesse a lista de pacientes e abra o painel lateral para criar ou editar dados cadastrais.
      </div>
    </div>
  );
}
