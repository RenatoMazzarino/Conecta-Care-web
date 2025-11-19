import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pill, Stethoscope, Activity, ShieldAlert, ExternalLink } from 'lucide-react';

const severityColor: Record<string, string> = {
  grave: 'bg-rose-50 text-rose-700 border-rose-100',
  moderada: 'bg-amber-50 text-amber-700 border-amber-100',
  leve: 'bg-sky-50 text-sky-700 border-sky-100',
};

export function TabClinical({ patient }: { patient: Patient }) {
  const summary = patient.clinicalSummary;
  const medications = patient.clinicalData?.medications ?? [];
  const alertBadges = [
    ...(summary?.allergies ?? []).map((allergy) => ({
      key: `allergy-${allergy.substance}`,
      label: `Alergia: ${allergy.substance}`,
      className: severityColor[allergy.severity] ?? 'bg-rose-50 text-rose-700 border-rose-100',
    })),
    ...(summary?.criticalMedications ?? []).map((med) => ({
      key: `med-${med.name}`,
      label: `Medicação crítica: ${med.name}`,
      className: 'bg-amber-50 text-amber-700 border-amber-100',
    })),
    ...(summary?.devicesActive ?? []).map((device) => ({
      key: `device-${device}`,
      label: `Dispositivo: ${device}`,
      className: 'bg-sky-50 text-sky-700 border-sky-100',
    })),
  ].slice(0, 6);

  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Última revisão clínica</p>
            <p className="text-base font-semibold text-foreground">
              {summary?.lastReview?.by ?? 'Equipe Conecta Care'}
            </p>
            <p className="text-sm text-muted-foreground">
              {summary?.lastReview?.date
                ? new Date(summary.lastReview.date).toLocaleDateString('pt-BR')
                : 'Data não registrada'}
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/patients/${patient.id}/profile`} aria-label="Abrir prontuário completo">
              <ExternalLink className="h-4 w-4" />
              Abrir prontuário completo
            </Link>
          </Button>
        </CardContent>
      </Card>
      {alertBadges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {alertBadges.map((badge) => (
            <Badge key={badge.key} variant="outline" className={badge.className}>
              {badge.label}
            </Badge>
          ))}
        </div>
      )}
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="h-5 w-5 text-primary" />
            Diagnóstico e riscos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Diagnóstico principal</p>
              <p className="text-lg font-semibold">{summary?.diagnosisPrimary?.name ?? 'Não informado'}</p>
              <p className="text-muted-foreground">CID {summary?.diagnosisPrimary?.cid ?? '—'}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Risco de quedas</p>
              <p className="text-lg font-semibold">
                {summary?.riskScores?.falls ? `${summary.riskScores.falls} pts` : 'Não informado'}
              </p>
              <p className="text-muted-foreground">{summary?.riskScores?.fallsLabel ?? '--'}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Escala Braden</p>
              <p className="text-lg font-semibold">
                {summary?.riskScores?.braden ? `${summary.riskScores.braden} pts` : 'Não informado'}
              </p>
              <p className="text-muted-foreground">{summary?.riskScores?.bradenLabel ?? '--'}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Oxigenoterapia</p>
              <p className="text-lg font-semibold">{summary?.oxygenTherapy?.active ? 'Ativa' : 'Inativa'}</p>
              {summary?.oxygenTherapy?.flow && (
                <p className="text-muted-foreground">Fluxo: {summary.oxygenTherapy.flow}</p>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-dashed bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Nota clínica</p>
            <p className="text-base text-foreground">
              {summary?.shortNote ?? 'Nenhuma observação registrada.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="h-5 w-5 text-accent-foreground" />
            Alergias e dispositivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">Alergias registradas</p>
            {summary?.allergies?.length ? (
              <div className="space-y-3">
                {summary.allergies.map((allergy) => (
                  <div key={allergy.substance} className="rounded-lg border bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{allergy.substance}</p>
                      <Badge
                        variant="outline"
                        className={severityColor[allergy.severity] ?? 'bg-slate-50 text-slate-600'}
                      >
                        {allergy.severity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">Reação: {allergy.reaction}</p>
                    <p className="text-xs text-muted-foreground">
                      Registrado em {new Date(allergy.recordedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma alergia cadastrada.</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-muted-foreground">Dispositivos ativos</p>
              <p className="text-sm text-foreground">
                {summary?.devicesActive?.length
                  ? summary.devicesActive.join(', ')
                  : 'Nenhum dispositivo informado'}
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-muted-foreground">Alertas críticos</p>
              <p className="text-sm text-foreground">
                {summary?.alerts?.length ? summary.alerts.map((a) => a.type).join(', ') : 'Sem alertas'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Pill className="h-5 w-5 text-primary" />
            Medicações e condutas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">Medicamentos críticos</p>
            {summary?.criticalMedications?.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {summary.criticalMedications.map((med) => (
                  <div key={med.name} className="rounded-lg border bg-white p-3 shadow-sm">
                    <p className="text-base font-semibold text-foreground">{med.name}</p>
                    <p className="text-muted-foreground">{med.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum medicamento crítico em destaque.</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">Prescrições em uso</p>
            {medications.length ? (
              <div className="overflow-hidden rounded-lg border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Medicamento</th>
                      <th className="px-4 py-3">Dosagem</th>
                      <th className="px-4 py-3">Frequência</th>
                      <th className="px-4 py-3">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((med) => (
                      <tr key={`${med.name}-${med.dosage}`} className="border-t">
                        <td className="px-4 py-3 font-medium text-foreground">{med.name}</td>
                        <td className="px-4 py-3">{med.dosage}</td>
                        <td className="px-4 py-3">{med.frequency}</td>
                        <td className="px-4 py-3 text-muted-foreground">{med.notes ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma prescrição registrada no prontuário.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Metadados clínicos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-muted-foreground">Última revisão</p>
            <p className="text-base font-semibold">{summary?.lastReview?.by ?? '—'}</p>
            <p className="text-muted-foreground">
              {summary?.lastReview?.date
                ? new Date(summary.lastReview.date).toLocaleDateString('pt-BR')
                : ''}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-muted-foreground">Atualizado em</p>
            <p className="text-base font-semibold">
              {patient.clinicalSummaryMeta?.lastUpdatedAt
                ? new Date(patient.clinicalSummaryMeta.lastUpdatedAt).toLocaleString('pt-BR')
                : '—'}
            </p>
            <p className="text-muted-foreground">
              {patient.clinicalSummaryMeta?.lastUpdatedBy ?? 'Equipe Conecta Care'}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-muted-foreground">Fonte de dados</p>
            <p className="text-base font-semibold">
              {patient.clinicalSummaryMeta?.source === 'prontuario' ? 'Prontuário' : 'Manual'}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-muted-foreground">Condição atual</p>
            <p className="text-base font-semibold">
              {summary?.shortNote ?? 'Plano assistencial estável.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
