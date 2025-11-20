'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Patient, PaymentTransaction, PatientFinancialProfile } from '@/lib/types';
import {
  DownloadSimple as Download,
  Eye,
  FirstAid as BriefcaseMedical,
  FunnelSimple as Filter,
  Printer,
  Receipt,
  SlidersHorizontal,
  Wallet,
  Warning as AlertTriangle,
} from '@phosphor-icons/react';
import type { ReactNode } from 'react';

type PaymentStatus = 'Pago' | 'Pendente' | 'Atrasado' | 'Aberto';

type PaymentEntry = {
  id: string;
  competence: string;
  description: string;
  dueDate?: string;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  method?: string;
  notes?: string;
};

type TabFinancialProps = {
  patient: Patient;
  isEditing?: boolean;
  paymentTransactions?: PaymentTransaction[];
};

const formatCurrency = (value?: number) => {
  if (!value) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
};

const formatCompetence = (value: string) => {
  if (!value) return '—';
  if (/\w{3}\/?\d{4}/i.test(value)) return value;
  const parsed = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
};

const statusTone: Record<PaymentStatus, string> = {
  Pago: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Pendente: 'border-amber-300 bg-amber-50 text-amber-700',
  Aberto: 'border-amber-200 bg-amber-50 text-amber-700',
  Atrasado: 'border-rose-200 bg-rose-50 text-rose-700',
};

const normalizeTransactionStatus = (status?: string, dueDate?: string): PaymentStatus => {
  const normalized = status?.toLowerCase();
  const isOverdue = dueDate ? !Number.isNaN(Date.parse(dueDate)) && new Date(dueDate) < new Date() : false;
  if (normalized === 'paid') return 'Pago';
  if (normalized === 'overdue') return 'Atrasado';
  if (normalized === 'pending') return isOverdue ? 'Atrasado' : 'Pendente';
  if (normalized === 'cancelled') return 'Aberto';
  if (normalized === 'failed') return 'Atrasado';
  return isOverdue ? 'Atrasado' : 'Aberto';
};

const FieldValue = ({
  value,
  isEditing,
  name,
  type = 'text',
  placeholder,
  displayClassName,
}: {
  value?: ReactNode;
  isEditing: boolean;
  name: string;
  type?: 'text' | 'number' | 'date' | 'textarea';
  placeholder?: string;
  displayClassName?: string;
}) => {
  if (!isEditing) {
    return (
      <div
        className={cn(
          'flex min-h-[36px] items-center rounded border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900',
          displayClassName,
        )}
      >
        {value ?? '—'}
      </div>
    );
  }

  if (type === 'textarea') {
    return <Textarea name={name} defaultValue={(value as string) ?? ''} placeholder={placeholder} className="min-h-[120px]" />;
  }

  return (
    <Input
      name={name}
      type={type}
      defaultValue={typeof value === 'string' || typeof value === 'number' ? value : undefined}
      placeholder={placeholder}
      className="h-10"
    />
  );
};

const DenseField = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
    {children}
  </div>
);

export function TabFinancial({ patient, isEditing = false, paymentTransactions }: TabFinancialProps) {
  const financial: Partial<PatientFinancialProfile> = patient.financialProfile ?? {};
  const emergencyContacts = Array.isArray(patient.emergencyContacts) ? patient.emergencyContacts : [];
  const insurerName = financial.insurerName ?? '—';
  const planName = financial.planName ?? 'Plano não informado';
  const cardNumber = financial.insuranceCardNumber ?? '—';
  const validity = financial.insuranceCardValidity;
  const monthlyFee = financial.monthlyFee ?? 0;
  const billingDay = financial.billingDueDay;
  const paymentMethod = financial.paymentMethod ?? '—';
  const bondType = financial.bondType ?? '—';
  const billingStatus = financial.billingStatus ?? 'active';
  const billingStatusLabel =
    billingStatus === 'active'
      ? 'Ativo'
      : billingStatus === 'suspended'
        ? 'Suspenso'
        : billingStatus === 'defaulting'
          ? 'Inadimplente'
          : billingStatus;
  const billingNotes = financial.notes;
  const financialContact =
    financial.financialResponsibleName || financial.financialResponsibleContact
      ? {
          name: financial.financialResponsibleName ?? 'Responsável Financeiro',
          contact: financial.financialResponsibleContact,
        }
      : emergencyContacts.find((contact) => contact.permissions?.financial);
  const billingEmail =
    typeof (financialContact as any)?.contact === 'string' && (financialContact as any).contact.includes('@')
      ? (financialContact as any).contact
      : (financialContact as any)?.email;
  const contactLine = financialContact
    ? [
        (financialContact as any).relationship ?? 'Contato',
        (financialContact as any).contact ?? (financialContact as any).phone,
      ]
        .filter(Boolean)
        .join(' • ')
    : undefined;

  const transactions = paymentTransactions ?? patient.paymentTransactions ?? [];
  const ledger: PaymentEntry[] = transactions.map((tx) => {
    const dueDate = tx.dueDate ?? undefined;
    const status = normalizeTransactionStatus(typeof tx.status === 'string' ? tx.status : undefined, dueDate);
    const competence = dueDate ?? tx.createdAt ?? '';
    return {
      id: tx.id ?? tx.providerTxId ?? `${tx.provider}-${competence || 'tx'}`,
      competence,
      description: tx.providerTxId ? `${tx.provider} • ${tx.providerTxId}` : tx.provider ?? 'Transação',
      dueDate,
      status,
      amount: tx.amount ?? 0,
      paidAt: tx.paidAt ?? undefined,
      method: tx.method ?? undefined,
      notes: (tx.metadata as Record<string, unknown>)?.notes as string | undefined,
    };
  });

  const totals = ledger.reduce(
    (acc, item) => {
      if (item.status === 'Pago') acc.paid += item.amount;
      if (item.status === 'Pendente' || item.status === 'Atrasado' || item.status === 'Aberto') acc.pending += item.amount;
      return acc;
    },
    { paid: 0, pending: 0 },
  );

  const years = Array.from(
    new Set(
      ledger
        .map((item) => {
          const yearMatch = item.competence?.match(/(\d{4})/);
          if (yearMatch) return yearMatch[1];
          const date = item.dueDate ? new Date(item.dueDate) : null;
          return date && !Number.isNaN(date.getTime()) ? `${date.getFullYear()}` : undefined;
        })
        .filter(Boolean) as string[],
    ),
  ).sort((a, b) => Number(b) - Number(a));
  const defaultYear = years[0] ?? new Date().getFullYear().toString();

  const expiryDate = validity ? new Date(validity) : null;
  const isExpirySoon = expiryDate ? (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 60 : false;

  const responsibleInitials = financialContact?.name
    ? financialContact.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'RF';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-[#0F2B45] to-[#1B4B7A] p-6 text-white shadow-[0_8px_16px_rgba(15,43,69,0.3)]">
            <div className="flex items-start justify-between">
              <span className="rounded border border-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {bondType}
              </span>
              <BriefcaseMedical className="h-6 w-6 opacity-80" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="text-[10px] uppercase opacity-80">Operadora</div>
              <div className="text-2xl font-bold tracking-wide">{insurerName}</div>
              <div className="text-sm font-medium opacity-90">{planName ?? 'Plano não informado'}</div>
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 text-sm">
              <div>
                <p className="text-[10px] uppercase opacity-80">Número da Carteira</p>
                <p className="font-mono text-lg tracking-widest">{cardNumber}</p>
              </div>
              <div className={cn('text-right', isExpirySoon && 'text-red-100')}>
                <p className="text-[10px] uppercase opacity-80">Validade</p>
                <p className="font-bold">{validity ? formatDate(validity) : '—'}</p>
                {isExpirySoon && <p className="text-[10px] uppercase">Revalidar</p>}
              </div>
            </div>
          </div>

          <Card className="border border-border shadow-fluent">
          <CardHeader className="border-b border-slate-200 pb-4">
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
              <SlidersHorizontal className="h-5 w-5" /> Regras de faturamento
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <DenseField label="Vínculo">
                <FieldValue isEditing={isEditing} name="bond_type" value={bondType} />
              </DenseField>
            </div>
            <DenseField label="Mensalidade Base">
              <FieldValue
                isEditing={isEditing}
                name="monthly_fee"
                value={isEditing ? monthlyFee ?? '' : formatCurrency(monthlyFee)}
                type="number"
                placeholder="0,00"
                displayClassName="font-bold text-slate-900"
              />
            </DenseField>
            <DenseField label="Dia do vencimento">
              <FieldValue
                isEditing={isEditing}
                name="billing_due_day"
                value={isEditing ? billingDay ?? '' : billingDay ? `Dia ${billingDay}` : '—'}
                type="number"
                placeholder="10"
              />
            </DenseField>
            <div className="sm:col-span-2">
              <DenseField label="Forma de pagamento">
                <FieldValue
                  isEditing={isEditing}
                  name="payment_method"
                  value={paymentMethod ?? '—'}
                  placeholder="PIX / Boleto / Faturamento"
                  displayClassName="flex items-center gap-2"
                />
              </DenseField>
            </div>
            <DenseField label="Status de cobrança">
              <FieldValue
                isEditing={isEditing}
                name="billing_status"
                value={billingStatusLabel ?? '—'}
                displayClassName={cn(
                  'font-bold',
                  billingStatus === 'defaulting'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : billingStatus === 'suspended'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-emerald-100 bg-emerald-50 text-emerald-700',
                )}
              />
            </DenseField>
            <div className="sm:col-span-2">
              <DenseField label="Observações financeiras">
                <FieldValue
                  isEditing={isEditing}
                  name="notes"
                  value={billingNotes ?? '—'}
                  type={isEditing ? 'textarea' : 'text'}
                  placeholder="Regras adicionais, combinações de negociação, contatos autorizados..."
                  displayClassName="min-h-[48px]"
                />
              </DenseField>
            </div>
          </CardContent>
        </Card>

          <Card className="border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-200 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <Wallet className="h-5 w-5" /> Responsável financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-600">
                  {responsibleInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{financialContact?.name ?? 'Responsável não definido'}</p>
                  {financialContact && <p className="text-xs text-slate-500">{contactLine}</p>}
                </div>
              </div>

              <DenseField label="Nome do responsável">
                <FieldValue
                  isEditing={isEditing}
                  name="financial_responsible_name"
                  value={financialContact?.name ?? ''}
                  placeholder="Nome completo"
                />
              </DenseField>

              <DenseField label="Contato (e-mail ou telefone)">
                <FieldValue
                  isEditing={isEditing}
                  name="financial_responsible_contact"
                  value={billingEmail ?? (financialContact as any)?.contact ?? (financialContact as any)?.phone ?? '—'}
                  placeholder="contato@dominio.com / (11) 99999-9999"
                  displayClassName="text-blue-600 underline"
                />
              </DenseField>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="flex h-full flex-col border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                  <Receipt className="h-5 w-5" /> Extrato financeiro
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 border-slate-300 text-slate-600">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 border-brand text-brand hover:bg-brand/5">
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                  <select
                    className="h-8 rounded border border-slate-300 bg-white pl-6 pr-2 text-xs font-semibold text-slate-600 shadow-sm focus:border-brand"
                    defaultValue={defaultYear}
                    aria-label="Ano"
                  >
                    {years.length ? years.map((year) => <option key={year}>{year}</option>) : <option>{defaultYear}</option>}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  <Button variant="ghost" size="sm" className="h-7 rounded border border-slate-300 px-2 text-slate-600 shadow-sm">
                    Todos
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 rounded px-2 text-slate-500">
                    Pagos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded border border-rose-200 bg-rose-50 px-2 text-rose-600"
                  >
                    Pendentes ({ledger.filter((item) => item.status !== 'Pago').length})
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="flex-1 overflow-x-auto p-0">
              <table className="min-w-full text-[12px]">
                <thead className="bg-slate-100 uppercase text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Competência</th>
                    <th className="px-4 py-3 text-left">Descrição / ID</th>
                    <th className="px-4 py-3 text-left">Vencimento</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.length ? (
                    ledger.map((item) => (
                      <tr key={item.id} className={cn('border-b border-slate-100', item.status === 'Atrasado' && 'bg-rose-50/50')}>
                        <td className="px-4 py-3 font-semibold text-slate-700">{formatCompetence(item.competence)}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{item.description}</div>
                          <div className="font-mono text-[10px] text-slate-400">{item.id}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.dueDate ? formatDate(item.dueDate) : '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className={statusTone[item.status] ?? statusTone.Pendente}>
                              {item.status}
                            </Badge>
                            {item.paidAt && item.status === 'Pago' && (
                              <span className="text-[10px] text-slate-400">Em {formatDate(item.paidAt)} ({item.method ?? '—'})</span>
                            )}
                            {item.status === 'Atrasado' && item.notes && (
                              <span className="text-[10px] text-rose-600">{item.notes}</span>
                            )}
                          </div>
                        </td>
                        <td className={cn('px-4 py-3 text-right font-bold', item.status === 'Atrasado' ? 'text-rose-600' : 'text-slate-800')}>
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                        Nenhuma transação encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>

            <div className="flex flex-wrap justify-end gap-8 border-t border-slate-200 bg-slate-50 px-6 py-4 text-right text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Total pago (ano)</p>
                <p className="text-base font-bold text-emerald-700">{formatCurrency(totals.paid)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Em aberto</p>
                <p className="text-lg font-bold text-brand">{formatCurrency(totals.pending)}</p>
              </div>
            </div>
          </Card>

          {totals.pending > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertTriangle className="h-4 w-4" /> Há valores em aberto. Considere gerar lembrete ou negociação.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
