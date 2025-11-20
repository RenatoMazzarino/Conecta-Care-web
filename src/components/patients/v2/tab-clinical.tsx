"use client";

import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  CalendarCheck,
  Carrot,
  ChartBar,
  Chats,
  Clock,
  FirstAid,
  Heartbeat,
  Hospital,
  MicrophoneStage,
  Pill,
  PlugsConnected,
  Plus,
  Sparkle,
  Stethoscope,
  Toilet,
  UsersThree,
  WarningCircle,
  WarningOctagon,
  Wind,
} from '@phosphor-icons/react';
import { type ReactNode } from 'react';

type TabClinicalProps = {
  patient: Patient;
  isEditing?: boolean;
};

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('pt-BR') : 'Não informado');

const calculateStayDuration = (startDate?: string) => {
  if (!startDate) return '—';
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return '—';
  const diffMonths = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.4);
  if (diffMonths < 1) {
    const diffDays = Math.max(1, Math.round((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  }
  const months = Math.round(diffMonths);
  return `${months} mês${months > 1 ? 'es' : ''}`;
};

const FieldValue = ({
  value,
  isEditing,
  name,
  type = 'text',
  placeholder,
  className,
}: {
  value?: ReactNode;
  isEditing: boolean;
  name: string;
  type?: 'text' | 'textarea';
  placeholder?: string;
  className?: string;
}) => {
  if (!isEditing) {
    return <span className={cn('font-semibold text-slate-800', className)}>{value ?? 'Não informado'}</span>;
  }
  if (type === 'textarea') {
    return <Textarea name={name} defaultValue={(value as string) ?? ''} placeholder={placeholder} className={cn('min-h-[90px]', className)} />;
  }
  return <Input name={name} defaultValue={(value as string) ?? ''} placeholder={placeholder} className={className} />;
};

const ContextPill = ({ icon: Icon, children, tone = 'default' }: { icon: typeof Hospital; children: ReactNode; tone?: 'default' | 'brand' }) => (
  <span
    className={cn(
      'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]',
      tone === 'brand' ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600',
    )}
  >
    <Icon size={14} />
    {children}
  </span>
);

const GaugeCard = ({ title, value, percent, tone, label }: { title: string; value?: string | number; percent: number; tone: 'green' | 'orange' | 'red'; label?: string }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3">
    <div className="flex items-end justify-between">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{title}</span>
      <span className={cn('text-lg font-bold', tone === 'red' ? 'text-rose-600' : tone === 'orange' ? 'text-amber-600' : 'text-emerald-600')}>
        {value ?? '—'}
      </span>
    </div>
    <div className="mt-2 h-1.5 rounded-full bg-slate-200">
      <div
        className={cn('h-full rounded-full', tone === 'red' ? 'bg-rose-500' : tone === 'orange' ? 'bg-amber-500' : 'bg-emerald-500')}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
    {label && <p className={cn('mt-1 text-right text-[10px] font-semibold', tone === 'red' ? 'text-rose-600' : tone === 'orange' ? 'text-amber-600' : 'text-emerald-600')}>{label}</p>}
  </div>
);

const DeviceCard = ({ icon: Icon, label, detail, active, name, isEditing }: { icon: typeof MicrophoneStage; label: string; detail?: string; active: boolean; name: string; isEditing: boolean }) => (
  <div
    className={cn(
      'flex flex-col items-center rounded-md border p-3 text-center text-xs font-semibold uppercase transition-colors',
      active ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-400',
    )}
  >
    <Icon size={24} className="mb-1" />
    <span>{label}</span>
    <span className="text-[10px] normal-case text-slate-500">{detail ?? '—'}</span>
    {isEditing && (
      <div className="mt-2 text-[10px] font-normal text-slate-500">
        <label className="flex items-center gap-2">
          <input type="checkbox" name={name} defaultChecked={active} className="h-3 w-3" />
          <span>Ativo</span>
        </label>
      </div>
    )}
  </div>
);

const mockPlan = [
  {
    key: 'fisio',
    icon: Sparkle,
    title: 'Fisioterapia Motora',
    professional: 'Dra. Carla Dias',
    frequency: '3x semana',
  },
  {
    key: 'fono',
    icon: Chats,
    title: 'Fonoaudiologia',
    professional: 'Dr. Pedro Silva',
    frequency: '1x semana',
  },
  {
    key: 'nutri',
    icon: Carrot,
    title: 'Nutrição Clínica',
    professional: 'Dra. Ana Souza',
    frequency: 'Quinzenal',
  },
];

const getServiceCoverage = (packageName?: Patient['adminData']['servicePackage']) => {
  switch (packageName) {
    case 'Completo':
    case 'VIP':
      return 'Enfermagem Técnica 24h';
    case 'Intermediário':
      return 'Enfermagem Técnica 16h';
    case 'Básico':
      return 'Enfermagem Técnica 12h';
    default:
      return 'Cobertura sob demanda';
  }
};

const getRiskLabel = (score?: number, type: 'braden' | 'morse' | 'readmission' = 'braden') => {
  if (score === undefined || score === null) return { tone: 'orange' as const, label: 'Sem dado' };
  if (type === 'braden') {
    if (score <= 12) return { tone: 'red' as const, label: 'Risco elevado' };
    if (score <= 16) return { tone: 'orange' as const, label: 'Risco moderado' };
    return { tone: 'green' as const, label: 'Risco baixo' };
  }
  if (type === 'morse') {
    if (score >= 45) return { tone: 'red' as const, label: 'Queda iminente' };
    if (score >= 25) return { tone: 'orange' as const, label: 'Monitorar' };
    return { tone: 'green' as const, label: 'Seguro' };
  }
  if (score >= 70) return { tone: 'red' as const, label: 'Reinternação provável' };
  if (score >= 40) return { tone: 'orange' as const, label: 'Atenção' };
  return { tone: 'green' as const, label: 'Estável' };
};

export function TabClinical({ patient, isEditing = false }: TabClinicalProps) {
  const summary = patient.clinicalSummary;
  const medications = patient.clinicalData?.medications ?? [];
  const smartFields = patient.smartFields;
  const stayDuration = calculateStayDuration(patient.adminData?.startDate);

  const devicesActive = (summary?.devicesActive ?? []).map((device) => device.toLowerCase());

  const criticalAllergy = summary?.allergies?.find((item) => item.severity === 'grave');
  const diagnosisSecondary = (summary as Record<string, any>)?.diagnosisSecondary ?? [];

  const readmissionScore = smartFields?.readmissionRiskScore?.value;
  const careAdherence = smartFields?.careAdherenceScore?.value ?? 0;

  const filteredMedications = medications.filter((med: any) => med.isCritical ?? true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <ContextPill icon={Hospital} tone="brand">
          {patient.adminData?.admissionType ?? 'Admissão não informada'}
        </ContextPill>
        <ContextPill icon={Clock}>Tempo de permanência: {stayDuration}</ContextPill>
        <ContextPill icon={CalendarCheck}>Última revisão: {formatDate(summary?.lastReview?.date)}</ContextPill>
      </div>

      {criticalAllergy && (
        <div className="flex items-center justify-between rounded-md border-l-4 border-rose-500 bg-rose-50 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white p-2 text-rose-600 shadow-sm">
              <WarningOctagon size={20} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-rose-700">Alergia crítica confirmada</p>
              <p className="text-sm font-semibold text-rose-900">
                {criticalAllergy.substance} ({criticalAllergy.reaction})
              </p>
            </div>
          </div>
          <button className="rounded border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-rose-700 shadow-sm">
            Ver detalhes
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-6">
          <Card className="border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <Stethoscope size={20} /> Diagnósticos (CID-10)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <Badge variant="outline" className="rounded bg-slate-50 font-mono text-xs font-black">
                  {summary?.diagnosisPrimary?.cid ?? '—'}
                </Badge>
                <div className="space-y-1">
                  <FieldValue isEditing={isEditing} name="clinicalSummary.diagnosisPrimary.name" value={summary?.diagnosisPrimary?.name} className="text-sm" />
                  <p className="text-xs text-slate-500">Diagnóstico primário</p>
                </div>
              </div>
              {diagnosisSecondary.map((diag: any, index: number) => (
                <div key={`diag-${index}`} className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-b-0">
                  <Badge variant="outline" className="rounded bg-white font-mono text-xs font-black">
                    {diag.cid ?? '—'}
                  </Badge>
                  <div>
                    <FieldValue isEditing={isEditing} name={`clinicalSummary.diagnosisSecondary.${index}.name`} value={diag.name} className="text-sm" />
                    <p className="text-xs text-slate-500">{diag.context ?? 'Comorbidade'}</p>
                  </div>
                </div>
              ))}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand">Resumo do caso</p>
                <div className="mt-2 rounded-r-md border border-slate-200 border-l-4 border-l-brand bg-slate-50 p-3 text-sm text-slate-700 italic">
                  <FieldValue isEditing={isEditing} name="clinicalSummary.shortNote" value={summary?.shortNote} type="textarea" />
                </div>
              </div>
              {!isEditing && (
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-brand">
                  <Plus size={12} /> Adicionar CID
                </button>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border shadow-fluent">
            <CardHeader className="flex items-center justify-between border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <PlugsConnected size={20} /> Dispositivos &amp; suporte
              </CardTitle>
              {patient.adminData?.complexity && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-[0.1em]">
                  {patient.adminData.complexity}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { key: 'tqt', label: 'TQT', icon: MicrophoneStage, detail: 'Traqueo' },
                  { key: 'gtt', label: 'GTT', icon: Pill, detail: 'Nutrição' },
                  { key: 'svd', label: 'SVD', icon: Toilet, detail: 'Sonda vesical' },
                ].map((device) => (
                  <DeviceCard
                    key={device.key}
                    icon={device.icon}
                    label={device.label}
                    detail={device.detail}
                    active={devicesActive.includes(device.key)}
                    name={`clinicalSummary.devicesActive.${device.key}`}
                    isEditing={isEditing}
                  />
                ))}
              </div>

              <div className="rounded-md border border-sky-100 bg-sky-50/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-sky-900">
                    <Wind size={16} /> Oxigenoterapia
                  </span>
                  <Badge variant="outline" className="bg-white text-[10px] font-bold uppercase tracking-[0.08em] text-sky-700">
                    {summary?.oxygenTherapy?.active ? 'Contínuo' : 'Sob demanda'}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Fluxo</p>
                    <FieldValue isEditing={isEditing} name="clinicalSummary.oxygenTherapy.flow" value={summary?.oxygenTherapy?.flow ?? '—'} className="text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Equipamento</p>
                    <FieldValue isEditing={isEditing} name="clinicalSummary.oxygenTherapy.equipment" value={(summary?.oxygenTherapy as any)?.equipment ?? 'Concentrador'} className="text-sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-6">
          <Card className="border border-border shadow-fluent">
            <CardHeader className="flex items-center justify-between border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <UsersThree size={20} /> Plano multidisciplinar
              </CardTitle>
              {patient.adminData?.servicePackage && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-[0.1em]">
                  Pacote {patient.adminData.servicePackage}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-slate-100 bg-sky-50 px-4 py-3 text-xs font-bold uppercase text-sky-900">
                <span className="flex items-center gap-2">
                  <span className="rounded border border-sky-200 bg-white p-1 text-sky-700">
                    <FirstAid size={16} />
                  </span>
                  Enfermagem Técnico
                </span>
                <span>{getServiceCoverage(patient.adminData?.servicePackage)}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {mockPlan.map((entry) => (
                  <div key={entry.key} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded border border-slate-200 bg-slate-50 p-1.5 text-slate-500">
                        <entry.icon size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{entry.title}</p>
                        <p className="text-[10px] text-slate-400">{entry.professional}</p>
                      </div>
                    </div>
                    <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600">
                      {entry.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <ChartBar size={20} /> Gestão de risco (KPIs)
              </CardTitle>
              <p className="text-[10px] text-slate-400">Atualizado: {formatDate(patient.clinicalSummaryMeta?.lastUpdatedAt)}</p>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {(() => {
                  const braden = summary?.riskScores?.braden;
                  const { tone, label } = getRiskLabel(braden, 'braden');
                  const percent = braden ? (braden / 23) * 100 : 50;
                  return <GaugeCard title="Escala Braden" value={braden ?? '—'} percent={percent} tone={tone} label={label} />;
                })()}
                {(() => {
                  const morse = summary?.riskScores?.falls;
                  const { tone, label } = getRiskLabel(morse, 'morse');
                  const percent = morse ? Math.min(100, (morse / 125) * 100) : 30;
                  return <GaugeCard title="Escala Morse" value={morse ?? '—'} percent={percent} tone={tone} label={label} />;
                })()}
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkle size={18} className="text-violet-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-violet-900">Conecta AI Insights</span>
                </div>
                <div className="space-y-3">
                  {(() => {
                    const { tone, label } = getRiskLabel(readmissionScore, 'readmission');
                    return (
                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-slate-600">Risco de Reinternação (30d)</span>
                          <span className={cn('font-bold', tone === 'red' ? 'text-rose-600' : tone === 'orange' ? 'text-amber-600' : 'text-emerald-600')}>
                            {label} {readmissionScore ? `(${readmissionScore}%)` : ''}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/60">
                          <div className={cn('h-full rounded-full', tone === 'red' ? 'bg-rose-500' : tone === 'orange' ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${Math.min(100, readmissionScore ?? 0)}%` }} />
                        </div>
                      </div>
                    );
                  })()}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Aderência ao plano</span>
                      <span className="font-bold text-emerald-600">
                        {careAdherence ? `${careAdherence}%` : 'Sem dado'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/60">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, careAdherence)}%` }} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs">
                  <span className="font-bold uppercase text-slate-500">Incidentes (30 dias)</span>
                  <span className="rounded border border-slate-200 bg-white px-2 py-1 font-bold text-slate-600">
                    {smartFields?.incidentsLast30Days?.count ?? 0} incidentes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <Pill size={20} /> Medicamentos críticos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredMedications.length ? (
                <div className="overflow-hidden rounded-md">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Fármaco</th>
                        <th className="px-3 py-2">Dose / Via</th>
                        <th className="px-3 py-2 text-right">Frequência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMedications.map((med, index) => {
                        const medIsCritical = (med as { isCritical?: boolean }).isCritical ?? true;
                        return (
                          <tr key={`${med.name}-${index}`} className={cn(medIsCritical ? 'bg-white' : '')}>
                            <td className="px-3 py-3 font-semibold text-slate-800">
                              {medIsCritical && <WarningCircle size={12} className="mr-1 inline text-rose-500" />}
                              {med.name}
                            </td>
                          <td className="px-3 py-3 text-slate-600">{med.dosage ?? '—'}</td>
                          <td className="px-3 py-3 text-right font-semibold text-slate-600">{med.frequency ?? '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-4 text-sm text-muted-foreground">Nenhuma prescrição crítica registrada.</p>
              )}
              {!isEditing && (
                <div className="border-t border-slate-100 p-2 text-center">
                  <button className="text-xs font-bold uppercase tracking-[0.08em] text-brand">Ver prescrição completa</button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <Heartbeat size={20} /> Metadados clínicos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Última revisão</p>
                <p className="text-base font-semibold text-slate-800">{summary?.lastReview?.by ?? '—'}</p>
                <p className="text-xs text-slate-500">{formatDate(summary?.lastReview?.date)}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Atualizado em</p>
                <p className="text-base font-semibold text-slate-800">{patient.clinicalSummaryMeta?.lastUpdatedBy ?? 'Equipe Conecta Care'}</p>
                <p className="text-xs text-slate-500">{formatDate(patient.clinicalSummaryMeta?.lastUpdatedAt)}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Fonte</p>
                <p className="text-base font-semibold text-slate-800">
                  {patient.clinicalSummaryMeta?.source === 'prontuario' ? 'Prontuário' : 'Manual'}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Observação</p>
                <p className="text-sm text-slate-700">{summary?.shortNote ?? 'Plano assistencial estável.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
