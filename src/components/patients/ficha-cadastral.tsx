

'use client';

import * as React from 'react';
import type { Diagnosis, Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home, Building, Dog, Ambulance, Stethoscope, Pill, Plus, X, Briefcase, Link as LinkIcon, FileText, NotebookTabs, Wallet, Users, ShieldCheck, FolderOpen, History } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FichaCadastralProps {
    isEditing: boolean;
    displayData: Patient;
    editedData: Patient | null;
    setEditedData: (data: Patient | null) => void;
}

export function FichaCadastral({ isEditing, displayData, editedData, setEditedData }: FichaCadastralProps) {

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
    
    const ValueDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <div className={cn("flex items-center h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm", className)}>
            {children || '-'}
        </div>
    );

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

    const addDiagnosis = () => {
        if (!editedData || !editedData.clinicalData) return;
        const newDiagnoses = [...(editedData.clinicalData.diagnoses || []), { name: '', code: '' }];
        handleChange('clinicalData.diagnoses', newDiagnoses);
    };

    const removeDiagnosis = (index: number) => {
        if (!editedData || !editedData.clinicalData?.diagnoses) return;
        const newDiagnoses = editedData.clinicalData.diagnoses.filter((_, i) => i !== index);
        handleChange('clinicalData.diagnoses', newDiagnoses);
    };

    const updateDiagnosis = (index: number, field: keyof Diagnosis, value: string) => {
        if (!editedData || !editedData.clinicalData?.diagnoses) return;
        const newDiagnoses = [...editedData.clinicalData.diagnoses];
        newDiagnoses[index] = { ...newDiagnoses[index], [field]: value };
        handleChange('clinicalData.diagnoses', newDiagnoses);
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
                        <CardTitle className="flex items-center gap-3 text-xl"><User className="w-6 h-6 text-primary" />Dados Pessoais</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="md:col-span-3">
                                <Label>Nome Completo</Label>
                                {isEditing ? <Input value={data.name || ''} onChange={e => handleChange('name', e.target.value)} /> : <ValueDisplay>{data.name}</ValueDisplay>}
                            </div>
                             <div className="md:col-span-1">
                                <Label>Nome Social</Label>
                                {isEditing ? <Input value={data.socialName || ''} onChange={e => handleChange('socialName', e.target.value)} /> : <ValueDisplay>{data.socialName}</ValueDisplay>}
                            </div>
                         </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div>
                                <Label>CPF</Label>
                                {isEditing ? <Input value={data.cpf || ''} onChange={e => handleChange('cpf', e.target.value)} /> : <ValueDisplay>{data.cpf}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>RG</Label>
                                {isEditing ? <Input value={data.rg || ''} onChange={e => handleChange('rg', e.target.value)} /> : <ValueDisplay>{data.rg}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Órgão Emissor</Label>
                                {isEditing ? <Input value={data.rgEmissor || ''} onChange={e => handleChange('rgEmissor', e.target.value)} /> : <ValueDisplay>{data.rgEmissor}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Data de Nascimento</Label>
                                {isEditing ? <Input type="date" value={data.dateOfBirth || ''} onChange={e => handleChange('dateOfBirth', e.target.value)} /> : <ValueDisplay>{data.dateOfBirth ? `${new Date(data.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} (${age})` : '-'}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div>
                                <Label>Sexo</Label>
                                {isEditing ? (
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
                                {isEditing ? <Input value={data.estadoCivil || ''} onChange={e => handleChange('estadoCivil', e.target.value)} /> : <ValueDisplay>{data.estadoCivil}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Nacionalidade</Label>
                                {isEditing ? <Input value={data.nacionalidade || ''} onChange={e => handleChange('nacionalidade', e.target.value)} /> : <ValueDisplay>{data.nacionalidade}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Naturalidade (Cidade/UF)</Label>
                                {isEditing ? <Input value={data.naturalidade || ''} onChange={e => handleChange('naturalidade', e.target.value)} /> : <ValueDisplay>{data.naturalidade}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             <div >
                                <Label>Email</Label>
                                {isEditing ? <Input type="email" value={data.email || ''} onChange={e => handleChange('email', e.target.value)} /> : <ValueDisplay>{data.email}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Telefone</Label>
                                {isEditing ? <Input value={data.phone || ''} onChange={e => handleChange('phone', e.target.value)} /> : <ValueDisplay>{data.phone}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg mb-6">
                            <h4 className="font-semibold mb-2">Contato de Emergência</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div>
                                    <Label>Nome</Label>
                                    {isEditing ? <Input value={data.emergencyContact?.name || ''} onChange={e => handleChange('emergencyContact.name', e.target.value)} /> : <ValueDisplay>{data.emergencyContact?.name}</ValueDisplay>}
                                </div>
                                 <div>
                                    <Label>Parentesco</Label>
                                    {isEditing ? <Input value={data.emergencyContact?.relationship || ''} onChange={e => handleChange('emergencyContact.relationship', e.target.value)} /> : <ValueDisplay>{data.emergencyContact?.relationship}</ValueDisplay>}
                                </div>
                                 <div>
                                    <Label>Telefone</Label>
                                    {isEditing ? <Input value={data.emergencyContact?.phone || ''} onChange={e => handleChange('emergencyContact.phone', e.target.value)} /> : <ValueDisplay>{data.emergencyContact?.phone}</ValueDisplay>}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <Button variant="link" className="p-0 h-auto font-semibold text-foreground" onClick={() => alert('Abrir modal do Drive (futuro)')}>
                                <h4 className="flex items-center gap-2"><FileText className="w-4 h-4" />Documentos Digitais</h4>
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label>RG Digital (URL)</Label>
                                {isEditing ? (
                                <Input value={data.rgDigitalUrl || ''} onChange={(e) => handleChange('rgDigitalUrl', e.target.value)} placeholder="https://..." />
                                ) : (
                                <LinkValueDisplay url={data.rgDigitalUrl} label="Visualizar RG" />
                                )}
                            </div>
                            {/* Adicionar mais campos de documentos aqui conforme necessário */}
                            </div>
                        </div>
                    </AccordionContent>
                </Card>
             </AccordionItem>

             {/* 2. ENDEREÇO E AMBIENTE */}
             <AccordionItem value="item-2" className="border-none">
                 <Card>
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-center gap-3 text-lg"><Home className="w-5 h-5 text-primary" />Endereço e Ambiente Domiciliar</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-1">
                                <Label>CEP</Label>
                                 {isEditing ? <Input value={data.address?.zipCode || ''} onChange={e => handleChange('address.zipCode', e.target.value)} /> : <ValueDisplay>{data.address?.zipCode}</ValueDisplay>}
                            </div>
                            <div className="md:col-span-3">
                                <Label>Logradouro</Label>
                                {isEditing ? <Input value={data.address?.street || ''} onChange={e => handleChange('address.street', e.target.value)} /> : <ValueDisplay>{data.address?.street}</ValueDisplay>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <Label>Número</Label>
                                {isEditing ? <Input value={data.address?.number || ''} onChange={e => handleChange('address.number', e.target.value)} /> : <ValueDisplay>{data.address?.number}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Complemento</Label>
                                {isEditing ? <Input value={data.address?.complement || ''} onChange={e => handleChange('address.complement', e.target.value)} /> : <ValueDisplay>{data.address?.complement}</ValueDisplay>}
                            </div>
                             <div className="md:col-span-2">
                                <Label>Bairro</Label>
                                {isEditing ? <Input value={data.address?.neighborhood || ''} onChange={e => handleChange('address.neighborhood', e.target.value)} /> : <ValueDisplay>{data.address?.neighborhood}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Label>Cidade</Label>
                                {isEditing ? <Input value={data.address?.city || ''} onChange={e => handleChange('address.city', e.target.value)} /> : <ValueDisplay>{data.address?.city}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Estado</Label>
                                {isEditing ? <Input value={data.address?.state || ''} onChange={e => handleChange('address.state', e.target.value)} /> : <ValueDisplay>{data.address?.state}</ValueDisplay>}
                            </div>
                        </div>
                         <div>
                            <Label>Ponto de Referência</Label>
                            {isEditing ? <Input value={data.address?.pontoReferencia || ''} onChange={e => handleChange('address.pontoReferencia', e.target.value)} /> : <ValueDisplay>{data.address?.pontoReferencia}</ValueDisplay>}
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                             <h4 className="font-semibold">Detalhes do Ambiente</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 <div>
                                    <Label className="flex items-center gap-2 mb-2"><Building className="w-4 h-4"/>Tipo de Residência</Label>
                                     {isEditing ? (
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
                                     {isEditing ? <Switch id="acessoAmbulancia" checked={data.address?.acessoAmbulancia || false} onCheckedChange={c => handleChange('address.acessoAmbulancia', c)} /> : <ValueDisplay>{data.address?.acessoAmbulancia ? 'Sim' : 'Não'}</ValueDisplay>}
                                </div>
                                 <div className="flex items-center gap-4 pt-5">
                                     <Label htmlFor="possuiAnimal" className="flex items-center gap-2 cursor-pointer"><Dog className="w-4 h-4"/>Possui Animal?</Label>
                                     {isEditing ? <Switch id="possuiAnimal" checked={data.address?.possuiAnimal || false} onCheckedChange={c => handleChange('address.possuiAnimal', c)} /> : <ValueDisplay>{data.address?.possuiAnimal ? 'Sim' : 'Não'}</ValueDisplay>}
                                </div>
                             </div>
                             <div>
                                <Label>Condições/Observações do Domicílio</Label>
                                {isEditing ? <Textarea value={data.address?.condicoesDomicilio || ''} onChange={e => handleChange('address.condicoesDomicilio', e.target.value)} placeholder="Ex: Acesso por escadas, pouca iluminação no corredor..." /> : <ValueDisplay>{data.address?.condicoesDomicilio}</ValueDisplay>}
                             </div>
                             {(isEditing || data.address?.possuiAnimal) && (
                                 <div>
                                    <Label>Descrição dos Animais</Label>
                                    {isEditing ? <Input value={data.address?.animalDescricao || ''} onChange={e => handleChange('address.animalDescricao', e.target.value)} placeholder="Ex: 1 cão de pequeno porte, dócil." /> : <ValueDisplay>{data.address?.animalDescricao}</ValueDisplay>}
                                </div>
                             )}
                        </div>
                    </AccordionContent>
                </Card>
             </AccordionItem>

            {/* 3. DADOS CLÍNICOS E ASSISTENCIAIS */}
             <AccordionItem value="item-3" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-center gap-3 text-lg"><Stethoscope className="w-5 h-5 text-primary" />Dados Clínicos e Assistenciais</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-6">
                        
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold flex items-center gap-2"><NotebookTabs className="w-4 h-4"/>Diagnósticos</h4>
                                {isEditing && (
                                <Button onClick={addDiagnosis} size="sm" variant="outline">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Adicionar
                                </Button>
                                )}
                            </div>
                            {isEditing ? (
                                 <div className="space-y-4">
                                    {data.clinicalData?.diagnoses?.map((diag, index) => (
                                        <Card key={index} className="p-4 bg-background">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium">Diagnóstico {index + 1}</h4>
                                                <Button onClick={() => removeDiagnosis(index)} size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 h-7 w-7">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3">
                                                <div>
                                                    <Label>Nome do Diagnóstico</Label>
                                                    <Input value={diag.name} onChange={(e) => updateDiagnosis(index, 'name', e.target.value)} />
                                                </div>
                                                <div>
                                                    <Label>Código (CID)</Label>
                                                    <Input value={diag.code} onChange={(e) => updateDiagnosis(index, 'code', e.target.value)} />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    {(!data.clinicalData?.diagnoses || data.clinicalData.diagnoses.length === 0) && (
                                        <p className="text-muted-foreground text-center py-4">Nenhum diagnóstico para editar.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {data.clinicalData?.diagnoses?.length > 0 ? (
                                        data.clinicalData.diagnoses.map((diag, i) => (
                                        <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-secondary-foreground">{diag.name}</p>
                                                {diag.code && <span className="text-xs font-mono bg-secondary-foreground/20 text-secondary-foreground py-0.5 px-1.5 rounded-sm">{diag.code}</span>}
                                            </div>
                                        </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-center py-4">Nenhum diagnóstico cadastrado.</p>
                                    )}
                                </div>
                            )}
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Alergias</Label>
                                {isEditing ? <Input value={data.clinicalData?.allergies?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.allergies', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.allergies} />}
                            </div>
                            <div>
                                <Label>Restrições (alimentares, físicas, etc.)</Label>
                                {isEditing ? <Input value={data.clinicalData?.restricoes?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.restricoes', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.restricoes} />}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label>Mobilidade</Label>
                                {isEditing ? (
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
                                {isEditing ? <Input value={data.clinicalData?.estadoConsciencia || ''} onChange={e => handleChange('clinicalData.estadoConsciencia', e.target.value)} /> : <ValueDisplay>{data.clinicalData?.estadoConsciencia}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Dispositivos (GTT, SNE, etc.)</Label>
                                {isEditing ? <Input value={data.clinicalData?.dispositivos?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.dispositivos', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.dispositivos} />}
                            </div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold flex items-center gap-2"><Pill className="w-4 h-4"/>Medicações em Uso</h4>
                                {isEditing && (
                                <Button onClick={addMedication} size="sm" variant="outline">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Adicionar
                                </Button>
                                )}
                            </div>
                             {isEditing ? (
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
                    </AccordionContent>
                 </Card>
             </AccordionItem>

             {/* 4. DADOS ADMINISTRATIVOS */}
             <AccordionItem value="item-4" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-center gap-3 text-lg"><Briefcase className="w-5 h-5 text-primary" />Informações Administrativas e Internas</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label>Status do Paciente</Label>
                                 {isEditing ? (
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
                                 {isEditing ? (
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
                                 {isEditing ? (
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
                                {isEditing ? <Input type="date" value={data.adminData?.dataInicioAtendimento || ''} onChange={e => handleChange('adminData.dataInicioAtendimento', e.target.value)} /> : <ValueDisplay>{data.adminData?.dataInicioAtendimento ? new Date(data.adminData.dataInicioAtendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Data de Término do Atendimento</Label>
                                {isEditing ? <Input type="date" value={data.adminData?.dataTerminoAtendimento || ''} onChange={e => handleChange('adminData.dataTerminoAtendimento', e.target.value)} /> : <ValueDisplay>{data.adminData?.dataTerminoAtendimento ? new Date(data.adminData.dataTerminoAtendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label>Supervisor(a)</Label>
                                {/* TODO: Replace with a Professional selector component */}
                                {isEditing ? <Input value={data.adminData?.supervisorId || ''} onChange={e => handleChange('adminData.supervisorId', e.target.value)} /> : <ValueDisplay>{data.adminData?.supervisorId}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Escalista</Label>
                                {isEditing ? <Input value={data.adminData?.schedulerId || ''} onChange={e => handleChange('adminData.schedulerId', e.target.value)} /> : <ValueDisplay>{data.adminData?.schedulerId}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Enfermeiro Responsável</Label>
                                {isEditing ? <Input value={data.adminData?.enfermeiroResponsavelId || ''} onChange={e => handleChange('adminData.enfermeiroResponsavelId', e.target.value)} /> : <ValueDisplay>{data.adminData?.enfermeiroResponsavelId}</ValueDisplay>}
                            </div>
                         </div>
                          <div>
                            <Label>Frequência de Atendimento</Label>
                            {isEditing ? <Input value={data.adminData?.frequenciaAtendimento || ''} onChange={e => handleChange('adminData.frequenciaAtendimento', e.target.value)} placeholder="Ex: 24h, 12h, 3x/semana" /> : <ValueDisplay>{data.adminData?.frequenciaAtendimento}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Observações Internas</Label>
                            {isEditing ? <Textarea value={data.adminData?.observacoesInternas || ''} onChange={e => handleChange('adminData.observacoesInternas', e.target.value)} placeholder="Anotações visíveis apenas para a equipe..." /> : <ValueDisplay className="min-h-[80px] h-auto">{data.adminData?.observacoesInternas}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>Cuidador(es) IDs</Label>
                            {isEditing ? <Input value={data.adminData?.cuidadoresIds?.join(', ') || ''} onChange={e => handleArrayChange('adminData.cuidadoresIds', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.adminData?.cuidadoresIds} />}
                        </div>
                    </AccordionContent>
                 </Card>
             </AccordionItem>

            {/* 5. DADOS FINANCEIROS */}
             <AccordionItem value="item-5" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-center gap-3 text-lg"><Wallet className="w-5 h-5 text-primary" />Informações Financeiras</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Tipo de Vínculo</Label>
                                {isEditing ? (
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
                                {isEditing ? <Input value={data.financial?.operadora || ''} onChange={e => handleChange('financial.operadora', e.target.value)} /> : <ValueDisplay>{data.financial?.operadora}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Nº da Carteirinha</Label>
                                {isEditing ? <Input value={data.financial?.carteirinha || ''} onChange={e => handleChange('financial.carteirinha', e.target.value)} /> : <ValueDisplay>{data.financial?.carteirinha}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Validade da Carteirinha</Label>
                                {isEditing ? <Input type="date" value={data.financial?.validadeCarteirinha || ''} onChange={e => handleChange('financial.validadeCarteirinha', e.target.value)} /> : <ValueDisplay>{data.financial?.validadeCarteirinha ? new Date(data.financial.validadeCarteirinha).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label>Valor Mensal (R$)</Label>
                                {isEditing ? <Input type="number" value={data.financial?.monthlyFee || ''} onChange={e => handleChange('financial.monthlyFee', parseFloat(e.target.value))} /> : <ValueDisplay>{data.financial?.monthlyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Dia do Vencimento</Label>
                                {isEditing ? <Input type="number" value={data.financial?.billingDay || ''} onChange={e => handleChange('financial.billingDay', parseInt(e.target.value))} /> : <ValueDisplay>{data.financial?.billingDay}</ValueDisplay>}
                            </div>
                             <div>
                                <Label>Forma de Pagamento</Label>
                                {isEditing ? <Input value={data.financial?.formaPagamento || ''} onChange={e => handleChange('financial.formaPagamento', e.target.value)} /> : <ValueDisplay>{data.financial?.formaPagamento}</ValueDisplay>}
                            </div>
                        </div>
                         <div>
                            <Label>Observações Financeiras</Label>
                            {isEditing ? <Textarea value={data.financial?.observacoesFinanceiras || ''} onChange={e => handleChange('financial.observacoesFinanceiras', e.target.value)} placeholder="Anotações sobre faturamento, pagamentos, etc..." /> : <ValueDisplay className="min-h-[80px] h-auto">{data.financial?.observacoesFinanceiras}</ValueDisplay>}
                        </div>
                    </AccordionContent>
                 </Card>
             </AccordionItem>
            
            {/* 6. REDE DE APOIO */}
            <AccordionItem value="item-6" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-center gap-3 text-lg"><Users className="w-5 h-5 text-primary" />Rede de Apoio e Responsáveis</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Nome do Responsável Legal</Label>
                                {isEditing ? <Input value={data.supportNetwork?.responsavelLegal || ''} onChange={e => handleChange('supportNetwork.responsavelLegal', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.responsavelLegal}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Parentesco</Label>
                                {isEditing ? <Input value={data.supportNetwork?.parentescoResponsavel || ''} onChange={e => handleChange('supportNetwork.parentescoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.parentescoResponsavel}</ValueDisplay>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Telefone do Responsável</Label>
                                {isEditing ? <Input value={data.supportNetwork?.contatoResponsavel || ''} onChange={e => handleChange('supportNetwork.contatoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.contatoResponsavel}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Email do Responsável</Label>
                                {isEditing ? <Input type="email" value={data.supportNetwork?.emailResponsavel || ''} onChange={e => handleChange('supportNetwork.emailResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.emailResponsavel}</ValueDisplay>}
                            </div>
                        </div>
                         <div>
                            <Label>Endereço do Responsável (se diferente)</Label>
                            {isEditing ? <Input value={data.supportNetwork?.enderecoResponsavel || ''} onChange={e => handleChange('supportNetwork.enderecoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.enderecoResponsavel}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Familiares Cadastrados no App (IDs)</Label>
                            {isEditing ? <Input value={data.supportNetwork?.familiaresAppIds?.join(', ') || ''} onChange={e => handleArrayChange('supportNetwork.familiaresAppIds', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.supportNetwork?.familiaresAppIds} />}
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
                            {isEditing ? (
                                <Switch 
                                    id="lgpd-auth"
                                    checked={data.supportNetwork?.autorizacaoAcessoDados || false} 
                                    onCheckedChange={c => handleChange('supportNetwork.autorizacaoAcessoDados', c)}
                                />
                            ) : (
                                <ValueDisplay className="w-20 justify-center">{data.supportNetwork?.autorizacaoAcessoDados ? 'Sim' : 'Não'}</ValueDisplay>
                            )}
                        </div>
                    </AccordionContent>
                 </Card>
             </AccordionItem>

             {/* 7. DOCUMENTOS E CONSENTIMENTOS */}
             <AccordionItem value="item-7" className="border-none">
                 <Card>
                     <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-center gap-3 text-lg"><FolderOpen className="w-5 h-5 text-primary" />Documentos e Consentimentos</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                             <Button variant="link" className="p-0 h-auto font-semibold text-foreground" onClick={() => alert('Abrir modal do Drive (futuro)')}>
                                <h4 className="flex items-center gap-2"><FileText className="w-4 h-4" />Central de Documentos</h4>
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1 mb-4">Abaixo estão os links diretos para os documentos importantes do paciente.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <Label>Termo de Consentimento</Label>
                                    {isEditing ? <Input value={data.documents?.termoConsentimentoUrl || ''} onChange={(e) => handleChange('documents.termoConsentimentoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.termoConsentimentoUrl} label="Visualizar Termo" />}
                                </div>
                                <div>
                                    <Label>Termo de LGPD / Uso de Imagem</Label>
                                    {isEditing ? <Input value={data.documents?.termoLgpdUrl || ''} onChange={(e) => handleChange('documents.termoLgpdUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.termoLgpdUrl} label="Visualizar Termo LGPD" />}
                                </div>
                                <div>
                                    <Label>Documento com Foto (RG/CNH)</Label>
                                    {isEditing ? <Input value={data.documents?.documentoComFotoUrl || ''} onChange={(e) => handleChange('documents.documentoComFotoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.documentoComFotoUrl} label="Visualizar Documento" />}
                                </div>
                                <div>
                                    <Label>Comprovante de Endereço</Label>
                                    {isEditing ? <Input value={data.documents?.comprovanteEnderecoUrl || ''} onChange={(e) => handleChange('documents.comprovanteEnderecoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.comprovanteEnderecoUrl} label="Visualizar Comprovante" />}
                                </div>
                                 <div>
                                    <Label>Ficha de Avaliação de Enfermagem</Label>
                                    {isEditing ? <Input value={data.documents?.fichaAvaliacaoEnfermagemUrl || ''} onChange={(e) => handleChange('documents.fichaAvaliacaoEnfermagemUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.fichaAvaliacaoEnfermagemUrl} label="Visualizar Ficha" />}
                                </div>
                                <div>
                                    <Label>Plano de Cuidado Individualizado</Label>
                                    {isEditing ? <Input value={data.documents?.planoCuidadoUrl || ''} onChange={(e) => handleChange('documents.planoCuidadoUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.planoCuidadoUrl} label="Visualizar Plano" />}
                                </div>
                                <div>
                                    <Label>Último Protocolo de Auditoria</Label>
                                    {isEditing ? <Input value={data.documents?.protocoloAuditoriaUrl || ''} onChange={(e) => handleChange('documents.protocoloAuditoriaUrl', e.target.value)} placeholder="https://..." /> : <LinkValueDisplay url={data.documents?.protocoloAuditoriaUrl} label="Visualizar Protocolo" />}
                                </div>
                            </div>
                        </div>
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
