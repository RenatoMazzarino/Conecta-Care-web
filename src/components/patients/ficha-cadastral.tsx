

'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home, Briefcase, Link as LinkIcon, FileText, NotebookTabs, Wallet, Users, ShieldCheck, FolderOpen, History, MessageCircle, Edit, Save, BadgeCheck, BadgeAlert, Gavel, FileWarning } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { EditMode } from './patient-details-panel';
import { Badge } from '@/components/ui/badge';

// Define a simple SVG icon for WhatsApp
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39z M22.311 19.74c-.258 0-.81.272-.81.272s-.486.272-1.39.272c-.902 0-1.39-.272-1.39-.272s-.486-.272-1.39-.272c-.902 0-1.39.272-1.39.272s-.486.272-1.39.272c-1.562 0-2.822-1.259-2.822-2.822s1.259-2.822 2.822-2.822c1.562 0 2.822 1.259 2.822 2.822 0 .258-.054.486-.108.702a.63.63 0 0 1-.162.272.63.63 0 0 1 .108.432c0 .902.702 1.568 1.568 1.568.902 0 1.568-.702 1.568-1.568a1.518 1.518 0 0 1 .108-1.518.63.63 0 0 1 .108-.272c.054-.216.108-.486.108-.702 0-1.562 1.259-2.822 2.822-2.822 1.562 0 2.822 1.259 2.822 2.822s-1.259 2.822-2.822 2.822z" fillRule="evenodd" clipRule="evenodd" fill="#fff" stroke="none" transform="translate(4.42 4.42) scale(1.03)"/></svg>
);

type FormSectionProps = {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    editMode?: boolean;
    onEdit?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    isSaveDisabled?: boolean;
    headerContent?: React.ReactNode;
};

const FormSection: React.FC<FormSectionProps> = ({ icon: Icon, title, children, editMode, onEdit, onSave, onCancel, isSaveDisabled, headerContent }) => {
    return (
        <div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-primary">{title}</h3>
                    {headerContent}
                </div>
                {!editMode && onEdit && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="pt-4">{children}</div>
             {editMode && onSave && onCancel && (
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                    <Button onClick={onSave} disabled={isSaveDisabled}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                    </Button>
                </div>
            )}
        </div>
    );
};

const FormRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>
);

const FormField = ({ label, value, action }: { label: string, value: React.ReactNode, action?: React.ReactNode }) => (
    <div>
        <Label className="flex items-center gap-2">{label}{action}</Label>
        <div className="text-sm text-foreground mt-1 whitespace-pre-wrap">{value || <span className="text-muted-foreground italic">Não informado</span>}</div>
    </div>
);

const FormInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <div>
        <Label>{label}</Label>
        <Input value={value} onChange={onChange} placeholder={placeholder} className="mt-1" />
    </div>
);

const FormSelect = ({ label, value, onValueChange, children }: { label: string, value: string, onValueChange: (value: string) => void, children: React.ReactNode }) => (
    <div>
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

const CardEditButton = ({ card, children }: { card: EditMode, children: React.ReactNode }) => (
  <div onClick={(e) => e.stopPropagation()}>
      {children}
  </div>
);


export function FichaCadastral({ editMode, setEditMode, displayData, editedData, setEditedData, onSave, onCancel }: FichaCadastralProps) {
  if (!displayData || !editedData) return null;

  const isCardEditing = (card: EditMode) => editMode === 'full' || editMode === card;

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
    <Accordion type="multiple" defaultValue={['dadosPessoais', 'contato']} className="w-full space-y-4">
      <AccordionItem value="dadosPessoais">
        <Card>
          <CardHeader className="p-0">
             <div className="flex items-center p-6 hover:bg-accent/50 rounded-t-lg">
                <AccordionTrigger className="flex-1">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-primary">Dados Pessoais</h3>
                    </div>
                </AccordionTrigger>
                 <CardEditButton card="dadosPessoais">
                    {isCardEditing('dadosPessoais') ? (
                       <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                            <Button onClick={onSave}><Save className="mr-2 h-4 w-4" />Salvar</Button>
                        </div>
                    ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditMode('dadosPessoais')}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </CardEditButton>
            </div>
          </CardHeader>
          <AccordionContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                  <FormSection icon={User} title="Identificação Básica">
                      {isCardEditing('dadosPessoais') ? (
                           <>
                             <FormField label="Nome Completo (Visualização)" value={fullName}/>
                             <FormRow>
                                <FormSelect label="Tratamento" value={editedData.pronouns || 'none'} onValueChange={(v) => handleRootFieldChange('pronouns', v)}>
                                    <SelectItem value="none">Nenhum</SelectItem>
                                    <SelectItem value="Sr.">Sr.</SelectItem>
                                    <SelectItem value="Sra.">Sra.</SelectItem>
                                    <SelectItem value="Sre.">Sre.</SelectItem>
                                </FormSelect>
                                <FormInput label="Nome de Preferência" value={editedData.displayName} onChange={(e) => handleRootFieldChange('displayName', e.target.value)} />
                             </FormRow>
                             <FormRow>
                                <FormInput label="Nome" value={editedData.firstName} onChange={(e) => handleRootFieldChange('firstName', e.target.value)} />
                                <FormInput label="Sobrenome" value={editedData.lastName} onChange={(e) => handleRootFieldChange('lastName', e.target.value)} />
                              </FormRow>
                              <FormRow>
                                <FormInput label="CPF" value={editedData.cpf} onChange={(e) => handleRootFieldChange('cpf', e.target.value)} />
                                <FormInput label="RG" value={editedData.rg || ''} onChange={(e) => handleRootFieldChange('rg', e.target.value)} />
                              </FormRow>
                               <FormRow>
                                <FormInput label="CNS" value={editedData.cns || ''} onChange={(e) => handleRootFieldChange('cns', e.target.value)} />
                                <FormInput label="Órgão Emissor" value={editedData.rgIssuer || ''} onChange={(e) => handleRootFieldChange('rgIssuer', e.target.value)} />
                              </FormRow>
                              <FormRow>
                                <FormInput label="Nacionalidade" value={editedData.nacionalidade || ''} onChange={(e) => handleRootFieldChange('nacionalidade', e.target.value)} />
                                <FormInput label="Local de Nascimento" value={editedData.naturalidade || ''} onChange={(e) => handleRootFieldChange('naturalidade', e.target.value)} />
                              </FormRow>
                              <FormRow>
                                <FormInput label="Data de Nascimento" value={editedData.dateOfBirth} onChange={(e) => handleRootFieldChange('dateOfBirth', e.target.value)} />
                                <FormInput label="Identidade de Gênero" value={editedData.genderIdentity || ''} onChange={(e) => handleRootFieldChange('genderIdentity', e.target.value)} />
                              </FormRow>
                              <FormRow>
                                  <FormSelect label="Sexo de Nascimento" value={editedData.sexo || ''} onValueChange={v => handleRootFieldChange('sexo', v)}>
                                      <SelectItem value="Masculino">Masculino</SelectItem>
                                      <SelectItem value="Feminino">Feminino</SelectItem>
                                      <SelectItem value="Outro">Outro</SelectItem>
                                  </FormSelect>
                                   <FormSelect label="Idioma" value={editedData.preferredLanguage || ''} onValueChange={v => handleRootFieldChange('preferredLanguage', v)}>
                                      <SelectItem value="Português">Português</SelectItem>
                                      <SelectItem value="Inglês">Inglês</SelectItem>
                                      <SelectItem value="Espanhol">Espanhol</SelectItem>
                                  </FormSelect>
                              </FormRow>
                           </>
                      ) : (
                          <>
                            <FormRow>
                                <FormField label="Tratamento" value={displayData.pronouns} />
                                <FormField label="Nome de Preferência" value={displayData.displayName} />
                            </FormRow>
                            <FormField label="Nome Completo" value={fullName} />
                            <FormRow>
                                <FormField label="CPF" value={displayData.cpf} action={
                                      <Badge variant={displayData.cpfStatus === 'valid' ? 'secondary' : 'destructive'} className={cn('ml-2', displayData.cpfStatus === 'valid' && 'bg-green-100 text-green-800')}>
                                        <BadgeCheck className="h-3 w-3 mr-1" />{displayData.cpfStatus === 'valid' ? 'Verificado' : 'Não Verificado'}
                                      </Badge>
                                }/>
                                <FormField label="RG" value={`${displayData.rg || ''} ${displayData.rgIssuer || ''}`} action={
                                    <Badge variant={displayData.documentValidation?.status === 'validated' ? 'secondary' : 'destructive'} className={cn('ml-2', displayData.documentValidation?.status === 'validated' && 'bg-green-100 text-green-800')}>
                                      <BadgeCheck className="h-3 w-3 mr-1" />{displayData.documentValidation?.status === 'validated' ? 'Verificado' : 'Pendente'}
                                    </Badge>
                                }/>
                            </FormRow>
                             <FormRow>
                                <FormField label="CNS" value={displayData.cns} action={
                                     <Badge variant={displayData.documentValidation?.status === 'validated' ? 'secondary' : 'destructive'} className={cn('ml-2', displayData.documentValidation?.status === 'validated' && 'bg-green-100 text-green-800')}>
                                      <BadgeCheck className="h-3 w-3 mr-1" />{displayData.documentValidation?.status === 'validated' ? 'Verificado' : 'Pendente'}
                                    </Badge>
                                }/>
                                <FormField label="Nacionalidade" value={displayData.nacionalidade} />
                             </FormRow>
                             <FormRow>
                                <FormField label="Local de Nascimento" value={displayData.naturalidade} />
                                <FormField label="Data de Nascimento" value={`${new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC'})} (${age})`} />
                            </FormRow>
                            <FormRow>
                                <FormField label="Sexo de Nascimento" value={displayData.sexo} />
                                <FormField label="Identidade de Gênero" value={displayData.genderIdentity} />
                            </FormRow>
                            <FormRow>
                                <FormField label="Idioma" value={displayData.preferredLanguage} />
                            </FormRow>
                          </>
                      )}
                  </FormSection>
              </div>

               <div className="lg:col-span-1">
                   <FormSection icon={Gavel} title="Representante Legal">
                       <FormField label="Nome" value={displayData.legalGuardian?.name} />
                       <FormField label="Documento" value={displayData.legalGuardian?.document} />
                       <FormField label="Procuração" value={
                           <Button variant="link" asChild className="p-0 h-auto"><Link href={displayData.legalGuardian?.powerOfAttorneyUrl || '#'}><LinkIcon className="mr-2 h-4 w-4" />Visualizar</Link></Button>
                       }/>
                   </FormSection>
               </div>
            </div>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="contato">
        <Card>
            <CardHeader className="p-0">
               <div className="flex items-center p-6 hover:bg-accent/50 rounded-t-lg">
                    <AccordionTrigger className="flex-1">
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-primary">Informações de Contato</h3>
                            {displayData.preferredContactMethod && (
                                <Badge>{`Prefere ${displayData.preferredContactMethod}`}</Badge>
                            )}
                        </div>
                    </AccordionTrigger>
                    <CardEditButton card="dadosPessoais">
                        {isCardEditing('dadosPessoais') ? (
                          <span></span>
                        ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditMode('dadosPessoais')}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </CardEditButton>
                </div>
            </CardHeader>
            <AccordionContent className="p-6">
                <div className="space-y-4">
                  <FormSection icon={Phone} title="Telefones">
                    {displayData.phones.map((phone, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <span className="capitalize text-sm font-medium">{phone.type}:</span>
                        <span className="text-sm">{phone.number}</span>
                         {phone.type === 'mobile' && (
                             <a href={`https://wa.me/${phone.number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="ml-2">
                                <WhatsAppIcon className="h-5 w-5 text-green-500"/>
                            </a>
                        )}
                      </div>
                    ))}
                  </FormSection>
                   <FormSection icon={Mail} title="E-mails">
                    {displayData.emails?.map((email, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <span className="text-sm">{email.email}</span>
                        <a href={`mailto:${email.email}`} className="ml-2">
                            <Mail className="h-4 w-4 text-muted-foreground"/>
                        </a>
                      </div>
                    ))}
                  </FormSection>
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
                       {isCardEditing('dadosPessoais') && (
                           <Button variant="outline" className="w-full">Adicionar Contato</Button>
                       )}
                      </div>
                  </FormSection>
                </div>
            </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
}
