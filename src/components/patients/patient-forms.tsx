// src/components/patients/patient-forms.tsx
"use client";

import * as React from "react";
import { upsertPatientPersonal } from "@/app/(app)/patients/actions.upsertPersonal";
import { upsertPatientAddress } from "@/app/(app)/patients/actions.upsertAddress";
import { upsertPatientAdminInfo } from "@/app/(app)/patients/actions.upsertAdminInfo";
import { upsertClinicalSummary } from "@/app/(app)/patients/actions.upsertClinicalSummary";
import { upsertPatientFinancial } from "@/app/(app)/patients/actions.upsertFinancialInfo";

type PersonalRecord = Awaited<ReturnType<typeof upsertPatientPersonal>>;
type AddressRecord = Awaited<ReturnType<typeof upsertPatientAddress>>;
type FinancialRecord = Awaited<ReturnType<typeof upsertPatientFinancial>>;

export type PatientPersonalFormResult = PersonalRecord;

type Feedback = { type: "success" | "error"; message: string } | null;

function formDataToObject(formData: FormData) {
  const record: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      record[key] = value;
    }
  });
  return record;
}

function pruneEmptyStrings(record: Record<string, unknown>) {
  Object.keys(record).forEach((key) => {
    const value = record[key];
    if (typeof value === "string" && value.trim() === "") {
      delete record[key];
    }
  });
}

function FormFeedback({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  const color =
    feedback.type === "success" ? "text-green-600" : "text-red-600";
  return <p className={`text-sm ${color}`}>{feedback.message}</p>;
}

type PersonalFormValues = {
  full_name?: string;
  display_name?: string;
  cpf?: string;
  date_of_birth?: string;
};

type PatientPersonalFormProps = {
  patientId?: string;
  defaultValues?: PersonalFormValues;
  onSaved?: (record: PersonalRecord) => void;
};

export function PatientPersonalForm({
  patientId,
  defaultValues,
  onSaved,
}: PatientPersonalFormProps) {
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    const formElement = event.currentTarget;

    try {
      const formData = new FormData(formElement);
      const payload = formDataToObject(formData);

      pruneEmptyStrings(payload);

      if (patientId) {
        payload.id = patientId;
      } else {
        delete payload.id;
      }

      const saved = await upsertPatientPersonal(payload);
      setFeedback({ type: "success", message: "Dados pessoais salvos!" });
      if (!patientId) {
        formElement.reset();
      }
      onSaved?.(saved);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar dados pessoais.";
      setFeedback({ type: "error", message });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Atualizar dados pessoais</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Nome completo
          </label>
          <input
            name="full_name"
            defaultValue={defaultValues?.full_name}
            required
            className="border px-2 py-1 w-full rounded"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Nome social
          </label>
          <input
            name="display_name"
            defaultValue={defaultValues?.display_name}
            className="border px-2 py-1 w-full rounded"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">CPF</label>
          <input
            name="cpf"
            defaultValue={defaultValues?.cpf}
            className="border px-2 py-1 w-full rounded"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Data de nascimento
          </label>
          <input
            type="date"
            name="date_of_birth"
            defaultValue={defaultValues?.date_of_birth}
            className="border px-2 py-1 w-full rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded"
            disabled={pending}
            type="submit"
          >
            {pending ? "Salvando..." : "Salvar dados pessoais"}
          </button>
          <FormFeedback feedback={feedback} />
        </div>
      </form>
    </div>
  );
}

type AddressFormValues = {
  cep?: string;
  address_line?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  reference_point?: string;
};

type PatientAddressFormProps = {
  patientId: string;
  defaultValues?: AddressFormValues;
  onSaved?: (record: AddressRecord) => void;
};

export function PatientAddressForm({
  patientId,
  defaultValues,
  onSaved,
}: PatientAddressFormProps) {
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = formDataToObject(formData);

      pruneEmptyStrings(payload);
      payload.patient_id = patientId;

      const saved = await upsertPatientAddress(payload);
      setFeedback({ type: "success", message: "EndereÃ§o salvo!" });
      onSaved?.(saved);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar endereÃ§o.";
      setFeedback({ type: "error", message });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Atualizar endereÃ§o e ambiente</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1 md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">CEP</label>
            <input
              name="cep"
              defaultValue={defaultValues?.cep}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              EndereÃ§o
            </label>
            <input
              name="address_line"
              defaultValue={defaultValues?.address_line}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              NÃºmero
            </label>
            <input
              name="number"
              defaultValue={defaultValues?.number}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Complemento
            </label>
            <input
              name="complement"
              defaultValue={defaultValues?.complement}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Bairro
            </label>
            <input
              name="neighborhood"
              defaultValue={defaultValues?.neighborhood}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Cidade
            </label>
            <input
              name="city"
              defaultValue={defaultValues?.city}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Estado
            </label>
            <input
              name="state"
              defaultValue={defaultValues?.state}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Ponto de referÃªncia
            </label>
            <input
              name="reference_point"
              defaultValue={defaultValues?.reference_point}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded"
            disabled={pending}
            type="submit"
          >
            {pending ? "Salvando..." : "Salvar endereÃ§o"}
          </button>
          <FormFeedback feedback={feedback} />
        </div>
      </form>
    </div>
  );
}

type PatientAdminFormProps = {
  patientId: string;
  defaultValues?: {
    status?: string;
    admission_type?: string;
    complexity?: string;
    service_package?: string;
    start_date?: string;
    end_date?: string;
    notes_internal?: string;
  };
  onSaved?: () => void;
};

export function PatientAdminForm({
  patientId,
  defaultValues,
  onSaved,
}: PatientAdminFormProps) {
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = formDataToObject(formData);

      pruneEmptyStrings(payload);
      payload.patient_id = patientId;

      await upsertPatientAdminInfo(payload);
      setFeedback({ type: "success", message: "Dados administrativos salvos!" });
      onSaved?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao salvar dados administrativos.";
      setFeedback({ type: "error", message });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Atualizar dados administrativos</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <input
              name="status"
              defaultValue={defaultValues?.status}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Tipo de admissÃ£o
            </label>
            <input
              name="admission_type"
              defaultValue={defaultValues?.admission_type}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Complexidade
            </label>
            <input
              name="complexity"
              defaultValue={defaultValues?.complexity}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Pacote de serviÃ§o
            </label>
            <input
              name="service_package"
              defaultValue={defaultValues?.service_package}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Data de inÃ­cio
            </label>
            <input
              type="date"
              name="start_date"
              defaultValue={defaultValues?.start_date}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Data de tÃ©rmino
            </label>
            <input
              type="date"
              name="end_date"
              defaultValue={defaultValues?.end_date}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            ObservaÃ§Ãµes internas
          </label>
          <textarea
            name="notes_internal"
            defaultValue={defaultValues?.notes_internal}
            className="border px-2 py-1 w-full rounded min-h-[80px] resize-y"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded"
            disabled={pending}
            type="submit"
          >
            {pending ? "Salvando..." : "Salvar administrativo"}
          </button>
          <FormFeedback feedback={feedback} />
        </div>
      </form>
    </div>
  );
}

type PatientClinicalSummaryFormProps = {
  patientId: string;
  defaultValues?: {
    summary?: unknown;
    meta?: unknown;
  };
  onSaved?: () => void;
};

export function PatientClinicalSummaryForm({
  patientId,
  defaultValues,
  onSaved,
}: PatientClinicalSummaryFormProps) {
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  const [summaryText, setSummaryText] = React.useState(
    defaultValues?.summary ? JSON.stringify(defaultValues.summary, null, 2) : "",
  );
  const [metaText, setMetaText] = React.useState(
    defaultValues?.meta ? JSON.stringify(defaultValues.meta, null, 2) : "",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    try {
      const summary = summaryText ? JSON.parse(summaryText) : {};
      const meta = metaText ? JSON.parse(metaText) : undefined;

      await upsertClinicalSummary({
        patient_id: patientId,
        summary,
        meta,
      });

      setFeedback({ type: "success", message: "Resumo clÃ­nico salvo!" });
      onSaved?.();
    } catch (error: unknown) {
      const message =
        error instanceof SyntaxError
          ? "JSON invÃ¡lido. Verifique o formato do resumo/meta."
          : error instanceof Error
          ? error.message
          : "Erro ao salvar resumo clÃ­nico.";
      setFeedback({ type: "error", message });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Atualizar resumo clÃ­nico</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Resumo (JSON)
          </label>
          <textarea
            value={summaryText}
            onChange={(event) => setSummaryText(event.target.value)}
            className="border px-2 py-1 w-full rounded min-h-[160px] resize-y font-mono text-sm"
            placeholder='Ex.: {"diagnosis":"..."}'
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Meta (JSON opcional)
          </label>
          <textarea
            value={metaText}
            onChange={(event) => setMetaText(event.target.value)}
            className="border px-2 py-1 w-full rounded min-h-[120px] resize-y font-mono text-sm"
            placeholder='Ex.: {"lastUpdate":"..."}'
          />
        </div>

        <div className="flex items-center gap-3">
      <button
        className="bg-blue-600 text-white px-3 py-2 rounded"
        disabled={pending}
        type="submit"
      >
        {pending ? "Salvando..." : "Salvar resumo clÃ­nico"}
      </button>
      <FormFeedback feedback={feedback} />
    </div>
  </form>
</div>
  );
}

type PatientFinancialFormProps = {
  patientId: string;
  defaultValues?: {
    id?: string;
    bond_type?: string;
    insurer?: string;
    plan_name?: string;
    card_number?: string;
    validity?: string;
    monthly_fee?: number;
    due_day?: number;
    payment_method?: string;
    billing_status?: string;
    last_payment_date?: string;
    last_payment_amount?: number;
    financial_contact?: string;
    observations?: string;
    invoice_history?: unknown[];
  };
  onSaved?: (record: FinancialRecord) => void;
};

const BOND_OPTIONS = [
  "Plano de Saúde",
  "Particular",
  "Convênio",
  "SUS",
  "Parceria",
] as const;

const PAYMENT_OPTIONS = [
  "Boleto",
  "PIX",
  "Débito",
  "Transferência",
  "Faturamento",
  "Outro",
] as const;

const BILLING_STATUS_OPTIONS = [
  "Em dia",
  "Atrasado",
  "Em negociação",
  "Inadimplente",
  "Isento",
] as const;

export function PatientFinancialForm({
  patientId,
  defaultValues,
  onSaved,
}: PatientFinancialFormProps) {
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  const [invoiceHistoryText, setInvoiceHistoryText] = React.useState(
    defaultValues?.invoice_history
      ? JSON.stringify(defaultValues.invoice_history, null, 2)
      : "",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    try {
      const formElement = event.currentTarget;
      const formData = new FormData(formElement);
      const payload = formDataToObject(formData);

      pruneEmptyStrings(payload);
      payload.patient_id = patientId;

      if (invoiceHistoryText.trim()) {
        try {
          payload.invoice_history = JSON.parse(invoiceHistoryText);
        } catch (parseError) {
          throw new Error("Histórico de faturas precisa ser um JSON valido.");
        }
      } else {
        delete payload.invoice_history;
      }

      if (defaultValues?.id) {
        payload.id = defaultValues.id;
      }

      const saved = await upsertPatientFinancial(payload);
      setFeedback({ type: "success", message: "Dados financeiros salvos!" });
      onSaved?.(saved);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao salvar dados financeiros.";
      setFeedback({ type: "error", message });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Atualizar dados financeiros</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {defaultValues?.id && (
          <input type="hidden" name="id" value={defaultValues.id} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Vínculo
            </label>
            <select
              name="bond_type"
              defaultValue={defaultValues?.bond_type ?? ""}
              className="border px-2 py-1 w-full rounded"
            >
              <option value="">Selecione</option>
              {BOND_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Operadora
            </label>
            <input
              name="insurer"
              defaultValue={defaultValues?.insurer}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Nome do plano
            </label>
            <input
              name="plan_name"
              defaultValue={defaultValues?.plan_name}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Numero do cartao
            </label>
            <input
              name="card_number"
              defaultValue={defaultValues?.card_number}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Validade
            </label>
            <input
              type="date"
              name="validity"
              defaultValue={defaultValues?.validity}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Mensalidade
            </label>
            <input
              type="number"
              step="0.01"
              name="monthly_fee"
              defaultValue={
                defaultValues?.monthly_fee !== undefined
                  ? String(defaultValues.monthly_fee)
                  : ""
              }
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Dia de vencimento
            </label>
            <input
              type="number"
              min={1}
              max={31}
              name="due_day"
              defaultValue={
                defaultValues?.due_day !== undefined
                  ? String(defaultValues.due_day)
                  : ""
              }
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Forma de pagamento
            </label>
            <select
              name="payment_method"
              defaultValue={defaultValues?.payment_method ?? ""}
              className="border px-2 py-1 w-full rounded"
            >
              <option value="">Selecione</option>
              {PAYMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Status de cobrança
            </label>
            <select
              name="billing_status"
              defaultValue={defaultValues?.billing_status ?? ""}
              className="border px-2 py-1 w-full rounded"
            >
              <option value="">Selecione</option>
              {BILLING_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Último pagamento
            </label>
            <input
              type="date"
              name="last_payment_date"
              defaultValue={defaultValues?.last_payment_date}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Valor do último pagamento
            </label>
            <input
              type="number"
              step="0.01"
              name="last_payment_amount"
              defaultValue={
                defaultValues?.last_payment_amount !== undefined
                  ? String(defaultValues.last_payment_amount)
                  : ""
              }
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Contato financeiro
          </label>
          <input
            name="financial_contact"
            defaultValue={defaultValues?.financial_contact}
            className="border px-2 py-1 w-full rounded"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Observações gerais
          </label>
          <textarea
            name="observations"
            defaultValue={defaultValues?.observations}
            className="border px-2 py-1 w-full rounded min-h-[80px] resize-y"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Histórico de faturas (JSON)
          </label>
          <textarea
            value={invoiceHistoryText}
            onChange={(event) => setInvoiceHistoryText(event.target.value)}
            className="border px-2 py-1 w-full rounded min-h-[120px] resize-y font-mono text-sm"
            placeholder='Ex.: [{"date":"2024-01-10","value":1200,"status":"Pago"}]'
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded"
            disabled={pending}
            type="submit"
          >
            {pending ? "Salvando..." : "Salvar financeiro"}
          </button>
          <FormFeedback feedback={feedback} />
        </div>
      </form>
    </div>
  );
}

