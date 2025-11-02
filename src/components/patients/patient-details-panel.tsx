

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

export type EditMode = 'none' | 'full' | 'dadosPessoais' | 'endereco' | 'clinico' | 'administrativo' | 'financeiro' | 'redeDeApoio' | 'documentos' | 'medicacoes';


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

  const [editMode, setEditMode] = React.useState<EditMode>('none');
  const [editedData, setEditedData] = React.useState<Patient | null>(null);

  const [currentView, setCurrentView] = React.useState<'prontuario' | 'ficha'>('prontuario');
  const [activeProntuarioTab, setActiveProntuarioTab] = React.useState('dashboard');
  
  const isEditing = editMode !== 'none';

  React.useEffect(() => {
    if (isOpen && patientId) {
      setIsLoading(true);
      setCurrentView('ficha');
      setActiveProntuarioTab('dashboard');
      setEditMode('none');
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
      description: `As informações de ${editedData.displayName} foram atualizadas.`,
    });
    setEditMode('none');
  };
  
  const handleCancelEdit = () => {
    setEditMode('none');
    setEditedData(JSON.parse(JSON.stringify(patient))); // Reset changes
  }
  
  const handleFeaturePlaceholder = (featureName: string) => {
    toast({
        title: "Funcionalidade em Breve",
        description: `A funcionalidade de "${featureName}" será implementada em breve.`,
    })
  }

  const displayData = editedData || patient;
  const isSaveDisabled = patient && editedData ? deepEqual(patient, editedData) : true;
  

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] p-0 flex flex-col bg-muted/30 shadow-lg">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isLoading && (
              <div className="p-6"><Skeleton className="h-[85vh] w-full" /></div>
            )}

            {!isLoading && !displayData && (
              <div className="p-6 text-center text-muted-foreground">Paciente não encontrado.</div>
            )}

            {!isLoading && displayData && (
              <FichaCadastral 
                  editMode={editMode} 
                  setEditMode={setEditMode} 
                  displayData={displayData} 
                  editedData={editedData} 
                  setEditedData={setEditedData} 
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
              />
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
