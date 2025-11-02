

'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Save, X, FileText, Upload, BookUser, Edit, FileHeart, Gavel, AlertTriangle, Stethoscope } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';
import { trackEvent } from '@/lib/analytics';

import { ProntuarioDashboard } from '@/components/prontuario/prontuario-dashboard';
import { ProntuarioEnfermagem } from '@/components/prontuario/prontuario-enfermagem';
import { ProntuarioMedico } from '@/components/prontuario/prontuario-medico';
import { ProntuarioFisioterapia } from '@/components/prontuario/prontuario-fisioterapia';
import { ProntuarioNutricao } from '@/components/prontuario/prontuario-nutricao';
import { ProntuarioDocumentos } from '@/components/prontuario/prontuario-documentos';
import { ProntuarioUploadDialog } from '@/components/prontuario/prontuario-upload-dialog';
import { patients as mockPatients } from '@/lib/data';
import { FichaCadastral } from './ficha-cadastral';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { prontuarioTabs, ProntuarioContent } from '@/components/prontuario/prontuario-tabs';
import { Badge } from '../ui/badge';


interface PatientDetailsPanelProps {
  patientId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPatientUpdate: (patient: Patient) => void;
}

const ProntuarioJuridico: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle>Termos e Consentimentos</CardTitle>
        <CardDescription>
          Gerenciamento de consentimentos e documentos legais do paciente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/50">
            <h4 className="font-semibold">Termo de Consentimento para Tratamento de Dados (LGPD)</h4>
            <p className="text-sm text-muted-foreground mt-1">Assinado em 20 de Janeiro de 2023</p>
            <Button variant="link" asChild className="px-0 h-auto mt-2">
                <Link href="#" target="_blank">Visualizar Documento</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
);

export function PatientDetailsPanel({ patientId, isOpen, onOpenChange, onPatientUpdate }: PatientDetailsPanelProps) {
  const { toast } = useToast();
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedData, setEditedData] = React.useState<Patient | null>(null);

  const [currentView, setCurrentView] = React.useState<'prontuario' | 'ficha'>('prontuario');
  const [activeProntuarioTab, setActiveProntuarioTab] = React.useState('dashboard');

  React.useEffect(() => {
    if (isOpen && patientId) {
      setIsLoading(true);
      setCurrentView('prontuario');
      setActiveProntuarioTab('dashboard');
      setIsEditing(false);
      const timer = setTimeout(() => {
        const foundPatient = mockPatients.find(p => p.id === patientId);
        setPatient(foundPatient || null);
        if (foundPatient) {
          setEditedData(JSON.parse(JSON.stringify(foundPatient)));
          // Track event for auditing purposes (LGPD)
          trackEvent({
              eventName: 'patient_record_viewed',
              properties: {
                  patientId: foundPatient.id,
                  userId: 'user-123', // Placeholder for current user's ID
                  timestamp: new Date().toISOString()
              }
          })
        } else {
          setEditedData(null);
        }
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setTimeout(() => {
        setPatient(null);
        setEditedData(null);
        setIsLoading(true);
      }, 300);
    }
  }, [patientId, isOpen]);

  const handleSave = () => {
    if (!editedData) return;
    setPatient(editedData);
    onPatientUpdate(editedData);
    toast({
      title: "Dados Salvos",
      description: `As informações de ${editedData.name} foram atualizadas.`,
    });
    setIsEditing(false);
  };
  
  const handleFeaturePlaceholder = (featureName: string) => {
    toast({
        title: "Funcionalidade em Breve",
        description: `A funcionalidade de "${featureName}" será implementada em breve.`,
    })
  }

  const displayData = editedData || patient;
  const isSaveDisabled = patient && editedData ? deepEqual(patient, editedData) : true;
  
  const age = displayData?.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;
  const primaryDiagnosis = displayData?.clinicalData?.diagnoses?.[0]?.name;
  const allergies = displayData?.clinicalData?.allergies;


  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] p-0 flex flex-col bg-background shadow-lg">
           <SheetHeader className="flex-row items-center justify-between p-4 border-b space-y-0 z-20">
            <div className="flex items-center gap-4 flex-1">
               {isLoading ? (
                  <Skeleton className="h-16 w-16 rounded-full" />
                ) : (
                  displayData && (
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={displayData.avatarUrl} alt={displayData.name} />
                      <AvatarFallback>{displayData.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  )
               )}
               <div className="flex flex-col gap-2">
                <SheetTitle className="text-xl">
                  {isLoading ? <Skeleton className="h-7 w-48" /> : <span>{displayData?.name}</span>}
                </SheetTitle>
                <div className="flex items-center gap-2 flex-wrap">
                    <SheetDescription className="text-sm text-muted-foreground">
                        {isLoading ? (
                        <Skeleton className="h-4 w-32 mt-1" />
                        ) : (
                        <span>
                            {age ? `Paciente, ${age}` : `ID: ${displayData?.id}`}
                        </span>
                        )}
                    </SheetDescription>
                     {primaryDiagnosis && (
                        <Badge variant="outline" className="text-xs">
                             <Stethoscope className="w-3 h-3 mr-1.5"/>
                             {primaryDiagnosis}
                        </Badge>
                     )}
                     {allergies && allergies.length > 0 && (
                        <Badge className="border border-red-300 bg-red-100 text-red-700 font-medium py-1 px-2 text-sm">
                             <AlertTriangle className="w-4 h-4 mr-1.5 text-red-700"/>
                             Alergia: {allergies.join(', ')}
                        </Badge>
                     )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentView === 'prontuario' ? (
                <Button variant="outline" onClick={() => setCurrentView('ficha')} disabled={isLoading}><BookUser className="mr-2 h-4 w-4" />Ficha Cadastral</Button>
              ) : (
                <Button variant="outline" onClick={() => setCurrentView('prontuario')} disabled={isLoading}><FileText className="mr-2 h-4 w-4" />Ver Prontuário</Button>
              )}
              <Button onClick={() => handleFeaturePlaceholder('Anexar Documento')} variant="outline" disabled={isLoading}><Upload className="mr-2 h-4 w-4" />Anexar</Button>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => {
                    setIsEditing(false);
                    setEditedData(JSON.parse(JSON.stringify(patient)));
                  }} variant="outline">
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
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6">
            {isLoading && (
              <div className="p-6"><Skeleton className="h-[70vh] w-full" /></div>
            )}

            {!isLoading && !displayData && (
              <div className="p-6 text-center text-muted-foreground">Paciente não encontrado.</div>
            )}

            {!isLoading && displayData && currentView === 'ficha' && (
              <div><FichaCadastral isEditing={isEditing} displayData={displayData} editedData={editedData} setEditedData={setEditedData} /></div>
            )}

            {!isLoading && displayData && currentView === 'prontuario' && (
               <Tabs defaultValue="dashboard" value={activeProntuarioTab} onValueChange={setActiveProntuarioTab} className="w-full">
                  <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <TabsList className="inline-flex">
                      {prontuarioTabs.map(tab => (
                        <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                          <tab.icon className="h-4 w-4" />
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                  {prontuarioTabs.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-6">
                      <ProntuarioContent tabId={tab.id} isEditing={isEditing} editedData={editedData} setEditedData={setEditedData}/>
                    </TabsContent>
                  ))}
               </Tabs>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {patient && (
        <ProntuarioUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} />
      )}
    </>
  );
}
