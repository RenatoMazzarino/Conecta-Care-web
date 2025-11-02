
'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home } from 'lucide-react';

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
        let current = newEditedData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) {
              current[keys[i]] = {}; // Create nested object if it doesn't exist
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setEditedData(newEditedData);
    };
    
    const ValueDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <div className={cn("font-medium mt-1 text-sm text-foreground break-words", className)}>
            {children || '-'}
        </div>
    );

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
        </div>
    )
}
