'use client';

import { CheckCircle, Gavel, IdentificationBadge, Phone, UserCircle, WhatsappLogo } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Patient } from '@/lib/types';

type TabPersonalProps = { patient: Patient };

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('pt-BR') : 'Não informado');

const calculateAge = (value?: string) => {
  if (!value) return '—';
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return '—';
  const diff = Date.now() - birth.getTime();
  return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))} anos`;
};

const motherNameFrom = (patient: Patient) => {
  const any = patient as Record<string, any>;
  return any.motherName ?? any.mother_name ?? any.nomeMae ?? '';
};

const COL_SPAN_CLASSES: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
};

const Field = ({
  label,
  value,
  span = 3,
  badge,
  italic,
  muted,
  strong,
  highlight,
  mono,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  span?: number;
  badge?: React.ReactNode;
  italic?: boolean;
  muted?: boolean;
  strong?: boolean;
  highlight?: boolean;
  mono?: boolean;
  valueClassName?: string;
}) => {
  const spanClass = COL_SPAN_CLASSES[span] ?? COL_SPAN_CLASSES[3];
  return (
    <div className={cn('col-span-12', spanClass)}>
      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
        <span>{label}</span>
        {badge}
      </div>
      <div
        className={cn(
          'flex min-h-[40px] items-center rounded-[6px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-[0_1.6px_3.6px_rgba(15,43,69,0.04)]',
          muted && 'text-slate-400',
          strong && 'font-semibold',
          italic && 'italic text-slate-500',
          highlight && 'border-slate-300 bg-white text-[#0F2B45] font-semibold',
          mono && 'font-mono tracking-tight',
          valueClassName
        )}
      >
        {value}
      </div>
    </div>
  );
};

const Section = ({
  title,
  icon,
  badge,
  children,
  highlightLeft,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  highlightLeft?: boolean;
}) => (
  <div
    className={cn(
      'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1.6px_3.6px_rgba(0,0,0,0.132)]',
      highlightLeft && 'border-l-4 border-l-[#0F2B45]'
    )}
  >
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.05em] text-[#0F2B45]">
      <div className="flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
      {badge}
    </div>
    <div className="grid grid-cols-12 gap-4 px-5 py-5">{children}</div>
  </div>
);

export function TabPersonal({ patient }: TabPersonalProps) {
  const motherName = motherNameFrom(patient);
  const phones = patient.phones ?? [];
  const emails = patient.emails ?? [];

  const primaryPhone = phones[0];
  const secondaryPhone = phones[1];
  const primaryEmail = emails[0];

  const acceptSms = !patient.communicationOptOut?.some((c) => c.type === 'sms');
  const acceptEmail = !patient.communicationOptOut?.some((c) => c.type === 'email');
  const blockedMarketing = patient.communicationOptOut?.some((c) => c.type === 'marketing');

  return (
    <div className="space-y-6">
      <Section
        title="Identidade e Perfil Social"
        icon={<UserCircle className="h-5 w-5" weight="bold" />}
        badge={
          patient.photoConsent?.granted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <CheckCircle className="h-4 w-4" weight="bold" />
              Consentimento de Foto: <span className="text-emerald-700">Concedido</span>
            </span>
          ) : null
        }
      >
        <Field label="Tratamento" span={2} value={patient.salutation ?? '—'} />
        <Field label="Nome Civil Completo" span={4} value={patient.name} highlight />
        <Field label="Nome Social / Display" span={3} value={patient.displayName || '-- Não utiliza --'} italic={!patient.displayName} muted={!patient.displayName} />
        <Field label="Pronomes" span={3} value={patient.pronouns ?? '—'} />

        <Field
          label="Data de Nascimento"
          span={3}
          value={
            <div className="flex w-full items-center justify-between">
              <span>{formatDate(patient.dateOfBirth)}</span>
              <span className="text-xs font-normal text-slate-500">({calculateAge(patient.dateOfBirth)})</span>
            </div>
          }
        />
        <Field label="Sexo Biológico" span={3} value={patient.sexo ?? '—'} />
        <Field label="Identidade de Gênero" span={3} value={patient.genderIdentity ?? '--'} muted={!patient.genderIdentity} />
        <Field label="Estado Civil" span={3} value={patient.estadoCivil ?? '—'} />

        <Field label="Nacionalidade" span={3} value={patient.nacionalidade ?? '—'} />
        <Field label="Naturalidade (Local Nasc.)" span={3} value={patient.naturalidade ?? patient.placeOfBirth ?? '—'} />
        <Field label="Idioma Preferencial" span={2} value={patient.preferredLanguage ?? '—'} />
        <Field label="Nome da Mãe" span={4} value={motherName || '—'} />
      </Section>

      <Section
        title="Documentação Civil"
        icon={<IdentificationBadge className="h-5 w-5" weight="bold" />}
        badge={
          <span className="inline-flex items-center gap-1 rounded border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
            <CheckCircle className="h-4 w-4" weight="bold" />
            Documentos validados via {patient.documentValidation?.method?.toUpperCase() ?? '—'}
          </span>
        }
      >
        <Field
          label="CPF"
          span={3}
          badge={
            patient.cpfStatus ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]',
                  patient.cpfStatus === 'valid'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                )}
              >
                <CheckCircle className="h-3.5 w-3.5" weight="fill" />
                {patient.cpfStatus === 'valid' ? 'Regular' : patient.cpfStatus}
              </span>
            ) : null
          }
          value={<span className="font-mono text-base tracking-tight">{patient.cpf ?? '—'}</span>}
          highlight
        />
        <Field
          label="RG"
          span={3}
          value={
            <div className="flex w-full items-center gap-2 text-sm">
              <span>{patient.rg ?? '—'}</span>
              {patient.rgIssuer ? <span className="text-[11px] text-slate-500">|</span> : null}
              {patient.rgIssuer ? <span className="text-[11px] uppercase text-slate-500">{patient.rgIssuer}</span> : null}
            </div>
          }
        />
        <Field
          label="Cartão SUS (CNS)"
          span={3}
          value={<span className="font-mono text-[#0F2B45]">{patient.cns ?? '—'}</span>}
          valueClassName="bg-blue-50/80 border-blue-100 text-blue-900"
        />
        <Field label="ID Estrangeiro" span={3} value={patient.nationalId ?? '--'} muted={!patient.nationalId} />

        <div className="col-span-12 mt-2 border-t border-slate-100 pt-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400">
            Códigos de Integração (Sistemas Externos)
          </div>
          <div className="flex flex-wrap gap-3">
            {patient.externalIds
              ? Object.entries(patient.externalIds).map(([key, val]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
                  >
                    <span className="text-slate-600">{key}:</span>
                    <span className="font-mono">{val}</span>
                  </span>
                ))
              : null}
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7">
          <Section title="Canais de Contato" icon={<Phone className="h-5 w-5" weight="bold" />}>
            <div className="col-span-12 space-y-4">
              {primaryPhone ? (
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Celular (Principal)</span>
                      {primaryPhone.verified && (
                        <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Verificado
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xl font-bold text-slate-900">{primaryPhone.number}</div>
                  </div>
                  {patient.preferredContactMethod === 'WhatsApp' && primaryPhone.type === 'mobile' ? (
                    <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <WhatsappLogo className="h-4 w-4" weight="fill" /> WhatsApp
                    </span>
                  ) : null}
                </div>
              ) : null}

              {secondaryPhone ? (
                <div className="flex items-center justify-between rounded-md border border-slate-100 px-4 py-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400">{secondaryPhone.type}</span>
                    <div className="text-sm font-medium text-slate-700 mt-1">{secondaryPhone.number}</div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-12 gap-4 pt-1">
                <Field
                  label="Email Principal"
                  span={6}
                  value={primaryEmail ? <span className="text-primary underline">{primaryEmail.email}</span> : 'Não informado'}
                />
                <Field
                  label="Preferência de Contato"
                  span={6}
                  value={
                    <span className="inline-flex items-center gap-2">
                      {patient.preferredContactMethod === 'WhatsApp' && (
                        <WhatsappLogo className="h-4 w-4 text-emerald-600" weight="fill" />
                      )}
                      {patient.preferredContactMethod ?? 'Não informado'}
                    </span>
                  }
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1 text-xs">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" disabled checked={acceptSms} className="accent-primary" />
                  Aceita SMS
                </label>
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" disabled checked={acceptEmail} className="accent-primary" />
                  Aceita Email
                </label>
                <label className="flex items-center gap-2 font-bold text-red-600">
                  <input type="checkbox" disabled checked={!!blockedMarketing} className="accent-red-500" />
                  Bloqueou Marketing
                </label>
              </div>
            </div>
          </Section>
        </div>

        <div className="col-span-12 md:col-span-5">
          <Section title="Responsável Legal" icon={<Gavel className="h-5 w-5" weight="bold" />} highlightLeft>
            <div className="col-span-12 space-y-4">
              <div>
                <div className="text-base font-semibold text-primary">{patient.legalGuardian?.name ?? 'Não informado'}</div>
                {patient.legalGuardian?.documentType && (
                  <div className="text-xs text-slate-600">
                    Relação: <strong>{patient.legalGuardian.documentType}</strong>
                  </div>
                )}
              </div>

              <Field label="Documento Legal (Vínculo)" span={12} value={patient.legalGuardian?.document ?? '—'} strong />
              <Field label="Validade da Procuração" span={12} value={formatDate(patient.legalGuardian?.validityDate)} />

              {patient.legalGuardian?.permissions ? (
                <div className="col-span-12">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">Permissões Concedidas</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(patient.legalGuardian.permissions)
                      .filter(([, allowed]) => allowed)
                      .map(([key]) => (
                        <span
                          key={key}
                          className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase text-emerald-700"
                        >
                          {key}
                        </span>
                      ))}
                  </div>
                </div>
              ) : null}

              <div className="col-span-12 border-t border-slate-100 pt-3">
                <button className="text-xs font-bold text-primary hover:underline">Baixar Documento Digitalizado</button>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="text-right text-[11px] text-slate-400">Dados sensíveis protegidos por LGPD.</div>
    </div>
  );
}
