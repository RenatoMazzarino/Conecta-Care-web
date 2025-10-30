'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import type { Patient } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Edit, Save, X, FileText, AlertCircle, Upload } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

import { ProntuarioDashboard } from '@/components/prontuario/prontuario-dashboard';
import { ProntuarioEnfermagem } from '@/components/prontuario/prontuario-enfermagem';
import { ProntuarioMedico } from '@/components/prontuario/prontuario-medico';
import { ProntuarioFisioterapia } from '@/components/prontuario/prontuario-fisioterapia';
import { ProntuarioNutricao } from '@/components/prontuario/prontuario-nutricao';
import { Badge } from '@/components/ui/badge';
import { ProntuarioDocumentos } from '@/components/prontuario/prontuario-documentos';
import { ProntuarioUploadDialog } from '@/components/prontuario/prontuario-upload-dialog';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function PatientDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const patientId = params.patientId as string;
  const firestore = useFirestore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  
  const patientDocRef = React.useMemo(() => {
      if (!firestore || !patientId) return null;
      return doc(firestore, 'patients', patientId);
  }, [firestore, patientId]);

  const { data: patient, isLoading } = useDoc<Patient>(patientDocRef);

  const [editedData, setEditedData] = React.useState<Patient | null>(null);
  
  React.useEffect(() => {
    if (patient) {
      setEditedData(JSON.parse(JSON.stringify(patient)));
    }
  }, [patient]);


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
    // TODO: Implement Firestore update logic here
    toast({
      title: "Prontuário Salvo",
      description: `As informações de ${editedData.name} foram atualizadas (simulação).`,
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
  
  const age = patient ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 0;

  return (
    <>
    <AppHeader title={`Prontuário de ${patient?.name || ''}`} />
    <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prontuário do Paciente</h1>
          <p className="text-muted-foreground mt-1">Central de informações clínicas e assistenciais.</p>
        </div>
        <div className="flex gap-2 items-center">
           <Button asChild variant="secondary"><Link href={`/patients/${patientId}/profile`}><FileText className="mr-2"/>Ver Ficha Cadastral</Link></Button>
            <Button onClick={() => setIsUploadOpen(true)} variant="outline"><Upload className="mr-2"/>Anexar Documento</Button>
            {!isEditing ? (
            <Button onClick={handleEdit} size="sm" variant="ghost">
                <Edit className="w-4 h-4 mr-2" />
                Editar
            </Button>
            ) : (
            <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaveDisabled} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Salvar
                </Button>
            </div>
            )}
        </div>
      </div>
      
       <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            <div className="flex items-center gap-3">
                 <div className="p-2 rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Paciente</p>
                    <p className="font-semibold">{displayData.name}</p>
                    <p className="text-xs text-muted-foreground">{age} anos ({new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', {timeZone: 'UTC'})})</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                     <p className="text-xs text-muted-foreground">Contato de Emergência</p>
                    <p className="font-semibold">{displayData.familyContact.name}</p>
                    <p className="text-xs text-muted-foreground">{displayData.familyContact.phone}</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-destructive/10 mt-1">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                     <p className="text-xs text-muted-foreground">Condições e Alergias</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {displayData.chronicConditions?.length > 0 ? (
                        displayData.chronicConditions.map((condition, i) => (
                        <Badge key={`cond-${i}`} variant="secondary">{condition}</Badge>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">Nenhuma condição crônica</p>
                    )}
                     {displayData.allergies?.length > 0 ? (
                        displayData.allergies.map((allergy, i) => (
                        <Badge key={`allergy-${i}`} variant="destructive">{allergy}</Badge>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">Nenhuma alergia</p>
                    )}
                    </div>
                </div>
            </div>
        </CardContent>
       </Card>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="enfermagem">Enfermagem</TabsTrigger>
            <TabsTrigger value="medico">Médico</TabsTrigger>
            <TabsTrigger value="fisioterapia">Fisioterapia</TabsTrigger>
            <TabsTrigger value="nutricao">Nutrição</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
             <ProntuarioDashboard 
                isEditing={isEditing}
                editedData={editedData}
                setEditedData={setEditedData}
             />
        </TabsContent>
        <TabsContent value="enfermagem" className="mt-6">
            <ProntuarioEnfermagem />
        </TabsContent>
        <TabsContent value="medico" className="mt-6">
            <ProntuarioMedico />
        </TabsContent>
         <TabsContent value="fisioterapia" className="mt-6">
            <ProntuarioFisioterapia />
        </TabsContent>
         <TabsContent value="nutricao" className="mt-6">
            <ProntuarioNutricao />
        </TabsContent>
        <TabsContent value="documentos" className="mt-6">
            <ProntuarioDocumentos />
        </TabsContent>
      </Tabs>
      <ProntuarioUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </main>
    </>
  );
}
