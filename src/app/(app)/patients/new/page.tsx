// src/app/(app)/patients/new/page.tsx
"use client";

import * as React from "react";
import {
  PatientPersonalForm,
  type PatientPersonalFormResult,
} from "@/components/patients/patient-forms";

export default function NewPatientPage() {
  const [savedPatientId, setSavedPatientId] = React.useState<string | null>(null);

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Novo Paciente</h1>
      <p className="text-sm text-muted-foreground">
        Preencha os campos para cadastrar um novo paciente via server action.
      </p>
      <PatientPersonalForm
        onSaved={(record: PatientPersonalFormResult) =>
          setSavedPatientId(
            record && typeof record === "object"
              ? (record as { id?: string }).id ?? null
              : null,
          )}
      />
      {savedPatientId && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Paciente criado com sucesso! ID:{" "}
          <span className="font-mono">{savedPatientId}</span>
        </div>
      )}
    </div>
  );
}
