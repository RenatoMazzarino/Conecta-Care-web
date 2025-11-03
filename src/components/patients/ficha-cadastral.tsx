'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
    User, Phone, Mail, Calendar, Home, Copy, FileText, BadgeCheck, Gavel
} from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.916-.816-.524.0-.624.0-.67.0-1.018.332-1.393 1.341-1.393 3.256c0 1.914 1.42 3.771 1.616 3.966.197.199 2.781 4.237 6.746 5.922.955.399 1.711.636 2.298.814.862.259 1.629.219 2.227.132.645-.087 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.815 11.815 0 005.792 1.634h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
    </svg>
);


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

    const handleCopy = (text: string | undefined, fieldName: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast({ title: `${fieldName} copiado!`, description: text });
    };

    const age = displayData.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Coluna da Esquerda */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Identificação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField label="ID do Paciente" className="md:col-span-2">
                           <span className="font-mono text-xs select-all">{displayData.id}</span>
                           <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(displayData.id, 'ID do Paciente')}><Copy className="w-3 h-3"/></Button>
                       </FormField>
                       <FormField label="Tratamento">
                           {isEditing ? (
                               <Select value={editedData.salutation || ''} onValueChange={v => handleFieldChange('salutation', v)}>
                                   <SelectTrigger><SelectValue/></SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="Sr.">Sr.</SelectItem>
                                       <SelectItem value="Sra.">Sra.</SelectItem>
                                   </SelectContent>
                               </Select>
                           ): (<span>{displayData.salutation || '-'}</span>)}
                       </FormField>
                       <FormField label="Nome Social / Apelido">
                           {isEditing ? <Input value={editedData.displayName} onChange={e => handleFieldChange('displayName', e.target.value)} /> : <span>{displayData.displayName}</span>}
                       </FormField>
                       <FormField label="Nome">
                           {isEditing ? <Input value={editedData.firstName} onChange={e => handleFieldChange('firstName', e.target.value)} /> : <span>{displayData.firstName}</span>}
                       </FormField>
                       <FormField label="Sobrenome">
                           {isEditing ? <Input value={editedData.lastName} onChange={e => handleFieldChange('lastName', e.target.value)} /> : <span>{displayData.lastName}</span>}
                       </FormField>
                        <FormField label="Nacionalidade">
                           {isEditing ? <Input value={editedData.nacionalidade || ''} onChange={e => handleFieldChange('nacionalidade', e.target.value)} /> : <span>{displayData.nacionalidade || '-'}</span>}
                       </FormField>
                       <FormField label="Naturalidade (Cidade/UF)">
                           {isEditing ? <Input value={editedData.naturalidade || ''} onChange={e => handleFieldChange('naturalidade', e.target.value)} /> : <span>{displayData.naturalidade || '-'}</span>}
                       </FormField>
                       <FormField label="Data de Nascimento">
                           {isEditing ? <Input type="date" value={editedData.dateOfBirth} onChange={e => handleFieldChange('dateOfBirth', e.target.value)} /> : <span>{new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} ({age})</span>}
                       </FormField>
                       <FormField label="Sexo de Nascimento">
                           {isEditing ? <Input value={editedData.sexo || ''} onChange={e => handleFieldChange('sexo', e.target.value)} /> : <span>{displayData.sexo || '-'}</span>}
                       </FormField>
                       <FormField label="Identidade de Gênero">
                           {isEditing ? <Input value={editedData.genderIdentity || ''} onChange={e => handleFieldChange('genderIdentity', e.target.value)} /> : <span>{displayData.genderIdentity || '-'}</span>}
                       </FormField>
                       <FormField label="Pronomes">
                           {isEditing ? <Input value={editedData.pronouns || ''} onChange={e => handleFieldChange('pronouns', e.target.value)} /> : <span>{displayData.pronouns || '-'}</span>}
                       </FormField>
                       <FormField label="Estado Civil">
                           {isEditing ? <Input value={editedData.estadoCivil || ''} onChange={e => handleFieldChange('estadoCivil', e.target.value)} /> : <span>{displayData.estadoCivil || '-'}</span>}
                       </FormField>
                       <FormField label="Idioma Preferencial">
                           {isEditing ? <Input value={editedData.preferredLanguage || ''} onChange={e => handleFieldChange('preferredLanguage', e.target.value)} /> : <span>{displayData.preferredLanguage || '-'}</span>}
                       </FormField>
                    </CardContent>

                    <Separator className="my-4"/>

                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Documentos e Validação</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                        <FormField label="CPF">
                            <div className="flex items-center gap-2">
                            <span className="font-mono">{displayData.cpf}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(displayData.cpf, 'CPF')}><Copy className="w-3 h-3"/></Button>
                            </div>
                            {displayData.cpfStatus && <Badge variant={displayData.cpfStatus === 'valid' ? 'secondary' : 'destructive'} className="ml-auto">{displayData.cpfStatus}</Badge>}
                        </FormField>
                        <FormField label="RG / Órgão Emissor">
                            {isEditing ? (
                                <div className="flex gap-2 w-full">
                                    <Input value={editedData.rg || ''} placeholder="RG" onChange={e => handleFieldChange('rg', e.target.value)} />
                                    <Input value={editedData.rgIssuer || ''} placeholder="Órgão Emissor" onChange={e => handleFieldChange('rgIssuer', e.target.value)} />
                                </div>
                            ) : (
                                <span className="truncate">{displayData.rg || '-'} / {displayData.rgIssuer || '-'}</span>
                            )}
                        </FormField>
                        <FormField label="CNS (Cartão SUS)">
                            {isEditing ? <Input value={editedData.cns || ''} onChange={e => handleFieldChange('cns', e.target.value)} /> : <span>{displayData.cns || '-'}</span>}
                        </FormField>
                        <FormField label="Doc. Estrangeiro (ID)">
                            {isEditing ? <Input value={editedData.nationalId || ''} onChange={e => handleFieldChange('nationalId', e.target.value)} /> : <span>{displayData.nationalId || '-'}</span>}
                        </FormField>
                        <FormField label="Validação de Documentos" className="lg:col-span-2">
                            <div className="flex items-center gap-2">
                                <Badge variant={displayData.documentValidation?.status === 'validated' ? 'secondary' : 'default'}>{displayData.documentValidation?.status || 'none'}</Badge>
                                {displayData.documentValidation?.status !== 'none' && (
                                    <span className="text-xs text-muted-foreground">({displayData.documentValidation?.method} por {displayData.documentValidation?.validatedBy} em {displayData.documentValidation?.validatedAt ? new Date(displayData.documentValidation.validatedAt).toLocaleDateString('pt-BR') : 'N/A'})</span>
                                )}
                            </div>
                        </FormField>
                    </CardContent>
                </Card>

                {/* Coluna da Direita */}
                <Card className="flex flex-col">
                     <CardHeader className="flex flex-row items-start justify-between">
                        <div className="flex items-center gap-2">
                            <Gavel className="w-5 h-5 text-primary mt-1" />
                            <div>
                                <CardTitle className="text-base">Representante Legal</CardTitle>
                            </div>
                        </div>
                        {displayData.legalGuardian?.powerOfAttorneyUrl && displayData.legalGuardian?.documentType && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                <BadgeCheck className="w-3 h-3 mr-1"/>
                                {displayData.legalGuardian.documentType} Cadastrada
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ScrollArea className="h-full">
                            <div className="pr-4">
                                {displayData.legalGuardian?.name ? (
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-1">
                                        <FormField label="Nome do Responsável">{displayData.legalGuardian.name}</FormField>
                                        <FormField label="Documento">{displayData.legalGuardian.document}</FormField>
                                        <FormField label="Tipo">{displayData.legalGuardian.documentType}</FormField>
                                        {displayData.legalGuardian.powerOfAttorneyUrl && (
                                            <div className="flex items-end">
                                                <Button variant="outline" size="sm" asChild className="w-full">
                                                    <Link href={displayData.legalGuardian.powerOfAttorneyUrl} target="_blank">Ver {displayData.legalGuardian.documentType}</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-sm text-muted-foreground text-center">Nenhum representante legal cadastrado.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    
                    <Separator className="my-4"/>

                    <CardHeader>
                        <CardTitle className="text-base">Contatos de Emergência</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ScrollArea className="h-full">
                        <div className="space-y-3 pr-4">
                            {displayData.emergencyContacts?.map((contact, index) => (
                            <div key={index} className="flex items-start justify-between gap-4 p-3 rounded-md border bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Avatar><AvatarFallback>{contact.name.charAt(0)}</AvatarFallback></Avatar>
                                    <div>
                                        <p className="font-medium text-slate-900">{contact.name} {contact.isLegalRepresentative && <Badge className="ml-2">Rep. Legal</Badge>}</p>
                                        <p className="text-sm text-slate-600">{contact.relationship} • {contact.phone}</p>
                                        {contact.email && <p className="text-xs text-slate-500">{contact.email}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"><Phone className="h-4 h-4"/></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600"><WhatsAppIcon className="w-5 h-5"/></Button>
                                </div>
                            </div>
                            ))}
                            {(!displayData.emergencyContacts || displayData.emergencyContacts.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-8">Nenhum contato de emergência.</p>
                            )}
                        </div>
                       </ScrollArea>
                    </CardContent>

                    <Separator className="my-4"/>

                     <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Phone className="w-5 h-5 text-primary" />
                            Contatos do Paciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField label="Telefone Principal">
                                <div className="flex items-center gap-2">
                                    <span>{displayData.phones?.[0]?.number}</span>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700 ml-auto"><WhatsAppIcon className="w-5 h-5"/></Button>
                                </div>
                            </FormField>
                            <FormField label="E-mail">
                                <div className="flex items-center gap-2">
                                    <span>{displayData.emails?.[0]?.email}</span>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary ml-auto"><Mail className="w-4 h-4"/></Button>
                                </div>
                            </FormField>
                            <FormField label="Contato Preferencial">
                                <span>{displayData.preferredContactMethod}</span>
                            </FormField>
                            <FormField label="Opt-Out de Comunicação" className="md:col-span-2 lg:col-span-3">
                                {displayData.communicationOptOut?.length > 0 ? (
                                    <div className="flex gap-2">
                                        {displayData.communicationOptOut.map(opt => <Badge key={opt.type}>{opt.type.toUpperCase()}</Badge>)}
                                    </div>
                                ) : (
                                    <span>Nenhum</span>
                                )}
                            </FormField>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
