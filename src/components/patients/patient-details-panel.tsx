'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Save, X, FileText, Upload, BookUser, ArrowLeft, Stethoscope, Dumbbell, Apple, Activity, Brain, Bone, FileHeart, Edit } from 'lucide-react';
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
    { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'bg-blue-100' },
    { id: 'enfermagem', label: 'Enfermagem', icon: FileHeart, color: 'bg-rose-100' },
    { id: 'medico', label: 'Médico', icon: Stethoscope, color: 'bg-lime-100' },
    { id: 'fisioterapia', label: 'Fisioterapia', icon: Dumbbell, color: 'bg-amber-100' },
    { id: 'nutricao', label: 'Nutrição', icon: Apple, color: 'bg-purple-100' },
    { id: 'psicologia', label: 'Psicologia', icon: Brain, color: 'bg-cyan-100' },
    { id: 'fonoaudiologia', label: 'Fonoaudiologia', icon: Bone, color: 'bg-teal-100' },
    { id: 'documentos', label: 'Documentos', icon: FileText, color: 'bg-slate-100' },
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
            // Delay resetting state to allow for exit animation
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
    
    const renderProntuarioContent = () => {
        switch(activeProntuarioTab) {
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
                        <h3 className="text-lg font-semibold">Módulo de Psicologia</h3>
                        <p className="text-sm text-muted-foreground mt-2">Esta funcionalidade está em desenvolvimento e estará disponível em breve.</p>
                    </div>
                </div>
            );
        }
    }
    
    const age = displayData ? new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear() : null;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] p-0 flex flex-col">
                     <SheetHeader className="flex-row items-center justify-between p-4 border-b space-y-0">
                         <div className="flex items-center gap-4 flex-1">
                           {(currentView === 'ficha') && (
                                <Button variant="outline" size="icon" onClick={() => setCurrentView('prontuario')}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                           )}
                           <div>
                                <SheetTitle>
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
                               <nav className="flex flex-col items-start pt-8 bg-muted/70">
                                {prontuarioTabs.map((tab, index) => {
                                    const isActive = activeProntuarioTab === tab.id;
                                    return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveProntuarioTab(tab.id)}
                                        className={cn(
                                        "relative flex flex-col items-center justify-center h-24 w-20 transition-all duration-200 ease-in-out -mb-6",
                                        isActive
                                            ? 'bg-card text-primary z-10'
                                            : 'bg-muted text-muted-foreground hover:bg-card/80 hover:z-20'
                                        )}
                                        style={{
                                            borderTopLeftRadius: '0.5rem',
                                            borderTopRightRadius: '0.5rem',
                                        }}
                                    >
                                        <tab.icon className={cn("h-5 w-5 mb-1", isActive ? "text-primary" : "")} />
                                        <span className="text-xs font-medium" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                            {tab.label}
                                        </span>
                                    </button>
                                    );
                                })}
                                </nav>
                                <main className="flex-1 p-6 overflow-y-auto bg-card shadow-lg z-20">
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
