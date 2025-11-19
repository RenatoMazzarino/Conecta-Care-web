'use client';

import * as React from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeftRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Moon,
  Plus,
  Sun,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ShiftMonitorSheet,
  type ShiftMonitorData,
  type ShiftMonitorNote,
  type ShiftMonitorTimelineEvent,
} from '@/components/shifts/ShiftMonitorSheet';
import { Badge } from '@/components/ui/badge';
import { VacancyManagerDialog } from '@/components/shifts/VacancyManagerDialog';

type WeekDay = {
  key: string;
  label: string;
  dateLabel: string;
  isToday: boolean;
  isWeekend: boolean;
  fullDate: Date;
};

type ScheduleSlotStatus =
  | 'completed'
  | 'live'
  | 'planned'
  | 'warning'
  | 'open'
  | 'open-candidates'
  | 'critical'
  | 'backup';

type ProfessionalRef = {
  name: string;
  role?: string;
  avatarUrl?: string;
  phone?: string;
};

type ScheduleSlot = {
  id: string;
  shiftType: 'day' | 'night';
  status: ScheduleSlotStatus;
  professional?: ProfessionalRef;
  checkIn?: string;
  candidateCount?: number;
  caution?: string;
};

type ScheduleRow = {
  id: string;
  patientId: string;
  patientName: string;
  contract: string;
  tags?: string[];
  badge: string;
  slots: Record<string, { day: ScheduleSlot; night: ScheduleSlot }>;
};

type VacancyContext = {
  shiftId: string;
  patientId: string;
  patientName: string;
  shiftType: 'day' | 'night';
  dayLabel: string;
  caution?: string;
  candidateCount?: number;
};

const STATUS_CLASSES: Record<ScheduleSlotStatus, string> = {
  completed: 'border-l-slate-400 text-slate-600 bg-white/80',
  live: 'border-l-emerald-500 ring-1 ring-emerald-100 text-slate-900',
  planned: 'border-l-blue-500 text-slate-800',
  warning: 'border-l-amber-500 bg-amber-50/70 text-amber-800',
  open: 'border-l-slate-300 bg-slate-50 text-slate-600',
  'open-candidates': 'border-l-orange-500 bg-orange-50/70 text-orange-700',
  critical: '',
  backup: 'border-l-slate-300 bg-white/40 text-slate-500',
};

const baseDayProfessional: ProfessionalRef = {
  name: 'Ana Silva',
  role: 'Téc. Enfermagem',
  phone: '+551199887766',
};

const baseNightProfessional: ProfessionalRef = {
  name: 'Carla Dias',
  role: 'Enfermeira',
  phone: '+551199881234',
};

export function ScheduleDashboard() {
  const [anchorDate, setAnchorDate] = React.useState(new Date(2025, 10, 19));
  const [monitorData, setMonitorData] = React.useState<ShiftMonitorData>();
  const [isMonitorOpen, setIsMonitorOpen] = React.useState(false);
  const [vacancyContext, setVacancyContext] = React.useState<VacancyContext | null>(null);

  const weekDays = React.useMemo(() => buildWeekDays(anchorDate), [anchorDate]);
  const rows = React.useMemo(() => createScheduleRows(weekDays), [weekDays]);
  const totals = React.useMemo(() => calculateTotals(rows, weekDays), [rows, weekDays]);

  function handleWeek(direction: 'prev' | 'next') {
    setAnchorDate((prev) => addDays(prev, direction === 'next' ? 7 : -7));
  }

  function handleSlotClick(
    slot: ScheduleSlot,
    patientName: string,
    patientId: string,
    day: WeekDay,
  ) {
    if (['live', 'planned', 'warning', 'completed'].includes(slot.status) && slot.professional) {
      setMonitorData(buildMonitorPayload(slot, patientName, day));
      setIsMonitorOpen(true);
      return;
    }
    if (['open', 'open-candidates', 'critical'].includes(slot.status)) {
      setVacancyContext({
        shiftId: slot.id,
        patientId,
        patientName,
        shiftType: slot.shiftType,
        dayLabel: `${day.label} ${day.dateLabel}`,
        caution: slot.caution,
        candidateCount: slot.candidateCount,
      });
    }
  }

  return (
    <div className="space-y-4 text-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Operação • Escala assistencial
          </p>
          <h1 className="text-3xl font-semibold text-[#0F2B45]">Central de Plantões</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => handleWeek('prev')}
            className="rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 px-3 text-sm font-semibold text-[#0F2B45]">
            <Calendar className="h-4 w-4" />
            <span>{format(anchorDate, "MMMM 'de' yyyy", { locale: ptBR })}</span>
            <span className="text-xs font-medium text-slate-400">
              • Semana {format(anchorDate, 'II')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleWeek('next')}
            className="rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <section className="sticky top-4 z-20 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <CommandBarButton icon={Plus} label="Nova Vaga" accent />
            <div className="h-5 w-px bg-slate-200" />
            <CommandBarButton icon={Users} label="Filtrar" />
            <CommandBarButton icon={ArrowLeftRight} label="Troca de Plantão" />
            <CommandBarButton icon={FileSpreadsheet} label="Exportar" />
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <LegendDot className="bg-emerald-500" label="Execução" />
            <LegendDot className="bg-blue-500" label="Previsto" />
            <LegendDot className="bg-amber-500" label="Atenção" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50/80 px-6 py-3 text-xs font-semibold text-slate-600 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <span>
            Total de plantões:{' '}
            <span className="text-base font-bold text-[#0F2B45]">{totals.total}</span>
          </span>
          <span>
            Cobertura real:{' '}
            <span className="text-base font-bold text-emerald-600">{totals.coverage}%</span>
          </span>
          <span>
            Vagas críticas:{' '}
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-base font-bold text-rose-600">
              {totals.critical}
            </span>
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,43,69,0.08)]">
        <div className="relative overflow-auto">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-[280px_repeat(7,minmax(0,1fr))] border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <div className="border-r border-slate-200 px-4 py-3">Paciente / Contrato</div>
              {weekDays.map((day) => (
                <div
                  key={day.key}
                  className={cn(
                    'border-r border-slate-200 px-3 py-2 text-center',
                    day.isToday && 'bg-blue-50 text-[#0F2B45] border-b-2 border-b-[#0F2B45]',
                   day.isWeekend && 'bg-slate-100'
                  )}
                >
                  {day.label}
                  <span className="block text-lg font-bold text-slate-400">
                    {day.dateLabel}
                  </span>
                </div>
              ))}
            </div>

            {rows.map((row) => (
              <div
                key={row.id}
                className="group grid grid-cols-[280px_repeat(7,minmax(0,1fr))] border-b border-slate-100 hover:bg-slate-50"
              >
                <div className="sticky left-0 z-10 flex items-center gap-3 border-r border-slate-100 bg-white px-4 py-3 shadow-[1px_0_0_rgba(226,232,240,1)]">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold',
                      row.badge
                    )}
                  >
                    {getInitials(row.patientName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F2B45]">{row.patientName}</p>
                    <p className="text-xs text-slate-500">{row.contract}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-slate-200 bg-slate-50 px-1.5 text-[10px] font-semibold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {weekDays.map((day) => {
                  const daySlots = row.slots[day.key];
                  return (
                    <div
                      key={`${row.id}-${day.key}`}
                      className={cn(
                        'border-r border-slate-100 p-1',
                        day.isWeekend && 'bg-slate-50/70'
                      )}
                    >
                      {renderSlotCard(daySlots.day, day, row.patientName, row.patientId, handleSlotClick)}
                      {renderSlotCard(daySlots.night, day, row.patientName, row.patientId, handleSlotClick)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ShiftMonitorSheet
        open={isMonitorOpen}
        onOpenChange={(open) => {
          setIsMonitorOpen(open);
          if (!open) {
            setMonitorData(undefined);
          }
        }}
        data={monitorData}
      />

      <VacancyManagerDialog
        open={Boolean(vacancyContext)}
        onOpenChange={(open) => {
          if (!open) setVacancyContext(null);
        }}
        context={vacancyContext}
      />
    </div>
  );
}

function renderSlotCard(
  slot: ScheduleSlot,
  day: WeekDay,
  patientName: string,
  patientId: string,
  onClick: (slot: ScheduleSlot, patientName: string, patientId: string, day: WeekDay) => void,
) {
  const baseIcon = slot.shiftType === 'day' ? Sun : Moon;
  const professionalName = slot.professional?.name ?? 'Folguista';
  const showAction = ['live', 'warning', 'open', 'open-candidates', 'critical'].includes(
    slot.status
  );
  const actionLabel =
    slot.status === 'live'
      ? 'Monitorar'
      : slot.status === 'critical'
        ? 'Alocar'
        : slot.status === 'warning'
          ? 'Resolver'
          : 'Gerenciar';

  return (
    <div
      className={cn(
        'space-y-1 rounded border bg-white px-3 py-2 text-left text-xs shadow-sm transition',
        'hover:-translate-y-0.5 hover:shadow-md',
        STATUS_CLASSES[slot.status]
      )}
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase">
        <span className="flex items-center gap-1">
          {React.createElement(baseIcon, { className: 'h-3 w-3 text-slate-500' })}
          {slot.shiftType === 'day' ? '07h-19h' : '19h-07h'}
        </span>
        {slot.checkIn && <span className="text-slate-400">Check-in {slot.checkIn}</span>}
        {slot.candidateCount && (
          <Badge
            variant="outline"
            className="border-orange-200 bg-orange-50 text-[9px] font-bold text-orange-700"
          >
            {slot.candidateCount} cand.
          </Badge>
        )}
      </div>
      <p className="text-sm font-semibold text-slate-800">
        {slot.status === 'open'
          ? 'Vaga aberta'
          : slot.status === 'open-candidates'
            ? 'Candidatos disponíveis'
            : slot.status === 'critical'
              ? 'Sem cobertura'
              : professionalName}
      </p>
      {slot.caution && (
        <p className="text-[10px] font-semibold text-amber-600">{slot.caution}</p>
      )}
      {showAction && (
        <button
          type="button"
          onClick={() => onClick(slot, patientName, patientId, day)}
          className={cn(
            'mt-1 w-full rounded border text-[11px] font-semibold transition',
            slot.status === 'live'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : slot.status === 'critical'
                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join('');
}

function buildWeekDays(anchor: Date): WeekDay[] {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    return {
      key: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE', { locale: ptBR }).toUpperCase().slice(0, 3),
      dateLabel: format(date, 'dd'),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      isWeekend: [0, 6].includes(date.getDay()),
      fullDate: date,
    };
  });
}

function createScheduleRows(days: WeekDay[]): ScheduleRow[] {
  const createSlots = (
    rowId: string,
    patterns: Array<Partial<{ day: Partial<ScheduleSlot>; night: Partial<ScheduleSlot> }>>,
  ) => {
    return Object.fromEntries(
      days.map((day, index) => {
        const pattern = patterns[index] ?? {};
        const daySlot: ScheduleSlot = {
          id: `${rowId}-${day.key}-day`,
          shiftType: 'day',
          status: pattern.day?.status ?? 'planned',
          professional:
            pattern.day?.status && ['open', 'open-candidates', 'critical'].includes(pattern.day.status)
              ? undefined
              : pattern.day?.professional ?? baseDayProfessional,
          checkIn: pattern.day?.checkIn,
          candidateCount: pattern.day?.candidateCount,
          caution: pattern.day?.caution,
        };

        const nightSlot: ScheduleSlot = {
          id: `${rowId}-${day.key}-night`,
          shiftType: 'night',
          status: pattern.night?.status ?? 'planned',
          professional:
            pattern.night?.status &&
            ['open', 'open-candidates', 'critical'].includes(pattern.night.status)
              ? undefined
              : pattern.night?.professional ?? baseNightProfessional,
          checkIn: pattern.night?.checkIn,
          candidateCount: pattern.night?.candidateCount,
          caution: pattern.night?.caution,
        };

        return [day.key, { day: daySlot, night: nightSlot }];
      }),
    );
  };

  return [
    {
      id: 'row-maria',
      patientId: 'patient-maria',
      patientName: 'Maria de Lourdes',
      contract: 'Unimed • Campinas',
      tags: ['TQT', 'GTT'],
      badge: 'bg-[#0F2B45]/10 text-[#0F2B45]',
      slots: createSlots('maria', [
        {
          day: { status: 'completed', professional: baseDayProfessional },
          night: { status: 'completed' },
        },
        {
          day: { status: 'live', checkIn: '07:05' },
          night: { status: 'warning', caution: 'Atraso confirmado' },
        },
        {
          day: { status: 'planned' },
          night: { status: 'open-candidates', candidateCount: 3 },
        },
        {
          day: { status: 'planned' },
          night: { status: 'critical' },
        },
        {
          day: { status: 'planned' },
          night: { status: 'planned' },
        },
        {
          day: {
            status: 'backup',
            professional: { name: 'Folguista A', role: 'Backup' },
          },
          night: { status: 'backup', professional: { name: 'Folguista B', role: 'Backup' } },
        },
        {
          day: { status: 'backup', professional: { name: 'Folguista A' } },
          night: { status: 'backup', professional: { name: 'Folguista B' } },
        },
      ]),
    },
    {
      id: 'row-joao',
      patientId: 'patient-joao',
      patientName: 'João da Silva',
      contract: 'Particular • Cuidador',
      tags: ['Home Care'],
      badge: 'bg-blue-100 text-blue-700',
      slots: createSlots('joao', [
        {
          day: { status: 'completed', professional: { name: 'Roberto', role: 'Cuidador' } },
          night: { status: 'completed', professional: { name: 'Família', role: 'Suporte' } },
        },
        {
          day: { status: 'live', professional: { name: 'Roberto', role: 'Cuidador' } },
          night: { status: 'planned', professional: { name: 'Família', role: 'Suporte' } },
        },
        {
          day: { status: 'planned', professional: { name: 'Roberto', role: 'Cuidador' } },
          night: { status: 'planned', professional: { name: 'Família' } },
        },
        {
          day: { status: 'planned', professional: { name: 'Roberto' } },
          night: { status: 'planned', professional: { name: 'Família' } },
        },
        {
          day: { status: 'planned', professional: { name: 'Roberto' } },
          night: { status: 'planned', professional: { name: 'Família' } },
        },
        {
          day: { status: 'backup', professional: { name: 'Folguista', role: 'Técnico' } },
          night: { status: 'backup', professional: { name: 'Família' } },
        },
        {
          day: { status: 'backup', professional: { name: 'Folguista', role: 'Técnico' } },
          night: { status: 'backup', professional: { name: 'Família' } },
        },
      ]),
    },
    {
      id: 'row-lucas',
      patientId: 'patient-lucas',
      patientName: 'Lucas Menezes',
      contract: 'Amil • São Paulo',
      tags: ['Alta complexidade'],
      badge: 'bg-emerald-100 text-emerald-700',
      slots: createSlots('lucas', [
        {
          day: { status: 'completed' },
          night: { status: 'completed' },
        },
        {
          day: { status: 'planned' },
          night: { status: 'planned' },
        },
        {
          day: { status: 'planned' },
          night: { status: 'warning', caution: 'Sem check-in' },
        },
        {
          day: { status: 'open' },
          night: { status: 'open-candidates', candidateCount: 2 },
        },
        {
          day: { status: 'live', checkIn: '07:02' },
          night: { status: 'planned' },
        },
        {
          day: { status: 'planned' },
          night: { status: 'planned' },
        },
        {
          day: { status: 'planned' },
          night: { status: 'planned' },
        },
      ]),
    },
  ];
}

function calculateTotals(rows: ScheduleRow[], days: WeekDay[]) {
  const total = rows.length * days.length * 2;
  let filled = 0;
  let critical = 0;

  rows.forEach((row) => {
    Object.values(row.slots).forEach(({ day, night }) => {
      [day, night].forEach((slot) => {
        if (!['open', 'open-candidates', 'critical'].includes(slot.status)) {
          filled += 1;
        }
        if (slot.status === 'critical') {
          critical += 1;
        }
      });
    });
  });

  const coverage = Math.round((filled / total) * 100);
  return { total, coverage, critical };
}

function buildMonitorPayload(
  slot: ScheduleSlot,
  patientName: string,
  day: WeekDay,
): ShiftMonitorData {
  const timeline: ShiftMonitorTimelineEvent[] = [
    {
      id: 'vitals',
      time: '20:30',
      title: 'Sinais vitais',
      description: 'Aferição de rotina concluída.',
      icon: Users,
      meta: ['PA 120/80', 'Sat 98%'],
    },
    {
      id: 'med',
      time: '20:00',
      title: 'Medicação',
      description: 'Dipirona 1g administrada via oral.',
      icon: Users,
    },
    {
      id: 'checkin',
      time: slot.checkIn ?? '19:05',
      title: 'Check-in validado',
      description: 'Entrada com reconhecimento facial.',
      icon: Calendar,
      tone: 'success',
    },
  ];

  const notes: ShiftMonitorNote[] = [
    {
      id: 'note-1',
      author: 'Mariana (Escalista)',
      timestamp: '19:15',
      message: 'Profissional notificou trânsito, atraso de 5 min.',
    },
    {
      id: 'note-2',
      author: 'Dr. Renato',
      timestamp: 'Ontem',
      message: 'Família solicitou evitar campainha após 20h.',
      variant: 'muted',
    },
  ];

  const shiftLabel = slot.shiftType === 'day' ? '07h-19h' : '19h-07h';
  return {
    shiftId: slot.id,
    patientName,
    professional: {
      name: slot.professional?.name ?? 'Profissional não definido',
      role: slot.professional?.role ?? 'Escala',
      avatarUrl: undefined,
      initials: getInitials(slot.professional?.name ?? 'ND'),
      phone: slot.professional?.phone ?? '',
      whatsapp: slot.professional?.phone,
      battery: 82,
      bleStatus: 'connected',
      gpsStatus: 'ok',
    },
    shiftWindow: {
      start: shiftLabel.split('-')[0] ?? '07h',
      end: shiftLabel.split('-')[1] ?? '19h',
      startedAt: slot.checkIn,
    },
    status: slot.status === 'live' ? 'Ao vivo' : 'Escalado',
    progress: slot.status === 'live' ? 37 : 12,
    reminder: `${day.label} ${day.dateLabel}`,
    checkInTime: slot.checkIn,
    auditBadges: [
      { id: 'facial', label: 'Facial', status: 'ok' },
      { id: 'gps', label: 'GPS', status: 'ok' },
    ],
    timeline,
    notes,
  };
}

function CommandBarButton({
  icon: Icon,
  label,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition',
        'hover:bg-slate-100 hover:text-[#0F2B45]',
        accent && 'text-[#D46F5D] font-bold'
      )}
    >
      <Icon className={cn('h-4 w-4', accent && 'text-[#D46F5D]')} />
      {label}
    </button>
  );
}

function LegendDot({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn('h-2 w-2 rounded-full', className)} />
      {label}
    </span>
  );
}
