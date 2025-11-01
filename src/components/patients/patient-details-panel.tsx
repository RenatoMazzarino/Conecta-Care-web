'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Edit, Save, X, FileText, Upload, CheckSquare, ArrowLeft, Stethoscope, Dumbbell, Apple, Activity, BookUser, FileHeart, Brain, Bone } from 'lucide-react';
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
            setPatient(null);
            setEditedData(null);
            setIsLoading(true);
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
    
    const renderProntuarioContent = () => {
        switch(activeProntuarioTab) {
            case 'dashboard': return <ProntuarioDashboard isEditing={isEditing} editedData={editedData} setEditedData={setEditedData} />;
            case 'enfermagem': return <ProntuarioEnfermagem />;
            case 'medico': return <ProntuarioMedico />;
            case 'fisioterapia': return <ProntuarioFisioterapia />;
            case 'nutricao': return <ProntuarioNutricao />;
            case 'documentos': return <ProntuarioDocumentos />;
            default: return <div className="flex items-center justify-center h-full text-muted-foreground">Selecione uma seção</div>;
        }
    }

    const age = displayData ? new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear() : null;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-[90vw] lg:max-w-[85vw] p-0 flex flex-col">
                    <SheetHeader className="flex-row items-center justify-between p-4 border-b space-y-0">
                        <div className="flex items-center gap-4 flex-1">
                           {currentView === 'ficha' && (
                                <Button variant="outline" size="icon" onClick={() => setCurrentView('prontuario')}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                           )}
                           <div>
                                <SheetTitle className="text-2xl">
                                    {isLoading ? <Skeleton className="h-8 w-48" /> : displayData?.name}
                                </SheetTitle>
                                <SheetDescription>
                                     {isLoading ? <Skeleton className="h-4 w-32 mt-1" /> : (
                                        <>{age ? `${age} anos` : ''}{age && displayData?.cpf ? ' \u2022 ' : ''}{displayData?.cpf}</>
                                     )}
                                </SheetDescription>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                             {currentView === 'prontuario' ? (
                               <Button variant="outline" onClick={() => setCurrentView('ficha')} disabled={isLoading}><BookUser className="mr-2 h-4 w-4"/>Ficha Cadastral</Button>
                            ) : (
                                <Button variant="outline" onClick={() => setCurrentView('prontuario')} disabled={isLoading}><FileText className="mr-2 h-4 w-4" />Ver Prontuário</Button>
                            )}
                            <Button onClick={() => setIsUploadOpen(true)} variant="outline" disabled={isLoading}><Upload className="mr-2 h-4 w-4"/>Anexar</Button>
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
                    <div className="flex-1 overflow-y-auto bg-muted/40">
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
                            <div className="flex h-full">
                                <aside className="w-64 border-r bg-card p-4">
                                    <nav className="flex flex-col gap-1">
                                        {prontuarioTabs.map(tab => (
                                            <Button
                                                key={tab.id}
                                                variant={activeProntuarioTab === tab.id ? 'secondary' : 'ghost'}
                                                className="w-full justify-start gap-3"
                                                onClick={() => setActiveProntuarioTab(tab.id)}
                                            >
                                                <tab.icon className="h-5 w-5" />
                                                {tab.label}
                                            </Button>
                                        ))}
                                    </nav>
                                </aside>
                                <main className="flex-1 p-6 overflow-y-auto">
                                    {renderProntuarioContent()}
                                </main>
                            </div>
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
