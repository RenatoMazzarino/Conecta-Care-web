
'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home, Building, Dog, Ambulance, Stethoscope, Pill, Plus, X } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

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
        <div className={cn("font-medium mt-1 text-sm text-foreground break-words", className)}>
            {children || '-'}
        </div>
    );

    const ArrayValueDisplay = ({ value }: { value?: string[] }) => (
        <div className="font-medium mt-1 text-sm text-foreground break-words">
            {value && value.length > 0 ? value.join(', ') : '-'}
        </div>
    );

    const addMedication = () => {
        if (!editedData) return;
        const newMeds = [...(editedData.clinicalData?.medications || []), { name: '', dosage: '', frequency: '', notes: '' }];
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

    const data = editedData || displayData;

    if (!data) return null;

    return (
         <div className="space-y-6">
            
            {/* 1. DADOS PESSOAIS */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-primary" />Dados Pessoais</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <Label>ID do Paciente</Label>
                            <ValueDisplay className="font-mono text-xs">{data.id}</ValueDisplay>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Nome Completo</Label>
                            {isEditing ? <Input value={data.name || ''} onChange={e => handleChange('name', e.target.value)} /> : <ValueDisplay>{data.name}</ValueDisplay>}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label>Nome Social</Label>
                            {isEditing ? <Input value={data.socialName || ''} onChange={e => handleChange('socialName', e.target.value)} /> : <ValueDisplay>{data.socialName}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>CPF</Label>
                            {isEditing ? <Input value={data.cpf || ''} onChange={e => handleChange('cpf', e.target.value)} /> : <ValueDisplay>{data.cpf}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>RG</Label>
                            {isEditing ? <Input value={data.rg || ''} onChange={e => handleChange('rg', e.target.value)} /> : <ValueDisplay>{data.rg}</ValueDisplay>}
                        </div>
                     </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label>Órgão Emissor</Label>
                            {isEditing ? <Input value={data.rgEmissor || ''} onChange={e => handleChange('rgEmissor', e.target.value)} /> : <ValueDisplay>{data.rgEmissor}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>Data de Nascimento</Label>
                            {isEditing ? <Input type="date" value={data.dateOfBirth || ''} onChange={e => handleChange('dateOfBirth', e.target.value)} /> : <ValueDisplay>{data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                        </div>
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
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <Label>Estado Civil</Label>
                            {isEditing ? <Input value={data.estadoCivil || ''} onChange={e => handleChange('estadoCivil', e.target.value)} /> : <ValueDisplay>{data.estadoCivil}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Nacionalidade</Label>
                            {isEditing ? <Input value={data.nacionalidade || ''} onChange={e => handleChange('nacionalidade', e.target.value)} /> : <ValueDisplay>{data.nacionalidade}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Naturalidade</Label>
                            {isEditing ? <Input value={data.naturalidade || ''} onChange={e => handleChange('naturalidade', e.target.value)} /> : <ValueDisplay>{data.naturalidade}</ValueDisplay>}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div >
                            <Label>Email</Label>
                            {isEditing ? <Input type="email" value={data.email || ''} onChange={e => handleChange('email', e.target.value)} /> : <ValueDisplay>{data.email}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Telefone</Label>
                            {isEditing ? <Input value={data.phone || ''} onChange={e => handleChange('phone', e.target.value)} /> : <ValueDisplay>{data.phone}</ValueDisplay>}
                        </div>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
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
                </CardContent>
            </Card>

             {/* 2. ENDEREÇO E AMBIENTE */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Home className="w-5 h-5 text-primary" />Endereço e Ambiente Domiciliar</CardTitle></CardHeader>
                <CardContent className="space-y-6">
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
                         {data.address?.possuiAnimal && (
                             <div>
                                <Label>Descrição dos Animais</Label>
                                {isEditing ? <Input value={data.address?.animalDescricao || ''} onChange={e => handleChange('address.animalDescricao', e.target.value)} placeholder="Ex: 1 cão de pequeno porte, dócil." /> : <ValueDisplay>{data.address?.animalDescricao}</ValueDisplay>}
                            </div>
                         )}
                    </div>
                </CardContent>
            </Card>

            {/* 3. DADOS CLÍNICOS E ASSISTENCIAIS */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Stethoscope className="w-5 h-5 text-primary" />Dados Clínicos e Assistenciais</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>Diagnóstico Principal</Label>
                        {isEditing ? <Textarea value={data.clinicalData?.diagnosticoPrincipal || ''} onChange={e => handleChange('clinicalData.diagnosticoPrincipal', e.target.value)} /> : <ValueDisplay>{data.clinicalData?.diagnosticoPrincipal}</ValueDisplay>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Diagnósticos Secundários</Label>
                            {isEditing ? <Input value={data.clinicalData?.diagnosticosSecundarios?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.diagnosticosSecundarios', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.diagnosticosSecundarios} />}
                        </div>
                        <div>
                            <Label>CID(s)</Label>
                            {isEditing ? <Input value={data.clinicalData?.cid?.join(', ') || ''} onChange={e => handleArrayChange('clinicalData.cid', e.target.value)} placeholder="Separados por vírgula"/> : <ArrayValueDisplay value={data.clinicalData?.cid} />}
                        </div>
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
                </CardContent>
            </Card>

        </div>
    )
}

    