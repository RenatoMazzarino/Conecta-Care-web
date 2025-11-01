'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Save, X, FileText, Upload, BookUser, ArrowLeft, Stethoscope, Dumbbell, Apple, Activity, Brain, Bone, Edit, FileHeart } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';

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


interface PatientDetailsPanelProps {
  patientId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPatientUpdate: (patient: Patient) => void;
}

const prontuarioTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'enfermagem', label: 'Enfermagem', icon: FileHeart },
  { id: 'medico', label: 'Médico', icon: Stethoscope },
  { id: 'fisioterapia', label: 'Fisioterapia', icon: Dumbbell },
  { id: 'nutricao', label: 'Nutrição', icon: Apple },
  { id: 'psicologia', label: 'Psicologia', icon: Brain },
  { id: 'fonoaudiologia', label: 'Fonoaudiologia', icon: Bone },
  { id: 'documentos', label: 'Documentos', icon: FileText },
];

const ProntuarioContent: React.FC<{ tabId: string; isEditing: boolean; editedData: Patient | null; setEditedData: (data: Patient | null) => void; }> = ({ tabId, isEditing, editedData, setEditedData }) => {
    switch (tabId) {
      case 'dashboard': return <ProntuarioDashboard isEditing={isEditing} editedData={editedData} setEditedData={setEditedData} />;
      case 'enfermagem': return <ProntuarioEnfermagem />;
      case 'medico': return <ProntuarioMedico />;
      case 'fisioterapia': return <ProntuarioFisioterapia />;
      case 'nutricao': return <ProntuarioNutricao />;
      case 'documentos': return <ProntuarioDocumentos />;
      default: return (
        <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 h-80">
            <Brain className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Módulo em Desenvolvimento</h3>
            <p className="text-sm text-muted-foreground mt-2">Esta funcionalidade estará disponível em breve.</p>
          </div>
        </div>
      );
    }
};

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

  const displayData = isEditing ? editedData : patient;
  const isSaveDisabled = patient && editedData ? deepEqual(patient, editedData) : true;

  const age = displayData ? new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear() : null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] p-0 flex flex-col bg-muted/40 border-0 shadow-none">
          <SheetHeader className="flex-row items-center justify-between p-4 border-b space-y-0 bg-card rounded-t-lg z-20">
            <div className="flex items-center gap-4 flex-1">
              {(currentView === 'ficha') && (
                <Button variant="outline" size="icon" onClick={() => setCurrentView('prontuario')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex text-center sm:text-left flex-col space-y-1.5">
                <SheetTitle>
                  {isLoading ? <Skeleton className="h-8 w-48" /> : <span>{displayData?.name}</span>}
                </SheetTitle>
                <div className="text-sm text-muted-foreground">
                  {isLoading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <span>
                      {age ? `${age} anos` : ''}
                      {age && displayData?.cpf ? ' \u2022 ' : ''}
                      {displayData?.cpf}
                    </span>
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
              <Button onClick={() => setIsUploadOpen(true)} variant="outline" disabled={isLoading}><Upload className="mr-2 h-4 w-4" />Anexar</Button>
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

          <div className="flex-1 overflow-y-auto bg-card rounded-b-lg p-6">
            {isLoading && (
              <div className="p-6"><Skeleton className="h-[70vh] w-full" /></div>
            )}

            {!isLoading && !displayData && (
              <div className="p-6 text-center text-muted-foreground">Paciente não encontrado.</div>
            )}

            {!isLoading && displayData && currentView === 'ficha' && (
              <div className="p-6"><FichaCadastral isEditing={isEditing} displayData={displayData} editedData={editedData} setEditedData={setEditedData} /></div>
            )}

            {!isLoading && displayData && currentView === 'prontuario' && (
               <Tabs defaultValue="dashboard" value={activeProntuarioTab} onValueChange={setActiveProntuarioTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-8">
                    {prontuarioTabs.map(tab => (
                      <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
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
