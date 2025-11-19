import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CalendarCheck2, ClipboardList, Shield, Brain, Link2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

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

const alertSeverity: Record<string, string> = {
  CRITICAL: 'bg-rose-50 text-rose-700 border-rose-100',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-100',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-100',
  LOW: 'bg-slate-50 text-slate-600 border-slate-200',
};

export function TabGeneral({ patient }: { patient: Patient }) {
  const summary = patient.clinicalSummary;
  const alerts = summary?.alerts ?? [];
  const smartFields = patient.smartFields;
  const operationalLinks = patient.operationalLinks;
  const accessSummary = patient.accessLogSummary;
  const recordStatus = patient.recordStatus;
  const copyProtocolLink = (url: string) => {
    trackEvent({
      eventName: 'patient_protocol_link_copied',
      properties: { patientId: patient.id, url },
    });
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const overview = [
    { label: 'Status', value: patient.adminData.status },
    { label: 'Tipo de admissão', value: patient.adminData.admissionType ?? 'Não informado' },
    { label: 'Complexidade', value: patient.adminData.complexity },
    { label: 'Pacote', value: patient.adminData.servicePackage },
    { label: 'Operação', value: patient.adminData.operationArea ?? 'Não informado' },
    { label: 'Origem', value: patient.adminData.admissionSource ?? 'Não informado' },
    { label: 'Frequência', value: patient.adminData.frequency ?? 'Não informado' },
    { label: 'Última auditoria', value: formatDateTime(patient.adminData.lastAuditDate) },
    {
      label: 'Acessos',
      value: accessSummary ? `${accessSummary.totalViews} visualizações` : 'Sem registros',
    },
  ];

  const timeline = [
    {
      title: 'Início do cuidado',
      date: patient.adminData.startDate,
      description: patient.adminData.admissionSource ?? 'Fluxo interno',
    },
    {
      title: 'Última visita registrada',
      date: patient.last_visit_date,
      description: 'Equipe Conecta Care',
    },
    {
      title: 'Próxima visita planejada',
      date: patient.next_visit_date,
      description: patient.adminData.frequency,
    },
    {
      title: 'Última auditoria',
      date: patient.adminData.lastAuditDate,
      description: patient.adminData.lastAuditBy ?? 'Supervisão',
    },
    {
      title: 'Atualização cadastral',
      date: patient.audit.updatedAt,
      description: `Por ${patient.audit.updatedBy}`,
    },
  ].filter((item) => !!item.date);

  return (
    <div className="space-y-6">
      {recordStatus && recordStatus !== 'active' && (
        <Alert className="border-amber-200 bg-amber-50 shadow-fluent">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <AlertTitle className="text-amber-900">Atenção</AlertTitle>
          <AlertDescription className="text-amber-900">
            {recordStatus === 'deceased'
              ? 'Paciente marcado como óbito. Observe políticas de retenção.'
              : 'Registro inativo. Revise antes de editar.'}
          </AlertDescription>
        </Alert>
      )}
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Resumo operacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {overview.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm"
              >
                <p className="text-muted-foreground">{item.label}</p>
                <p className="text-base font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {patient.riskFlags?.length ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-4 shadow-fluent text-sm">
          <p className="text-rose-900 font-semibold mb-2">Flags de risco</p>
          <div className="flex flex-wrap gap-2">
            {patient.riskFlags.map((flag) => (
              <Badge key={flag} variant="destructive" className="text-xs">
                {flag}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-fluent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-accent-foreground" />
              Alertas assistenciais
              <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
                {alerts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum alerta ativo para este paciente.</p>
            ) : (
              <ul className="space-y-3">
                {alerts.map((alert, index) => (
                  <li
                    key={`${alert.message}-${index}`}
                    className="rounded-lg border bg-card px-4 py-3 text-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={alertSeverity[alert.severity] ?? 'bg-slate-50 text-slate-600'}
                      >
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Revisado {formatDateTime(summary?.lastReview?.date)}
                      </span>
                    </div>
                    <p className="mt-2 font-medium text-foreground">{alert.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-fluent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarCheck2 className="h-5 w-5 text-primary" />
              Linha do tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 border-l border-border pl-4">
              {timeline.map((entry) => (
                <li key={entry.title} className="relative text-sm">
                  <span className="absolute -left-[0.65rem] mt-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{entry.title}</p>
                  <p className="text-base font-semibold text-foreground">{formatDateTime(entry.date)}</p>
                  <p className="text-muted-foreground">{entry.description}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {(smartFields || operationalLinks) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {smartFields && (
            <Card className="shadow-fluent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  Insights inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    key: 'readmission',
                    title: 'Risco de Reinternação',
                    data: smartFields.readmissionRiskScore,
                  },
                  {
                    key: 'adherence',
                    title: 'Adesão ao plano',
                    data: smartFields.careAdherenceScore,
                  },
                  {
                    key: 'family',
                    title: 'Satisfação familiar',
                    data: smartFields.familySatisfactionScore,
                  },
                  {
                    key: 'incidents',
                    title: 'Ocorrências (30 dias)',
                    incidents: smartFields.incidentsLast30Days,
                  },
                ]
                  .filter((item) => item.data || item.incidents)
                  .map((item) => (
                    <div key={item.key} className="rounded-lg border bg-white p-4 shadow-sm">
                      <p className="text-muted-foreground">{item.title}</p>
                      {item.data ? (
                        <>
                          <p className="text-2xl font-semibold text-foreground">
                            {item.data.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Valor: {item.data.value.toFixed(2)}
                            {item.data.lastUpdatedAt
                              ? ` • Atualizado ${formatDateTime(item.data.lastUpdatedAt)}`
                              : ''}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-semibold text-foreground">
                          {item.incidents?.count ?? 0}
                        </p>
                      )}
                      {item.incidents?.lastIncidentAt && (
                        <p className="text-xs text-muted-foreground">
                          Último incidente em {item.incidents.lastIncidentAt}
                        </p>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {operationalLinks && (
            <Card className="shadow-fluent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Link2 className="h-5 w-5 text-primary" />
                  Integrações operacionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { label: 'Contrato', value: operationalLinks.contractId },
                  { label: 'Escala', value: operationalLinks.rosterId },
                  { label: 'Estoque', value: operationalLinks.inventoryId },
                  { label: 'Protocolo público', value: operationalLinks.publicProtocolUrl },
                  { label: 'Logs de acesso', value: operationalLinks.accessLogRef },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
                    >
                      <span className="text-muted-foreground">{item.label}</span>
                      {item.value?.startsWith('http') ? (
                        <a
                          href={item.value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-primary hover:underline"
                          onClick={() =>
                            trackEvent({
                              eventName: 'patient_operational_link_opened',
                              properties: { patientId: patient.id, type: item.label },
                            })
                          }
                        >
                          Abrir
                        </a>
                      ) : (
                        <span className="font-semibold text-foreground">{item.value}</span>
                      )}
                    </div>
                  ))}
                {operationalLinks.publicProtocolUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyProtocolLink(operationalLinks.publicProtocolUrl!)}
                  >
                    Copiar link do protocolo
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-fluent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Notas rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Resumo clínico:</p>
              <p className="rounded-lg border border-dashed border-accent/40 bg-accent/10 p-3 text-foreground">
                {summary?.shortNote ?? 'Sem observações clínicas registradas.'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Notas internas / Operação:</p>
              <p className="rounded-lg border border-dashed border-border bg-muted/50 p-3 text-foreground">
                {patient.adminData.notesInternal ?? 'Sem notas internas.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-fluent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Auditoria e Consentimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-white p-3">
                <p className="text-muted-foreground">Consentimento LGPD</p>
                <p className="text-base font-semibold">
                  {patient.consent_status === 'ok' ? 'Atualizado' : 'Pendente'}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-3">
                <p className="text-muted-foreground">Docs pendentes</p>
                <p className="text-base font-semibold">{patient.pending_documents}</p>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="text-muted-foreground">Criação</p>
              <p className="text-foreground">
                {formatDateTime(patient.audit.createdAt, true)} por {patient.audit.createdBy}
              </p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="text-muted-foreground">Última atualização</p>
              <p className="text-foreground">
                {formatDateTime(patient.audit.updatedAt, true)} por {patient.audit.updatedBy}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
