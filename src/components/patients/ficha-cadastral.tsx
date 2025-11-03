
'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
    User, Phone, Mail, Calendar, Home, Users, Copy, Download, FileText, Upload, Plus, X, BadgeCheck, Gavel, Eye, WhatsAppIcon
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import type { EditMode } from '@/app/(app)/patients/[patientId]/page';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const FormField = ({ label, children, className }: { 
    label: string, 
    children: React.ReactNode,
    className?: string
}) => (
    <div className={cn(className)}>
        <Label className="text-xs text-slate-600">{label}</Label>
        <div className="mt-1 text-sm text-slate-900 flex items-center gap-2">
            {children}
        </div>
    </div>
);

type FichaCadastralProps = {
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: (data: Patient | null) => void;
  isEditing: boolean;
};

export function FichaCadastral({ displayData, editedData, setEditedData, isEditing }: FichaCadastralProps) {
    const { toast } = useToast();

    if (!displayData || !editedData) return null;

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

    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `${fieldName} copiado!`, description: text });
    };

    const age = displayData.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                             <User className="w-5 h-5 text-primary" />
                             Identificação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Nome Completo">
                            {isEditing ? <Input value={`${editedData.firstName} ${editedData.lastName}`} disabled /> : <span>{displayData.firstName} {displayData.lastName}</span>}
                        </FormField>
                        <FormField label="Nome Social / Apelido">
                            {isEditing ? <Input value={editedData.displayName} onChange={e => handleFieldChange('displayName', e.target.value)} /> : <span>{displayData.displayName}</span>}
                        </FormField>
                        <FormField label="Data de Nascimento">
                            {isEditing ? <Input type="date" value={editedData.dateOfBirth} onChange={e => handleFieldChange('dateOfBirth', e.target.value)} /> : <span>{new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} {age && `(${age})`}</span>}
                        </FormField>
                         <FormField label="Gênero / Pronomes">
                            {isEditing ? (
                                <div className="flex gap-2 w-full">
                                <Input value={editedData.genderIdentity || ''} placeholder="Gênero" onChange={e => handleFieldChange('genderIdentity', e.target.value)} />
                                <Input value={editedData.pronouns || ''} placeholder="Pronomes" onChange={e => handleFieldChange('pronouns', e.target.value)} />
                                </div>
                            ) : (
                                <span>{displayData.genderIdentity || '-'} / {displayData.pronouns || '-'}</span>
                            )}
                        </FormField>
                         <FormField label="CPF">
                            <span className="font-mono">{displayData.cpf}</span>
                            <Button size="sm" variant="outline" className="ml-auto h-7 text-xs" onClick={() => handleCopy(displayData.cpf, 'CPF')}><Copy className="w-3 h-3 mr-1"/>Copiar</Button>
                        </FormField>
                        <FormField label="RG / Órgão Emissor">
                            {isEditing ? (
                                <div className="flex gap-2 w-full">
                                    <Input value={editedData.rg || ''} placeholder="RG" onChange={e => handleFieldChange('rg', e.target.value)} />
                                    <Input value={editedData.rgIssuer || ''} placeholder="Órgão Emissor" onChange={e => handleFieldChange('rgIssuer', e.target.value)} />
                                </div>
                            ) : (
                                <span>{displayData.rg || '-'} / {displayData.rgIssuer || '-'}</span>
                            )}
                        </FormField>
                        <FormField label="CNS (Cartão SUS)">
                            {isEditing ? <Input value={editedData.cns || ''} onChange={e => handleFieldChange('cns', e.target.value)} /> : <span>{displayData.cns || '-'}</span>}
                        </FormField>
                        <FormField label="Estado Civil">
                            {isEditing ? <Input value={editedData.estadoCivil || ''} onChange={e => handleFieldChange('estadoCivil', e.target.value)} /> : <span>{displayData.estadoCivil || '-'}</span>}
                        </FormField>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                             <Phone className="w-5 h-5 text-primary" />
                             Contatos
                        </CardTitle>
                    </CardHeader>
                     <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField label="Telefone Principal">
                            <span>{displayData.phones?.[0]?.number}</span>
                             <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700 ml-auto"><WhatsAppIcon className="w-5 h-5"/></Button>
                        </FormField>
                        <FormField label="E-mail">
                            <span>{displayData.emails?.[0]?.email}</span>
                             <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary ml-auto"><Mail className="w-4 h-4"/></Button>
                        </FormField>
                        <FormField label="Contato Preferencial">
                            <span>{displayData.preferredContactMethod}</span>
                        </FormField>
                     </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Contatos de Emergência
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {displayData.emergencyContacts?.map((contact, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 p-3 rounded-md border bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Avatar><AvatarFallback>{contact.name.charAt(0)}</AvatarFallback></Avatar>
                                    <div>
                                        <p className="font-medium text-slate-900">{contact.name} {contact.isLegalRepresentative && <Badge className="ml-2">Rep. Legal</Badge>}</p>
                                        <p className="text-sm text-slate-600">{contact.relationship} • {contact.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"><Phone className="h-4 h-4"/></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600"><WhatsAppIcon className="w-5 h-5"/></Button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>

            </div>

             <aside className="col-span-12 lg:col-span-4 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Resumo Rápido</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                         <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{displayData.adminData.status}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Complexidade</dt><dd className="font-medium text-red-600">{displayData.adminData.complexity}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Pacote</dt><dd className="font-medium">{displayData.adminData.servicePackage}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Última atualização</dt><dd className="text-xs text-muted-foreground">{new Date(displayData.audit.updatedAt).toLocaleDateString('pt-BR')}</dd></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Verificação de Identidade</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                         <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="font-medium flex items-center gap-1 text-green-600"><BadgeCheck className="w-4 h-4"/> Verificado</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Método</dt><dd className="font-medium">{displayData.documentValidation?.method}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Data</dt><dd className="text-xs">{displayData.documentValidation?.validatedAt ? new Date(displayData.documentValidation.validatedAt).toLocaleDateString('pt-BR') : '-'}</dd></div>
                         <div className="flex justify-between"><dt className="text-muted-foreground">Responsável</dt><dd className="text-xs">{displayData.documentValidation?.validatedBy}</dd></div>
                    </CardContent>
                </Card>
             </aside>

        </div>
    );
}
