
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
    Shield, AlertTriangle, Star, Eye, Copy, Download, FileText, Upload
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { EditMode } from './patient-details-panel';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39z M16.749 21.13c-1.389 0-2.5-1.11-2.5-2.5 0-1.389 1.111-2.5 2.5-2.5 1.389 0 2.5 1.111 2.5 2.5 0 1.39-1.111 2.5-2.5 2.5z M22.311 19.74c-.258 0-.81.272-1.39.272s-1.132-.272-1.39-.272c-.258 0-.81.272-1.39.272s-1.132-.272-1.39-.272c-.258 0-.81.272-1.39.272s-1.132-.272-1.39-.272c-2.08 0-3.72-1.72-3.72-3.72s1.72-3.72 3.72-3.72c.258 0 .81-.272 1.39-.272s1.132.272 1.39.272c.258 0 .81-.272 1.39-.272s1.132.272 1.39.272c.258 0 .81-.272 1.39-.272s1.132.272 1.39-.272c2.08 0 3.72 1.72 3.72 3.72s-1.72 3.72-3.72-3.72z"/></svg>
);


type FormSectionProps = {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
};

const FormSection: React.FC<FormSectionProps> = ({ icon: Icon, title, children }) => {
    return (
        <fieldset className="bg-card border rounded-md p-4">
            <legend className="text-sm font-semibold text-slate-900 flex items-center gap-2 px-2">
                <Icon className="w-5 h-5 text-slate-700" />
                {title}
            </legend>
            <div className="mt-4">{children}</div>
        </fieldset>
    );
};

const FormRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>
);

const FormField = ({ label, value, action }: { label: string, value: React.ReactNode, action?: React.ReactNode }) => (
    <div>
        <Label className="text-xs text-gray-600 flex items-center gap-2">{label} {action}</Label>
        <div className="mt-1 w-full rounded-md border bg-muted/50 p-2 text-sm text-foreground min-h-[36px] flex items-center">
            {value || <span className="text-muted-foreground italic">Não informado</span>}
        </div>
    </div>
);


const FormInput = ({ label, value, onChange, placeholder, isFullWidth }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, isFullWidth?: boolean }) => (
    <div className={cn(isFullWidth && "md:col-span-2")}>
        <Label className="text-xs text-gray-600">{label}</Label>
        <Input value={value} onChange={onChange} placeholder={placeholder} className="mt-1 text-sm" />
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
};

export function FichaCadastral({ editMode, setEditMode, displayData, editedData, setEditedData, onSave, onCancel }: FichaCadastralProps) {
    if (!displayData || !editedData) return null;

    const isEditing = editMode !== 'none';
    const fullName = `${displayData.firstName || ''} ${displayData.lastName || ''}`.trim();
    const age = displayData.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;

    const mainAllergy = displayData.clinicalData?.allergies?.[0];

    const handleFieldChange = (card: keyof Patient, field: string, value: any) => {
        setEditedData({
            ...editedData,
            [card]: {
                ...(editedData[card] as any),
                [field]: value
            }
        });
    };

    const handleRootFieldChange = (field: keyof Patient, value: any) => {
        setEditedData({
            ...editedData,
            [field]: value
        });
    };

    return (
        <section aria-labelledby="patient-personal-title" className="bg-card shadow rounded-lg border overflow-hidden">
            <header className="flex items-center justify-between gap-4 p-5 bg-muted/30">
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
                        <p className="mt-1 text-sm text-slate-600 flex items-center">
                            {age && <span id="patient-age">{age}</span>}
                            <span className="mx-2">•</span>
                            <span id="patient-cpf" className="text-sm text-slate-500">CPF: <strong className="ml-1">***.***.***-00</strong></span>
                            <Button type="button" title="Mostrar CPF" variant="ghost" size="icon" className="ml-2 h-7 w-7 text-gray-500 hover:bg-gray-50">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </p>
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
                    <Button variant="outline" title="Anexar documento"><Upload className="w-4 h-4 mr-2" /> Anexar</Button>
                    <Button variant="outline" title="Exportar ficha"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                     {isEditing ? (
                        <>
                         <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2"/> Cancelar</Button>
                         <Button onClick={onSave}><BadgeCheck className="w-4 h-4 mr-2"/> Salvar Alterações</Button>
                        </>
                    ) : (
                         <Button onClick={() => setEditMode('full')}><Edit className="w-4 h-4 mr-2"/> Editar</Button>
                    )}
                </div>
            </header>
            
            <div className="p-6 space-y-6">
                 <div className="grid grid-cols-12 gap-6">
                     <div className="col-span-12 lg:col-span-8 space-y-6">
                        <FormSection icon={User} title="Identificação">
                            <FormRow>
                                <FormField label="Nome" value={displayData.firstName} />
                                <FormField label="Sobrenome" value={displayData.lastName} />
                            </FormRow>
                             <FormRow className="mt-4">
                                <FormField label="Nome Social" value={displayData.displayName} />
                                <FormField label="Data de Nascimento" value={`${new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} (${age})`} />
                            </FormRow>
                            <FormRow className="mt-4">
                                <FormField label="CPF" value={displayData.cpf} action={
                                    <BadgeCheck className="w-4 h-4 text-green-600" />
                                }/>
                                <FormField label="RG / Órgão Emissor" value={`${displayData.rg || ''} - ${displayData.rgIssuer || ''}`} action={
                                    <BadgeCheck className="w-4 h-4 text-green-600" />
                                } />
                            </FormRow>
                        </FormSection>

                        <FormSection icon={Phone} title="Contatos">
                             <FormRow>
                                <FormField label="Telefone principal" value={
                                     <div className="flex items-center gap-2">
                                        <span>{displayData.phones[0]?.number}</span>
                                        <a href="#" className="text-green-500 hover:text-green-600"><WhatsAppIcon className="h-5 w-5"/></a>
                                    </div>
                                } />
                                <FormField label="E-mail" value={
                                    <div className="flex items-center gap-2">
                                        <span>{displayData.emails?.[0]?.email}</span>
                                        <a href="#" className="text-muted-foreground hover:text-primary"><Mail className="h-4 w-4"/></a>
                                    </div>
                                } />
                            </FormRow>
                        </FormSection>

                         <FormSection icon={Users} title="Contato(s) de Emergência">
                            <div className="grid grid-cols-1 gap-3">
                                {displayData.emergencyContacts.map((contact, index) => (
                                     <div key={index} className="flex items-center justify-between gap-4 p-3 rounded-md border bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-slate-900">{contact.name}</div>
                                                <div className="text-sm text-slate-600">{contact.relationship} • {contact.phone}</div>
                                            </div>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <Button type="button" size="icon" variant="outline" title="Ligar" className="h-8 w-8"><Phone className="h-4 w-4"/></Button>
                                            <Button type="button" size="icon" variant="outline" title="Enviar WhatsApp" className="h-8 w-8"><WhatsAppIcon className="h-4 w-4 text-green-600"/></Button>
                                         </div>
                                     </div>
                                ))}
                            </div>
                        </FormSection>
                     </div>
                     <aside className="col-span-12 lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">Documentos</CardTitle>
                                <CardDescription className="text-xs">Última validação: 20/07/2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <ul className="space-y-3">
                                    <li className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-slate-500" />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">RG Digital</div>
                                                <div className="text-xs text-slate-600">Não enviado</div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">Enviar</Button>
                                    </li>
                                     <li className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-slate-500" />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">Carteirinha do Plano</div>
                                                <div className="text-xs text-slate-600">{displayData.financial.carteirinha}</div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">Validar</Button>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-900">Indicadores rápidos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <dl className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                                    <div className="flex items-center justify-between">
                                      <dt className="text-slate-600">Status do paciente</dt>
                                      <dd className="font-medium">{displayData.adminData.status}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <dt className="text-slate-600">Complexidade</dt>
                                      <dd className="font-medium text-red-600">{displayData.adminData.complexity}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <dt className="text-slate-600">Pacote</dt>
                                      <dd className="font-medium">{displayData.adminData.servicePackage}</dd>
                                    </div>
                                </dl>
                            </CardContent>
                         </Card>

                     </aside>
                 </div>
            </div>
        </section>
    );
}
