'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, X, FileText, Upload, BookUser, Edit, BadgeCheck } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';
import { trackEvent } from '@/lib/analytics';
import { FichaCadastral } from '@/components/patients/ficha-cadastral';
import { ProntuarioPanel } from '@/components/prontuario/prontuario-panel';
import { patients as mockPatients } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Star } from 'lucide-react';

export type EditMode = 'none' | 'full' | 'dadosPessoais' | 'endereco' | 'clinico' | 'administrativo' | 'financeiro' | 'redeDeApoio' | 'documentos' | 'medicacoes';

const TABS = [
    { id: "ficha", label: "Ficha Cadastral" },
    { id: "clinico", label: "Dados Clínicos" },
    { id: "financeiro", label: "Financeiro" },
    { id: "administrativo", label: "Administrativo" },
];

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const patientId = params.patientId as string;
  
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProntuarioOpen, setIsProntuarioOpen] = React.useState(false);

  const [editMode, setEditMode] = React.useState<EditMode>('none');
  const [editedData, setEditedData] = React.useState<Patient | null>(null);
  
  const isEditing = editMode !== 'none';
  const hasChanges = isEditing && patient && editedData && !deepEqual(patient, editedData);

  React.useEffect(() => {
    if (patientId) {
      setIsLoading(true);
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
                  userId: 'user-123', // Placeholder
                  timestamp: new Date().toISOString()
              }
          })
        } else {
          setEditedData(null);
        }
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [patientId]);

  const handleSave = () => {
    if (!editedData) return;
    setPatient(editedData);
    // In a real app, this would be `onPatientUpdate(editedData)` to update the parent state
    // For now, we just update the local state.
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

  if (isLoading) {
      return <div className="p-6"><Skeleton className="h-[85vh] w-full" /></div>
  }

  if (!displayData) {
      return <div className="p-6 text-center text-muted-foreground">Paciente não encontrado.</div>
  }

  const fullName = `${displayData.firstName || ''} ${displayData.lastName || ''}`.trim();
  const age = displayData.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;
  const mainAllergy = displayData.clinicalData?.allergies?.[0];

  return (
    <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.push('/patients')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
        </Button>
        
        {/* HEADER GERAL DA PÁGINA */}
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-5 bg-muted/30">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="w-24 h-24 rounded-md text-3xl">
                            <AvatarImage src={displayData.avatarUrl} alt={fullName} className="object-cover border" />
                            <AvatarFallback>{displayData.initials}</AvatarFallback>
                        </Avatar>
                        {displayData.photoConsent?.granted && (
                            <Badge className="absolute -bottom-2 -right-2 bg-green-600 text-white shadow" title="Consentimento para uso de foto: Sim">Foto: OK</Badge>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold text-slate-900 truncate">
                            {fullName} <span className="text-sm text-muted-foreground">— {displayData.displayName}</span>
                        </h2>
                        <div className="mt-1 text-sm text-slate-600 flex items-center">
                            {age && <span>{age}</span>}
                            <span className="mx-2">•</span>
                            <span className="text-sm text-slate-500">CPF: <strong>{isEditing ? displayData.cpf : '***.***.***-00'}</strong></span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                                <Shield className="w-4 h-4 mr-2" />
                                Consentimento: Assinado
                            </Badge>
                            {mainAllergy && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Alergia: {mainAllergy}
                                </Badge>
                            )}
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-100">
                                <Star className="w-4 h-4 mr-2" />
                                Complexidade: {displayData.adminData.complexity}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setIsProntuarioOpen(true)}><BookUser className="w-4 h-4 mr-2"/> Ver Prontuário</Button>
                    {isEditing ? (
                        <>
                        <Button variant="outline" onClick={handleCancelEdit}><X className="w-4 h-4 mr-2"/> Cancelar</Button>
                        <Button onClick={handleSave}><BadgeCheck className="w-4 h-4 mr-2"/> Salvar Alterações</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMode('full')}><Edit className="w-4 h-4 mr-2"/> Editar Ficha</Button>
                    )}
                </div>
            </div>
        </Card>

        <Tabs defaultValue="ficha">
            <TabsList className="mb-6">
                {TABS.map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="ficha">
                 <FichaCadastral 
                    editMode={editMode} 
                    setEditMode={setEditMode} 
                    displayData={displayData} 
                    editedData={editedData} 
                    setEditedData={setEditedData} 
                />
            </TabsContent>
            
             <TabsContent value="clinico">
                 <Card>
                    <CardHeader>
                        <CardTitle>Dados Clínicos</CardTitle>
                        <CardDescription>Esta seção conterá os dados clínicos detalhados do paciente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Em breve.</p>
                    </CardContent>
                 </Card>
            </TabsContent>
             <TabsContent value="financeiro">
                 <Card>
                    <CardHeader>
                        <CardTitle>Financeiro</CardTitle>
                        <CardDescription>Esta seção conterá os dados financeiros do paciente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Em breve.</p>
                    </CardContent>
                 </Card>
            </TabsContent>
             <TabsContent value="administrativo">
                 <Card>
                    <CardHeader>
                        <CardTitle>Administrativo</CardTitle>
                        <CardDescription>Esta seção conterá os dados administrativos do paciente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Em breve.</p>
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
        
        <ProntuarioPanel
            patient={displayData}
            isOpen={isProntuarioOpen}
            onOpenChange={setIsProntuarioOpen}
        />
    </div>
  );
}
