'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home, Link as LinkIcon, Gavel, BadgeCheck, Users } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { EditMode } from './patient-details-panel';
import { Badge } from '@/components/ui/badge';

// Define a simple SVG icon for WhatsApp
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39z M22.311 19.74c-.258 0-.81.272-.81.272s-.486.272-1.39.272c-.902 0-1.39-.272-1.39-.272s-.486-.272-1.39-.272c-.902 0-1.39.272-1.39.272s-.486.272-1.39-.272c-1.562 0-2.822-1.259-2.822-2.822s1.259-2.822 2.822-2.822c1.562 0 2.822 1.259 2.822 2.822 0 .258-.054.486-.108.702a.63.63 0 0 1-.162.272.63.63 0 0 1 .108.432c0 .902.702 1.568 1.568 1.568.902 0 1.568-.702 1.568-1.568a1.518 1.518 0 0 1 .108-1.518.63.63 0 0 1 .108-.272c.054-.216.108-.486.108-.702 0-1.562 1.259-2.822 2.822-2.822 1.562 0 2.822 1.259 2.822 2.822s-1.259 2.822-2.822 2.822z" fillRule="evenodd" clipRule="evenodd" fill="#fff" stroke="none" transform="translate(4.42 4.42) scale(1.03)"/></svg>
);

type FormSectionProps = {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    className?: string;
};

const FormSection: React.FC<FormSectionProps> = ({ icon: Icon, title, children, headerContent, className }) => {
    return (
        <div className={className}>
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                {headerContent}
            </div>
            <div className="pt-4">{children}</div>
        </div>
    );
};

const FormRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>
);

const FormField = ({ label, value, action, isFullWidth, valueClassName }: { label: string, value: React.ReactNode, action?: React.ReactNode, isFullWidth?: boolean, valueClassName?: string }) => (
    <div className={cn(isFullWidth && "md:col-span-2")}>
        <div className="flex items-center gap-2">
            <Label className="text-muted-foreground">{label}</Label>
            {action}
        </div>
        <div className={cn("text-sm text-foreground mt-1 whitespace-pre-wrap", valueClassName)}>{value || <span className="text-muted-foreground italic">Não informado</span>}</div>
    </div>
);

const FormInput = ({ label, value, onChange, placeholder, isFullWidth }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, isFullWidth?: boolean }) => (
    <div className={cn(isFullWidth && "md:col-span-2")}>
        <Label>{label}</Label>
        <Input value={value} onChange={onChange} placeholder={placeholder} className="mt-1" />
    </div>
);

const FormSelect = ({ label, value, onValueChange, children, isFullWidth }: { label: string, value: string, onValueChange: (value: string) => void, children: React.ReactNode, isFullWidth?: boolean }) => (
    <div className={cn(isFullWidth && "md:col-span-2")}>
        <Label>{label}</Label>
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{children}</SelectContent>
        </Select>
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
  
  const fullName = `${displayData.firstName || ''} ${displayData.lastName || ''}`.trim();
  const age = displayData.dateOfBirth ? `${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos` : null;

  return (
    <Card>
      <CardHeader>
        {/* ... Header content ... */}
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FormSection icon={User} title="Identificação Básica" className="lg:col-span-2">
             <FormRow>
                <FormField label="ID do Paciente" value={displayData.id} />
             </FormRow>
            <FormRow className="mt-4">
              <FormField label="Tratamento" value={displayData.pronouns} />
              <FormField label="Nome de Preferência" value={displayData.displayName} />
            </FormRow>
             <FormRow className="mt-4">
                <FormField label="Nome Completo" value={fullName} isFullWidth />
            </FormRow>
            <FormRow className="mt-4">
              <FormField
                label="CPF"
                value={displayData.cpf}
                action={
                    <Badge variant={displayData.cpfStatus === 'valid' ? 'secondary' : 'destructive'} className={cn(displayData.cpfStatus === 'valid' && 'bg-green-100 text-green-800')}>
                        <BadgeCheck className="h-3 w-3 mr-1" />{displayData.cpfStatus === 'valid' ? 'Verificado' : 'Não Verificado'}
                    </Badge>
                }
              />
              <FormField
                label="RG"
                value={`${displayData.rg || ''} ${displayData.rgIssuer || ''}`}
                 action={
                    <Badge variant={displayData.documentValidation?.status === 'validated' ? 'secondary' : 'destructive'} className={cn(displayData.documentValidation?.status === 'validated' && 'bg-green-100 text-green-800')}>
                        <BadgeCheck className="h-3 w-3 mr-1" />{displayData.documentValidation?.status === 'validated' ? 'Verificado' : 'Não Verificado'}
                    </Badge>
                }
              />
            </FormRow>
            <FormRow className="mt-4">
               <FormField
                label="CNS"
                value={displayData.cns}
                 action={
                    <Badge variant={displayData.documentValidation?.status === 'validated' ? 'secondary' : 'destructive'} className={cn(displayData.documentValidation?.status === 'validated' && 'bg-green-100 text-green-800')}>
                        <BadgeCheck className="h-3 w-3 mr-1" />{displayData.documentValidation?.status === 'validated' ? 'Verificado' : 'Não Verificado'}
                    </Badge>
                }
              />
              <FormField label="Nacionalidade" value={displayData.nacionalidade} />
            </FormRow>
            <FormRow className="mt-4">
              <FormField label="Local de Nascimento" value={displayData.naturalidade} />
              <FormField label="Data de Nascimento" value={`${new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} (${age})`} />
            </FormRow>
            <FormRow className="mt-4">
              <FormField label="Sexo de Nascimento" value={displayData.sexo} />
              <FormField label="Identidade de Gênero" value={displayData.genderIdentity} />
            </FormRow>
             <FormRow className="mt-4">
              <FormField label="Idioma" value={displayData.preferredLanguage} />
            </FormRow>
          </FormSection>

          <FormSection icon={Gavel} title="Representante Legal">
            <FormField label="Nome" value={displayData.legalGuardian?.name} />
            <FormField label="Documento" value={displayData.legalGuardian?.document} />
            <FormField
              label="Procuração"
              value={
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href={displayData.legalGuardian?.powerOfAttorneyUrl || '#'}><LinkIcon className="mr-2 h-4 w-4" />Visualizar</Link>
                </Button>
              }
            />
          </FormSection>
        </div>
        
        <hr/>
        
        <FormSection
          icon={Phone}
          title="Informações de Contato"
          headerContent={
            displayData.preferredContactMethod && <Badge className="ml-2">{`Prefere ${displayData.preferredContactMethod}`}</Badge>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label className="text-base font-semibold text-foreground">Telefones</Label>
              <div className="mt-2 space-y-2">
                {displayData.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
                    <span className="font-medium capitalize">{phone.type}:</span>
                    <span>{phone.number}</span>
                    {phone.type === 'mobile' && (
                      <a href={`https://wa.me/${phone.number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="ml-1">
                        <WhatsAppIcon className="h-5 w-5 text-green-500 fill-current" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold text-foreground">E-mails</Label>
              <div className="mt-2 space-y-2">
                {displayData.emails?.map((email, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
                    <span>{email.email}</span>
                    <a href={`mailto:${email.email}`} className="ml-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <hr/>

        <FormSection icon={Users} title="Contatos de Emergência">
          <div className="space-y-3">
            {displayData.emergencyContacts.map((contact, index) => (
              <div key={index} className="p-3 border rounded-lg bg-background">
                <div className="font-semibold flex items-center justify-between">
                  <span>{contact.name}</span>
                  {contact.isLegalRepresentative && <Badge className="ml-2">Rep. Legal</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                <div className="mt-2 text-sm flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <span>{contact.email || 'Não informado'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FormSection>
      </CardContent>
    </Card>
  );
}
