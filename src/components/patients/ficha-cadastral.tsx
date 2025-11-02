
'use client';

import * as React from 'react';
import type { Patient, Professional } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, Phone, Home, DollarSign, UserCheck, HeartPulse, FileText, Briefcase, Building, Shield, Activity, Users, FileHeart } from 'lucide-react';
import { professionals as mockProfessionals } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

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

    const supervisors = React.useMemo(() =>
        mockProfessionals.filter(p => p.role === 'Supervisor(a)'),
        []
    );

    const schedulers = React.useMemo(() =>
        mockProfessionals.filter(p => p.role === 'Escalista'),
        []
    );
    
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
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <Label>ID do Paciente</Label>
                            <ValueDisplay className="font-mono text-xs">{data.id}</ValueDisplay>
                        </div>
                        <div className="col-span-2">
                            <Label>Nome Completo</Label>
                            {isEditing ? <Input value={data.name || ''} onChange={e => handleChange('name', e.target.value)} /> : <ValueDisplay>{data.name}</ValueDisplay>}
                        </div>
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
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                         <div>
                            <Label>Estado Civil</Label>
                            {isEditing ? <Input value={data.estadoCivil || ''} onChange={e => handleChange('estadoCivil', e.target.value)} /> : <ValueDisplay>{data.estadoCivil}</ValueDisplay>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 6. REDE DE APOIO E RESPONSÁVEIS */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Users className="w-5 h-5 text-primary" />Rede de Apoio e Contato</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label>Responsável Legal</Label>
                            {isEditing ? <Input value={data.supportNetwork?.responsavelLegal || ''} onChange={e => handleChange('supportNetwork.responsavelLegal', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.responsavelLegal}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Parentesco</Label>
                            {isEditing ? <Input value={data.supportNetwork?.parentescoResponsavel || ''} onChange={e => handleChange('supportNetwork.parentescoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.parentescoResponsavel}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Telefone do Responsável</Label>
                            {isEditing ? <Input value={data.supportNetwork?.contatoResponsavel || ''} onChange={e => handleChange('supportNetwork.contatoResponsavel', e.target.value)} /> : <ValueDisplay>{data.supportNetwork?.contatoResponsavel}</ValueDisplay>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. ENDEREÇO E AMBIENTE */}
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Home className="w-5 h-5 text-primary" />Endereço e Ambiente Domiciliar</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="col-span-4">
                            <Label>Logradouro</Label>
                            {isEditing ? <Input value={data.address.street || ''} onChange={e => handleChange('address.street', e.target.value)} /> : <ValueDisplay>{data.address.street}</ValueDisplay>}
                        </div>
                        <div className="col-span-2">
                            <Label>Número</Label>
                            {isEditing ? <Input value={data.address.number || ''} onChange={e => handleChange('address.number', e.target.value)} /> : <ValueDisplay>{data.address.number}</ValueDisplay>}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label>Complemento</Label>
                            {isEditing ? <Input value={data.address.complement || ''} onChange={e => handleChange('address.complement', e.target.value)} /> : <ValueDisplay>{data.address.complement}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>Bairro</Label>
                            {isEditing ? <Input value={data.address.neighborhood || ''} onChange={e => handleChange('address.neighborhood', e.target.value)} /> : <ValueDisplay>{data.address.neighborhood}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>CEP</Label>
                            {isEditing ? <Input value={data.address.zipCode || ''} onChange={e => handleChange('address.zipCode', e.target.value)} /> : <ValueDisplay>{data.address.zipCode}</ValueDisplay>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Cidade</Label>
                            {isEditing ? <Input value={data.address.city || ''} onChange={e => handleChange('address.city', e.target.value)} /> : <ValueDisplay>{data.address.city}</ValueDisplay>}
                        </div>
                        <div>
                            <Label>Estado</Label>
                            {isEditing ? <Input value={data.address.state || ''} onChange={e => handleChange('address.state', e.target.value)} /> : <ValueDisplay>{data.address.state}</ValueDisplay>}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div>
                            <Label>Condições do Domicílio</Label>
                            {isEditing ? <Textarea value={data.address.condicoesDomicilio || ''} onChange={e => handleChange('address.condicoesDomicilio', e.target.value)} placeholder="Ex: Acesso por escadas, boa iluminação..." /> : <ValueDisplay>{data.address.condicoesDomicilio}</ValueDisplay>}
                        </div>
                        <div className="flex flex-col gap-4 pt-2">
                           <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <Label htmlFor="acesso-ambulancia" className="flex flex-col gap-1">
                                    <span>Acesso para Ambulância</span>
                                    <span className="font-normal text-xs text-muted-foreground">Acesso fácil para veículos de emergência.</span>
                                </Label>
                                {isEditing ? <Switch id="acesso-ambulancia" checked={data.address.acessoAmbulancia} onCheckedChange={c => handleChange('address.acessoAmbulancia', c)} /> : <Badge variant={data.address.acessoAmbulancia ? 'secondary' : 'outline'}>{data.address.acessoAmbulancia ? 'Sim' : 'Não'}</Badge>}
                           </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. DADOS CLÍNICOS */}
            <Card>
                 <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileHeart className="w-5 h-5 text-primary" />Dados Clínicos e Assistenciais</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    <div>
                        <Label>Diagnóstico Principal</Label>
                         {isEditing ? <Textarea value={data.clinicalData?.diagnosticoPrincipal || ''} onChange={e => handleChange('clinicalData.diagnosticoPrincipal', e.target.value)} /> : <ValueDisplay>{data.clinicalData?.diagnosticoPrincipal}</ValueDisplay>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Diagnósticos Secundários (separados por vírgula)</Label>
                            {isEditing ? <Input value={data.clinicalData?.diagnosticosSecundarios?.join(', ') || ''} onChange={e => handleChange('clinicalData.diagnosticosSecundarios', e.target.value.split(',').map(s => s.trim()))} /> : <ValueDisplay>{data.clinicalData?.diagnosticosSecundarios?.join(', ')}</ValueDisplay>}
                        </div>
                         <div>
                            <Label>Alergias (separadas por vírgula)</Label>
                            {isEditing ? <Input value={data.clinicalData?.allergies?.join(', ') || ''} onChange={e => handleChange('clinicalData.allergies', e.target.value.split(',').map(s => s.trim()))} /> : <ValueDisplay>{data.clinicalData?.allergies?.join(', ')}</ValueDisplay>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Label>Dispositivos (GTT, SNE, etc)</Label>
                            {isEditing ? <Input value={data.clinicalData?.dispositivos?.join(', ') || ''} onChange={e => handleChange('clinicalData.dispositivos', e.target.value.split(',').map(s => s.trim()))} /> : <ValueDisplay>{data.clinicalData?.dispositivos?.join(', ')}</ValueDisplay>}
                        </div>
                    </div>
                 </CardContent>
            </Card>

            {/* 4. INFORMAÇÕES ADMINISTRATIVAS */}
            <Card>
                 <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Activity className="w-5 h-5 text-primary" />Informações Administrativas</CardTitle></CardHeader>
                 <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Status</Label>
                        {isEditing ? (
                            <Select value={data.adminData?.status || ''} onValueChange={v => handleChange('adminData.status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay><Badge variant={data.adminData?.status === 'Ativo' ? 'secondary' : 'destructive'}>{data.adminData?.status}</Badge></ValueDisplay>
                        )}
                    </div>
                    <div>
                        <Label>Complexidade</Label>
                        {isEditing ? (
                            <Select value={data.adminData?.complexity || ''} onValueChange={v => handleChange('adminData.complexity', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baixa">Baixa</SelectItem>
                                    <SelectItem value="Média">Média</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{data.adminData?.complexity}</ValueDisplay>
                        )}
                    </div>
                    <div>
                        <Label>Pacote de Serviço</Label>
                        {isEditing ? (
                            <Select value={data.adminData?.servicePackage || ''} onValueChange={v => handleChange('adminData.servicePackage', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Básico">Básico</SelectItem>
                                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                                    <SelectItem value="Completo">Completo</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{data.adminData?.servicePackage}</ValueDisplay>
                        )}
                    </div>
                    <div>
                        <Label>Supervisor(a)</Label>
                        {isEditing ? (
                            <Select value={data.adminData?.supervisorId || ''} onValueChange={v => handleChange('adminData.supervisorId', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    {supervisors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{supervisors.find(s => s.id === data.adminData?.supervisorId)?.name || 'Não atribuído'}</ValueDisplay>
                        )}
                    </div>
                    <div>
                        <Label>Escalista</Label>
                        {isEditing ? (
                            <Select value={data.adminData?.schedulerId || ''} onValueChange={v => handleChange('adminData.schedulerId', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    {schedulers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{schedulers.find(s => s.id === data.adminData?.schedulerId)?.name || 'Não atribuído'}</ValueDisplay>
                        )}
                    </div>
                 </CardContent>
            </Card>

            {/* 5. INFORMAÇÕES FINANCEIRAS */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><DollarSign className="w-5 h-5 text-primary" />Informações Financeiras</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Label>Tipo de Vínculo</Label>
                        {isEditing ? (
                            <Select value={data.financial.vinculo || ''} onValueChange={v => handleChange('financial.vinculo', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Particular">Particular</SelectItem>
                                    <SelectItem value="Plano de Saúde">Plano de Saúde</SelectItem>
                                    <SelectItem value="Convênio">Convênio</SelectItem>
                                    <SelectItem value="Público">Público</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <ValueDisplay>{data.financial.vinculo}</ValueDisplay>
                        )}
                    </div>
                    {data.financial.vinculo === 'Plano de Saúde' && (
                        <>
                            <div>
                                <Label>Plano de Saúde</Label>
                                {isEditing ? <Input value={data.financial.operadora || ''} onChange={e => handleChange('financial.operadora', e.target.value)} /> : <ValueDisplay>{data.financial.operadora}</ValueDisplay>}
                            </div>
                            <div>
                                <Label>Nº da Carteirinha</Label>
                                {isEditing ? <Input value={data.financial.carteirinha || ''} onChange={e => handleChange('financial.carteirinha', e.target.value)} /> : <ValueDisplay>{data.financial.carteirinha}</ValueDisplay>}
                            </div>
                        </>
                    )}
                    <div className={data.financial.vinculo === 'Plano de Saúde' ? '' : 'col-span-2'}>
                        <Label>Mensalidade (R$)</Label>
                        {isEditing ? <Input type="number" value={data.financial.monthlyFee || 0} onChange={e => handleChange('financial.monthlyFee', parseFloat(e.target.value))} /> : <ValueDisplay>{data.financial.monthlyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ValueDisplay>}
                    </div>
                    <div>
                        <Label>Dia do Vencimento</Label>
                        {isEditing ? <Input type="number" min="1" max="31" value={data.financial.billingDay || 1} onChange={e => handleChange('financial.billingDay', parseInt(e.target.value))} /> : <ValueDisplay>Todo dia {data.financial.billingDay}</ValueDisplay>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
