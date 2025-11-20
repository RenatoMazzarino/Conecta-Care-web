'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { professionals } from '@/lib/data';
import { cn } from '@/lib/utils';

type VacancyContext = {
  shiftId: string;
  patientId: string;
  patientName: string;
  shiftType: 'day' | 'night';
  dayLabel: string;
  caution?: string;
  candidateCount?: number;
} | null;

type Candidate = ReturnType<typeof buildCandidateList>[number];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: VacancyContext;
};

export function VacancyManagerDialog({ open, onOpenChange, context }: Props) {
  const [tab, setTab] = React.useState<'staffing' | 'publish'>('publish');
  const [startTime, setStartTime] = React.useState('19:00');
  const [endTime, setEndTime] = React.useState('07:00');
  const [rate, setRate] = React.useState('150,00');
  const [bonus, setBonus] = React.useState('0,00');
  const [urgent, setUrgent] = React.useState(true);
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (!open || !context) return;
    setTab('publish');
    setNotes('');
    if (context.shiftType === 'day') {
      setStartTime('07:00');
      setEndTime('19:00');
    } else {
      setStartTime('19:00');
      setEndTime('07:00');
    }
  }, [open, context]);

  const candidates = React.useMemo(() => buildCandidateList(), []);

  async function handleAssign(candidate: Candidate) {
    if (!context) return;
    try {
      await fetch(`/api/shifts/${context.shiftId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: candidate.id,
          patientId: context.patientId,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      onOpenChange(false);
    }
  }

  async function handlePublish() {
    if (!context) return;
    try {
      await fetch(`/api/shifts/${context.shiftId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: context.patientId,
          startTime,
          endTime,
          rate,
          bonus,
          urgent,
          notes,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1520px] border border-slate-200 bg-white px-0 py-0 shadow-[0_32px_80px_-32px_rgba(15,43,69,0.45)]">
        <DialogHeader className="border-b border-slate-200 bg-[#0F2B45] px-6 py-5 text-left text-white">
          <DialogTitle className="text-2xl font-semibold">Gerenciar Cobertura</DialogTitle>
          {context && (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span className="inline-flex items-center gap-1">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold uppercase">
                  {context.patientName
                    .split(' ')
                    .slice(0, 2)
                    .map((value) => value[0])
                    .join('')}
                </span>
                {context.patientName}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{context.dayLabel || 'Hoje'}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="rounded-full border border-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {context.shiftType === 'day' ? 'Diurno' : 'Noturno'}
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="px-6 py-6">
          <Tabs value={tab} onValueChange={(value) => setTab(value as 'staffing' | 'publish')} className="w-full">
            <TabsList className="mb-4 border-b border-slate-200 bg-transparent">
              <TabsTrigger
                value="staffing"
                className="px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-[#D46F5D] data-[state=active]:text-[#0F2B45]"
              >
                Alocação Interna (Staffing)
              </TabsTrigger>
              <TabsTrigger
                value="publish"
                className="px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-[#D46F5D] data-[state=active]:text-[#0F2B45]"
              >
                Publicar Vaga (App)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="staffing" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F2B45]">Profissionais recomendados</h3>
                  <p className="text-sm text-slate-500">
                    Ordenados por match score (distância, histórico e qualificações clínicas).
                  </p>
                </div>
                {context?.candidateCount && (
                  <Badge className="bg-orange-100 text-orange-700">
                    {context.candidateCount} candidatos externos
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-[0_12px_24px_-10px_rgba(15,43,69,0.25)]"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border border-slate-200">
                        <AvatarImage src={candidate.avatarUrl} />
                        <AvatarFallback>{candidate.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-[#0F2B45]">{candidate.name}</p>
                        <p className="text-xs text-slate-500">{candidate.role}</p>
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-500">
                          <span className="rounded bg-slate-100 px-1.5">
                            Histórico {candidate.history} plantões
                          </span>
                          <span className="rounded bg-slate-100 px-1.5">{candidate.distance} km</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {candidate.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant="outline"
                              className="border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs text-slate-500">
                        <p className="font-semibold text-[#0F2B45]">Match {candidate.score}%</p>
                        <div className="mt-1 h-2 w-32 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${candidate.score}%` }} />
                        </div>
                      </div>
                      <Button className="bg-[#0F2B45] text-white hover:bg-[#143654]" onClick={() => handleAssign(candidate)}>
                        Selecionar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="publish">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#0F2B45] flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2B45]/10 text-xs font-bold text-[#0F2B45]">
                      1
                    </span>
                    Configurar oferta
                  </h3>

                  <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                    <Field label="Início" icon="clock">
                      <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </Field>
                    <Field label="Fim" icon="clock">
                      <Input value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </Field>
                    <div className="sm:col-span-2">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-slate-500">Valor da oferta</Label>
                        <span className="text-[10px] font-bold text-emerald-600">Margem OK</span>
                      </div>
                      <div className="mt-1 flex gap-2">
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                            R$
                          </span>
                          <Input className="pl-8 font-semibold" value={rate} onChange={(e) => setRate(e.target.value)} />
                        </div>
                        <button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                          + Adicional
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">Adicional / bônus</Label>
                      <Input className="mt-1" value={bonus} onChange={(e) => setBonus(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-rose-700 flex items-center gap-2">
                            Marcar como urgente
                          </p>
                          <p className="text-xs text-rose-500">
                            Dispara notificação push imediata (raio 10 km) para profissionais elegíveis.
                          </p>
                        </div>
                        <Switch checked={urgent} onCheckedChange={setUrgent} />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Observações da vaga
                      </Label>
                      <Textarea
                        className="mt-1 h-28 resize-none"
                        placeholder="Ex: Paciente acamado, família solicita uso de sapatilhas..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => onOpenChange(false)}>
                      Cancelar
                    </Button>
                    <Button
                      className={cn(
                        'text-white',
                        urgent ? 'bg-[#D46F5D] hover:bg-[#c35a48]' : 'bg-[#0F2B45] hover:bg-[#143654]'
                      )}
                      onClick={handlePublish}
                    >
                      Confirmar publicação
                    </Button>
                  </div>
                </div>

                <div className="relative flex items-center justify-center bg-slate-100">
                  <span className="absolute top-8 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[10px] font-semibold text-slate-500 shadow-sm">
                    Preview • App do Profissional
                  </span>
                  <MobilePreview
                    patientName={context?.patientName ?? 'Paciente'}
                    startTime={startTime}
                    endTime={endTime}
                    rate={rate}
                    bonus={bonus}
                    urgent={urgent}
                    shiftType={context?.shiftType ?? 'day'}
                    dayLabel={context?.dayLabel ?? ''}
                    notes={notes}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: React.ReactNode;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-[10px] font-bold uppercase text-slate-500">{label}</Label>
      <div className="relative mt-1">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <i className={`ph ph-${icon}`} />
          </span>
        )}
        <div className={icon ? 'pl-8' : ''}>{children}</div>
      </div>
    </div>
  );
}

function buildCandidateList() {
  return professionals.slice(0, 6).map((pro, index) => ({
    id: pro.id,
    name: pro.name,
    role: pro.role,
    avatarUrl: pro.avatarUrl,
    initials: pro.name
      .split(' ')
      .slice(0, 2)
      .map((value) => value[0])
      .join('')
      .toUpperCase(),
    badges: pro.specialties.slice(0, 3),
    history: 8 - index,
    distance: (index + 1) * 2,
    score: Math.max(60, 95 - index * 7),
  }));
}

function MobilePreview({
  patientName,
  startTime,
  endTime,
  rate,
  bonus,
  urgent,
  shiftType,
  dayLabel,
  notes,
}: {
  patientName: string;
  startTime: string;
  endTime: string;
  rate: string;
  bonus: string;
  urgent: boolean;
  shiftType: 'day' | 'night';
  dayLabel: string;
  notes: string;
}) {
  return (
    <div className="phone-shell relative h-[620px] w-[320px] rounded-lg bg-[#F2F2F7] shadow-[0_0_0_12px_#1C1C1E,0_22px_45px_10px_rgba(0,0,0,0.35)]">
      <div className="phone-notch absolute left-1/2 top-0 h-7 w-32 -translate-x-1/2 rounded-b-[16px] bg-[#1C1C1E]" />
      <div className="flex h-full flex-col rounded-lg overflow-hidden">
        <div className="bg-white px-5 pt-10 pb-4 shadow-sm">
          <button className="flex items-center gap-1 text-sm font-medium text-blue-600">
            <i className="ph ph-caret-left" /> Voltar
          </button>
          <h2 className="text-2xl font-bold text-slate-900">Detalhes da Vaga</h2>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#F2F2F7] pb-16">
          <div className="h-40 bg-slate-200 relative">
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-widest text-slate-500/70">
              Mapa Google Maps
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 animate-ping" />
            </div>
            <div className="absolute bottom-3 left-4 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow">
              Campinas/SP
            </div>
          </div>
          <div className="px-4 -mt-6 relative z-10 space-y-4">
            <div className="rounded-lg bg-white p-5 shadow">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Valor líquido</span>
                {urgent && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                    Urgente
                  </span>
                )}
              </div>
              <p className="mt-2 text-3xl font-bold text-emerald-600">R$ {rate}</p>
              {bonus !== '0,00' && (
                <p className="text-xs font-semibold text-emerald-600">+ R$ {bonus} bônus</p>
              )}
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-[#0F2B45]">
                    <i className="ph ph-calendar-blank" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Data</p>
                    <p className="font-semibold">{dayLabel || 'Hoje'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-[#0F2B45]">
                    <i className="ph ph-clock" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Horário</p>
                    <p className="font-semibold">
                      {startTime} às {endTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-5 shadow">
              <div className="text-xs font-semibold uppercase text-slate-500">Janela do plantão</div>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {shiftType === 'day' ? 'Plantão 07h-19h (12h)' : 'Plantão 19h-07h (12h)'}
              </p>
            </div>
            <div className="rounded-lg bg-white p-5 shadow">
              <h3 className="mb-3 font-bold text-slate-900">Sobre o paciente</h3>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600 font-bold">
                  {patientName
                    .split(' ')
                    .slice(0, 2)
                    .map((v) => v[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{patientName}</p>
                  <p className="text-xs text-slate-500">Alta complexidade</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  TQT
                </span>
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  GTT
                </span>
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  Acamado
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-white p-5 shadow">
              <h3 className="mb-2 font-bold text-slate-900">Observações</h3>
              <p className="text-sm text-slate-600">
                {notes || 'A família solicita uso de sapatilhas ao entrar no quarto. Necessário experiência com aspiração de TQT.'}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full rounded-b-lg border-t border-slate-200 bg-white px-4 py-4">
          <button className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-500/30">
            Aceitar plantão
          </button>
        </div>
      </div>
    </div>
  );
}
