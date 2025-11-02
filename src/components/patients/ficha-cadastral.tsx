

'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home, Building, Dog, Ambulance, Stethoscope, Pill, Plus, X, Briefcase, Link as LinkIcon, FileText, NotebookTabs, Wallet, Users, ShieldCheck, FolderOpen, History, MessageCircle, Edit, Save } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { EditMode } from './patient-details-panel';

// Define a simple SVG icon for WhatsApp
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}>
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39z" fill="currentColor"></path>
    </svg>
);


interface FichaCadastralProps {
    editMode: EditMode;
    setEditMode: (mode: EditMode) => void;
    displayData: Patient;
    editedData: Patient | null;
    setEditedData: (data: Patient | null) => void;
    onSave: () => void;
    onCancel: () => void;
}

export function FichaCadastral({ editMode, setEditMode, displayData, editedData, setEditedData, onSave, onCancel }: FichaCadastralProps) {

    const isCardEditing = (card: EditMode) => editMode === 'full' || editMode === card;

    const handleChange = (path: string, value: any) => {
        if (!editedData) return;
        const keys = path.split('.');
        const newEditedData = JSON.parse(JSON.stringify(editedData)); // Deep copy
        let current: any = newEditedData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined || current[keys[i]] === null) {
              current[keys[i]] = {}; // Create nested object if it doesn't exist
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setEditedData(newEditedData);
    };

    const handleArrayChange = (path: string, value: string) => {
        const newArray = value.split(',').map(item => item.trim()).filter(Boolean);
        handleChange(path, newArray);
    }
    
    const handleEmergencyContactChange = (index: number, field: string, value: string) => {
        if (!editedData || !editedData.emergencyContacts) return;
        const newContacts = [...editedData.emergencyContacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        handleChange('emergencyContacts', newContacts);
    };

    const addEmergencyContact = () => {
        const baseData = editedData || displayData;
        const newContacts = [...(baseData.emergencyContacts || []), { name: '', relationship: '', phone: '' }];
        
        // Se não estiver em modo de edição, precisamos criar um novo objeto de edição
        if (!editedData) {
            const newEditedState = JSON.parse(JSON.stringify(displayData));
            newEditedState.emergencyContacts = newContacts;
            setEditedData(newEditedState);
        } else {
            handleChange('emergencyContacts', newContacts);
        }
        setEditMode('dadosPessoais');
    };

    const removeEmergencyContact = (index: number) => {
        if (!editedData || !editedData.emergencyContacts) return;
        const newContacts = editedData.emergencyContacts.filter((_, i) => i !== index);
        handleChange('emergencyContacts', newContacts);
    };

    const ValueDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <div className={cn("flex items-center h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm", className)}>
            {children || '-'}
        </div>
    );
    
    const PhoneValueDisplay = ({ value, className }: { value?: string, className?: string }) => {
        const handleWhatsAppClick = () => {
            if (!value) return;
            const phoneNumber = value.replace(/\D/g, '');
            window.open(`https://wa.me/${phoneNumber}`, '_blank');
        };

        return (
            <div className={cn("flex items-center h-10 w-full rounded-md border border-input bg-muted/50 text-sm", className)}>
                 <span className="flex-1 px-3 py-2">{value || '-'}</span>
                {value && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mr-1 text-green-600 hover:bg-green-100"
                        onClick={handleWhatsAppClick}
                    >
                        <WhatsAppIcon className="w-5 h-5" />
                    </Button>
                )}
            </div>
        );
    };

    const ArrayValueDisplay = ({ value }: { value?: string[] }) => (
        <ValueDisplay>{value && value.length > 0 ? value.join(', ') : '-'}</ValueDisplay>
    );
    
    const LinkValueDisplay = ({ url, label }: { url?: string, label: string }) => (
        <ValueDisplay>
            {url ? (
                <Button variant="link" asChild className="p-0 h-auto -ml-1">
                    <Link href={url} target="_blank" rel="noopener noreferrer">{label}</Link>
                </Button>
            ) : '-'}
        </ValueDisplay>
    );

    const addMedication = () => {
        if (!editedData || !editedData.clinicalData) return;
        const newMeds = [...(editedData.clinicalData.medications || []), { name: '', dosage: '', frequency: '', notes: '' }];
        handleChange('clinicalData.medications', newMeds);
    };

    const removeMedication = (index: number) => {
        if (!editedData || !editedData.clinicalData?.medications) return;
        const newMeds = editedData.clinicalData.medications.filter((_, i) => i !== index);
        handleChange('clinicalData.medications', newMeds);
    };

    const updateMedication = (index: number, field: string, value: string) => {
        if (!editedData || !editedData.clinicalData?.medications) return;
        const newMeds = [...editedData.clinicalData.medications];
        newMeds[index] = { ...newMeds[index], [field]: value };
        handleChange('clinicalData.medications', newMeds);
    };
    
    const CardEditButton = ({ card }: { card: EditMode }) => {
        if (isCardEditing(card)) return null;
        return (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditMode(card); }}>
                <Edit className="h-4 w-4" />
            </Button>
        )
    };
    
     const CardEditFooter = ({ card }: { card: EditMode }) => {
        if (editMode !== card) return null;
        return (
            <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
                <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
                <Button onClick={onSave}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
            </div>
        )
    };

    const data = editedData || displayData;


    if (!data) return null;
    
    const age = data?.dateOfBirth ? `${new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear()} anos` : null;


    return (
         <Accordion type="multiple" defaultValue={['item-1']} className="w-full space-y-4">
            
            {/* 1. DADOS PESSOAIS */}
             <AccordionItem value="item-1" className="border-none">
                 <Card>
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between w-full">
                           <CardTitle className="flex items-center gap-3 text-xl"><User className="w-6 h-6 text-primary" />Dados Pessoais</CardTitle>
                           <CardEditButton card="dadosPessoais" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <Label>Nome Completo</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.name || ''} onChange={e => handleChange('name', e.target.value)} /> : <ValueDisplay>{data.name}</ValueDisplay>}
                            </div>
                             <div className="md:col-span-1">
                                <Label>Nome Social</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.socialName || ''} onChange={e => handleChange('socialName', e.target.value)} /> : <ValueDisplay>{data.socialName}</ValueDisplay>}
                            </div>
                             <div className="md:col-span-1">
                                <Label>Pronomes</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.pronouns || ''} onChange={e => handleChange('pronouns', e.target.value)} placeholder="Ex: ela/dela"/> : <ValueDisplay>{data.pronouns}</ValueDisplay>}
                            </div>
                         </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <Label>CPF</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.cpf || ''} onChange={e => handleChange('cpf', e.target.value)} /> : <ValueDisplay>{data.cpf}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>CNS (Cartão SUS)</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.cns || ''} onChange={e => handleChange('cns', e.target.value)} /> : <ValueDisplay>{data.cns}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>RG</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.rg || ''} onChange={e => handleChange('rg', e.target.value)} /> : <ValueDisplay>{data.rg}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div>
                                <Label>Data de Nascimento</Label>
                                {isCardEditing('dadosPessoais') ? <Input type="date" value={data.dateOfBirth || ''} onChange={e => handleChange('dateOfBirth', e.target.value)} /> : <ValueDisplay>{data.dateOfBirth ? `${new Date(data.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} (${age})` : '-'}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Sexo</Label>
                                {isCardEditing('dadosPessoais') ? (
                                    <Select value={data.sexo || ''} onValueChange={v => handleChange('sexo', v)}>
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Masculino">Masculino</SelectItem>
                                            <SelectItem value="Feminino">Feminino</SelectItem>
                                            <SelectItem value="Outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : <ValueDisplay>{data.sexo}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Estado Civil</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.estadoCivil || ''} onChange={e => handleChange('estadoCivil', e.target.value)} /> : <ValueDisplay>{data.estadoCivil}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Idioma</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.preferredLanguage || ''} onChange={e => handleChange('preferredLanguage', e.target.value)} placeholder="Ex: Português" /> : <ValueDisplay>{data.preferredLanguage}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                             <div>
                                <Label>Email</Label>
                                {isCardEditing('dadosPessoais') ? <Input type="email" value={data.email || ''} onChange={e => handleChange('email', e.target.value)} /> : <ValueDisplay>{data.email}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Telefone Celular (WhatsApp)</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.mobile || ''} onChange={e => handleChange('mobile', e.target.value)} /> : <PhoneValueDisplay value={data.mobile} />}
                            </div>
                            <div>
                                <Label>Telefone Fixo</Label>
                                {isCardEditing('dadosPessoais') ? <Input value={data.phone || ''} onChange={e => handleChange('phone', e.target.value)} /> : <ValueDisplay>{data.phone}</ValueDisplay>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                             <div>
                                <Label>Método de Contato Preferencial</Label>
                                {isCardEditing('dadosPessoais') ? (
                                     <Select value={data.preferredContactMethod || ''} onValueChange={v => handleChange('preferredContactMethod', v)}>
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Telefone">Telefone</SelectItem>
                                            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                            <SelectItem value="Email">Email</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : <ValueDisplay className="flex items-center gap-2">
                                        {data.preferredContactMethod === 'WhatsApp' && <MessageCircle className="w-4 h-4 text-green-600"/>}
                                        {data.preferredContactMethod === 'Email' && <Mail className="w-4 h-4"/>}
                                        {data.preferredContactMethod === 'Telefone' && <Phone className="w-4 h-4"/>}
                                        {data.preferredContactMethod}
                                    </ValueDisplay>}
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold">Contatos de Emergência</h4>
                                <Button onClick={addEmergencyContact} size="sm" variant="outline">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Adicionar Contato
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {data.emergencyContacts?.map((contact, index) => (
                                    <Card key={index} className="p-4 bg-background">
                                        <div className="flex justify-between items-start mb-3">
                                            <h5 className="font-medium">Contato {index + 1}</h5>
                                            {isCardEditing('dadosPessoais') && (
                                                <Button onClick={() => removeEmergencyContact(index)} size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 h-7 w-7">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label>Nome</Label>
                                                {isCardEditing('dadosPessoais') ? <Input value={contact.name} onChange={e => handleEmergencyContactChange(index, 'name', e.target.value)} /> : <ValueDisplay>{contact.name}</ValueDisplay>}
                                            </div>
                                            <div>
                                                <Label>Parentesco</Label>
                                                {isCardEditing('dadosPessoais') ? <Input value={contact.relationship} onChange={e => handleEmergencyContactChange(index, 'relationship', e.target.value)} /> : <ValueDisplay>{contact.relationship}</ValueDisplay>}
                                            </div>
                                            <div>
                                                <Label>Telefone</Label>
                                                {isCardEditing('dadosPessoais') ? <Input value={contact.phone} onChange={e => handleEmergencyContactChange(index, 'phone', e.target.value)} /> : <ValueDisplay>{contact.phone}</ValueDisplay>}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                {(!data.emergencyContacts || data.emergencyContacts.length === 0) && (
                                    <p className="text-muted-foreground text-center py-4">
                                        {isCardEditing('dadosPessoais') ? 'Clique em "Adicionar Contato" para começar.' : 'Nenhum contato de emergência cadastrado.'}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <Button variant="link" className="p-0 h-auto font-semibold text-foreground" onClick={() => alert('Abrir modal do Drive (futuro)')}>
                                <h4 className="flex items-center gap-2"><FileText className="w-4 h-4" />Documentos Digitais</h4>
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label>RG Digital (URL)</Label>
                                {isCardEditing('dadosPessoais') ? (
                                <Input value={data.rgDigitalUrl || ''} onChange={(e) => handleChange('rgDigitalUrl', e.target.value)} placeholder="https://..." />
                                ) : (
                                <LinkValueDisplay url={data.rgDigitalUrl} label="Visualizar RG" />
                                )}
                            </div>
                            {/* Adicionar mais campos de documentos aqui conforme necessário */}
                            </div>
                        </div>
                        <CardEditFooter card="dadosPessoais" />
                    </AccordionContent>
                </Card>
             </AccordionItem>

             {/* 2. ENDEREÇO E AMBIENTE */}
             <AccordionItem value="item-2" className="border-none">
                 <Card>
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between w-full">
                           <CardTitle className="flex items-center gap-3 text-lg"><Home className="w-5 h-5 text-primary" />Endereço e Ambiente Domiciliar</CardTitle>
                            <CardEditButton card="endereco" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-1">
                                    <Label>CEP</Label>
                                     {isCardEditing('endereco') ? <Input value={data.address?.zipCode || ''} onChange={e => handleChange('address.zipCode', e.target.value)} /> : <ValueDisplay>{data.address?.zipCode}</ValueDisplay>}
                                </div>
                                <div className="md:col-span-3">
                                    <Label>Logradouro</Label>
                                    {isCardEditing('endereco') ? <Input value={data.address?.street || ''} onChange={e => handleChange('address.street', e.target.value)} /> : <ValueDisplay>{data.address?.street}</ValueDisplay>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <Label>Número</Label>
                                    {isCardEditing('endereco') ? <Input value={data.address?.number || ''} onChange={e => handleChange('address.number', e.target.value)} /> : <ValueDisplay>{data.address?.number}</ValueDisplay>}
                                </div>
                                 <div>
                                    <Label>Complemento</Label>
                                    {isCardEditing('endereco') ? <Input value={data.address?.complement || ''} onChange={e => handleChange('address.complement', e.target.value)} /> : <ValueDisplay>{data.address?.complement}</ValueDisplay>}
                                </div>
                                 <div className="md:col-span-2">
                                    <Label>Bairro</Label>
                                    {isCardEditing('endereco') ? <Input value={data.address?.neighborhood || ''} onChange={e => handleChange('address.neighborhood', e.target.value)} /> : <ValueDisplay>{data.address?.neighborhood}</ValueDisplay>}
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <Label>Cidade</Label>
                                    {isCardEditing('endereco') ? <Input value={data.address?.city || ''} onChange={e => handleChange('address.city', e.target.value)} /> : <ValueDisplay>{data.address?.city}</ValueDisplay>}
                                </div>
                                 <div>
                                    <Label>Estado</Label>
                                    {isCardEditing('endereco') ? <Input value={data.address?.state || ''} onChange={e => handleChange('address.state', e.target.value)} /> : <ValueDisplay>{data.address?.state}</ValueDisplay>}
                                </div>
                            </div>
                             <div>
                                <Label>Ponto de Referência</Label>
                                {isCardEditing('endereco') ? <Input value={data.address?.pontoReferencia || ''} onChange={e => handleChange('address.pontoReferencia', e.target.value)} /> : <ValueDisplay>{data.address?.pontoReferencia}</ValueDisplay>}
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                 <h4 className="font-semibold">Detalhes do Ambiente</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                     <div>
                                        <Label className="flex items-center gap-2 mb-2"><Building className="w-4 h-4"/>Tipo de Residência</Label>
                                         {isCardEditing('endereco') ? (
                                            <Select value={data.address?.tipoResidencia || ''} onValueChange={v => handleChange('address.tipoResidencia', v)}>
                                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Casa">Casa</SelectItem>
                                                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                                                    <SelectItem value="Chácara">Chácara</SelectItem>
                                                    <SelectItem value="Condomínio">Condomínio</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : <ValueDisplay>{data.address?.tipoResidencia}</ValueDisplay>}
                                    </div>
                                    <div className="flex items-center gap-4 pt-5">
                                         <Label htmlFor="acessoAmbulancia" className="flex items-center gap-2 cursor-pointer"><Ambulance className="w-4 h-4"/>Acesso para Ambulância</Label>
                                         {isCardEditing('endereco') ? <Switch id="acessoAmbulancia" checked={data.address?.acessoAmbulancia || false} onCheckedChange={c => handleChange('address.acessoAmbulancia', c)} /> : <ValueDisplay>{data.address?.acessoAmbulancia ? 'Sim' : 'Não'}</ValueDisplay>}
                                    </div>
                                     <div className="flex items-center gap-4 pt-5">
                                         <Label htmlFor="possuiAnimal" className="flex items-center gap-2 cursor-pointer"><Dog className="w-4 h-4"/>Possui Animal?</Label>
                                         {isCardEditing('endereco') ? <Switch id="possuiAnimal" checked={data.address?.possuiAnimal || false} onCheckedChange={c => handleChange('address.possuiAnimal', c)} /> : <ValueDisplay>{data.address?.possuiAnimal ? 'Sim' : 'Não'}</ValueDisplay>}
                                    </div>
                                 </div>
                                 <div>
                                    <Label>Condições/Observações do Domicílio</Label>
                                    {isCardEditing('endereco') ? <Textarea value={data.address?.condicoesDomicilio || ''} onChange={e => handleChange('address.condicoesDomicilio', e.target.value)} placeholder="Ex: Acesso por escadas, pouca iluminação no corredor..." /> : <ValueDisplay>{data.address?.condicoesDomicilio}</ValueDisplay>}
                                 </div>
                                 {(isCardEditing('endereco') || data.address?.possuiAnimal) && (
                                     <div>
                                        <Label>Descrição dos Animais</Label>
                                        {isCardEditing('endereco') ? <Input value={data.address?.animalDescricao || ''} onChange={e => handleChange('address.animalDescricao', e.target.value)} placeholder="Ex: 1 cão de pequeno porte, dócil." /> : <ValueDisplay>{data.address?.animalDescricao}</ValueDisplay>}
                                    </div>
                                 )}
                            </div>
                        </div>
                        <CardEditFooter card="endereco" />
                    </AccordionContent>
                </Card>
             </AccordionItem>

            {/* 3. DADOS CLÍNICOS E ASSISTENCIAIS */}
             <AccordionItem value="item-3" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between w-full">
                           <CardTitle className="flex items-center gap-3 text-lg"><Stethoscope className="w-5 h-5 text-primary" />Dados Clínicos e Assistenciais</CardTitle>
                           <CardEditButton card="clinico" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="space-y-6">
                            <div>
                                <Label>Diagnóstico Principal</Label>
                                {isCardEditing('clinico') ? <Input value={data.clinicalData?.diagnosticoPrincipal || ''} onChange={e => handleChange('clinicalData.diagnosticoPrincipal', e.target.value)} /> : <ValueDisplay>{data.clinicalData?.diagnosticoPrincipal}</ValueDisplay>}
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Alergias</Label>
                                    {isCardEditing('clinico') ? <Input value={data.clinicalData?.allergies?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.allergies', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.allergies} />}
                                </div>
                                <div>
                                    <Label>Restrições (alimentares, físicas, etc.)</Label>
                                    {isCardEditing('clinico') ? <Input value={data.clinicalData?.restricoes?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.restricoes', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.restricoes} />}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label>Mobilidade</Label>
                                    {isCardEditing('clinico') ? (
                                        <Select value={data.clinicalData?.mobilidade || ''} onValueChange={v => handleChange('clinicalData.mobilidade', v)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Autônomo">Autônomo</SelectItem>
                                                <SelectItem value="Parcialmente Dependente">Parcialmente Dependente</SelectItem>
                                                <SelectItem value="Acamado">Acamado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : <ValueDisplay>{data.clinicalData?.mobilidade}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Estado de Consciência</Label>
                                    {isCardEditing('clinico') ? <Input value={data.clinicalData?.estadoConsciencia || ''} onChange={e => handleChange('clinicalData.estadoConsciencia', e.target.value)} /> : <ValueDisplay>{data.clinicalData?.estadoConsciencia}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Dispositivos (GTT, SNE, etc.)</Label>
                                    {isCardEditing('clinico') ? <Input value={data.clinicalData?.dispositivos?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.dispositivos', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.dispositivos} />}
                                </div>
                            </div>
                             <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold flex items-center gap-2"><Pill className="w-4 h-4"/>Medicações em Uso</h4>
                                    {isCardEditing('clinico') && (
                                    <Button onClick={addMedication} size="sm" variant="outline">
                                        <Plus className="w-4 h-4 mr-1" />
                                        Adicionar
                                    </Button>
                                    )}
                                </div>
                                 {isCardEditing('clinico') ? (
                                    <div className="space-y-4">
                                        {data.clinicalData?.medications?.map((med, index) => (
                                            <Card key={index} className="p-4 bg-background">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium">Medicação {index + 1}</h4>
                                                <Button
                                                onClick={() => removeMedication(index)}
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:bg-destructive/10 h-7 w-7"
                                                >
                                                <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <Label>Nome</Label>
                                                    <Input
                                                        value={med.name}
                                                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Dosagem</Label>
                                                    <Input
                                                        value={med.dosage}
                                                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <Label>Frequência</Label>
                                                    <Input
                                                        value={med.frequency}
                                                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label>Observações</Label>
                                                    <Input
                                                        value={med.notes || ''}
                                                        onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            </Card>
                                        ))}
                                        {(!data.clinicalData?.medications || data.clinicalData.medications.length === 0) && (
                                            <p className="text-muted-foreground text-center py-4">Nenhuma medicação para editar.</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.clinicalData?.medications?.length > 0 ? (
                                            data.clinicalData.medications.map((med, i) => (
                                            <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                                                <p className="font-semibold text-secondary-foreground">{med.name}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                {med.dosage} &bull; {med.frequency}
                                                </p>
                                                {med.notes && (
                                                <p className="text-xs text-muted-foreground mt-2 italic">"{med.notes}"</p>
                                                )}
                                            </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">Nenhuma medicação cadastrada</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <CardEditFooter card="clinico" />
                    </AccordionContent>
                 </Card>
             </AccordionItem>

             {/* 4. DADOS ADMINISTRATIVOS */}
             <AccordionItem value="item-4" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between w-full">
                           <CardTitle className="flex items-center gap-3 text-lg"><Briefcase className="w-5 h-5 text-primary" />Informações Administrativas e Internas</CardTitle>
                           <CardEditButton card="administrativo" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label>Status do Paciente</Label>
                                     {isCardEditing('administrativo') ? (
                                        <Select value={data.adminData?.status || ''} onValueChange={v => handleChange('adminData.status', v)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ativo">Ativo</SelectItem>
                                                <SelectItem value="Inativo">Inativo</SelectItem>
                                                <SelectItem value="Suspenso">Suspenso</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : <ValueDisplay>{data.adminData?.status}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Complexidade</Label>
                                     {isCardEditing('administrativo') ? (
                                        <Select value={data.adminData?.complexity || ''} onValueChange={v => handleChange('adminData.complexity', v)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Baixa">Baixa</SelectItem>
                                                <SelectItem value="Média">Média</SelectItem>
                                                <SelectItem value="Alta">Alta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : <ValueDisplay>{data.adminData?.complexity}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Pacote de Serviço</Label>
                                     {isCardEditing('administrativo') ? (
                                        <Select value={data.adminData?.servicePackage || ''} onValueChange={v => handleChange('adminData.servicePackage', v)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Básico">Básico</SelectItem>
                                                <SelectItem value="Intermediário">Intermediário</SelectItem>
                                                <SelectItem value="Completo">Completo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : <ValueDisplay>{data.adminData?.servicePackage}</ValueDisplay>}
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Data de Início do Atendimento</Label>
                                    {isCardEditing('administrativo') ? <Input type="date" value={data.adminData?.dataInicioAtendimento || ''} onChange={e => handleChange('adminData.dataInicioAtendimento', e.target.value)} /> : <ValueDisplay>{data.adminData?.dataInicioAtendimento ? new Date(data.adminData.dataInicioAtendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                                </div>
                                 <div>
                                    <Label>Data de Término do Atendimento</Label>
                                    {isCardEditing('administrativo') ? <Input type="date" value={data.adminData?.dataTerminoAtendimento || ''} onChange={e => handleChange('adminData.dataTerminoAtendimento', e.target.value)} /> : <ValueDisplay>{data.adminData?.dataTerminoAtendimento ? new Date(data.adminData.dataTerminoAtendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label>Supervisor(a)</Label>
                                    {/* TODO: Replace with a Professional selector component */}
                                    {isCardEditing('administrativo') ? <Input value={data.adminData?.supervisorId || ''} onChange={e => handleChange('adminData.supervisorId', e.target.value)} /> : <ValueDisplay>{data.adminData?.supervisorId}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Escalista</Label>
                                    {isCardEditing('administrativo') ? <Input value={data.adminData?.schedulerId || ''} onChange={e => handleChange('adminData.schedulerId', e.target.value)} /> : <ValueDisplay>{data.adminData?.schedulerId}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Enfermeiro Responsável</Label>
                                    {isCardEditing('administrativo') ? <Input value={data.adminData?.enfermeiroResponsavelId || ''} onChange={e => handleChange('adminData.enfermeiroResponsavelId', e.target.value)} /> : <ValueDisplay>{data.adminData?.enfermeiroResponsavelId}</ValueDisplay>}
                                </div>
                             </div>
                              <div>
                                <Label>Frequência de Atendimento</Label>
                                {isCardEditing('administrativo') ? <Input value={data.adminData?.frequenciaAtendimento || ''} onChange={e => handleChange('adminData.frequenciaAtendimento', e.target.value)} placeholder="Ex: 24h, 12h, 3x/semana" /> : <ValueDisplay>{data.adminData?.frequenciaAtendimento}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Observações Internas</Label>
                                {isCardEditing('administrativo') ? <Textarea value={data.adminData?.observacoesInternas || ''} onChange={e => handleChange('adminData.observacoesInternas', e.target.value)} placeholder="Anotações visíveis apenas para a equipe..." /> : <ValueDisplay className="min-h-[80px] h-auto">{data.adminData?.observacoesInternas}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Cuidador(es) IDs</Label>
                                {isCardEditing('administrativo') ? <Input value={data.adminData?.cuidadoresIds?.join(', ') || ''} onChange={e => handleArrayChange('adminData.cuidadoresIds', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.adminData?.cuidadoresIds} />}
                            </div>
                        </div>
                        <CardEditFooter card="administrativo" />
                    </AccordionContent>
                 </Card>
             </AccordionItem>

            {/* 5. DADOS FINANCEIROS */}
             <AccordionItem value="item-5" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between w-full">
                            <CardTitle className="flex items-center gap-3 text-lg"><Wallet className="w-5 h-5 text-primary" />Informações Financeiras</CardTitle>
                            <CardEditButton card="financeiro" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Tipo de Vínculo</Label>
                                    {isCardEditing('financeiro') ? (
                                        <Select value={data.financial?.vinculo || ''} onValueChange={v => handleChange('financial.vinculo', v)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Plano de Saúde">Plano de Saúde</SelectItem>
                                                <SelectItem value="Particular">Particular</SelectItem>
                                                <SelectItem value="Convênio">Convênio</SelectItem>
                                                <SelectItem value="Público">Público</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : <ValueDisplay>{data.financial?.vinculo}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Operadora / Convênio</Label>
                                    {isCardEditing('financeiro') ? <Input value={data.financial?.operadora || ''} onChange={e => handleChange('financial.operadora', e.target.value)} /> : <ValueDisplay>{data.financial?.operadora}</ValueDisplay>}
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Nº da Carteirinha</Label>
                                    {isCardEditing('financeiro') ? <Input value={data.financial?.carteirinha || ''} onChange={e => handleChange('financial.carteirinha', e.target.value)} /> : <ValueDisplay>{data.financial?.carteirinha}</ValueDisplay>}
                                </div>
                                 <div>
                                    <Label>Validade da Carteirinha</Label>
                                    {isCardEditing('financeiro') ? <Input type="date" value={data.financial?.validadeCarteirinha || ''} onChange={e => handleChange('financial.validadeCarteirinha', e.target.value)} /> : <ValueDisplay>{data.financial?.validadeCarteirinha ? new Date(data.financial.validadeCarteirinha).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label>Valor Mensal (R$)</Label>
                                    {isCardEditing('financeiro') ? <Input type="number" value={data.financial?.monthlyFee || ''} onChange={e => handleChange('financial.monthlyFee', parseFloat(e.target.value))} /> : <ValueDisplay>{data.financial?.monthlyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Dia do Vencimento</Label>
                                    {isCardEditing('financeiro') ? <Input type="number" value={data.financial?.billingDay || ''} onChange={e => handleChange('financial.billingDay', parseInt(e.target.value))} /> : <ValueDisplay>{data.financial?.billingDay}</ValueDisplay>}
                                </div>
                                 <div>
                                    <Label>Forma de Pagamento</Label>
                                    {isCardEditing('financeiro') ? <Input value={data.financial?.formaPagamento || ''} onChange={e => handleChange('financial.formaPagamento', e.target.value)} /> : <ValueDisplay>{data.financial?.formaPagamento}</ValueDisplay>}
                                </div>
                            </div>
                             <div>
                                <Label>Observações Financeiras</Label>
                                {isCardEditing('financeiro') ? <Textarea value={data.financial?.observacoesFinanceiras || ''} onChange={e => handleChange('financial.observacoesFinanceiras', e.target.value)} placeholder="Anotações sobre faturamento, pagamentos, etc..." /> : <ValueDisplay className="min-h-[80px] h-auto">{data.financial?.observacoesFinanceiras}</ValueDisplay>}
                            </div>
                        </div>
                        <CardEditFooter card="financeiro" />
                    </AccordionContent>
                 </Card>
             </AccordionItem>
            
            {/* 6. REDE DE APOIO */}
            <AccordionItem value="item-6" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between w-full">
                           <CardTitle className="flex items-center gap-3 text-lg"><Users className="w-5 h-5 text-primary" />Rede de Apoio e Responsáveis</CardTitle>
                           <CardEditButton card="redeDeApoio" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Nome do Responsável Legal</Label>
                                    {isCardEditing('redeDeApoio') ? <Input value={data.supportNetwork?.responsavelLegal || ''} onChange={e => handleChange('supportNetwork.responsavelLegal', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.responsavelLegal}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Parentesco</Label>
                                    {isCardEditing('redeDeApoio') ? <Input value={data.supportNetwork?.parentescoResponsavel || ''} onChange={e => handleChange('supportNetwork.parentescoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.parentescoResponsavel}</ValueDisplay>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Telefone do Responsável</Label>
                                    {isCardEditing('redeDeApoio') ? <Input value={data.supportNetwork?.contatoResponsavel || ''} onChange={e => handleChange('supportNetwork.contatoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.contatoResponsavel}</ValueDisplay>}
                                </div>
                                <div>
                                    <Label>Email do Responsável</Label>
                                    {isCardEditing('redeDeApoio') ? <Input type="email" value={data.supportNetwork?.emailResponsavel || ''} onChange={e => handleChange('supportNetwork.emailResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.emailResponsavel}</ValueDisplay>}
                                </div>
                            </div>
                             <div>
                                <Label>Endereço do Responsável (se diferente)</Label>
                                {isCardEditing('redeDeApoio') ? <Input value={data.supportNetwork?.enderecoResponsavel || ''} onChange={e => handleChange('supportNetwork.enderecoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.enderecoResponsavel}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Familiares Cadastrados no App (IDs)</Label>
                                {isCardEditing('redeDeApoio') ? <Input value={data.supportNetwork?.familiaresAppIds?.join(', ') || ''} onChange={e => handleArrayChange('supportNetwork.familiaresAppIds', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.supportNetwork?.familiaresAppIds} />}
                            </div>
                             <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                                <div className="flex items-center space-x-3">
                                    <ShieldCheck className="h-6 w-6 text-primary"/>
                                    <div>
                                        <Label htmlFor="lgpd-auth" className="font-semibold cursor-pointer">
                                            Autorização para Acesso aos Dados
                                        </Label>
                                        <p className="text-xs text-muted-foreground">O responsável autoriza o compartilhamento de dados do paciente com a equipe de cuidado, conforme LGPD.</p>
                                    </div>
                                </div>
                                {isCardEditing('redeDeApoio') ? (
                                    <Switch 
                                        id="lgpd-auth"
                                        checked={data.supportNetwork?.autorizacaoAcessoDados || false} 
                                        onCheckedChange={c => handleChange('supportNetwork.autorizacaoAcessoDados', c)}
                                    />
                                ) : (
                                    <ValueDisplay className="w-20 justify-center">{data.supportNetwork?.autorizacaoAcessoDados ? 'Sim' : 'Não'}</ValueDisplay>
                                )}
                            </div>
                        </div>
                        <CardEditFooter card="redeDeApoio" />
                    </AccordionContent>
                 </Card>
             </AccordionItem>

             {/* 7. DOCUMENTOS E CONSENTIMENTOS */}
             <AccordionItem value="item-7" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between w-full">
                           <CardTitle className="flex items-center gap-3 text-lg"><FolderOpen className="w-5 h-5 text-primary" />Documentos e Consentimentos</CardTitle>
                           <CardEditButton card="documentos" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                 <Button variant="link" className="p-0 h-auto font-semibold text-foreground" onClick={() => alert('Abrir modal do Drive (futuro)')}>
                                    <h4 className="flex items-center gap-2"><FileText className="w-4 h-4" />Central de Documentos</h4>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-1 mb-4">Abaixo estão os links diretos para os documentos importantes do paciente.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <Label>Termo de Consentimento</Label>
                                        {isCardEditing('documentos') ? <Input value={data.documents?.termoConsentimentoUrl || ''} onChange={(e) => handleChange('documents.termoConsentimentoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.termoConsentimentoUrl} label="Visualizar Termo" />}
                                    </div>
                                    <div>
                                        <Label>Termo de LGPD / Uso de Imagem</Label>
                                        {isCardEditing('documentos') ? <Input value={data.documents?.termoLgpdUrl || ''} onChange={(e) => handleChange('documents.termoLgpdUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.termoLgpdUrl} label="Visualizar Termo LGPD" />}
                                    </div>
                                    <div>
                                        <Label>Documento com Foto (RG/CNH)</Label>
                                        {isCardEditing('documentos') ? <Input value={data.documents?.documentoComFotoUrl || ''} onChange={(e) => handleChange('documents.documentoComFotoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.documentoComFotoUrl} label="Visualizar Documento" />}
                                    </div>
                                    <div>
                                        <Label>Comprovante de Endereço</Label>
                                        {isCardEditing('documentos') ? <Input value={data.documents?.comprovanteEnderecoUrl || ''} onChange={(e) => handleChange('documents.comprovanteEnderecoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.comprovanteEnderecoUrl} label="Visualizar Comprovante" />}
                                    </div>
                                     <div>
                                        <Label>Ficha de Avaliação de Enfermagem</Label>
                                        {isCardEditing('documentos') ? <Input value={data.documents?.fichaAvaliacaoEnfermagemUrl || ''} onChange={(e) => handleChange('documents.fichaAvaliacaoEnfermagemUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.fichaAvaliacaoEnfermagemUrl} label="Visualizar Ficha" />}
                                    </div>
                                    <div>
                                        <Label>Plano de Cuidado Individualizado</Label>
                                        {isCardEditing('documentos') ? <Input value={data.documents?.planoCuidadoUrl || ''} onChange={(e) => handleChange('documents.planoCuidadoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.planoCuidadoUrl} label="Visualizar Plano" />}
                                    </div>
                                    <div>
                                        <Label>Último Protocolo de Auditoria</Label>
                                        {isCardEditing('documentos') ? <Input value={data.documents?.protocoloAuditoriaUrl || ''} onChange={(e) => handleChange('documents.protocoloAuditoriaUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.protocoloAuditoriaUrl} label="Visualizar Protocolo" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardEditFooter card="documentos" />
                    </AccordionContent>
                 </Card>
             </AccordionItem>

            {/* 8. HISTÓRICO E AUDITORIA */}
            <AccordionItem value="item-8" className="border-none">
                <Card>
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <History className="w-5 h-5 text-primary" />
                            Histórico e Auditoria
                        </CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <Label>Data de Criação</Label>
                                <ValueDisplay>
                                    {data.audit?.createdAt ? new Date(data.audit.createdAt).toLocaleString('pt-BR') : '-'}
                                </ValueDisplay>
                            </div>
                            <div>
                                <Label>Criado por</Label>
                                <ValueDisplay>{data.audit?.createdBy || '-'}</ValueDisplay>
                            </div>
                            <div>
                                <Label>Última Atualização</Label>
                                <ValueDisplay>
                                    {data.audit?.updatedAt ? new Date(data.audit.updatedAt).toLocaleString('pt-BR') : '-'}
                                </ValueDisplay>
                            </div>
                            <div>
                                <Label>Alterado por</Label>
                                <ValueDisplay>{data.audit?.updatedBy || '-'}</ValueDisplay>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" disabled>Ver Histórico Completo de Alterações</Button>
                    </AccordionContent>
                </Card>
            </AccordionItem>

        </Accordion>
    )
}

    