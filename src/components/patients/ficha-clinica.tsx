'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    HeartPulse, Stethoscope, ShieldAlert, Pill, TrendingUp, User, Activity, AlertTriangle, RefreshCw, Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';


const FormField = ({ label, children, className, labelClassName }: { 
    label: string | React.ReactNode, 
    children: React.ReactNode,
    className?: string,
    labelClassName?: string,
}) => (
    <div className={cn(className)}>
        <div className={cn("text-xs text-slate-600 mb-1", labelClassName)}>{label}</div>
        <div className="text-sm text-slate-900 flex items-center gap-2">
            {children}
        </div>
    </div>
);

type FichaClinicaProps = {
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: (data: Patient | null) => void;
  isEditing: boolean;
};

const allergySeverityColors = {
    grave: 'destructive',
    moderada: 'secondary',
    leve: 'default'
}

export function FichaClinica({ displayData, editedData, setEditedData, isEditing }: FichaClinicaProps) {
    const { toast } = useToast();
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        toast({
            title: 'Sincronizando dados...',
            description: 'Buscando as informações mais recentes do prontuário eletrônico.',
        });
        setTimeout(() => {
            setIsRefreshing(false);
            toast({
                title: 'Resumo Clínico Atualizado',
                description: 'Os dados foram sincronizados com sucesso.',
            });
            // Aqui você chamaria a função que busca os dados da API
            // e atualiza o estado `editedData`.
        }, 1500);
    }

    if (!displayData || !displayData.clinicalSummary) return (
        <Card>
            <CardHeader>
                <CardTitle>Dados Clínicos</CardTitle>
                <CardDescription>Informações clínicas não disponíveis.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Não há dados clínicos para este paciente.</p>
            </CardContent>
        </Card>
    );

    const { clinicalSummary, clinicalSummaryMeta } = displayData;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-xl font-semibold">Resumo Clínico</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Última atualização em {new Date(clinicalSummaryMeta.lastUpdatedAt).toLocaleString('pt-BR')} por {clinicalSummaryMeta.lastUpdatedBy} (via {clinicalSummaryMeta.source})
                    </p>
                </div>
                 <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                    {isRefreshing ? 'Atualizando...' : 'Atualizar do Prontuário'}
                </Button>
            </div>
            
            {clinicalSummary.alerts && clinicalSummary.alerts.length > 0 && (
                 <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertTriangle className="h-4 w-4 !text-red-800" />
                    <AlertTitle>Alertas Críticos</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside">
                        {clinicalSummary.alerts.map((alert, i) => (
                            <li key={i}><strong>{alert.type}:</strong> {alert.message}</li>
                        ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-primary" />
                                Diagnósticos e Condições
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <FormField label="Diagnóstico Principal">
                                <span className="font-semibold">{clinicalSummary.diagnosisPrimary.name} ({clinicalSummary.diagnosisPrimary.cid})</span>
                            </FormField>
                             <FormField label="Dispositivos Ativos">
                                {clinicalSummary.devicesActive.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {clinicalSummary.devicesActive.map(device => <Badge key={device} variant="outline">{device}</Badge>)}
                                    </div>
                                ) : 'Nenhum'}
                            </FormField>
                            {clinicalSummary.oxygenTherapy.active && (
                                 <FormField label="Oxigenoterapia">
                                    <span>Ativa, com fluxo de {clinicalSummary.oxygenTherapy.flow}</span>
                                </FormField>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-primary" />
                                Alergias
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {clinicalSummary.allergies.length > 0 ? (
                                <div className="space-y-3">
                                {clinicalSummary.allergies.map((allergy, i) => (
                                    <div key={i} className="p-3 border rounded-lg bg-muted/50">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{allergy.substance}</p>
                                             <Badge variant={allergySeverityColors[allergy.severity]}>{allergy.severity}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1"><strong>Reação:</strong> {allergy.reaction}</p>
                                        <p className="text-xs text-muted-foreground mt-2">Registrado em: {new Date(allergy.recordedAt).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                ))}
                                </div>
                            ) : <p className="text-muted-foreground">Nenhuma alergia registrada.</p>}
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Scores de Risco
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <FormField label="Risco de Queda (Morse Fall Scale)">
                                <span className={cn("font-bold", clinicalSummary.riskScores.fallsLabel === 'Médio' ? 'text-amber-600' : 'text-foreground')}>{clinicalSummary.riskScores.fallsLabel} ({clinicalSummary.riskScores.falls} pontos)</span>
                           </FormField>
                           <FormField label="Risco de Lesão por Pressão (Braden)">
                                <span className={cn("font-bold", clinicalSummary.riskScores.bradenLabel === 'Risco Moderado' ? 'text-amber-600' : 'text-foreground')}>{clinicalSummary.riskScores.bradenLabel} ({clinicalSummary.riskScores.braden} pontos)</span>
                           </FormField>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Pill className="w-5 h-5 text-primary" />
                                Medicações Críticas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {clinicalSummary.criticalMedications.length > 0 ? (
                                 <ul className="space-y-2 list-disc list-inside">
                                    {clinicalSummary.criticalMedications.map((med, i) => (
                                        <li key={i}><span className="font-semibold">{med.name}:</span> {med.note}</li>
                                    ))}
                                 </ul>
                            ) : <p className="text-muted-foreground">Nenhuma medicação crítica.</p>}
                        </CardContent>
                    </Card>
                     <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-blue-900 font-medium">{clinicalSummary.shortNote}</p>
                            <p className="text-xs text-blue-700 mt-2">Última revisão por {clinicalSummary.lastReview.by} em {new Date(clinicalSummary.lastReview.date).toLocaleDateString('pt-BR')}</p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
