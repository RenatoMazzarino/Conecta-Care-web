
'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Save, X, FileText, Upload, BookUser, Edit } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';
import { trackEvent } from '@/lib/analytics';
import { FichaCadastral } from './ficha-cadastral';
import { ProntuarioDashboard } from '@/components/prontuario/prontuario-dashboard';
import { ProntuarioUploadDialog } from '@/components/prontuario/prontuario-upload-dialog';
import { patients as mockPatients } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface PatientDetailsPanelProps {
  patientId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPatientUpdate: (patient: Patient) => void;
}

export type EditMode = 'none' | 'full' | 'dadosPessoais' | 'endereco' | 'clinico' | 'administrativo' | 'financeiro' | 'redeDeApoio' | 'documentos' | 'medicacoes';

export function PatientDetailsPanel({ patientId, isOpen, onOpenChange, onPatientUpdate }: PatientDetailsPanelProps) {
  const { toast } = useToast();
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  const [editMode, setEditMode] = React.useState<EditMode>('none');
  const [editedData, setEditedData] = React.useState<Patient | null>(null);

  const [currentView, setCurrentView] = React.useState<'prontuario' | 'ficha'>('ficha');
  
  const isEditing = editMode !== 'none';
  const hasChanges = isEditing && patient && editedData && !deepEqual(patient, editedData);

  React.useEffect(() => {
    if (isOpen && patientId) {
      setIsLoading(true);
      setCurrentView('ficha');
      setEditMode('none');
      const timer = setTimeout(() => {
        const foundPatient = mockPatients.find(p => p.id === patientId);
        setPatient(foundPatient || null);
        if (foundPatient) {
          setEditedData(JSON.parse(JSON.stringify(foundPatient)));
          trackEvent({
              eventName: 'patient_record_viewed',
              properties: {
                  patientId: foundPatient.id,
                  userId: 'user-123',
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
      description: `As informações de ${editedData.displayName} foram atualizadas.`,
    });
    setEditMode('none');
  };
  
  const handleCancelEdit = () => {
    setEditMode('none');
    setEditedData(JSON.parse(JSON.stringify(patient))); // Reset changes
  }
  
  const displayData = editedData || patient;
  
  const ProntuarioView = () => (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Prontuário Eletrônico</h2>
            <div className="flex gap-2">
                 <Button variant="outline" onClick={() => setCurrentView('ficha')}><FileText className="w-4 h-4 mr-2"/> Ver Ficha Cadastral</Button>
                 <Button onClick={() => setIsUploadOpen(true)}><Upload className="w-4 h-4 mr-2"/> Anexar Documento</Button>
            </div>
        </div>
        <ProntuarioDashboard 
            editMode={editMode}
            setEditMode={setEditMode}
            editedData={editedData}
            setEditedData={setEditedData}
        />
      </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] p-0 flex flex-col bg-muted/30 shadow-lg">
            <SheetHeader className="p-6 pb-0">
                <SheetTitle className="sr-only">
                    {isLoading ? 'Carregando...' : `Detalhes de ${displayData?.displayName || 'Paciente'}`}
                </SheetTitle>
                <SheetDescription className="sr-only">
                    Painel para visualização e edição da ficha cadastral e prontuário do paciente.
                </SheetDescription>
            </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isLoading && (
              <div className="p-6"><Skeleton className="h-[85vh] w-full" /></div>
            )}

            {!isLoading && !displayData && (
              <div className="p-6 text-center text-muted-foreground">Paciente não encontrado.</div>
            )}

            {!isLoading && displayData && (
              currentView === 'ficha' ? (
                  <FichaCadastral 
                      editMode={editMode} 
                      setEditMode={setEditMode} 
                      displayData={displayData} 
                      editedData={editedData} 
                      setEditedData={setEditedData} 
                      onSave={handleSave}
                      onCancel={handleCancelEdit}
                      onSwitchView={setCurrentView}
                  />
              ) : (
                  <ProntuarioView />
              )
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
