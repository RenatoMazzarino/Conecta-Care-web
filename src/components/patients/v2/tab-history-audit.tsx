'use client';

import { useMemo, useState } from 'react';
import type { Patient, PatientAuditLog } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  DownloadSimple,
  Eye,
  PencilSimpleLine,
  ShieldCheck,
  UserSwitch,
  WarningCircle,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

type TabHistoryAuditProps = {
  patient: Patient;
};

const LOG_COLORS: Partial<Record<PatientAuditLog['type'], string>> = {
  view: 'text-sky-600',
  edit: 'text-indigo-600',
  export: 'text-emerald-600',
  download: 'text-emerald-600',
  status_change: 'text-amber-600',
};

const LOG_ICONS: Partial<Record<PatientAuditLog['type'], React.ElementType>> = {
  view: Eye,
  edit: PencilSimpleLine,
  export: DownloadSimple,
  download: DownloadSimple,
  status_change: UserSwitch,
};

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

const prettyValue = (value?: string) => {
  if (!value) return '—';
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

export function TabHistoryAudit({ patient }: TabHistoryAuditProps) {
  const combinedLogs = useMemo(() => {
    const logs = [...(patient.changeLog ?? []), ...(patient.accessLog ?? [])];
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [patient.changeLog, patient.accessLog]);

  const [visibleCount, setVisibleCount] = useState(12);
  const visibleLogs = combinedLogs.slice(0, visibleCount);
  const hasMore = visibleCount < combinedLogs.length;

  const { accessLogSummary, audit } = patient;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="lg:w-80 space-y-4">
        <Card className="shadow-fluent">
          <CardHeader>
            <CardTitle className="text-base">Atividade de Acesso</CardTitle>
            <CardDescription>Resumo rápido dos acessos ao prontuário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Visualizações totais</p>
              <p className="text-2xl font-semibold text-slate-900">
                {accessLogSummary?.totalViews ?? '—'}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3 space-y-1">
              <p className="text-xs uppercase text-slate-500">Último acesso</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatDateTime(accessLogSummary?.lastAccessAt)}
              </p>
              <p className="text-xs text-slate-500">
                Por {accessLogSummary?.lastAccessBy ?? 'Equipe Conecta Care'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-fluent">
          <CardHeader>
            <CardTitle className="text-base">Metadados de Auditoria</CardTitle>
            <CardDescription>Controle de criação e última atualização.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Criado em</p>
              <p className="font-semibold text-slate-900">{formatDateTime(audit.createdAt)}</p>
              <p className="text-xs text-slate-500">Por {audit.createdBy}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase text-slate-500">Atualizado em</p>
              <p className="font-semibold text-slate-900">{formatDateTime(audit.updatedAt)}</p>
              <p className="text-xs text-slate-500">Por {audit.updatedBy}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <Card className="shadow-fluent h-full">
          <CardHeader>
            <CardTitle className="text-lg">Linha do tempo unificada</CardTitle>
            <CardDescription>
              Eventos de visualização, edição e exportação consolidados em ordem cronológica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {visibleLogs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                <WarningCircle size={28} />
                Nenhum log registrado para este paciente.
              </div>
            ) : (
              <div className="relative border-l border-slate-200 pl-8">
                {visibleLogs.map((log, index) => {
                  const Icon =
                    LOG_ICONS[log.type] ??
                    (log.type === 'view' ? Eye : log.type === 'edit' ? PencilSimpleLine : WarningCircle);
                  const tone = LOG_COLORS[log.type] ?? 'text-slate-600';
                  const isCritical = log.type === 'export' || log.type === 'download';
                  const isDanger = log.type === 'status_change' && log.action?.toLowerCase().includes('exclus');
                  const reason =
                    typeof log.meta?.reason === 'string' ? log.meta.reason : (log.meta as any)?.motivo;

                  return (
                    <div
                      key={`${log.id}-${index}`}
                      className={cn(
                        'relative pb-10 last:pb-0',
                        isCritical && 'before:bg-emerald-100',
                        isDanger && 'before:bg-rose-100'
                      )}
                    >
                      <span className="absolute -left-[44px] top-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                        <Icon size={18} className={tone} />
                      </span>
                      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              log.type === 'edit' && 'border-indigo-200 bg-indigo-50 text-indigo-700',
                              log.type === 'view' && 'border-sky-200 bg-sky-50 text-sky-700',
                              (log.type === 'export' || log.type === 'download') &&
                                'border-emerald-200 bg-emerald-50 text-emerald-800',
                              log.type === 'status_change' && 'border-amber-200 bg-amber-50 text-amber-800'
                            )}
                          >
                            {log.type === 'view'
                              ? 'Visualização'
                              : log.type === 'edit'
                                ? 'Edição'
                                : log.type === 'export'
                                  ? 'Exportação'
                                  : log.type === 'download'
                                    ? 'Download'
                                    : 'Evento'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(log.timestamp)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            IP {log.ip ?? (log.meta as any)?.ip ?? '—'}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-800">
                          {log.action} • Usuário {log.userId}{' '}
                          {log.userRole ? `(${log.userRole})` : ''} via {log.origin}
                        </p>

                        {reason && (
                          <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-1 text-xs text-amber-800">
                            <ShieldCheck size={14} />
                            Motivo: {reason}
                          </div>
                        )}

                        {log.type === 'edit' && (log.oldValue || log.newValue) && (
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                              <p className="text-xs font-semibold text-slate-500">Antes</p>
                              <pre className="mt-2 max-h-40 overflow-auto text-xs text-slate-600">
                                {prettyValue(log.oldValue)}
                              </pre>
                            </div>
                            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                              <p className="text-xs font-semibold text-emerald-700">Depois</p>
                              <pre className="mt-2 max-h-40 overflow-auto text-xs text-emerald-800">
                                {prettyValue(log.newValue)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {log.meta && (log.meta as any)?.details && (
                          <div className="mt-3 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                            {(log.meta as any).details}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={() => setVisibleCount((count) => count + 10)}>
                  <Clock size={16} className="mr-2" />
                  Carregar mais
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
