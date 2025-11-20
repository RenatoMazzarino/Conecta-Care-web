'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Patient } from '@/lib/types';
import { BriefcaseBusiness, CalendarDays, FileText, Link2, ShieldCheck, UserCog, Users } from 'lucide-react';
import type { ReactNode } from 'react';

type TabAdministrativeProps = {
  patient: Patient;
  isEditing?: boolean;
};

const calculateStayDuration = (startDate?: string) => {
  if (!startDate) return '—';
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return '—';
  const diffDays = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return `${diffDays} dia${diffDays === 1 ? '' : 's'}`;
  const months = Math.floor(diffDays / 30);
  return `${months} mês${months === 1 ? '' : 'es'}`;
};

const formatRelativeDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Hoje';
  if (diffDays === 1) return 'Há 1 dia';
  if (diffDays < 30) return `Há ${diffDays} dias`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return 'Há 1 mês';
  if (diffMonths < 12) return `Há ${diffMonths} meses`;
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? 'Há 1 ano' : `Há ${diffYears} anos`;
};

const FieldValue = ({
  value,
  isEditing,
  name,
  type = 'text',
  placeholder,
  options,
  displayClassName,
  textClassName,
}: {
  value?: ReactNode;
  isEditing: boolean;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  options?: { label: string; value: string }[];
  displayClassName?: string;
  textClassName?: string;
}) => {
  if (!isEditing) {
    const content = value ?? 'Não informado';
    return (
      <div
        className={cn(
          'flex min-h-[38px] items-center rounded border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800',
          displayClassName,
        )}
      >
        {typeof content === 'string' || typeof content === 'number' ? (
          <span className={cn(textClassName)}>{content}</span>
        ) : (
          content
        )}
      </div>
    );
  }

  if (type === 'textarea') {
    return <Textarea name={name} defaultValue={(value as string) ?? ''} placeholder={placeholder} className="min-h-[90px]" />;
  }

  if (type === 'select' && options?.length) {
    return (
      <select
        name={name}
        defaultValue={(value as string) ?? ''}
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700"
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      type={type === 'date' ? 'date' : 'text'}
      name={name}
      defaultValue={(value as string) ?? ''}
      placeholder={placeholder}
      className="h-10"
    />
  );
};

const spanMap: Record<3 | 4 | 12, string> = {
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  12: 'lg:col-span-12',
};

const DenseField = ({
  label,
  children,
  colSpan = 3,
  className,
}: {
  label: string;
  children: ReactNode;
  colSpan?: 3 | 4 | 12;
  className?: string;
}) => (
  <div className={cn('space-y-1', spanMap[colSpan], className)}>
    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</span>
    {children}
  </div>
);

const TeamCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value ?? 'Definir'}</p>
    </div>
  </div>
);

const ExternalRow = ({ label, value, hasDivider = true }: { label: string; value?: string; hasDivider?: boolean }) => (
  <div className={cn('flex items-center justify-between py-2', hasDivider && 'border-b border-slate-100')}>
    <span className="text-xs font-semibold text-slate-600">{label}</span>
    <span className="font-mono text-xs text-slate-700">{value ?? '—'}</span>
  </div>
);

const statusTone: Record<Patient['adminData']['status'], string> = {
  Ativo: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Inativo: 'bg-slate-100 text-slate-600 border-slate-200',
  Suspenso: 'bg-amber-50 text-amber-700 border-amber-100',
  Alta: 'bg-blue-50 text-blue-700 border-blue-100',
  'Internado Temporário': 'bg-sky-50 text-sky-700 border-sky-100',
  Óbito: 'bg-slate-200 text-slate-600 border-slate-300',
};

const complexityTone: Record<Patient['adminData']['complexity'], string> = {
  Baixa: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  Média: 'border-amber-100 bg-amber-50 text-amber-700',
  Alta: 'border-rose-100 bg-rose-50 text-rose-700',
  Crítica: 'border-rose-200 bg-rose-50 text-rose-700',
};

export function TabAdministrative({ patient, isEditing = false }: TabAdministrativeProps) {
  const { adminData, externalIds, financial } = patient;
  const contractCode = adminData.contractId ?? externalIds?.contractId ?? 'N/A';
  const startDate = adminData.startDate ? new Date(adminData.startDate).toLocaleDateString('pt-BR') : 'Não informado';
  const endDate = adminData.endDate ? new Date(adminData.endDate).toLocaleDateString('pt-BR') : 'Indeterminado';
  const stayDuration = calculateStayDuration(adminData.startDate);
  const auditRelative = formatRelativeDate(adminData.lastAuditDate);
  const packageDescription = adminData.frequency ?? 'Plano configurado de acordo com a prescrição assistencial vigente.';

  const statusOptions = ['Ativo', 'Inativo', 'Suspenso', 'Alta', 'Internado Temporário', 'Óbito'].map((value) => ({
    label: value,
    value,
  }));
  const admissionOptions = ['Home Care', 'Paliativo', 'Internação Domiciliar', 'Acompanhamento Ambulatorial'].map((value) => ({
    label: value,
    value,
  }));
  const complexityOptions = ['Baixa', 'Média', 'Alta', 'Crítica'].map((value) => ({ label: value, value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <Card className="border border-border shadow-fluent">
            <CardHeader className="flex flex-col gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                  <FileText className="h-5 w-5" /> Contrato & Admissão
                </CardTitle>
                <span
                  className={cn(
                    'rounded-md border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]',
                    statusTone[adminData.status],
                  )}
                >
                  Contrato {adminData.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid gap-4 p-5 lg:grid-cols-12">
                <DenseField label="ID Contrato" colSpan={3}>
                  <FieldValue
                    isEditing={isEditing}
                    name="adminData.contractId"
                    value={<span className="font-mono">#{contractCode}</span>}
                    displayClassName="bg-white"
                  />
                </DenseField>
                <DenseField label="Data Admissão" colSpan={3}>
                  <FieldValue
                    isEditing={isEditing}
                    name="adminData.startDate"
                    value={startDate}
                    type="date"
                    displayClassName="bg-white"
                  />
                </DenseField>
                <DenseField label="Previsão Alta" colSpan={3}>
                  <FieldValue
                    isEditing={isEditing}
                    name="adminData.endDate"
                    value={adminData.endDate ? endDate : 'Indeterminado'}
                    type="date"
                    displayClassName="bg-white text-slate-500"
                  />
                </DenseField>
                <DenseField label="Tempo Permanência" colSpan={3}>
                  <FieldValue
                    isEditing={false}
                    name="adminData.stayDuration"
                    value={<span className="font-bold text-brand">{stayDuration}</span>}
                    displayClassName="border-blue-100 bg-blue-50"
                  />
                </DenseField>

                <DenseField label="Tipo de Admissão" colSpan={4}>
                  <FieldValue
                    isEditing={isEditing}
                    name="adminData.admissionType"
                    value={adminData.admissionType}
                    type="select"
                    options={admissionOptions}
                  />
                </DenseField>
                <DenseField label="Origem" colSpan={4}>
                  <FieldValue isEditing={isEditing} name="adminData.admissionSource" value={adminData.admissionSource} />
                </DenseField>
                <DenseField label="Complexidade" colSpan={4}>
                  {!isEditing ? (
                    <FieldValue
                      isEditing={false}
                      name="adminData.complexity"
                      value={adminData.complexity}
                      displayClassName={cn('uppercase tracking-[0.05em]', complexityTone[adminData.complexity])}
                    />
                  ) : (
                    <FieldValue
                      isEditing={true}
                      name="adminData.complexity"
                      value={adminData.complexity}
                      type="select"
                      options={complexityOptions}
                    />
                  )}
                </DenseField>

                <DenseField label="Pacote de Serviços Contratado" colSpan={12} className="border-t border-slate-100 pt-4">
                  <FieldValue
                    isEditing={isEditing}
                    name="adminData.servicePackage"
                    value={
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{adminData.servicePackage ?? 'Pacote personalizado'}</p>
                        <p className="text-xs text-slate-500">{packageDescription}</p>
                      </div>
                    }
                    displayClassName="items-start border-l-4 border-l-brand bg-white py-3 shadow-sm"
                  />
                </DenseField>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <Users className="h-5 w-5" /> Equipe de Gestão Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">
              <TeamCard label="Supervisão" value={adminData.supervisorId} icon={UserCog} />
              <TeamCard label="Escalista" value={adminData.escalistaId} icon={CalendarDays} />
              <TeamCard label="Gestor Conta" value={adminData.nurseResponsibleId} icon={BriefcaseBusiness} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-border border-l-4 border-l-slate-400 shadow-fluent">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <Link2 className="h-5 w-5" /> Vínculos Externos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <ExternalRow label="CRM ID" value={externalIds?.crmId} />
              <ExternalRow label="EMR Legado" value={externalIds?.susId} />
              <ExternalRow label="Operadora" value={financial?.operadora} hasDivider={false} />
            </CardContent>
          </Card>

          <Card className="border border-border shadow-fluent">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand">
                <ShieldCheck className="h-5 w-5" /> Governança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Última Auditoria</p>
                  <p className="text-xs font-semibold text-slate-800">
                    {adminData.lastAuditDate ? new Date(adminData.lastAuditDate).toLocaleDateString('pt-BR') : '—'}
                  </p>
                  {auditRelative && <p className="text-[10px] text-slate-400">{auditRelative}</p>}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Auditor</p>
                  <p className="text-xs font-semibold text-slate-800">{adminData.lastAuditBy ?? 'Não informado'}</p>
                  <p className="text-[10px] text-slate-400">Qualidade</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Status Geral</p>
                <FieldValue
                  isEditing={isEditing}
                  name="adminData.status"
                  value={adminData.status}
                  type="select"
                  options={statusOptions}
                  displayClassName="bg-white"
                />
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Notas Internas (Restrito)</p>
                {!isEditing ? (
                  <p className="mt-2 text-xs italic text-slate-600">
                    {adminData.notesInternal ?? 'Nenhuma nota registrada. Utilize este espaço para alinhamentos sensíveis.'}
                  </p>
                ) : (
                  <FieldValue
                    isEditing
                    name="adminData.notesInternal"
                    value={adminData.notesInternal}
                    type="textarea"
                    placeholder="Registrar alinhamentos internos..."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
