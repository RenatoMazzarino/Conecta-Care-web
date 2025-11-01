
'use client';

import * as React from 'react';
import type { Patient, Professional } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, Phone, Home, DollarSign, UserCheck, HeartPulse } from 'lucide-react';
import { professionals as mockProfessionals } from '@/lib/data';

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
        const newEditedData = JSON.parse(JSON.stringify(editedData));
        let current = newEditedData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setEditedData(newEditedData);
    };

    const supervisors = React.useMemo(() =>
        mockProfessionals.filter(p => p.role === 'Supervisor(a)'),
        []
    );

    const schedulers = React.useMemo(() =>
        mockProfessionals.filter(p => p.role === 'Escalista'),
        []
    );
    
    const ValueDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => <p className={cn("font-medium mt-1 text-sm text-foreground", className)}>{children || '-'}</p>;

    if (!displayData) return null;

    return (
         <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-primary" />Dados Pessoais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>ID do Paciente</Label>
                            <ValueDisplay className="font-mono text-xs">{displayData.id}</ValueDisplay>
                        </div>
                        <div>
                            <Label>Nome Completo</Label>
                            {isEditing ? <Input value={editedData?.name || ''} onChange={e => handleChange('name', e.target.value)} /> : <ValueDisplay>{displayData.name}</ValueDisplay>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>CPF</Label>
                                {isEditing ? <Input value={editedData?.cpf || ''} onChange={e => handleChange('cpf', e.target.value)} /> : <ValueDisplay>{displayData.cpf}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Data de Nascimento</Label>
                                {isEditing ? <Input type="date" value={editedData?.dateOfBirth || ''} onChange={e => handleChange('dateOfBirth', e.target.value)} /> : <ValueDisplay>{displayData.dateOfBirth ? new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</ValueDisplay>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Email</Label>
                                {isEditing ? <Input type="email" value={editedData?.email || ''} onChange={e => handleChange('email', e.target.value)} /> : <ValueDisplay>{displayData.email}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Telefone</Label>
                                {isEditing ? <Input value={editedData?.phone || ''} onChange={e => handleChange('phone', e.target.value)} /> : <ValueDisplay>{displayData.phone}</ValueDisplay>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Phone className="w-5 h-5 text-primary" />Contato de Emergência</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Nome do Contato</Label>
                            {isEditing ? <Input value={editedData?.familyContact.name || ''} onChange={e => handleChange('familyContact.name', e.target.value)} /> : <ValueDisplay>{displayData.familyContact.name}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>Telefone</Label>
                            {isEditing ? <Input value={editedData?.familyContact.phone || ''} onChange={e => handleChange('familyContact.phone', e.target.value)} placeholder="+55 11 99999-9999" /> : <ValueDisplay>{displayData.familyContact.phone}</ValueDisplay>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><HeartPulse className="w-5 h-5 text-primary" />Gestão Interna</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Status</Label>
                            {isEditing ? (
                                <Select value={editedData?.status || ''} onValueChange={v => handleChange('status', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ativo">Ativo</SelectItem>
                                        <SelectItem value="Inativo">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <ValueDisplay><Badge variant={displayData.status === 'Ativo' ? 'secondary' : 'destructive'}>{displayData.status}</Badge></ValueDisplay>
                            )}
                        </div>
                        <div>
                            <Label>Complexidade</Label>
                            {isEditing ? (
                                <Select value={editedData?.complexity || ''} onValueChange={v => handleChange('complexity', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="baixa">Baixa</SelectItem>
                                        <SelectItem value="media">Média</SelectItem>
                                        <SelectItem value="alta">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <ValueDisplay>{displayData.complexity.charAt(0).toUpperCase() + displayData.complexity.slice(1)}</ValueDisplay>
                            )}
                        </div>
                        <div>
                            <Label>Pacote de Serviço</Label>
                            {isEditing ? (
                                <Select value={editedData?.servicePackage || ''} onValueChange={v => handleChange('servicePackage', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Básico">Básico</SelectItem>
                                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                                        <SelectItem value="Completo">Completo</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <ValueDisplay>{displayData.servicePackage}</ValueDisplay>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-primary" />Responsáveis</CardTitle>
                    <CardDescription>Profissionais responsáveis pelo gerenciamento e escala do paciente.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Supervisor(a)</Label>
                        {isEditing ? (
                            <Select value={editedData?.supervisorId || ''} onValueChange={v => handleChange('supervisorId', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecione um supervisor..." /></SelectTrigger>
                                <SelectContent>
                                    {supervisors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{supervisors.find(s => s.id === displayData.supervisorId)?.name || 'Não atribuído'}</ValueDisplay>
                        )}
                    </div>
                    <div>
                        <Label>Escalista</Label>
                        {isEditing ? (
                            <Select value={editedData?.schedulerId || ''} onValueChange={v => handleChange('schedulerId', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecione um escalista..." /></SelectTrigger>
                                <SelectContent>
                                    {schedulers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{schedulers.find(s => s.id === displayData.schedulerId)?.name || 'Não atribuído'}</ValueDisplay>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Home className="w-5 h-5 text-primary" />Endereço</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="col-span-4">
                            <Label>Logradouro</Label>
                            {isEditing ? <Input value={editedData?.address.street || ''} onChange={e => handleChange('address.street', e.target.value)} /> : <ValueDisplay>{displayData.address.street}</ValueDisplay>}
                        </div>
                        <div className="col-span-2">
                            <Label>Número</Label>
                            {isEditing ? <Input value={editedData?.address.number || ''} onChange={e => handleChange('address.number', e.target.value)} /> : <ValueDisplay>{displayData.address.number}</ValueDisplay>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label>Complemento</Label>
                            {isEditing ? <Input value={editedData?.address.complement || ''} onChange={e => handleChange('address.complement', e.target.value)} /> : <ValueDisplay>{displayData.address.complement}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>Bairro</Label>
                            {isEditing ? <Input value={editedData?.address.neighborhood || ''} onChange={e => handleChange('address.neighborhood', e.target.value)} /> : <ValueDisplay>{displayData.address.neighborhood}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>CEP</Label>
                            {isEditing ? <Input value={editedData?.address.zipCode || ''} onChange={e => handleChange('address.zipCode', e.target.value)} /> : <ValueDisplay>{displayData.address.zipCode}</ValueDisplay>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Cidade</Label>
                            {isEditing ? <Input value={editedData?.address.city || ''} onChange={e => handleChange('address.city', e.target.value)} /> : <ValueDisplay>{displayData.address.city}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>Estado</Label>
                            {isEditing ? <Input value={editedData?.address.state || ''} onChange={e => handleChange('address.state', e.target.value)} /> : <ValueDisplay>{displayData.address.state}</ValueDisplay>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><DollarSign className="w-5 h-5 text-primary" />Informações Financeiras</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Label>Tipo de Vínculo</Label>
                        {isEditing ? (
                            <Select value={editedData?.financial.plan || ''} onValueChange={v => handleChange('financial.plan', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="particular">Particular</SelectItem>
                                    <SelectItem value="plano_de_saude">Plano de Saúde</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{displayData.financial.plan === 'particular' ? 'Particular' : 'Plano de Saúde'}</ValueDisplay>
                        )}
                    </div>
                    {displayData.financial.plan === 'plano_de_saude' && (
                        <>
                            <div>
                                <Label>Plano de Saúde</Label>
                                {isEditing ? <Input value={editedData?.financial.healthPlan || ''} onChange={e => handleChange('financial.healthPlan', e.target.value)} /> : <ValueDisplay>{displayData.financial.healthPlan}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Nº da Carteirinha</Label>
                                {isEditing ? <Input value={editedData?.financial.healthPlanId || ''} onChange={e => handleChange('financial.healthPlanId', e.target.value)} /> : <ValueDisplay>{displayData.financial.healthPlanId}</ValueDisplay>}
                            </div>
                        </>
                    )}
                    <div className={displayData.financial.plan === 'plano_de_saude' ? '' : 'col-span-2'}>
                        <Label>Mensalidade (R$)</Label>
                        {isEditing ? <Input type="number" value={editedData?.financial.monthlyFee || 0} onChange={e => handleChange('financial.monthlyFee', parseFloat(e.target.value))} /> : <ValueDisplay>{displayData.financial.monthlyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ValueDisplay>}
                    </div>
                    <div>
                        <Label>Dia do Vencimento</Label>
                        {isEditing ? <Input type="number" min="1" max="31" value={editedData?.financial.billingDay || 1} onChange={e => handleChange('financial.billingDay', parseInt(e.target.value))} /> : <ValueDisplay>Todo dia {displayData.financial.billingDay}</ValueDisplay>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
