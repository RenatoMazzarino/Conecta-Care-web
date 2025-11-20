"use client";

import type { Patient } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Bed,
  Cigarette,
  Droplets,
  Gavel,
  HomeIcon,
  DoorOpen,
  Info,
  MapPin,
  Moon,
  Archive,
  ParkingCircle,
  PawPrint,
  Quote,
  ShieldAlert,
  Truck,
  Volume2,
  Wifi,
  Wind,
  Zap,
} from 'lucide-react';

type TabAddressProps = { patient: Patient };

const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return 'Não informado';
  return value;
};

const toneBox = (tone: 'neutral' | 'good' | 'warn' | 'bad') =>
  cn(
    'rounded-md border px-3 py-2 text-center text-sm font-semibold',
    tone === 'good' && 'border-emerald-200 bg-emerald-50 text-emerald-800',
    tone === 'warn' && 'border-amber-200 bg-amber-50 text-amber-800',
    tone === 'bad' && 'border-rose-200 bg-rose-50 text-rose-800',
    tone === 'neutral' && 'border-slate-200 bg-slate-50 text-slate-700'
  );

const Field = ({
  label,
  value,
  span = 3,
  muted,
}: {
  label: string;
  value: string | React.ReactNode;
  span?: number;
  muted?: boolean;
}) => (
  <div className={`col-span-12 md:col-span-${span}`}>
    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
    <div
      className={cn(
        'flex min-h-[42px] items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900',
        muted && 'text-slate-400'
      )}
    >
      {value}
    </div>
  </div>
);

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
      'overflow-hidden rounded-md border border-slate-200 bg-white shadow-fluent',
      highlightLeft && 'border-l-4 border-l-primary'
    )}
  >
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.05em] text-primary">
      <div className="flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
      {badge}
    </div>
    <div className="px-5 py-5">{children}</div>
  </div>
);

const TagBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
    {label}
  </span>
);

const RiskCard = ({
  label,
  value,
  tone,
  note,
  icon: Icon,
}: {
  label: string;
  value?: string;
  tone: 'good' | 'warn' | 'bad' | 'neutral';
  note?: string;
  icon: typeof ShieldAlert;
}) => (
  <div className={toneBox(tone)}>
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em]">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="mt-1 text-sm font-semibold">{value ?? 'Não informado'}</div>
    {note ? <div className="text-[11px] font-medium">{note}</div> : null}
  </div>
);

const FamilyRow = ({
  name,
  role,
  note,
}: {
  name: string;
  role: string;
  note?: string;
}) => (
  <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3 last:border-b-0">
    <div>
      <p className="text-sm font-semibold text-slate-900">{name}</p>
      <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{role}</p>
    </div>
    {note ? <span className="text-[11px] font-semibold text-slate-500">{note}</span> : null}
  </div>
);

export function TabAddressEnvironment({ patient }: TabAddressProps) {
  const address = patient.address;
  const domicile = patient.domicile ?? {};

  const roomStats = [
    { label: 'Ventilação', value: domicile.ventilation, icon: Wind },
    { label: 'Iluminação', value: domicile.lightingQuality ?? 'Boa', icon: Droplets },
    { label: 'Ruído', value: domicile.noiseLevel ?? 'Médio', icon: Volume2 },
  ];

  const mapsUrl =
    address?.geolocation?.lat && address.geolocation.lng
      ? `https://www.google.com/maps/search/?api=1&query=${address.geolocation.lat},${address.geolocation.lng}`
      : undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-6">
          <Section
            title="Localização (PAD)"
            icon={<MapPin className="h-5 w-5" />}
            badge={
              address?.zoneType ? (
                <span className="rounded border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700">
                  Zona {address.zoneType}
                </span>
              ) : null
            }
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-5 lg:col-span-4 md:row-span-3">
                <div className="relative flex h-full min-h-[200px] items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  {address?.facadeImageUrl ? (
                    <img
                      src={address.facadeImageUrl}
                      alt={`Fachada do endereço de ${patient.displayName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <HomeIcon className="mx-auto mb-2 h-8 w-8" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em]">Foto da fachada</p>
                    </div>
                  )}
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-0 left-0 right-0 bg-slate-800/70 py-2 text-center text-[11px] font-semibold text-white"
                    >
                      Ver no Maps
                    </a>
                  )}
                </div>
              </div>

              <Field label="CEP" span={2} value={formatValue(address?.zipCode)} />
              <Field label="Cidade / UF" span={4} value={`${address?.city ?? '—'} - ${address?.state ?? '—'}`} />
              <Field label="Número" span={2} value={formatValue(address?.number)} />
              <Field label="Logradouro" span={4} value={formatValue(address?.street)} />

              <Field label="Complemento" span={4} value={formatValue(address?.complement)} />
              <Field label="Bairro" span={3} value={formatValue(address?.neighborhood)} />
              <Field label="Ponto de referência" span={12} value={address?.pontoReferencia ?? '—'} />

              <div className="col-span-12">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Geolocalização (Lat/Lng)</p>
                <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-sm font-mono text-slate-700">
                    {address?.geolocation
                      ? `${address.geolocation.lat.toFixed(6)}, ${address.geolocation.lng.toFixed(6)}`
                      : '—'}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                    <Truck className="h-4 w-4 text-slate-500" />
                    {address?.etaMinutes ? `${address.etaMinutes} min (do Centro)` : 'Tempo estimado não informado'}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Logística de Acesso" icon={<Truck className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <RiskCard label="Ambulância" value={domicile.ambulanceAccess ?? '—'} tone="bad" note="Sem elevador maca" icon={AlertTriangle} />
              <RiskCard label="Estacionamento" value={domicile.teamParking ?? '—'} tone="neutral" icon={ParkingCircle} />
              <RiskCard label="Risco noturno" value={domicile.nightAccessRisk ?? 'Baixo'} tone="good" icon={Moon} />
              <RiskCard label="Horário visita" value={address?.allowedVisitHours ?? 'Livre (24h)'} tone="neutral" icon={DoorOpen} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="Identificação Portaria" span={6} value={domicile.gateIdentification ?? 'Apresentar Crachá + RG'} />
              <Field label="Procedimento de Entrada" span={6} value={domicile.entryProcedure ?? 'Interfone 32. Aguardar autorização.'} />
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand">Notas de viagem (Travel Notes)</p>
              <div className="mt-2 flex gap-2 rounded-md border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
                <Info className="h-4 w-4" />
                <span>{formatValue(address?.travelNotes)}</span>
              </div>
            </div>
          </Section>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <Section title="Local de Permanência" icon={<HomeIcon className="h-5 w-5" />}>
            <div className="grid grid-cols-3 gap-3">
              {roomStats.map((stat) => (
                <div key={stat.label} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-center">
                  <stat.icon className="mx-auto mb-1 h-5 w-5 text-slate-400" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{stat.label}</p>
                  <p className="text-sm font-bold text-slate-800">{formatValue(stat.value)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 shadow-sm">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Cama</p>
                  <p className="text-sm font-semibold text-slate-800">{formatValue(domicile.bedType ?? domicile.patientRoom)}</p>
                </div>
              </div>
                <div className="flex items-center gap-3 border-t border-slate-200 pt-3">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 shadow-sm">
                  <Archive className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Colchão</p>
                  <p className="text-sm font-semibold text-slate-800">{formatValue(domicile.mattressType)}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Voltagem</p>
                <p className="text-sm font-semibold text-primary">{formatValue(domicile.voltage ?? domicile.electricalInfrastructure)}</p>
              </div>
              <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-rose-700">Gerador/Backup</p>
                <p className="text-sm font-semibold text-rose-700">{formatValue(domicile.backupPowerSource ?? 'Não possui')}</p>
              </div>
              <div className="col-span-2 flex flex-wrap items-center gap-2 pt-1">
                <TagBadge label={domicile.hasWifi ? 'Wi-Fi' : 'Wi-Fi não informado'} />
                <TagBadge label={domicile.waterSource ?? 'Água rede'} />
              </div>
            </div>
          </Section>

          <Section title="Dinâmica Familiar" icon={<AlertTriangle className="h-5 w-5" />}>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
                <div className="bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  Residentes & Cuidadores
                </div>
                {domicile.otherResidents?.length || domicile.caregivers?.length ? (
                  <div className="divide-y divide-slate-100">
                    {(domicile.otherResidents ?? []).map((res) => (
                      <FamilyRow key={res.name} name={res.name} role={res.relationship ?? 'Residente'} note="—" />
                    ))}
                    {(domicile.caregivers ?? []).map((care) => (
                      <FamilyRow key={care.name} name={care.name} role={care.role ?? 'Cuidador(a)'} note={care.schedule ?? '—'} />
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-4 text-sm text-slate-500">Sem registros familiares/cuidadores.</div>
                )}
              </div>

              {(domicile.pets || domicile.animalsBehavior) && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-white p-2 text-amber-600 shadow">
                      <PawPrint className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold uppercase">
                        <span>{domicile.pets}</span>
                        <span className="rounded border border-amber-200 bg-white px-2 py-0.5 text-[10px] text-amber-700">Atenção</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        <strong>Comportamento:</strong> {domicile.animalsBehavior ?? '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Fumantes</p>
                      <p className={cn('text-sm font-semibold', domicile.hasSmokers ? 'text-amber-700' : 'text-slate-700')}>
                        {domicile.hasSmokers ? 'Sim (Externo)' : 'Não'}
                      </p>
                    </div>
                    <Cigarette className={cn('h-5 w-5', domicile.hasSmokers ? 'text-amber-500' : 'text-slate-400')} />
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Higiene</p>
                      <p className="text-sm font-semibold text-emerald-700">{domicile.hygieneConditions ?? 'Boa'}</p>
                    </div>
                    <Droplets className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="rounded border border-slate-200 bg-white p-5 text-xs text-slate-600 italic">
                <Quote className="mb-2 h-4 w-4 text-slate-200" />
                <div>{formatValue(domicile.generalObservations)}</div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
