'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import type { Patient } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Edit, Save, X, FileText } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';
import { patients as mockPatients } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

import { ProntuarioResumo } from '@/components/prontuario/prontuario-resumo';
import { ProntuarioTimeline } from '@/components/prontuario/prontuario-timeline';
import { ProntuarioDocumentos } from '@/components/prontuario/prontuario-documentos';
import { ProntuarioExames } from '@/components/prontuario/prontuario-exames';

export default function PatientDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const patientId = params.patientId as string;

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedData, setEditedData] = React.useState<Patient | null>(null);
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
        const foundPatient = mockPatients.find(p => p.id === patientId);
        if (foundPatient) {
            const patientWithCounts = {
                ...foundPatient,
                lowStockCount: 0,
                criticalStockCount: 0,
            };
            setPatient(patientWithCounts);
            setEditedData(JSON.parse(JSON.stringify(patientWithCounts)));
        }
        setIsLoading(false);
    }, 500);
     return () => clearTimeout(timer);
  }, [patientId]);


  const handleEdit = () => {
    if (patient) {
      setEditedData(JSON.parse(JSON.stringify(patient)));
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(patient ? JSON.parse(JSON.stringify(patient)) : null);
  };

  const handleSave = () => {
    if (!editedData) return;
    setPatient(editedData);
    toast({
      title: "Prontuário Salvo",
      description: `As informações de ${editedData.name} foram atualizadas.`,
    });
    setIsEditing(false);
  };

  const displayData = isEditing ? editedData : patient;
  const isSaveDisabled = patient && editedData ? deepEqual(patient, editedData) : true;

  if (isLoading) {
    return (
        <>
            <AppHeader title="Carregando Prontuário..." />
            <main className="p-6 space-y-6 max-w-7xl mx-auto">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                 <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-72 w-full" />
            </main>
        </>
    );
  }

  if (!displayData) {
    return (
        <>
            <AppHeader title="Paciente não encontrado" />
            <main className="p-6 max-w-7xl mx-auto">
                <Card>
                <CardContent className="p-12 text-center">
                    <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Paciente não encontrado</h2>
                    <p className="text-muted-foreground">O prontuário para este ID de paciente não foi encontrado.</p>
                </CardContent>
                </Card>
            </main>
      </>
    );
  }

  return (
    <>
    <AppHeader title={`Prontuário de ${patient?.name || ''}`} />
    <main className="p-6 space-y-6 max-w-7xl mx-auto">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prontuário do Paciente</h1>
          <p className="text-muted-foreground mt-1">Informações clínicas, histórico e documentos.</p>
        </div>
        <div className="flex gap-2">
           <Button asChild variant="secondary"><Link href={`/patients/${patientId}/profile`}><FileText className="mr-2"/>Ver Ficha Cadastral</Link></Button>
            {!isEditing ? (
            <Button onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Resumo
            </Button>
            ) : (
            <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaveDisabled}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
                </Button>
            </div>
            )}
        </div>
      </div>
      
       <div className="grid lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                     <div className="p-3 rounded-full bg-primary/10">
                        <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">{displayData.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{displayData.age} anos ({new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', {timeZone: 'UTC'})})</p>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">{displayData.familyContact.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">Contato de Emergência: {displayData.familyContact.phone}</p>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Condições Principais</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-wrap gap-2">
                        {displayData.chronicConditions?.length > 0 ? (
                            displayData.chronicConditions.map((condition, i) => (
                            <span key={i} className="text-sm text-foreground">{condition}{i < displayData.chronicConditions.length - 1 ? ',' : ''}</span>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhuma condição registrada</p>
                        )}
                    </div>
                </CardContent>
            </Card>
      </div>

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList>
            <TabsTrigger value="resumo">Resumo Clínico</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="exames">Exames</TabsTrigger>
        </TabsList>
        <TabsContent value="resumo" className="mt-6">
             <ProntuarioResumo 
                isEditing={isEditing}
                editedData={editedData}
                setEditedData={setEditedData}
             />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
            <ProntuarioTimeline />
        </TabsContent>
        <TabsContent value="documentos" className="mt-6">
            <ProntuarioDocumentos />
        </TabsContent>
         <TabsContent value="exames" className="mt-6">
            <ProntuarioExames />
        </TabsContent>
      </Tabs>

    </main>
    </>
  );
}
