'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BatteryMedium,
  BluetoothConnected,
  CalendarBlank as Calendar,
  CellSignalFull as Signal,
  ChatCenteredText as MessageSquare,
  ChatCircle as MessageCircle,
  FileText,
  MapPin,
  NotePencil as NotebookPen,
  Phone,
  ShieldCheck,
  Warning as Activity,
} from '@phosphor-icons/react';

export type ShiftMonitorTimelineEvent = {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  meta?: string[];
  tone?: 'default' | 'success' | 'warning';
};

export type ShiftMonitorNote = {
  id: string;
  author: string;
  timestamp: string;
  message: string;
  variant?: 'default' | 'muted';
};

export type ShiftMonitorData = {
  shiftId: string;
  patientName: string;
  professional: {
    name: string;
    role: string;
    avatarUrl?: string;
    initials: string;
    phone: string;
    whatsapp?: string;
    bleStatus?: 'connected' | 'disconnected';
    gpsStatus?: 'ok' | 'pending';
    battery?: number;
  };
  shiftWindow: {
    start: string;
    end: string;
    startedAt?: string;
  };
  status?: string;
  progress: number;
  reminder?: string;
  checkInTime?: string;
  auditBadges?: Array<{ id: string; label: string; status: 'ok' | 'pending'; value?: string }>;
  timeline: ShiftMonitorTimelineEvent[];
  notes: ShiftMonitorNote[];
};

type ShiftMonitorSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ShiftMonitorData;
  onCreateInternalNote?: (note: string) => void;
};

const toneStyles: Record<
  NonNullable<ShiftMonitorTimelineEvent['tone']>,
  string
> = {
  default: 'bg-white border border-slate-200 text-slate-700',
  success: 'bg-green-50 border border-green-100 text-green-800',
  warning: 'bg-amber-50 border border-amber-100 text-amber-800',
};

export function ShiftMonitorSheet({
  open,
  onOpenChange,
  data,
  onCreateInternalNote,
}: ShiftMonitorSheetProps) {
  const [activeTab, setActiveTab] = React.useState<'timeline' | 'notes'>(
    'timeline'
  );
  const [noteValue, setNoteValue] = React.useState('');
  const [localNotes, setLocalNotes] = React.useState<ShiftMonitorNote[]>([]);

  React.useEffect(() => {
    if (open) {
      setActiveTab('timeline');
      setNoteValue('');
      setLocalNotes(data?.notes ?? []);
    }
  }, [open, data]);

  const hasData = Boolean(data);

  const timeline = data?.timeline ?? [];
  const notes = localNotes.length ? localNotes : data?.notes ?? [];

  function handleSubmitNote() {
    if (!noteValue.trim()) return;
    const newNote: ShiftMonitorNote = {
      id: `local-${Date.now()}`,
      author: 'Você',
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      message: noteValue.trim(),
    };
    setLocalNotes((prev) => [newNote, ...prev]);
    onCreateInternalNote?.(noteValue.trim());
    setNoteValue('');
  }

  // Polling example for telemetry updates (battery/progress)
  React.useEffect(() => {
    if (!open || !data?.shiftId) return;
    let isCancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/shifts/${data.shiftId}/telemetry`);
        if (!res.ok) return;
        const payload = await res.json();
        if (isCancelled) return;
        if (payload?.battery) {
          setLocalNotes((prev) => prev);
        }
      } catch {
        // Silencia erros em ambientes onde o endpoint ainda não existe.
      }
    };

    poll();
    const timer = setInterval(poll, 15000);
    return () => {
      isCancelled = true;
      clearInterval(timer);
    };
  }, [open, data?.shiftId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-[1200px] gap-0 border-none bg-[#F8FAFC] p-0 shadow-[ -4px_0_24px_rgba(15,43,69,0.15)]"
      >
        {!hasData ? (
          <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500">
            Selecione um plantão em execução para abrir o monitor.
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-hidden">
            <header className="flex flex-col gap-4 border-b border-white/20 bg-[#0F2B45] px-6 pb-16 pt-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Em andamento
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-[10px] text-white/70">
                    Iniciado às {data?.shiftWindow.startedAt ?? data?.shiftWindow.start}
                  </span>
                </div>
                <div className="flex gap-1 rounded-lg border border-white/20 bg-white/10 p-1">
                  <MonitorActionButton
                    icon={MessageSquare}
                    label="Chat interno"
                  />
                  <MonitorActionButton icon={MessageCircle} label="WhatsApp" />
                  <MonitorActionButton icon={Phone} label="Ligar" />
                  <div className="mx-1 w-px bg-white/30" />
                  <MonitorActionButton icon={NotebookPen} label="Tarefa" />
                  <MonitorActionButton icon={FileText} label="Prontuário" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-emerald-400 shadow-lg">
                    <AvatarImage src={data?.professional.avatarUrl} />
                    <AvatarFallback>{data?.professional.initials}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                    <BluetoothConnected className="h-3 w-3" /> BLE
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/70">
                    {data?.professional.role}
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    {data?.professional.name}
                  </h2>
                  <p className="text-sm text-white/70">
                    Paciente:{' '}
                    <span className="font-semibold text-white">
                      {data?.patientName}
                    </span>
                  </p>
                </div>
                <div className="ml-auto text-right text-xs text-white/70">
                  <div className="flex items-center justify-end gap-1">
                    <Calendar className="h-3.5 w-3.5 text-white/60" />
                    <span>
                      {data?.shiftWindow.start} • {data?.shiftWindow.end}
                    </span>
                  </div>
                  {data?.status && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                      <Signal className="h-3 w-3" /> {data.status}
                    </span>
                  )}
                </div>
              </div>
            </header>

            <div className="px-6 -mt-10 relative z-10">
              <div className="rounded-lg border border-slate-200 bg-white shadow-[0_8px_24px_-8px_rgba(15,43,69,0.2)]">
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 uppercase">
                      Progresso do turno
                    </span>
                    <span className="text-base font-semibold text-[#0F2B45]">
                      {Math.round(data?.progress ?? 0)}%
                    </span>
                  </div>
                  <div className="relative h-2.5 rounded-full bg-slate-100">
                    <div
                      className="absolute inset-y-0 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(data?.progress ?? 0, 100)}%` }}
                    />
                    <div
                      className="absolute -top-8 left-0 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] font-medium text-white shadow-lg transition-all duration-150"
                      style={{
                        left: `${Math.min(data?.progress ?? 0, 100)}%`,
                      }}
                    >
                      Faltam {calculateRemainingTime(data)}h
                      <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-800" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>{data?.shiftWindow.start}</span>
                    <span>{data?.shiftWindow.end}</span>
                  </div>
                </div>
                <div className="border-t border-slate-200">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-1 text-[#0F2B45] shadow-sm">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        Auditoria de segurança
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] font-bold uppercase text-emerald-700">
                          Check-in validado
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 transition group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="grid gap-6 border-t border-slate-100 bg-white px-4 py-4 text-xs text-slate-600 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Entrada ({data?.checkInTime ?? '19:05'})
                        </p>
                        <AuditRow icon={Activity} label="Facial" status="OK" />
                        <AuditRow icon={MapPin} label="GPS" status="OK" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Permanência
                        </p>
                        <AuditRow icon={BluetoothConnected} label="Beacon" status="Conectado" />
                        <AuditRow
                          icon={BatteryMedium}
                          label="Bateria"
                          status={`${data?.professional.battery ?? 82}%`}
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col">
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as 'timeline' | 'notes')}
                className="w-full"
              >
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-[#F8FAFC] px-6">
                  <TabsList className="bg-transparent p-0">
                    <TabsTrigger
                      value="timeline"
                      className={cn(
                        'rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-semibold text-slate-500',
                        activeTab === 'timeline'
                          ? 'border-[#D46F5D] text-[#0F2B45]'
                          : 'hover:border-slate-200 hover:text-slate-700'
                      )}
                    >
                      Linha do tempo
                    </TabsTrigger>
                    <TabsTrigger
                      value="notes"
                      className={cn(
                        'rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-semibold text-slate-500',
                        activeTab === 'notes'
                          ? 'border-[#D46F5D] text-[#0F2B45]'
                          : 'hover:border-slate-200 hover:text-slate-700'
                      )}
                    >
                      Anotações internas
                      <Badge
                        variant="outline"
                        className="ml-2 border-amber-200 bg-amber-50 text-[10px] font-semibold uppercase text-amber-700"
                      >
                        {notes.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="timeline" className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="relative space-y-6 pl-6">
                    <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-200" />
                    {timeline.map((event) => (
                      <div key={event.id} className="relative pl-8">
                        <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0F2B45] shadow-sm">
                          <event.icon className="h-4 w-4" />
                        </div>
                        <div
                          className={cn(
                            'rounded-lg border bg-white p-4 shadow-sm',
                            toneStyles[event.tone ?? 'default']
                          )}
                        >
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#0F2B45]">
                              {event.title}
                            </span>
                            <span className="text-slate-400">{event.time}</span>
                          </div>
                          <p className="text-sm">{event.description}</p>
                          {event.meta && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {event.meta.map((meta) => (
                                <Badge
                                  key={meta}
                                  variant="outline"
                                  className="border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-600"
                                >
                                  {meta}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-amber-700">
                        <NotebookPen className="h-4 w-4" />
                        Nova observação
                      </p>
                      <Textarea
                        placeholder="Digite uma orientação para a equipe de escala..."
                        value={noteValue}
                        onChange={(event) => setNoteValue(event.target.value)}
                        className="min-h-[100px] border-amber-200 bg-white text-sm text-slate-700"
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          className="bg-amber-600 text-white hover:bg-amber-700"
                          onClick={handleSubmitNote}
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className={cn(
                            'rounded-lg border p-4 shadow-sm',
                            note.variant === 'muted'
                              ? 'border-slate-100 bg-slate-50 text-slate-500'
                              : 'border-slate-200 bg-white text-slate-700'
                          )}
                        >
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold uppercase text-slate-600">
                              {note.author}
                            </span>
                            <span>{note.timestamp}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{note.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function MonitorActionButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/20"
      title={label}
      type="button"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function AuditRow({
  icon: Icon,
  label,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-600">
      <span className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        {label}
      </span>
      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
        {status}
      </span>
    </div>
  );
}

function calculateRemainingTime(data?: ShiftMonitorData) {
  if (!data?.progress) return '--';
  const remaining = Math.max(0, 100 - data.progress);
  const totalHours = (remaining / 100) * 12;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours.toString().padStart(2, '0')}h ${minutes
    .toString()
    .padStart(2, '0')}m`;
}
