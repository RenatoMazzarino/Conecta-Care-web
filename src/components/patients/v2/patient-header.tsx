'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChartLineUp, CloudArrowDown, FloppyDisk, NotePencil, Plus, ShieldCheck } from '@phosphor-icons/react';

import type { Patient } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

type PatientHeaderProps = {
  patient: Patient;
  onSave?: (formData: FormData) => Promise<unknown>;
  tabsList?: React.ReactNode;
};

const statusTone: Record<string, string> = {
  Ativo: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Inativo: 'bg-slate-100 text-slate-700 border-slate-200',
  Suspenso: 'bg-amber-50 text-amber-800 border-amber-200',
  Alta: 'bg-blue-50 text-blue-800 border-blue-200',
  'Internado Temporário': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  Óbito: 'bg-rose-50 text-rose-800 border-rose-200',
};

const recordStatusLabel: Record<string, string> = {
  inactive: 'Registro inativo',
  deceased: 'Registro marcado como óbito',
};

const riskFlagTone: Record<string, string> = {
  'high-risk': 'border-rose-200 bg-rose-50 text-rose-700',
  'do-not-visit-alone': 'border-amber-200 bg-amber-50 text-amber-700',
};

const formatDateTime = (value?: string | null, withTime = false) => {
  if (!value) return 'Não informado';
  try {
    const date = new Date(value);
    return withTime
      ? date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      : date.toLocaleDateString('pt-BR');
  } catch {
    return value;
  }
};

const calculateAge = (dateString?: string) => {
  if (!dateString) return '—';
  const birth = new Date(dateString);
  if (Number.isNaN(birth.getTime())) return '—';
  const diff = Date.now() - birth.getTime();
  return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))} anos`;
};

export function PatientHeader({ patient, onSave, tabsList }: PatientHeaderProps) {
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const riskFlags = patient.riskFlags ?? [];

  const handleSave = React.useCallback(() => {
    if (!onSave || isPending) return;
    const formData = new FormData();
    formData.append('patientId', patient.id);
    startTransition(async () => {
      await onSave(formData);
      setFeedback(`Dados sincronizados às ${new Date().toLocaleTimeString('pt-BR')}`);
      setTimeout(() => setFeedback(null), 4000);
    });
  }, [isPending, onSave, patient.id, startTransition]);

  const handleManageAccess = React.useCallback(() => {
    trackEvent({
      eventName: 'quick_action',
      properties: {
        action: 'manage_access',
        target_type: 'patient',
        target_id: patient.id,
      },
    });
  }, [patient.id]);

  const dataStrip = [
    { label: 'Código', value: `#${patient.id}` },
    { label: 'Idade', value: calculateAge(patient.dateOfBirth) },
    { label: 'Convênio', value: patient.financial.operadora ?? 'Particular' },
    { label: 'Complexidade', value: patient.adminData.complexity },
    { label: 'Próxima visita', value: formatDateTime(patient.next_visit_date, true) },
    { label: 'Última visita', value: formatDateTime(patient.last_visit_date, true) },
    { label: 'Pacote', value: patient.adminData.servicePackage },
    { label: 'Frequência', value: patient.adminData.frequency ?? 'Não informado' },
  ];

  const businessInfo = [
    { label: 'Contrato', value: patient.adminData.contractId ?? 'Não informado' },
    { label: 'Operação', value: patient.adminData.operationArea ?? 'Não informado' },
    { label: 'Admissão', value: patient.adminData.admissionType ?? 'Não informado' },
  ];

  const primaryMetrics = dataStrip.slice(0, 3);
  const secondaryMetrics = dataStrip.slice(3);

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 pb-6 pt-6 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !onSave}
              className={cn(
                'flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50',
                (isPending || !onSave) && 'cursor-not-allowed opacity-60'
              )}
            >
              <FloppyDisk className="h-4 w-4 text-[#0F2B45]" weight="bold" />
              {isPending ? 'Salvando...' : 'Salvar'}
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <button
              type="button"
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ChartLineUp className="h-4 w-4 text-[#0F2B45]" weight="bold" />
              Relatório
            </button>
            <Link
              href="/patients/new"
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4 text-[#0F2B45]" weight="bold" />
              Nova Evolução
            </Link>
            <button
              type="button"
              onClick={handleManageAccess}
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ShieldCheck className="h-4 w-4 text-[#0F2B45]" weight="bold" />
              Acessos
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <NotePencil className="h-4 w-4 text-[#0F2B45]" weight="bold" />
              Editar
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
            <span>Status</span>
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-[11px] font-bold tracking-[0.08em]',
                statusTone[patient.adminData.status] ?? 'border-slate-300 bg-slate-50 text-slate-700'
              )}
            >
              {patient.adminData.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 py-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-start gap-6">
              <Avatar className="h-20 w-20 rounded-full border-4 border-white bg-slate-100 text-[#0F2B45] shadow-lg">
                <AvatarImage src={patient.avatarUrl} alt={patient.avatarHint} />
                <AvatarFallback className="bg-slate-200 text-xl font-bold text-[#0F2B45] opacity-80">
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-[260px] flex-1 flex-col gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Pacientes</span>
                  <span className="text-[10px] text-slate-400">/</span>
                  <span className="font-semibold text-[#0F2B45]">{patient.firstName ?? patient.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{patient.name}</h1>
                  <Badge variant="outline" className="border-rose-200 bg-rose-50 text-[11px] font-bold uppercase text-rose-700">
                    Alta complexidade
                  </Badge>
                  {patient.recordStatus && patient.recordStatus !== 'active' && (
                    <Badge variant="destructive" className="text-xs">
                      {recordStatusLabel[patient.recordStatus] ?? patient.recordStatus}
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-slate-300 bg-slate-50 text-slate-800">
                    Consentimento {patient.consent_status === 'ok' ? 'em dia' : 'pendente'}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-12 gap-y-3 text-sm text-slate-900">
                  {primaryMetrics.map((item) => (
                    <div key={item.label}>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Responsável: {patient.emergencyContacts[0]?.name ?? 'Não definido'}</p>
                  {patient.accessLogSummary && (
                    <p>
                      Último acesso por {patient.accessLogSummary.lastAccessBy ?? '—'} em{' '}
                      {formatDateTime(patient.accessLogSummary.lastAccessAt, true)}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                  {riskFlags.slice(0, 3).map((flag) => (
                    <span
                      key={flag}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]',
                        riskFlagTone[flag] ?? 'border-slate-200 bg-slate-50 text-slate-700'
                      )}
                    >
                      {flag.replace(/-/g, ' ')}
                    </span>
                  ))}
                  {patient.photoConsent?.granted && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                      <ShieldCheck className="h-4 w-4" weight="bold" />
                      Consentimento de imagem ativo
                    </span>
                  )}
                  {patient.adminData.lastAuditDate && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                      Última auditoria {formatDateTime(patient.adminData.lastAuditDate)}
                    </span>
                  )}
                  {patient.sensitiveDataConsent && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-700">
                      Base legal: consentimento — {patient.sensitiveDataConsent.date.slice(0, 10)}
                    </span>
                  )}
                </div>
                {feedback && <p className="text-sm font-medium text-slate-900">{feedback}</p>}
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-700">
            {businessInfo.map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {secondaryMetrics.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {secondaryMetrics.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <Button
            variant="ghost"
            size="sm"
            className="border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
          >
            <CloudArrowDown className="mr-2 h-4 w-4" weight="bold" />
            Exportar PDF
          </Button>
          <Link
            href={`/patients/${patient.id}/profile`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver histórico completo
          </Link>
        </div>
      </div>
      {tabsList ? (
        <div className="mx-auto max-w-[1600px] px-4 pb-0 sm:px-6 lg:px-10">{tabsList}</div>
      ) : null}
    </section>
  );
}
