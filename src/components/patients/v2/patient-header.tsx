'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, CloudDownload, Edit3, ShieldCheck, UserCog } from 'lucide-react';

import type { Patient } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

type PatientHeaderProps = {
  patient: Patient;
  onSave?: (formData: FormData) => Promise<unknown>;
};

const statusVariant: Record<string, string> = {
  Ativo: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Inativo: 'bg-slate-100 text-slate-600 border-slate-200',
  Suspenso: 'bg-amber-50 text-amber-700 border-amber-100',
  Alta: 'bg-blue-50 text-blue-700 border-blue-100',
  'Internado Temporário': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Óbito: 'bg-rose-50 text-rose-700 border-rose-100',
};

const recordStatusLabel: Record<string, string> = {
  inactive: 'Registro inativo',
  deceased: 'Registro marcado como óbito',
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

export function PatientHeader({ patient, onSave }: PatientHeaderProps) {
  const router = useRouter();
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
      eventName: 'patient_access_management_opened',
      properties: { patientId: patient.id },
    });
  }, [patient.id]);

  const kpis = [
    { label: 'Idade', value: calculateAge(patient.dateOfBirth) },
    { label: 'Complexidade', value: patient.adminData.complexity },
    { label: 'Próxima visita', value: formatDateTime(patient.next_visit_date, true) },
    { label: 'Última visita', value: formatDateTime(patient.last_visit_date, true) },
    { label: 'Pacote', value: patient.adminData.servicePackage },
    { label: 'Frequência', value: patient.adminData.frequency ?? 'Não informado' },
    { label: 'Operadora', value: patient.financial.operadora ?? 'Particular' },
    { label: 'Status Consentimento', value: patient.consent_status === 'ok' ? 'Atualizado' : 'Pendente' },
  ];

  return (
    <header className="relative">
      <div className="sticky top-16 sm:top-0 z-30 bg-primary text-primary-foreground shadow-fluent">
        <div className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/40"
              onClick={() => router.push('/patients')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Pacientes
            </Button>
            <span className="text-primary-foreground/60">/</span>
            <span className="font-semibold">{patient.displayName}</span>
            <Badge variant="secondary" className="bg-white/20 text-primary-foreground ml-2">
              #{patient.id}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'border-white/40',
                patient.consent_status === 'ok'
                  ? 'bg-emerald-50/20 text-white'
                  : 'bg-amber-50/30 text-amber-100'
              )}
            >
              {patient.consent_status === 'ok' ? 'Consentimento em dia' : 'Consentimento pendente'}
            </Badge>
            {riskFlags.slice(0, 3).map((flag) => (
              <Badge key={flag} variant="outline" className="border-white/30 text-white">
                {flag}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageAccess}
              className="border-white/40 text-primary-foreground hover:bg-white/20"
            >
              <UserCog className="mr-2 h-4 w-4" />
              Gerenciar acessos
            </Button>
            <Button
              variant="secondary"
              className="bg-white/15 text-primary-foreground hover:bg-white/25"
              size="sm"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={isPending || !onSave}
              onClick={handleSave}
              className="bg-accent-foreground text-white hover:bg-accent-foreground/90"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      <Card className="relative rounded-xl border-0 bg-card shadow-fluent">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-fluent-md">
              <AvatarImage src={patient.avatarUrl} alt={patient.avatarHint} />
              <AvatarFallback className="text-xl font-semibold">{patient.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">{patient.name}</h1>
                <Badge
                  variant="outline"
                  className={cn(
                    'border text-xs font-medium',
                    statusVariant[patient.adminData.status] ?? 'bg-slate-50 text-slate-700 border-slate-200'
                  )}
                >
                  {patient.adminData.status}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-secondary-foreground/30 text-secondary-foreground"
                >
                  {patient.adminData.admissionType ?? 'Tipo não informado'}
                </Badge>
                {patient.recordStatus && patient.recordStatus !== 'active' && (
                  <Badge variant="destructive" className="text-xs">
                    {recordStatusLabel[patient.recordStatus] ?? patient.recordStatus}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  {patient.salutation} {patient.firstName} {patient.lastName} •{' '}
                  {patient.pronouns ?? 'Pronome não informado'}
                </p>
                <p>
                  CPF {patient.cpf} {patient.cpfStatus ? `(${patient.cpfStatus})` : ''}
                  {patient.cns ? ` • CNS ${patient.cns}` : ''}
                </p>
                <p>Responsável: {patient.emergencyContacts[0]?.name ?? 'Não definido'}</p>
                {patient.accessLogSummary && (
                  <p>
                    Último acesso por {patient.accessLogSummary.lastAccessBy ?? '—'} em{' '}
                    {formatDateTime(patient.accessLogSummary.lastAccessAt, true)}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {patient.photoConsent?.granted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Consentimento de imagem ativo
                  </span>
                )}
                {patient.adminData.lastAuditDate && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-sky-800">
                    <Clock className="h-4 w-4" />
                    Última auditoria {formatDateTime(patient.adminData.lastAuditDate)}
                  </span>
                )}
                {patient.sensitiveDataConsent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    Base legal: consentimento — {patient.sensitiveDataConsent.date.slice(0, 10)}
                  </span>
                )}
              </div>
              {feedback && (
                <p className="text-sm font-medium text-accent-foreground transition-opacity">
                  {feedback}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 text-sm text-muted-foreground lg:w-60">
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Contrato</span>
              <span className="font-semibold text-foreground">
                {patient.adminData.contractId ?? 'Não informado'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Operação</span>
              <span className="font-semibold text-foreground">
                {patient.adminData.operationArea ?? 'Não informado'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Pacote</span>
              <span className="font-semibold text-foreground">
                {patient.adminData.servicePackage}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-border/60 bg-white px-3 py-2 text-sm shadow-fluent"
              >
                <p className="text-muted-foreground">{kpi.label}</p>
                <p className="text-base font-semibold text-foreground">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t px-6 py-4">
          <Button variant="outline" size="sm">
            <CloudDownload className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Link href={`/patients/${patient.id}/profile`} className="text-sm text-primary hover:underline">
            Ver histórico completo
          </Link>
        </div>
      </Card>
    </header>
  );
}
