
'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Edit, Save, X, FileText, AlertCircle, Upload, CheckSquare, ArrowLeft } from 'lucide-react';
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
import { patients as mockPatients } from '@/lib/data';
import { FichaCadastral } from './ficha-cadastral';

interface PatientDetailsPanelProps {
    patientId: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onPatientUpdate: (patient: Patient) => void;
}

export function PatientDetailsPanel({ patientId, isOpen, onOpenChange, onPatientUpdate }: PatientDetailsPanelProps) {
    const { toast } = useToast();
    const [patient, setPatient] = React.useState<Patient | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isUploadOpen, setIsUploadOpen] = React.useState(false);

    const [isEditing, setIsEditing] = React.useState(false);
    const [editedData, setEditedData] = React.useState<Patient | null>(null);
    
    // View can be 'prontuario' or 'ficha'
    const [currentView, setCurrentView] = React.useState<'prontuario' | 'ficha'>('prontuario');

    React.useEffect(() => {
        if (patientId) {
            setIsLoading(true);
            setCurrentView('prontuario'); // Reset to default view when patient changes
            setIsEditing(false); // Reset editing mode
            // Simulate fetching data
            const timer = setTimeout(() => {
                const foundPatient = mockPatients.find(p => p.id === patientId);
                setPatient(foundPatient || null);
                if (foundPatient) {
                    setEditedData(JSON.parse(JSON.stringify(foundPatient)));
                }
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setPatient(null);
            setIsLoading(false);
        }
    }, [patientId]);

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

    const renderHeader = () => {
        if (isLoading || !displayData) {
            return <Skeleton className="h-10 w-2/3" />;
        }
        
        const age = displayData ? new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear() : 0;
        
        return (
             <SheetHeader className="text-left">
                <SheetTitle className="text-2xl">{displayData.name}</SheetTitle>
                <SheetDescription>
                    {age} anos &bull; {displayData.cpf}
                </SheetDescription>
            </SheetHeader>
        )
    };
    
    const renderContent = () => {
        if (isLoading) {
             return (
                <div className="space-y-6 p-6">
                    <Skeleton className="h-10 w-1/3" />
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-72 w-full" />
                </div>
            );
        }
        
        if (!displayData) {
            return (
                <Card>
                    <CardContent className="p-12 text-center">
                        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Paciente não encontrado</h2>
                        <p className="text-muted-foreground">O prontuário para este ID de paciente não foi encontrado.</p>
                    </CardContent>
                </Card>
            )
        }
        
        if (currentView === 'ficha') {
            return <FichaCadastral 
                        isEditing={isEditing}
                        displayData={displayData}
                        editedData={editedData}
                        setEditedData={setEditedData}
                    />
        }

        // Default to 'prontuario' view
        return (
             <div className="space-y-6">
                <Card>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Paciente</p>
                                <p className="font-semibold">{displayData.name}</p>
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
                                    {displayData.chronicConditions?.length > 0 && displayData.chronicConditions.map((condition, i) => (
                                        <Badge key={`cond-${i}`} variant="secondary">{condition}</Badge>
                                    ))}
                                    {displayData.allergies?.length > 0 && displayData.allergies.map((allergy, i) => (
                                        <Badge key={`allergy-${i}`} variant="destructive">{allergy}</Badge>
                                    ))}
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
                    <TabsContent value="enfermagem" className="mt-6"><ProntuarioEnfermagem /></TabsContent>
                    <TabsContent value="medico" className="mt-6"><ProntuarioMedico /></TabsContent>
                    <TabsContent value="fisioterapia" className="mt-6"><ProntuarioFisioterapia /></TabsContent>
                    <TabsContent value="nutricao" className="mt-6"><ProntuarioNutricao /></TabsContent>
                    <TabsContent value="documentos" className="mt-6"><ProntuarioDocumentos /></TabsContent>
                </Tabs>
             </div>
        );
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-[90vw] lg:max-w-[80vw] p-0 flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-4 flex-1">
                           {currentView === 'ficha' && (
                                <Button variant="outline" size="icon" onClick={() => setCurrentView('prontuario')}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                           )}
                           {renderHeader()}
                        </div>
                        <div className="flex items-center gap-2">
                            {currentView === 'prontuario' ? (
                               <Button variant="outline" onClick={() => setCurrentView('ficha')}><UserSquare className="mr-2 h-4 w-4"/>Ficha Cadastral</Button>
                            ) : (
                                <Button variant="outline" onClick={() => setCurrentView('prontuario')}><FileText className="mr-2 h-4 w-4" />Ver Prontuário</Button>
                            )}
                            <Button onClick={() => setIsUploadOpen(true)} variant="outline"><Upload className="mr-2 h-4 w-4"/>Anexar</Button>
                            <Button variant="outline" disabled><CheckSquare className="mr-2 h-4 w-4"/>Criar Tarefa</Button>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsEditing(false)} variant="outline">
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
                    <div className="flex-1 overflow-y-auto bg-muted/40 p-6">
                        {renderContent()}
                    </div>
                </SheetContent>
            </Sheet>
             {patient && (
                 <ProntuarioUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} />
             )}
        </>
    );
}

const UserSquare = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-2a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2"/>
    </svg>
)
