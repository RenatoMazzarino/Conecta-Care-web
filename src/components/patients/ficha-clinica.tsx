'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stethoscope, ShieldAlert, Pill, Activity, AlertTriangle, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FormField = ({
  label,
  children,
  className,
  labelClassName,
}: {
  label: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}) => (
  <div className={cn(className)}>
    <div className={cn('text-xs text-slate-600 mb-1', labelClassName)}>{label}</div>
    <div className="text-sm text-slate-900 flex flex-col gap-2">{children}</div>
  </div>
);

type Props = {
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: React.Dispatch<React.SetStateAction<Patient | null>>;
  isEditing: boolean;
};

const allergySeverityColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
  grave: 'destructive',
  moderada: 'secondary',
  leve: 'default',
};

const allergySeverityOptions = [
  { value: 'leve', label: 'Leve' },
  { value: 'moderada', label: 'Moderada' },
  { value: 'grave', label: 'Grave' },
];

const alertTypeOptions: Patient['clinicalSummary']['alerts'][number]['type'][] = ['ALERGIA', 'RISCO_QUEDA', 'MEDICAMENTO'];
const alertSeverityOptions: Patient['clinicalSummary']['alerts'][number]['severity'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export function FichaClinica({ displayData, editedData, setEditedData, isEditing }: Props) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const activeData = isEditing && editedData ? editedData : displayData;

  if (!activeData || !activeData.clinicalSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados clínicos</CardTitle>
          <CardDescription>Informações clínicas não disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Não há dados clínicos para este paciente.</p>
        </CardContent>
      </Card>
    );
  }

  const { clinicalSummary, clinicalSummaryMeta } = activeData;
  const medications = activeData.clinicalData?.medications ?? [];

  const updateSummary = (updater: (summary: Patient['clinicalSummary']) => void) => {
    setEditedData((prev) => {
      if (!prev || !prev.clinicalSummary) return prev;
      const next = structuredClone(prev);
      updater(next.clinicalSummary);
      return next;
    });
  };

  const updateClinicalData = (updater: (data: NonNullable<Patient['clinicalData']>) => void) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.clinicalData = next.clinicalData ?? { medications: [] };
      updater(next.clinicalData);
      return next;
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      title: 'Sincronizando dados...',
      description: 'Buscando as informações mais recentes do prontuário eletrônico.',
    });
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: 'Resumo clínico atualizado',
        description: 'Os dados foram sincronizados com sucesso.',
      });
    }, 1500);
  };

  const handleDevicesChange = (value: string) => {
    const devices = value
      .split('\n')
      .map((device) => device.trim())
      .filter(Boolean);
    updateSummary((summary) => {
      summary.devicesActive = devices;
    });
  };

  const handleOxygenToggle = (value: string) => {
    updateSummary((summary) => {
      summary.oxygenTherapy.active = value === 'true';
      if (!summary.oxygenTherapy.active) {
        summary.oxygenTherapy.flow = undefined;
      }
    });
  };

  const handleOxygenFlow = (value: string) => {
    updateSummary((summary) => {
      summary.oxygenTherapy.flow = value;
    });
  };

  const handleRiskScoreChange = (field: 'falls' | 'braden', value: string) => {
    updateSummary((summary) => {
      summary.riskScores[field] = value === '' ? undefined : Number(value);
    });
  };

  const handleRiskLabelChange = (field: 'fallsLabel' | 'bradenLabel', value: string) => {
    updateSummary((summary) => {
      summary.riskScores[field] = value;
    });
  };

  const handleDiagnosisChange = (field: 'name' | 'cid', value: string) => {
    updateSummary((summary) => {
      summary.diagnosisPrimary[field] = value;
    });
  };

  const handleAllergyChange = (index: number, field: keyof Patient['clinicalSummary']['allergies'][number], value: string) => {
    updateSummary((summary) => {
      summary.allergies[index] = { ...summary.allergies[index], [field]: value };
    });
  };

  const addAllergy = () => {
    updateSummary((summary) => {
      summary.allergies.push({
        substance: '',
        severity: 'leve',
        reaction: '',
        recordedAt: new Date().toISOString(),
      });
    });
  };

  const removeAllergy = (index: number) => {
    updateSummary((summary) => {
      summary.allergies.splice(index, 1);
    });
  };

  const handleCriticalMedicationChange = (
    index: number,
    field: keyof Patient['clinicalSummary']['criticalMedications'][number],
    value: string,
  ) => {
    updateSummary((summary) => {
      summary.criticalMedications[index] = { ...summary.criticalMedications[index], [field]: value };
    });
  };

  const addCriticalMedication = () => {
    updateSummary((summary) => {
      summary.criticalMedications.push({ name: '', note: '' });
    });
  };

  const removeCriticalMedication = (index: number) => {
    updateSummary((summary) => {
      summary.criticalMedications.splice(index, 1);
    });
  };

  const handleShortNoteChange = (value: string) => {
    updateSummary((summary) => {
      summary.shortNote = value;
    });
  };

  const handleLastReviewChange = (field: 'date' | 'by', value: string) => {
    updateSummary((summary) => {
      if (field === 'date') {
        summary.lastReview.date = value ? new Date(value).toISOString() : summary.lastReview.date;
      } else {
        summary.lastReview.by = value;
      }
    });
  };

  const handleAlertChange = (
    index: number,
    field: keyof Patient['clinicalSummary']['alerts'][number],
    value: string,
  ) => {
    updateSummary((summary) => {
      summary.alerts[index] = { ...summary.alerts[index], [field]: value as never };
    });
  };

  const addAlert = () => {
    updateSummary((summary) => {
      summary.alerts.push({
        type: 'ALERGIA',
        message: '',
        severity: 'MEDIUM',
      });
    });
  };

  const removeAlert = (index: number) => {
    updateSummary((summary) => {
      summary.alerts.splice(index, 1);
    });
  };

  const handleMedicationChange = (
    index: number,
    field: keyof NonNullable<NonNullable<Patient['clinicalData']>['medications']>[number],
    value: string,
  ) => {
    updateClinicalData((data) => {
      data.medications = [...(data.medications ?? [])];
      data.medications[index] = { ...data.medications[index], [field]: value };
    });
  };

  const addMedication = () => {
    updateClinicalData((data) => {
      data.medications = [...(data.medications ?? []), { name: '', dosage: '', frequency: '', notes: '' }];
    });
  };

  const removeMedication = (index: number) => {
    updateClinicalData((data) => {
      data.medications = (data.medications ?? []).filter((_, i) => i !== index);
    });
  };

  const toDateInputValue = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-semibold">Resumo clínico</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Última atualização em {new Date(clinicalSummaryMeta.lastUpdatedAt).toLocaleString('pt-BR')} por{' '}
            {clinicalSummaryMeta.lastUpdatedBy} (via {clinicalSummaryMeta.source})
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar do prontuário'}
        </Button>
      </div>

      {clinicalSummary.alerts.length > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="h-4 w-4 !text-red-800" />
          <AlertTitle>Alertas críticos</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
              {clinicalSummary.alerts.map((alert, i) => (
                <li key={`${alert.type}-${i}`}>
                  <strong>{alert.type}:</strong> {alert.message} ({alert.severity})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {isEditing && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Gerenciar alertas</CardTitle>
              <CardDescription>Atualize as mensagens de risco visíveis para a equipe.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addAlert}>
              <Plus className="w-4 h-4 mr-2" />
              Novo alerta
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {clinicalSummary.alerts.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum alerta configurado.</p>
            )}
            {clinicalSummary.alerts.map((alert, index) => (
              <div key={`alert-${index}`} className="border rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Select
                    value={alert.type}
                    onValueChange={(value) => handleAlertChange(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {alertTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={alert.severity}
                    onValueChange={(value) => handleAlertChange(index, 'severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Severidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {alertSeverityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Mensagem curta"
                    value={alert.message}
                    onChange={(e) => handleAlertChange(index, 'message', e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeAlert(index)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover alerta
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Diagnósticos e condições
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="Diagnóstico principal">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Nome"
                      value={clinicalSummary.diagnosisPrimary.name}
                      onChange={(e) => handleDiagnosisChange('name', e.target.value)}
                    />
                    <Input
                      placeholder="CID"
                      value={clinicalSummary.diagnosisPrimary.cid}
                      onChange={(e) => handleDiagnosisChange('cid', e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="font-semibold">
                    {clinicalSummary.diagnosisPrimary.name} ({clinicalSummary.diagnosisPrimary.cid})
                  </span>
                )}
              </FormField>
              <FormField label="Dispositivos ativos">
                {isEditing ? (
                  <Textarea
                    rows={4}
                    placeholder="Digite um dispositivo por linha"
                    value={clinicalSummary.devicesActive.join('\n')}
                    onChange={(e) => handleDevicesChange(e.target.value)}
                  />
                ) : clinicalSummary.devicesActive.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {clinicalSummary.devicesActive.map((device) => (
                      <Badge key={device} variant="outline">
                        {device}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  'Nenhum'
                )}
              </FormField>
              <FormField label="Oxigenoterapia">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <Select
                      value={clinicalSummary.oxygenTherapy.active ? 'true' : 'false'}
                      onValueChange={handleOxygenToggle}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Ativa</SelectItem>
                        <SelectItem value="false">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                    {clinicalSummary.oxygenTherapy.active && (
                      <Input
                        placeholder="Fluxo (ex: 3 L/min)"
                        value={clinicalSummary.oxygenTherapy.flow ?? ''}
                        onChange={(e) => handleOxygenFlow(e.target.value)}
                      />
                    )}
                  </div>
                ) : clinicalSummary.oxygenTherapy.active ? (
                  `Ativa, com fluxo de ${clinicalSummary.oxygenTherapy.flow}`
                ) : (
                  'Inativa'
                )}
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Alergias
              </CardTitle>
              {isEditing && (
                <Button size="sm" variant="outline" onClick={addAllergy}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar alergia
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {clinicalSummary.allergies.length > 0 ? (
                <div className="space-y-3">
                  {clinicalSummary.allergies.map((allergy, index) => (
                    <div key={`allergy-${index}`} className="p-3 border rounded-lg bg-muted/50 space-y-2">
                      {isEditing ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Input
                              placeholder="Substância"
                              value={allergy.substance}
                              onChange={(e) => handleAllergyChange(index, 'substance', e.target.value)}
                            />
                            <Select
                              value={allergy.severity}
                              onValueChange={(value) => handleAllergyChange(index, 'severity', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Severidade" />
                              </SelectTrigger>
                              <SelectContent>
                                {allergySeverityOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Textarea
                            placeholder="Reação observada"
                            value={allergy.reaction}
                            onChange={(e) => handleAllergyChange(index, 'reaction', e.target.value)}
                          />
                          <Input
                            type="date"
                            value={allergy.recordedAt ? allergy.recordedAt.slice(0, 10) : ''}
                            onChange={(e) => handleAllergyChange(index, 'recordedAt', e.target.value)}
                          />
                          <Button variant="ghost" size="sm" className="text-red-600 self-start" onClick={() => removeAllergy(index)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover alergia
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">{allergy.substance}</p>
                            <Badge variant={allergySeverityColors[allergy.severity]}>{allergy.severity}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Reação:</strong> {allergy.reaction}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Registrado em: {new Date(allergy.recordedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma alergia registrada.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Medicações em uso
              </CardTitle>
              {isEditing && (
                <Button size="sm" variant="outline" onClick={addMedication}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar medicação
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {medications.length === 0 && <p className="text-muted-foreground">Nenhuma medicação cadastrada.</p>}
              {medications.map((medication, index) => (
                <div key={`med-${index}`} className="border rounded-lg p-3 space-y-2">
                  {isEditing ? (
                    <>
                      <Input
                        placeholder="Nome"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          placeholder="Dosagem"
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        />
                        <Input
                          placeholder="Frequência"
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        />
                      </div>
                      <Textarea
                        placeholder="Observações"
                        value={medication.notes ?? ''}
                        onChange={(e) => handleMedicationChange(index, 'notes', e.target.value)}
                      />
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeMedication(index)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover medicação
                      </Button>
                    </>
                  ) : (
                    <div>
                      <p className="font-semibold">{medication.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {medication.dosage} — {medication.frequency}
                      </p>
                      {medication.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{medication.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Scores de risco
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Risco de queda (Morse)">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Pontuação"
                      value={clinicalSummary.riskScores.falls?.toString() ?? ''}
                      onChange={(e) => handleRiskScoreChange('falls', e.target.value)}
                    />
                    <Input
                      placeholder="Classificação"
                      value={clinicalSummary.riskScores.fallsLabel ?? ''}
                      onChange={(e) => handleRiskLabelChange('fallsLabel', e.target.value)}
                    />
                  </div>
                ) : (
                  <span
                    className={cn(
                      'font-bold',
                      clinicalSummary.riskScores.fallsLabel === 'Médio' ? 'text-amber-600' : 'text-foreground',
                    )}
                  >
                    {clinicalSummary.riskScores.fallsLabel} ({clinicalSummary.riskScores.falls} pontos)
                  </span>
                )}
              </FormField>
              <FormField label="Risco de LPP (Braden)">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Pontuação"
                      value={clinicalSummary.riskScores.braden?.toString() ?? ''}
                      onChange={(e) => handleRiskScoreChange('braden', e.target.value)}
                    />
                    <Input
                      placeholder="Classificação"
                      value={clinicalSummary.riskScores.bradenLabel ?? ''}
                      onChange={(e) => handleRiskLabelChange('bradenLabel', e.target.value)}
                    />
                  </div>
                ) : (
                  <span
                    className={cn(
                      'font-bold',
                      clinicalSummary.riskScores.bradenLabel === 'Risco Moderado' ? 'text-amber-600' : 'text-foreground',
                    )}
                  >
                    {clinicalSummary.riskScores.bradenLabel} ({clinicalSummary.riskScores.braden} pontos)
                  </span>
                )}
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Medicações críticas
              </CardTitle>
              {isEditing && (
                <Button size="sm" variant="outline" onClick={addCriticalMedication}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {clinicalSummary.criticalMedications.length > 0 ? (
                <div className="space-y-3">
                  {clinicalSummary.criticalMedications.map((med, index) => (
                    <div key={`critical-${index}`} className="border rounded-lg p-3 space-y-2">
                      {isEditing ? (
                        <>
                          <Input
                            placeholder="Nome"
                            value={med.name}
                            onChange={(e) => handleCriticalMedicationChange(index, 'name', e.target.value)}
                          />
                          <Textarea
                            placeholder="Observação"
                            value={med.note}
                            onChange={(e) => handleCriticalMedicationChange(index, 'note', e.target.value)}
                          />
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeCriticalMedication(index)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </Button>
                        </>
                      ) : (
                        <p>
                          <span className="font-semibold">{med.name}:</span> {med.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma medicação crítica.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 space-y-4">
              <FormField label="Resumo assistencial">
                {isEditing ? (
                  <Textarea rows={4} value={clinicalSummary.shortNote ?? ''} onChange={(e) => handleShortNoteChange(e.target.value)} />
                ) : (
                  <p className="text-sm text-blue-900 font-medium">{clinicalSummary.shortNote}</p>
                )}
              </FormField>
              <FormField label="Última revisão">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      type="datetime-local"
                      value={toDateInputValue(clinicalSummary.lastReview.date)}
                      onChange={(e) => handleLastReviewChange('date', e.target.value)}
                    />
                    <Input
                      placeholder="Responsável"
                      value={clinicalSummary.lastReview.by}
                      onChange={(e) => handleLastReviewChange('by', e.target.value)}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-blue-700">
                    Última revisão por {clinicalSummary.lastReview.by} em{' '}
                    {new Date(clinicalSummary.lastReview.date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
