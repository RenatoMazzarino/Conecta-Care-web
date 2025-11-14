
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Patient, Professional } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, X, BookUser, Edit, BadgeCheck, Gavel, Shield, AlertTriangle, Star } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';
import { trackEvent } from '@/lib/analytics';
import { FichaCadastral } from '@/components/patients/ficha-cadastral';
import { ProntuarioPanel } from '@/components/prontuario/prontuario-panel';
import { patients as mockPatients, professionals as mockProfessionals } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FichaEndereco } from '@/components/patients/ficha-endereco';
import { FichaClinica } from '@/components/patients/ficha-clinica';
import { FichaAdministrativa } from '@/components/patients/ficha-administrativa';
import { FichaFinanceira } from '@/components/patients/ficha-financeira';
import { Input } from '@/components/ui/input';

export type EditMode = 'none' | 'full' | 'dadosPessoais' | 'endereco' | 'clinico' | 'administrativo' | 'financeiro' | 'redeDeApoio' | 'documentos' | 'medicacoes';

const TABS = [
    { id: "pessoais", label: "Dados Pessoais" },
    { id: "endereco", label: "Endereço e Ambiente" },
    { id: "clinicos", label: "Dados Clínicos" },
    { id: "administrativo", label: "Administrativo" },
    { id: "financeiro", label: "Financeiro" },
    { id: "documentos", label: "Documentos e Consentimentos" },
    { id: "auditoria", label: "Histórico e Auditoria" },
];

const DOCUMENT_FIELDS = [
    { key: 'termoConsentimentoUrl', label: 'Termo de Consentimento', helper: 'Assinado pelo paciente ou representante legal.' },
    { key: 'termoLgpdUrl', label: 'Termo LGPD', helper: 'Autorização de uso e tratamento de dados.' },
    { key: 'documentoComFotoUrl', label: 'Documento com foto', helper: 'RG, CNH ou documento equivalente.' },
    { key: 'comprovanteEnderecoUrl', label: 'Comprovante de endereço' },
    { key: 'fichaAvaliacaoEnfermagemUrl', label: 'Ficha de avaliação de enfermagem' },
    { key: 'planoCuidadoUrl', label: 'Plano de cuidado' },
    { key: 'protocoloAuditoriaUrl', label: 'Protocolo de auditoria' },
] satisfies { key: keyof Patient['documents']; label: string; helper?: string }[];

const formatDate = (value?: string, withTime?: boolean) => {
    if (!value) return 'Não informado';
    const date = new Date(value);
    return withTime
        ? date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        : date.toLocaleDateString('pt-BR');
};

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const patientId = params.patientId as string;
  
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [professionals, setProfessionals] = React.useState<Professional[]>([]);
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
        setProfessionals(mockProfessionals);
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
  const documentData = displayData?.documents ?? {};

  const handleDocumentChange = React.useCallback(
    (field: keyof Patient['documents'], value: string) => {
      setEditedData((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        next.documents = {
          ...(next.documents ?? {}),
          [field]: value || undefined,
        };
        return next;
      });
    },
    [setEditedData]
  );

  if (isLoading) {
      return <div className="p-6"><Skeleton className="h-[85vh] w-full" /></div>
  }

  if (!displayData) {
      return <div className="p-6 text-center text-muted-foreground">Paciente não encontrado.</div>
  }

  const fullName = `${displayData.firstName || ''} ${displayData.lastName || ''}`.trim();
  const age = displayData.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;
  const mainAllergy = displayData.clinicalSummary?.allergies?.[0];
  const legalRep = displayData.emergencyContacts?.find(c => c.isLegalRepresentative);

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
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                                <Shield className="w-4 h-4 mr-2" />
                                Consentimento: Assinado
                            </Badge>
                             {legalRep && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                                    <Gavel className="w-4 h-4 mr-2" />
                                    Rep. Legal: {legalRep.name}
                                </Badge>
                            )}
                            {mainAllergy && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Alergia: {mainAllergy.substance}
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
                        <Button onClick={handleSave} disabled={!hasChanges}>
                            <BadgeCheck className="w-4 h-4 mr-2"/> Salvar Alterações
                        </Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMode('full')}><Edit className="w-4 h-4 mr-2"/> Editar Ficha</Button>
                    )}
                </div>
            </div>
        </Card>

        <Tabs defaultValue="pessoais">
            <TabsList className="mb-6">
                {TABS.map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="pessoais">
                 <div className="space-y-6">
                   <FichaCadastral 
                      isEditing={isEditing}
                      displayData={displayData} 
                      editedData={editedData} 
                      setEditedData={setEditedData} 
                  />
                </div>
            </TabsContent>
            
             <TabsContent value="endereco">
                <div className="space-y-6">
                  <FichaEndereco
                      isEditing={isEditing}
                      displayData={displayData}
                      editedData={editedData}
                      setEditedData={setEditedData}
                  />
                </div>
            </TabsContent>
            <TabsContent value="clinicos">
                 <div className="space-y-6">
                   <FichaClinica
                      isEditing={isEditing}
                      displayData={displayData}
                      editedData={editedData}
                      setEditedData={setEditedData}
                   />
                 </div>
            </TabsContent>
            <TabsContent value="administrativo">
                 <div className="space-y-6">
                   <FichaAdministrativa 
                      displayData={displayData} 
                      editedData={editedData}
                      setEditedData={setEditedData}
                      isEditing={isEditing}
                      professionals={professionals} 
                   />
                 </div>
            </TabsContent>
            <TabsContent value="financeiro">
                 <div className="space-y-6">
                   <FichaFinanceira
                      displayData={displayData}
                      editedData={editedData}
                      setEditedData={setEditedData}
                      isEditing={isEditing}
                   />
                 </div>
            </TabsContent>

            <TabsContent value="documentos">
                 <Card>
                    <CardHeader>
                        <CardTitle>Documentos e Consentimentos</CardTitle>
                        <CardDescription>
                            Status e links de arquivos essenciais para o atendimento.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {DOCUMENT_FIELDS.map((doc) => {
                            const value = documentData[doc.key];
                            return (
                                <div
                                    key={doc.key}
                                    className="rounded-lg border p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{doc.label}</p>
                                        {doc.helper && (
                                            <p className="text-xs text-muted-foreground">{doc.helper}</p>
                                        )}
                                        {!isEditing && value && (
                                            <a
                                                href={value}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Abrir documento
                                            </a>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            type="url"
                                            placeholder="URL ou identificador do arquivo"
                                            value={value ?? ''}
                                            onChange={(e) => handleDocumentChange(doc.key, e.target.value)}
                                        />
                                    ) : (
                                        <Badge variant={value ? 'secondary' : 'outline'} className="w-fit">
                                            {value ? 'Anexado' : 'Pendente'}
                                        </Badge>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                 </Card>
            </TabsContent>

            <TabsContent value="auditoria">
                 <Card>
                    <CardHeader>
                        <CardTitle>Histórico e Auditoria</CardTitle>
                        <CardDescription>
                            Registro das principais modificações e responsáveis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground uppercase">Criado em</p>
                                <p className="text-sm font-semibold">{formatDate(displayData.audit.createdAt, true)}</p>
                                <p className="text-xs text-muted-foreground">por {displayData.audit.createdBy || 'Equipe Conecta Care'}</p>
                            </div>
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground uppercase">Última atualização</p>
                                <p className="text-sm font-semibold">{formatDate(displayData.audit.updatedAt, true)}</p>
                                <p className="text-xs text-muted-foreground">por {displayData.audit.updatedBy || 'Equipe Conecta Care'}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p className="font-semibold">Última auditoria operacional</p>
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="font-medium">Status atual:</span>
                                    <Badge variant="outline">{displayData.adminData.status}</Badge>
                                </div>
                                <p><span className="font-medium">Data:</span> {formatDate(displayData.adminData.lastAuditDate, true)}</p>
                                <p><span className="font-medium">Responsável:</span> {displayData.adminData.lastAuditBy || 'Não informado'}</p>
                                <p><span className="font-medium">Observações:</span> {displayData.adminData.notesInternal || 'Sem anotações registradas.'}</p>
                            </div>
                        </div>
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

