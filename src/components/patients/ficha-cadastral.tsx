

'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home, Building, Dog, Ambulance, Stethoscope, Pill, Plus, X, Briefcase, Link as LinkIcon, FileText, NotebookTabs, Wallet, Users, ShieldCheck, FolderOpen, History, MessageCircle, Edit, Save, BadgeCheck, BadgeAlert, Gavel, FileWarning } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { EditMode } from './patient-details-panel';
import { Badge } from '@/components/ui/badge';

// Define a simple SVG icon for WhatsApp
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" {...props}><path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm12.108-2.162c-2.31-2.31-5.4-3.582-8.664-3.582-6.8 0-12.32 5.52-12.32 12.32 0 2.162.56 4.212 1.562 5.952L2.5 29.5l4.68-1.562c1.632 1 3.582 1.562 5.82 1.562 6.8 0 12.32-5.52 12.32-12.32 0-3.264-1.272-6.354-3.582-8.664zM13 27.5c-2.088 0-4.044-.81-5.52-2.28l-.372-.444-4.152 1.39 1.432-4.044-.444-.372c-1.47-1.47-2.28-3.432-2.28-5.52 0-5.49 4.47-9.96 9.96-9.96 2.688 0 5.16 1.044 7.044 2.928 1.884 1.884 2.928 4.356 2.928 7.044-.012 5.48-4.47 9.96-9.96 9.96z" fill="currentColor" fillRule="evenodd"></path></svg>
);


const FormSection: React.FC<{ title: string; icon: LucideIcon; children: React.ReactNode, className?: string, headerChildren?: React.ReactNode }> = ({ title, icon: Icon, children, className, headerChildren }) => (
  <div className={cn("pt-4", className)}>
    <div className="flex justify-between items-center border-b mb-3 pb-2">
      <h3 className="text-md font-semibold text-primary flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </h3>
      {headerChildren}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const FormField: React.FC<{ label: React.ReactNode; isEditing: boolean; value: React.ReactNode; children?: React.ReactNode; className?: string; action?: React.ReactNode }> = ({ label, isEditing, value, children, className, action }) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <div className="text-xs text-muted-foreground flex justify-between items-center">
      <Label>{label}</Label>
      {action && isEditing && <div className="pr-1">{action}</div>}
    </div>
    {isEditing ? (
      children
    ) : (
      <div className="flex items-center justify-between text-sm h-10">
        <div className="truncate flex items-center gap-2">{value || '-'}</div>
      </div>
    )}
  </div>
);

type CardEditButtonProps = {
  card: EditMode;
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
};

const CardEditButton = ({ card, editMode, setEditMode }: CardEditButtonProps) => {
  if (editMode !== 'none' && editMode !== card) return null;
  if (editMode === card) return null;

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditMode(card); }}>
      <Edit className="h-4 w-4" />
    </Button>
  );
};


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
  if (!displayData) return null;

  const isFullEditing = editMode === 'full';

  const handleFieldChange = (section: keyof Patient, field: string, value: any, subSection?: string) => {
    if (!editedData) return;
    const newData = JSON.parse(JSON.stringify(editedData));
    if (subSection) {
      (newData[section] as any)[subSection][field] = value;
    } else {
      (newData[section] as any)[field] = value;
    }
    setEditedData(newData);
  };

  const handleArrayChange = (section: keyof Patient, index: number, field: string, value: any) => {
    if (!editedData) return;
    const newData = JSON.parse(JSON.stringify(editedData));
    if (!newData[section]) (newData[section] as any) = [];
    (newData[section] as any[])[index][field] = value;
    setEditedData(newData);
  }
  
  const addToArray = (section: keyof Patient, newItem: any) => {
      if (!editedData) return;
      const newData = JSON.parse(JSON.stringify(editedData));
      if (!newData[section]) (newData[section] as any) = [];
      (newData[section] as any[]).push(newItem);
      setEditedData(newData);
      if (editMode === 'none') {
        setEditMode('dadosPessoais');
      }
  }

  const removeFromArray = (section: keyof Patient, index: number) => {
    if (!editedData) return;
    const newData = JSON.parse(JSON.stringify(editedData));
    (newData[section] as any[]).splice(index, 1);
    setEditedData(newData);
  }

  const renderCardFooter = (card: EditMode) => (
    editMode === card && !isFullEditing && (
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button onClick={onSave}>Salvar</Button>
      </div>
    )
  );

  return (
    <Accordion type="multiple" defaultValue={['dadosPessoais', 'endereco', 'clinico', 'administrativo', 'financeiro', 'redeDeApoio', 'documentos']} className="w-full space-y-4">
      
      {/* ======================================= */}
      {/* DADOS PESSOAIS */}
      {/* ======================================= */}
      <AccordionItem value="dadosPessoais" className="border-b-0">
        <Card>
          <CardHeader className="p-4 hover:bg-muted/30 rounded-t-lg">
            <div className="flex justify-between items-center w-full">
              <AccordionTrigger className="flex-1 p-0">
                  <CardTitle className="text-xl">1. Dados Pessoais e Contato</CardTitle>
              </AccordionTrigger>
              <CardEditButton card="dadosPessoais" editMode={editMode} setEditMode={setEditMode} />
            </div>
          </CardHeader>
          <AccordionContent className="p-6">
              <div className="space-y-4">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <FormSection icon={User} title="Identificação Básica" className="pt-0">
                    <FormField label="ID do Paciente" isEditing={false} value={displayData.id} className="md:col-span-3" />
                    <FormField label="Tratamento" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.pronouns}>
                        <Select value={editedData?.pronouns || ''} onValueChange={(v) => handleFieldChange('adminData', 'pronouns', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Sr.">Sr.</SelectItem>
                              <SelectItem value="Sra.">Sra.</SelectItem>
                              <SelectItem value="Srta.">Srta.</SelectItem>
                              <SelectItem value="Dr.">Dr.</SelectItem>
                              <SelectItem value="Dra.">Dra.</SelectItem>
                              <SelectItem value="">Nenhum</SelectItem>
                          </SelectContent>
                        </Select>
                    </FormField>
                    <FormField label="Nome Completo" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.fullName} className="md:col-span-2">
                        <Input value={editedData?.fullName || ''} onChange={(e) => handleFieldChange('adminData', 'fullName', e.target.value)} />
                    </FormField>
                    <FormField label="Nome Social" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.displayName} className="md:col-span-3">
                        <Input value={editedData?.displayName || ''} onChange={(e) => handleFieldChange('adminData', 'displayName', e.target.value)} />
                    </FormField>
                  </FormSection>

                   <FormSection icon={Gavel} title="Representante Legal" className="pt-0">
                      <FormField label="Nome do Representante" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.legalGuardian?.name || 'Não definido'} className="md:col-span-3">
                          <Input value={editedData?.legalGuardian?.name || ''} onChange={e => handleFieldChange('legalGuardian', 'name', e.target.value, 'patient')} />
                      </FormField>
                      <FormField label="Documento" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.legalGuardian?.document || 'Não definido'} className="md:col-span-3">
                          <Input value={editedData?.legalGuardian?.document || ''} onChange={e => handleFieldChange('legalGuardian', 'document', e.target.value, 'patient')} />
                      </FormField>
                      <FormField label="Procuração" isEditing={false} value={
                          displayData.legalGuardian?.powerOfAttorneyUrl ? <Link href={displayData.legalGuardian.powerOfAttorneyUrl} target="_blank" className="text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3"/> Visualizar</Link> : 'Nenhum documento'
                      } className="md:col-span-3"/>
                  </FormSection>
                </div>

                 <FormSection icon={FileText} title="Documentos e Identificação Civil">
                    <FormField 
                        label={<span className="flex items-center gap-2">CPF <Badge variant={displayData.cpfStatus === 'valid' ? 'secondary' : 'destructive'} className={cn(displayData.cpfStatus === 'valid' && 'bg-green-100 text-green-800')}><BadgeCheck className="h-3 w-3 mr-1" />{displayData.cpfStatus === 'valid' ? 'Verificado' : 'Inválido'}</Badge></span>}
                        isEditing={isFullEditing || editMode === 'dadosPessoais'} 
                        value={displayData.cpf}
                    >
                      <Input value={editedData?.cpf || ''} onChange={(e) => handleFieldChange('adminData', 'cpf', e.target.value)} />
                    </FormField>
                    <FormField label={<span className="flex items-center gap-2">RG <Badge variant="outline" className="h-5"><BadgeCheck className="h-3 w-3 mr-1"/>Verificado</Badge></span>} isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.rg || '-'}>
                        <Input value={editedData?.rg || ''} onChange={(e) => handleFieldChange('adminData', 'rg', e.target.value)} />
                    </FormField>
                    <FormField label="Órgão Emissor" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.rgIssuer || '-'}>
                        <Input value={editedData?.rgIssuer || ''} onChange={(e) => handleFieldChange('adminData', 'rgIssuer', e.target.value)} />
                    </FormField>
                    <FormField label={<span className="flex items-center gap-2">CNS (Cartão SUS) <Badge variant="outline" className="h-5"><BadgeCheck className="h-3 w-3 mr-1" />Verificado</Badge></span>} isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.cns || '-'}>
                        <Input value={editedData?.cns || ''} onChange={(e) => handleFieldChange('adminData', 'cns', e.target.value)} />
                    </FormField>
                     <FormField label="Doc. Estrangeiro (National ID)" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.nationalId || '-'}>
                        <Input value={editedData?.nationalId || ''} onChange={(e) => handleFieldChange('adminData', 'nationalId', e.target.value)} />
                    </FormField>
                    <FormField 
                        label="Documento Digital" 
                        isEditing={false} 
                        value={displayData.rgDigitalUrl ? <Link href={displayData.rgDigitalUrl} target="_blank" className="text-primary hover:underline">Visualizar Documento</Link> : '-'}
                    />
                 </FormSection>

                <FormSection icon={Calendar} title="Nascimento e Perfil Demográfico">
                  <FormField label="Data de Nascimento" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={`${new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR')} (${new Date().getFullYear() - new Date(displayData.dateOfBirth).getFullYear()} anos)`}>
                      <Input type="date" value={editedData?.dateOfBirth || ''} onChange={(e) => handleFieldChange('adminData', 'dateOfBirth', e.target.value)} />
                  </FormField>
                   <FormField label="Sexo de Nascimento" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.sexo}>
                      <Select value={editedData?.sexo || ''} onValueChange={(v) => handleFieldChange('adminData', 'sexo', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                  </FormField>
                  <FormField label="Identidade de Gênero" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.genderIdentity || '-'}>
                      <Input value={editedData?.genderIdentity || ''} onChange={(e) => handleFieldChange('adminData', 'genderIdentity', e.target.value)} />
                  </FormField>
                  <FormField label="Estado Civil" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.estadoCivil || '-'}>
                      <Input value={editedData?.estadoCivil || ''} onChange={(e) => handleFieldChange('adminData', 'estadoCivil', e.target.value)} />
                  </FormField>
                   <FormField label="Nacionalidade" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.nacionalidade || '-'}>
                      <Input value={editedData?.nacionalidade || ''} onChange={(e) => handleFieldChange('adminData', 'nacionalidade', e.target.value)} />
                  </FormField>
                   <FormField label="Local de Nascimento" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.naturalidade || '-'}>
                      <Input value={editedData?.naturalidade || ''} onChange={(e) => handleFieldChange('adminData', 'naturalidade', e.target.value)} />
                  </FormField>
                  <FormField label="Idioma Preferencial" isEditing={isFullEditing || editMode === 'dadosPessoais'} value={displayData.preferredLanguage || '-'}>
                       <Select value={editedData?.preferredLanguage || ''} onValueChange={(v) => handleFieldChange('adminData', 'preferredLanguage', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Português">Português</SelectItem>
                            <SelectItem value="Inglês">Inglês</SelectItem>
                            <SelectItem value="Espanhol">Espanhol</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                  </FormField>
                </FormSection>

                <FormSection 
                  icon={Phone} 
                  title="Informações de Contato"
                  headerChildren={
                    !isFullEditing && editMode !== 'dadosPessoais' && displayData.preferredContactMethod && (
                      <Badge variant="outline">Contato preferencial: {displayData.preferredContactMethod}</Badge>
                    )
                  }
                >
                  { (isFullEditing || editMode === 'dadosPessoais') ? (
                    <div className="col-span-full space-y-3">
                      {editedData?.phones.map((phone, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-2 p-2 border rounded-md">
                          <div>
                            <Label>Tipo</Label>
                            <Select value={phone.type} onValueChange={v => handleArrayChange('phones', index, 'type', v)}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mobile">Celular</SelectItem>
                                <SelectItem value="home">Residencial</SelectItem>
                                <SelectItem value="work">Trabalho</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Número</Label>
                            <Input value={phone.number} onChange={e => handleArrayChange('phones', index, 'number', e.target.value)} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id={`phone-preferred-${index}`} checked={phone.preferred} onCheckedChange={c => handleArrayChange('phones', index, 'preferred', c)}/>
                            <Label htmlFor={`phone-preferred-${index}`}>Preferencial</Label>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromArray('phones', index)}><X className="h-4 w-4 text-destructive"/></Button>
                        </div>
                      ))}
                       <Button variant="outline" size="sm" onClick={() => addToArray('phones', { type: 'mobile', number: '', verified: false, preferred: false })}>
                          <Plus className="h-4 w-4 mr-2" />Adicionar Telefone
                      </Button>
                    </div>
                  ) : (
                    displayData.phones.map((phone, index) => (
                      <FormField 
                        key={index}
                        label={`Telefone (${phone.type})`} 
                        isEditing={false} 
                        value={<span className="flex items-center gap-2">
                          <span>{phone.number}</span>
                          {phone.type === 'mobile' &&
                            <a href={`https://wa.me/${phone.number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 h-8 w-8 -ml-1"><WhatsAppIcon className="h-5 w-5" /></Button>
                            </a>
                          }
                        </span>}
                      />
                    ))
                  )}

                  { (isFullEditing || editMode === 'dadosPessoais') ? (
                     <div className="col-span-full space-y-3">
                      {editedData?.emails?.map((email, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto_auto] items-end gap-2 p-2 border rounded-md">
                          <div>
                            <Label>Email</Label>
                            <Input type="email" value={email.email} onChange={e => handleArrayChange('emails', index, 'email', e.target.value)} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id={`email-preferred-${index}`} checked={email.preferred} onCheckedChange={c => handleArrayChange('emails', index, 'preferred', c)}/>
                            <Label htmlFor={`email-preferred-${index}`}>Preferencial</Label>
                          </div>
                           <Button variant="ghost" size="icon" onClick={() => removeFromArray('emails', index)}><X className="h-4 w-4 text-destructive"/></Button>
                        </div>
                      ))}
                       <Button variant="outline" size="sm" onClick={() => addToArray('emails', { email: '', verified: false, preferred: false })}>
                          <Plus className="h-4 w-4 mr-2" />Adicionar Email
                      </Button>
                    </div>
                  ) : (
                    displayData.emails?.map((email, index) => (
                       <FormField 
                        key={index}
                        label={`Email`} 
                        isEditing={false} 
                        value={<span className="flex items-center gap-2">
                          <span>{email.email}</span>
                          <a href={`mailto:${email.email}`}>
                            <Button variant="ghost" size="icon" className="text-primary hover:text-primary h-8 w-8 -ml-2"><Mail className="h-5 w-5" /></Button>
                          </a>
                        </span>}
                      />
                    ))
                  )}
                  
                  { (isFullEditing || editMode === 'dadosPessoais') && (
                    <>
                     <FormField label="Método de Contato Preferencial" isEditing={true} value={displayData.preferredContactMethod}>
                       <Select value={editedData?.preferredContactMethod || ''} onValueChange={(v) => handleFieldChange('adminData', 'preferredContactMethod', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                              <SelectItem value="Telefone">Ligação Telefônica</SelectItem>
                              <SelectItem value="Email">Email</SelectItem>
                          </SelectContent>
                        </Select>
                    </FormField>
                    <FormField
                      label="Não receber comunicações"
                      isEditing={true}
                      value={null}
                    >
                      <div className="flex items-center space-x-2">
                        <Switch id="communication-opt-out" checked={!!editedData?.communicationOptOut} onCheckedChange={(checked) => handleFieldChange('adminData', 'communicationOptOut', checked ? [{ type: 'sms', optedOut: true, date: new Date().toISOString() }] : [])}/>
                        <Label htmlFor="communication-opt-out">Opt-out de SMS/Marketing</Label>
                      </div>
                    </FormField>
                    </>
                  )}
                </FormSection>

                <FormSection icon={Users} title="Contatos de Emergência">
                  <div className="col-span-full space-y-3">
                     {(isFullEditing || editMode === 'dadosPessoais') ? (
                       editedData?.emergencyContacts.map((contact, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex justify-end">
                            <Button variant="ghost" size="icon" onClick={() => removeFromArray('emergencyContacts', index)}><X className="h-4 w-4 text-destructive"/></Button>
                          </div>
                           <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                              <FormField label="Nome" isEditing={true} value="">
                                  <Input value={contact.name} onChange={e => handleArrayChange('emergencyContacts', index, 'name', e.target.value)} />
                              </FormField>
                              <FormField label="Parentesco" isEditing={true} value="">
                                  <Input value={contact.relationship} onChange={e => handleArrayChange('emergencyContacts', index, 'relationship', e.target.value)} />
                              </FormField>
                               <FormField label="Telefone" isEditing={true} value="">
                                  <Input value={contact.phone} onChange={e => handleArrayChange('emergencyContacts', index, 'phone', e.target.value)} />
                              </FormField>
                                <FormField label="Email" isEditing={true} value="">
                                  <Input type="email" value={contact.email || ''} onChange={e => handleArrayChange('emergencyContacts', index, 'email', e.target.value)} />
                              </FormField>
                               <div className="flex items-center gap-2 col-span-full">
                                <Switch id={`legal-rep-${index}`} checked={contact.isLegalRepresentative} onCheckedChange={c => handleArrayChange('emergencyContacts', index, 'isLegalRepresentative', c)}/>
                                <Label htmlFor={`legal-rep-${index}`}>É um representante legal</Label>
                              </div>
                           </div>
                        </Card>
                       ))
                     ) : (
                        displayData.emergencyContacts.map((contact, index) => (
                          <div key={index} className="p-3 border rounded-md bg-muted/50">
                            <div className="font-semibold flex items-center">{contact.name} <span className="text-sm font-normal text-muted-foreground ml-1">({contact.relationship})</span> {contact.isLegalRepresentative && <Badge className="ml-2">Rep. Legal</Badge>}</div>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                          </div>
                        ))
                     )}
                      {(isFullEditing || editMode === 'dadosPessoais') && (
                        <Button variant="outline" size="sm" onClick={() => addToArray('emergencyContacts', { name: '', relationship: '', phone: '', email: '' })}>
                            <Plus className="h-4 w-4 mr-2" />Adicionar Contato de Emergência
                        </Button>
                      )}
                  </div>
                </FormSection>

              </div>
              {renderCardFooter('dadosPessoais')}
          </AccordionContent>
        </Card>
      </AccordionItem>

      {/* ======================================= */}
      {/* ENDEREÇO */}
      {/* ======================================= */}
      <AccordionItem value="endereco" className="border-b-0">
        <Card>
           <CardHeader className="p-4 hover:bg-muted/30 rounded-t-lg">
             <div className="flex justify-between items-center w-full">
                <AccordionTrigger className="flex-1 p-0">
                    <CardTitle className="text-xl">2. Endereço e Ambiente Domiciliar</CardTitle>
                </AccordionTrigger>
                <CardEditButton card="endereco" editMode={editMode} setEditMode={setEditMode} />
            </div>
          </CardHeader>
          <AccordionContent className="p-6">
            <div className="space-y-4">
                <FormSection icon={Home} title="Localização">
                   <FormField label="CEP" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.zipCode} className="lg:col-span-1">
                      <Input value={editedData?.address.zipCode || ''} onChange={e => handleFieldChange('address', 'zipCode', e.target.value)} />
                  </FormField>
                   <FormField label="Endereço" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.street} className="lg:col-span-2">
                      <Input value={editedData?.address.street || ''} onChange={e => handleFieldChange('address', 'street', e.target.value)} />
                  </FormField>
                   <FormField label="Número" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.number}>
                      <Input value={editedData?.address.number || ''} onChange={e => handleFieldChange('address', 'number', e.target.value)} />
                  </FormField>
                   <FormField label="Complemento" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.complement || '-'}>
                      <Input value={editedData?.address.complement || ''} onChange={e => handleFieldChange('address', 'complement', e.target.value)} />
                  </FormField>
                   <FormField label="Bairro" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.neighborhood}>
                      <Input value={editedData?.address.neighborhood || ''} onChange={e => handleFieldChange('address', 'neighborhood', e.target.value)} />
                  </FormField>
                   <FormField label="Cidade" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.city}>
                      <Input value={editedData?.address.city || ''} onChange={e => handleFieldChange('address', 'city', e.target.value)} />
                  </FormField>
                   <FormField label="Estado" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.state}>
                      <Input value={editedData?.address.state || ''} onChange={e => handleFieldChange('address', 'state', e.target.value)} />
                  </FormField>
                   <FormField label="Ponto de Referência" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.pontoReferencia || '-'} className="lg:col-span-3">
                      <Textarea value={editedData?.address.pontoReferencia || ''} onChange={e => handleFieldChange('address', 'pontoReferencia', e.target.value)} />
                  </FormField>
                </FormSection>
                <FormSection icon={Building} title="Detalhes do Ambiente Domiciliar">
                    <FormField label="Tipo de Residência" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.tipoResidencia || '-'}>
                         <Select value={editedData?.address.tipoResidencia || ''} onValueChange={(v) => handleFieldChange('address', 'tipoResidencia', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Casa">Casa</SelectItem>
                                <SelectItem value="Apartamento">Apartamento</SelectItem>
                                <SelectItem value="Condomínio">Condomínio</SelectItem>
                                <SelectItem value="Chácara">Chácara</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                    <div className="flex items-center space-x-2">
                      <Switch id="ambulance-access" checked={displayData.address.acessoAmbulancia} disabled={!isFullEditing && editMode !== 'endereco'} onCheckedChange={(c) => handleFieldChange('address', 'acessoAmbulancia', c)} />
                      <Label htmlFor="ambulance-access" className="flex items-center gap-2"><Ambulance className="h-4 w-4"/> Acesso para Ambulância</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Switch id="has-pet" checked={displayData.address.possuiAnimal} disabled={!isFullEditing && editMode !== 'endereco'} onCheckedChange={(c) => handleFieldChange('address', 'possuiAnimal', c)}/>
                       <Label htmlFor="has-pet" className="flex items-center gap-2"><Dog className="h-4 w-4"/> Possui Animal de Estimação</Label>
                    </div>
                     {displayData.address.possuiAnimal && (
                        <FormField label="Descrição dos Animais" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.animalDescricao || '-'} className="lg:col-span-3">
                            <Textarea value={editedData?.address.animalDescricao || ''} onChange={e => handleFieldChange('address', 'animalDescricao', e.target.value)} placeholder="Ex: 1 cão de pequeno porte, dócil."/>
                        </FormField>
                     )}
                     <FormField label="Condições/Observações do Domicílio" isEditing={isFullEditing || editMode === 'endereco'} value={displayData.address.condicoesDomicilio || '-'} className="lg:col-span-3">
                        <Textarea value={editedData?.address.condicoesDomicilio || ''} onChange={e => handleFieldChange('address', 'condicoesDomicilio', e.target.value)} placeholder="Ex: Apartamento no 4º andar, possui elevador. Ambiente bem iluminado e arejado." />
                    </FormField>
                </FormSection>
            </div>
            {renderCardFooter('endereco')}
          </AccordionContent>
        </Card>
      </AccordionItem>
      
      {/* ======================================= */}
      {/* DADOS CLÍNICOS */}
      {/* ======================================= */}
       <AccordionItem value="clinico" className="border-b-0">
        <Card>
          <CardHeader className="p-4 hover:bg-muted/30 rounded-t-lg">
             <div className="flex justify-between items-center w-full">
                <AccordionTrigger className="flex-1 p-0">
                    <CardTitle className="text-xl">3. Dados Clínicos e Assistenciais</CardTitle>
                </AccordionTrigger>
              <CardEditButton card="clinico" editMode={editMode} setEditMode={setEditMode} />
            </div>
          </CardHeader>
          <AccordionContent className="p-6">
            <p className="text-muted-foreground">Em breve...</p>
             {renderCardFooter('clinico')}
          </AccordionContent>
        </Card>
      </AccordionItem>

       {/* ======================================= */}
      {/* DADOS ADMINISTRATIVOS */}
      {/* ======================================= */}
       <AccordionItem value="administrativo" className="border-b-0">
        <Card>
          <CardHeader className="p-4 hover:bg-muted/30 rounded-t-lg">
             <div className="flex justify-between items-center w-full">
                <AccordionTrigger className="flex-1 p-0">
                    <CardTitle className="text-xl">4. Dados Administrativos</CardTitle>
                </AccordionTrigger>
              <CardEditButton card="administrativo" editMode={editMode} setEditMode={setEditMode} />
            </div>
          </CardHeader>
          <AccordionContent className="p-6">
            <p className="text-muted-foreground">Em breve...</p>
             {renderCardFooter('administrativo')}
          </AccordionContent>
        </Card>
      </AccordionItem>
      
    </Accordion>
  );
}

    