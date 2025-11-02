'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
    User, Phone, Mail, Calendar, Home, Link as LinkIcon, Gavel, BadgeCheck, Users, Edit,
    Shield, AlertTriangle, Star, Eye, Copy, Download, FileText, Upload, Plus, X, BookUser
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { EditMode } from '@/app/(app)/patients/[patientId]/page';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '@/components/ui/badge';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
    <path d="M16.483 3.39a12.872 12.872 0 0 0-12.87 12.87c0 3.43 1.34 6.55 3.51 8.88l-2.22 6.45a.63.63 0 0 0 .78.78l6.45-2.22a12.872 12.872 0 0 0 8.88 3.51c7.11 0 12.87-5.76 12.87-12.87S23.593 3.39 16.483 3.39zm6.39 17.28c-.46.22-2.73 1.35-3.15 1.5s-.73.22-.98 0c-.26-.22-.98-1.2-1.35-2.25s-.37-.88-.37-1.13c0-.25.12-.37.24-.5.13-.12.28-.3.43-.45.14-.15.2-.2.27-.33.07-.13.04-.25-.04-.37s-.98-2.36-1.34-3.25c-.37-.88-.73-1.03-.98-1.03s-.49 0-.74.01c-.25.01-.58.22-.88.62s-1.16 1.13-1.16 2.75c0 1.62 1.18 3.18 1.34 3.4.16.22 2.36 3.62 5.72 5.06.8.34 1.44.54 1.94.69.8.25 1.54.21 2.12.12.65-.08 1.98-.81 2.25-1.58.28-.77.28-1.43.2-1.58-.08-.15-.3-.22-.58-.4z" />
  </svg>
);


type FormSectionProps = {
    icon: React.ElementType;
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

const FormSection: React.FC<FormSectionProps> = ({ icon: Icon, title, action, children, className }) => {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Icon className="w-5 h-5 text-slate-700" />
                        {title}
                    </CardTitle>
                    {action}
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

const FormRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4", className)}>{children}</div>
);

const FormField = ({ label, value, action, isEditing, editComponent, className }: { 
    label: string, 
    value: React.ReactNode, 
    action?: React.ReactNode,
    isEditing?: boolean,
    editComponent?: React.ReactNode,
    className?: string
}) => (
    <div className={cn(className)}>
        <div className="text-xs text-gray-600 flex items-center gap-2 mb-1">
          <Label>{label}</Label>
          {action}
        </div>
        {isEditing ? (
             <div>{editComponent}</div>
        ) : (
            <div className="w-full rounded-md border bg-muted/50 p-2 text-sm text-foreground min-h-[36px] flex items-center justify-between">
                <div>{value || <span className="text-muted-foreground italic">Não informado</span>}</div>
            </div>
        )}
    </div>
);

type FichaCadastralProps = {
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: (data: Patient | null) => void;
  onSave: () => void;
  onCancel: () => void;
  onSwitchView: (view: 'prontuario' | 'ficha') => void;
};

export function FichaCadastral({ editMode, setEditMode, displayData, editedData, setEditedData, onSave, onCancel, onSwitchView }: FichaCadastralProps) {
    if (!displayData || !editedData) return null;

    const isEditing = editMode !== 'none';
    const fullName = `${displayData.firstName || ''} ${displayData.lastName || ''}`.trim();
    const age = displayData.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;
    const mainAllergy = displayData.clinicalData?.allergies?.[0];

    const handleFieldChange = (path: string, value: any) => {
        setEditedData(prevData => {
            if (!prevData) return null;
            const newEditedData = JSON.parse(JSON.stringify(prevData));
            let current = newEditedData;
            const keys = path.split('.');
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = current[keys[i]] || {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newEditedData;
        });
    };
    
    return (
        <div className="space-y-6">
            {/* HEADER */}
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
                            <h2 id="patient-personal-title" className="text-xl font-semibold text-slate-900 truncate">
                                {fullName} <span className="text-sm text-muted-foreground">— {displayData.displayName}</span>
                            </h2>
                            <div className="mt-1 text-sm text-slate-600 flex items-center">
                                {age && <span id="patient-age">{age}</span>}
                                <span className="mx-2">•</span>
                                <span id="patient-cpf" className="text-sm text-slate-500">CPF: <strong className="ml-1">{isEditing ? displayData.cpf : '***.***.***-00'}</strong></span>
                                <Button type="button" title="Copiar CPF" variant="ghost" size="icon" className="ml-2 h-7 w-7 text-gray-500 hover:bg-gray-50">
                                    <Copy className="w-4 h-4" />
                                </Button>
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
                        <Button variant="outline" onClick={() => onSwitchView('prontuario')}><BookUser className="w-4 h-4 mr-2"/> Ver Prontuário</Button>
                        {isEditing ? (
                            <>
                            <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2"/> Cancelar</Button>
                            <Button onClick={onSave}><BadgeCheck className="w-4 h-4 mr-2"/> Salvar Alterações</Button>
                            </>
                        ) : (
                            <Button onClick={() => setEditMode('full')}><Edit className="w-4 h-4 mr-2"/> Editar Ficha</Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* BODY */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <FormSection icon={User} title="Identificação Básica">
                         <FormRow>
                            <FormField label="Tratamento" value={displayData.pronouns} isEditing={isEditing}
                                editComponent={
                                    <Select value={editedData.pronouns} onValueChange={(v) => handleFieldChange('pronouns', v)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum</SelectItem>
                                            <SelectItem value="Sr.">Sr.</SelectItem>
                                            <SelectItem value="Sra.">Sra.</SelectItem>
                                            <SelectItem value="Sre.">Sre.</SelectItem>
                                        </SelectContent>
                                    </Select>
                                }
                            />
                            <FormField label="Nome Social" value={displayData.displayName} isEditing={isEditing}
                                editComponent={<Input value={editedData.displayName} onChange={(e) => handleFieldChange('displayName', e.target.value)} />}
                            />
                        </FormRow>
                        <hr className="my-4"/>
                        <FormRow>
                            <FormField label="Nome" value={displayData.firstName} isEditing={isEditing}
                                editComponent={<Input value={editedData.firstName} onChange={(e) => handleFieldChange('firstName', e.target.value)} />}
                            />
                            <FormField label="Sobrenome" value={displayData.lastName} isEditing={isEditing}
                                editComponent={<Input value={editedData.lastName} onChange={(e) => handleFieldChange('lastName', e.target.value)} />}
                            />
                        </FormRow>
                        <hr className="my-4"/>
                        <FormRow>
                             <FormField label="CPF" value={displayData.cpf} 
                                action={<Badge variant={editedData.cpfStatus === 'valid' ? 'secondary' : 'destructive'} className={cn(editedData.cpfStatus === 'valid' && 'bg-green-100 text-green-800')}><BadgeCheck className="h-3 w-3 mr-1"/> Verificado</Badge>} 
                                isEditing={isEditing}
                                editComponent={<Input value={editedData.cpf} onChange={(e) => handleFieldChange('cpf', e.target.value)} />}
                             />
                             <FormField label="RG" value={displayData.rg} 
                                action={<Badge variant={editedData.documentValidation?.status === 'validated' ? 'secondary' : 'destructive'} className={cn(editedData.documentValidation?.status === 'validated' && 'bg-green-100 text-green-800')}><BadgeCheck className="h-3 w-3 mr-1"/> Verificado</Badge>}
                                isEditing={isEditing}
                                editComponent={<Input value={editedData.rg} onChange={(e) => handleFieldChange('rg', e.target.value)} />}
                             />
                         </FormRow>
                         <FormRow>
                              <FormField label="Órgão Emissor do RG" value={displayData.rgIssuer} isEditing={isEditing}
                                editComponent={<Input value={editedData.rgIssuer} onChange={(e) => handleFieldChange('rgIssuer', e.target.value)} />}
                              />
                             <FormField label="CNS" value={displayData.cns} 
                                action={<Badge variant="outline"><X className="w-3 h-3 mr-1"/> Pendente</Badge>} 
                                isEditing={isEditing}
                                editComponent={<Input value={editedData.cns} onChange={(e) => handleFieldChange('cns', e.target.value)} />}
                             />
                         </FormRow>
                    </FormSection>

                     <FormSection 
                        icon={Phone} 
                        title="Informações de Contato"
                        action={<Badge variant="outline">Contato Preferencial: {displayData.preferredContactMethod}</Badge>}
                      >
                         <FormRow>
                             <FormField label="Telefone" value={displayData.phones[0]?.number} 
                                action={<a href="#" title="Iniciar conversa no WhatsApp" className="text-green-600 hover:text-green-700 ml-2"><WhatsAppIcon className="h-5 w-5"/></a>}
                                isEditing={isEditing}
                                editComponent={<Input value={editedData.phones[0]?.number} onChange={(e) => handleFieldChange('phones.0.number', e.target.value)} />}
                             />
                             <FormField label="Email" value={displayData.emails?.[0]?.email}
                                action={<a href="#" title="Enviar email" className="text-muted-foreground hover:text-primary ml-2"><Mail className="h-4 w-4"/></a>}
                                isEditing={isEditing}
                                editComponent={<Input value={editedData.emails[0]?.email} onChange={(e) => handleFieldChange('emails.0.email', e.target.value)} />}
                              />
                         </FormRow>
                     </FormSection>

                    <FormSection icon={Users} title="Contatos de Emergência">
                         <div className="space-y-3">
                           {displayData.emergencyContacts.map((contact, index) => (
                             <div key={index} className="p-3 border rounded-lg bg-background">
                                 <div className="flex items-center justify-between">
                                   <div className="font-medium text-slate-900">
                                       {contact.name}
                                       {contact.isLegalRepresentative && <Badge className="ml-2">Rep. Legal</Badge>}
                                   </div>
                                   <div className="flex items-center gap-1">
                                       <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4"/></Button>
                                       <Button variant="ghost" size="icon" className="h-8 w-8"><WhatsAppIcon className="h-5 w-5 text-green-600"/></Button>
                                   </div>
                                 </div>
                                 <p className="text-sm text-muted-foreground">{contact.relationship} • {contact.phone}</p>
                             </div>
                           ))}
                         </div>
                         {isEditing && (
                           <Button variant="outline" className="mt-4 w-full border-dashed" onClick={() => { /* TODO */}}>
                               <Plus className="h-4 w-4 mr-2"/> Adicionar Contato
                           </Button>
                         )}
                     </FormSection>

                </div>

                <aside className="col-span-12 lg:col-span-4 space-y-6">
                    <FormSection icon={Gavel} title="Representante Legal">
                         <FormField label="Nome" value={displayData.legalGuardian?.name} />
                         <div className="mt-4">
                           <FormField label="Documento" value={displayData.legalGuardian?.document} />
                         </div>
                         <div className="mt-4">
                           <FormField label="Procuração / Documento Comprobatório" value={<Button variant="link" asChild className="p-0 h-auto"><Link href={displayData.legalGuardian?.powerOfAttorneyUrl || '#'}>Visualizar Documento</Link></Button>} />
                         </div>
                     </FormSection>
                </aside>
            </div>
        </div>
    );
}
