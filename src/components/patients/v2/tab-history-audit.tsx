'use client';

import * as React from 'react';

import type { Patient } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  History,
  Shield,
  FileText,
  Download,
  Filter,
  Eye,
  PencilLine,
  FileDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

const EVENT_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  view: { label: 'Visualização', icon: Eye },
  edit: { label: 'Edição', icon: PencilLine },
  export: { label: 'Exportação', icon: FileDown },
  download: { label: 'Download', icon: Download },
  login_as_family: { label: 'Login Familiar', icon: History },
  status_change: { label: 'Alteração de status', icon: Shield },
};

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

const typeFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'view', label: 'Visualizações' },
  { value: 'edit', label: 'Edições' },
  { value: 'export', label: 'Exportações' },
  { value: 'download', label: 'Downloads' },
  { value: 'status_change', label: 'Status' },
];

export function TabHistoryAudit({ patient }: { patient: Patient }) {
  const combinedLogs = React.useMemo(() => {
    const logs = [...(patient.changeLog ?? []), ...(patient.accessLog ?? [])];
    return logs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [patient.changeLog, patient.accessLog]);

  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [userFilter, setUserFilter] = React.useState('');

  const filteredLogs = React.useMemo(
    () =>
      combinedLogs.filter((log) => {
        const matchesType = typeFilter === 'all' || log.type === typeFilter;
        const matchesUser =
          userFilter.trim() === '' ||
          log.userId.toLowerCase().includes(userFilter.toLowerCase()) ||
          log.userRole.toLowerCase().includes(userFilter.toLowerCase());
        return matchesType && matchesUser;
      }),
    [combinedLogs, typeFilter, userFilter]
  );

  const metrics = {
    totalAccess: combinedLogs.length,
    edits: combinedLogs.filter((log) => log.type === 'edit').length,
    exports: combinedLogs.filter((log) => log.type === 'export' || log.type === 'download')
      .length,
    lastAccess: combinedLogs[0]?.timestamp,
  };

  const handleExport = (mode: 'lgpd' | 'full') => {
    trackEvent({
      eventName: 'patient_audit_logs_export',
      properties: { patientId: patient.id, mode },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Histórico & Auditoria
          </CardTitle>
          <CardDescription>
            Rastreabilidade completa de acessos, edições e exportações conforme LGPD.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Eventos registrados</p>
            <p className="text-2xl font-semibold">{metrics.totalAccess}</p>
            <p className="text-xs text-muted-foreground">
              Último acesso em {formatDateTime(metrics.lastAccess)}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Edições</p>
            <p className="text-2xl font-semibold text-primary">{metrics.edits}</p>
            <p className="text-xs text-muted-foreground">Mudanças acompanhadas em tempo real</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Exportações / downloads</p>
            <p className="text-2xl font-semibold text-accent-foreground">
              {metrics.exports}
            </p>
            <p className="text-xs text-muted-foreground">PDFs, contratos e relatórios</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Auditoria</p>
            <p className="text-lg font-semibold">
              {patient.audit.updatedBy ?? 'Equipe Conecta Care'}
            </p>
            <p className="text-xs text-muted-foreground">
              Atualizado em {formatDateTime(patient.audit.updatedAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {typeFilters.map((filter) => (
          <Button
            key={filter.value}
            size="sm"
            variant={filter.value === typeFilter ? 'default' : 'outline'}
            className={cn(
              'rounded-full',
              filter.value === typeFilter
                ? 'bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground'
            )}
            onClick={() => setTypeFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Input
            placeholder="Filtrar por usuário ou função"
            value={userFilter}
            onChange={(event) => setUserFilter(event.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros avançados
          </Button>
        </div>
      </div>

      <Card className="shadow-fluent">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Relatórios LGPD
            </CardTitle>
            <CardDescription>
              Gere relatórios para resposta ao titular ou exporte o log completo para compliance.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleExport('lgpd')}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório do titular
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport('full')}>
              <Download className="mr-2 h-4 w-4" />
              Exportar logs
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="text-lg">Linha do tempo de eventos</CardTitle>
          <CardDescription>
            Visualize cada ação com detalhe de usuário, origem e campos alterados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum log encontrado para os filtros selecionados.
              </p>
            )}
            {filteredLogs.map((log) => {
              const Icon = EVENT_LABELS[log.type]?.icon ?? History;
              return (
                <div key={log.id} className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">
                      {EVENT_LABELS[log.type]?.label ?? log.type}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {log.userRole}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                  {log.action} • Usuário {log.userId} via {log.origin}
                    {log.ip ? ` (IP ${log.ip})` : ''}
                  </p>
                  {log.changedFields && log.changedFields.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {log.changedFields.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {log.meta && (
                    <pre className="mt-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                      {JSON.stringify(log.meta, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
