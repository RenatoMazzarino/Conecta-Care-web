
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
import type { EditMode } from './patient-details-panel';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '@/components/ui/badge';

// Define a simple SVG icon for WhatsApp
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}><path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39z M16.749 21.13c-1.389 0-2.5-1.11-2.5-2.5 0-1.389 1.111-2.5 2.5-2.5 1.389 0 2.5 1.111 2.5 2.5 0 1.39-1.111 2.5-2.5 2.5z M22.311 19.74c-.258 0-.81.272-1.39.272s-1.132-.272-1.39-.272c-.258 0-.81.272-1.39.272s-1.132-.272-1.39-.272c-.258 0-.81.272-1.39.272s-1.132-.272-1.39-.272c-2.08 0-3.72-1.72-3.72-3.72s1.72-3.72 3.72-3.72c.258 0 .81-.272 1.39-.272s1.132.272 1.39.272c.258 0 .81-.272 1.39.272s1.132.272 1.39.272c.258 0 .81-.272 1.39.272s1.132.272 1.39-.272c2.08 0 3.72 1.72 3.72 3.72s-1.72 3.72-3.72-3.72z" /></svg>
);


type FormSectionProps = {
    icon: React.ElementType;
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
};

const FormSection: React.FC<FormSectionProps> = ({ icon: Icon, title, action, children }) => {
    return (
        <fieldset>
            <div className="flex items-center justify-between">
                <legend className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-slate-700" />
                    {title}
                </legend>
                {action}
            </div>
            <div className="mt-4">{children}</div>
        </fieldset>
    );
};

const FormRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>
);

const FormField = ({ label, value, action, isEditing, editComponent }: { 
    label: string, 
    value: React.ReactNode, 
    action?: React.ReactNode,
    isEditing?: boolean,
    editComponent?: React.ReactNode
}) => (
    <div>
        <div className="text-xs text-gray-600 flex items-center gap-2 mb-1">
          <Label>{label}</Label>
          {action}
        </div>
        {isEditing ? (
             <div className="">{editComponent}</div>
        ) : (
            <div className="w-full rounded-md border bg-muted/50 p-2 text-sm text-foreground min-h-[36px] flex items-center justify-between">
                <div>{value || <span className="text-muted-foreground italic">Não informado</span>}</div>
                {action && isEditing && <div className="ml-2">{action}</div>}
            </div>
        )}
    </div>
);


const FormInput = ({ label, value, onChange, placeholder, isFullWidth, required=false }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, isFullWidth?: boolean, required?: boolean }) => (
    <div className={cn(isFullWidth && "md:col-span-2")}>
        <Label className="text-xs text-gray-600">{label}</Label>
        <Input value={value || ''} onChange={onChange} placeholder={placeholder} className="mt-1 text-sm" required={required}/>
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
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newEditedData;
        });
    };
    
    return (
        <section aria-labelledby="patient-personal-title">
            {/* HEADER */}
            <header className="flex items-center justify-between gap-4 p-5 bg-card rounded-t-lg border">
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
            </header>
            
            {/* BODY */}
            <div className="p-6 bg-card rounded-b-lg border border-t-0">
                <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Dados Pessoais
                          </h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-2">
                          <div className="grid grid-cols-12 gap-x-8">
                              <div className="col-span-12 lg:col-span-7 space-y-6">
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
                                    <hr className="my-4" />
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
                                        <FormField label="CPF" value={displayData.cpf} action={ <Badge variant={editedData.cpfStatus === 'valid' ? 'secondary' : 'destructive'} className={cn(editedData.cpfStatus === 'valid' && 'bg-green-100 text-green-800')}><BadgeCheck className="h-3 w-3 mr-1"/> Verificado</Badge>} />
                                        <FormField label="RG" value={displayData.rg} action={ <Badge variant={editedData.documentValidation?.status === 'validated' ? 'secondary' : 'destructive'} className={cn(editedData.documentValidation?.status === 'validated' && 'bg-green-100 text-green-800')}><BadgeCheck className="h-3 w-3 mr-1"/> Verificado</Badge>} />
                                    </FormRow>
                                     <FormRow className="mt-4">
                                        <FormField label="CNS" value={displayData.cns} action={ <Badge variant="outline"><X className="w-3 h-3 mr-1"/> Pendente</Badge>} />
                                    </FormRow>
                                </FormSection>
                              </div>
                              <aside className="col-span-12 lg:col-span-5">
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
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                           <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Phone className="w-5 h-5 text-primary" /> Contato e Responsáveis
                          </h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-2">
                            <FormSection icon={Phone} title="Informações de Contato" action={
                              <Badge variant="outline">Contato Preferencial: {displayData.preferredContactMethod}</Badge>
                            }>
                              <FormRow>
                                  <FormField label="Telefone" value={displayData.phones[0]?.number} action={
                                      <a href="#" title="Iniciar conversa no WhatsApp" className="text-green-600 hover:text-green-700"><WhatsAppIcon className="h-5 w-5"/></a>
                                  }/>
                                  <FormField label="Email" value={displayData.emails?.[0]?.email} action={
                                      <a href="#" title="Enviar email" className="text-muted-foreground hover:text-primary"><Mail className="h-4 w-4"/></a>
                                  }/>
                              </FormRow>
                            </FormSection>
                            
                            <hr className="my-6"/>
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
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
