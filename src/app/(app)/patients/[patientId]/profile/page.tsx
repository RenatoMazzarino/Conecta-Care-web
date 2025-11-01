
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import type { Patient, Professional } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Save, X, Phone, Home, DollarSign, FileText, Briefcase, UserCheck, HeartPulse, Fingerprint } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';
import { patients as mockPatients, professionals as mockProfessionals } from '@/lib/data';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PatientProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const patientId = params.patientId as string;

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedData, setEditedData] = React.useState<Patient | null>(null);
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [professionals, setProfessionals] = React.useState<Professional[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
        const foundPatient = mockPatients.find(p => p.id === patientId);
        if (foundPatient) {
            setPatient(foundPatient);
            setEditedData(JSON.parse(JSON.stringify(foundPatient))); // Deep copy
        }
        setProfessionals(mockProfessionals);
        setIsLoading(false);
    }, 500);
     return () => clearTimeout(timer);
  }, [patientId]);


  const handleEdit = () => {
    if (patient) {
      setEditedData(JSON.parse(JSON.stringify(patient))); // Reset to original on re-edit
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(patient ? JSON.parse(JSON.stringify(patient)) : null); // Revert changes
  };

  const handleSave = () => {
     if (!editedData) return;
    
    // Optimistically update local state
    setPatient(editedData);

    toast({
      title: "Ficha Salva",
      description: `As informações de ${editedData.name} foram atualizadas.`,
    });
    setIsEditing(false);
  };

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
  
  const displayData = isEditing ? editedData : patient;
  const isSaveDisabled = patient && editedData ? deepEqual(patient, editedData) : true;
  
  const supervisors = React.useMemo(() => 
    professionals.filter(p => p.role === 'Supervisor(a)'), 
    [professionals]
  );
  
  const schedulers = React.useMemo(() => 
    professionals.filter(p => p.role === 'Escalista'),
    [professionals]
  );

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                 <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-72 w-full" />
        </div>
    );
  }

  if (!displayData) {
    return (
        <Card>
          <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Paciente não encontrado</h2>
              <p className="text-muted-foreground">A ficha cadastral para este ID de paciente não foi encontrada.</p>
          </CardContent>
        </Card>
    );
  }
  
  const ValueDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => <p className={cn("font-medium mt-1 text-sm text-foreground", className)}>{children || '-'}</p>;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
           <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold text-foreground">{displayData.name}</h1>
             <Badge variant={displayData.status === 'Ativo' ? 'secondary' : 'destructive'}>{displayData.status}</Badge>
           </div>
          <p className="text-muted-foreground mt-1">Informações administrativas, financeiras e de contato.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="secondary"><Link href={`/patients/${patientId}`}><FileText className="mr-2"/>Ver Prontuário</Link></Button>
            {isEditing ? (
            <>
                <Button onClick={handleCancel} variant="outline"><X className="mr-2" />Cancelar</Button>
                <Button onClick={handleSave} disabled={isSaveDisabled}><Save className="mr-2" />Salvar</Button>
            </>
            ) : (
            <Button onClick={handleEdit}><Edit className="mr-2" />Editar Ficha</Button>
            )}
        </div>
      </div>
      
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
                        {isEditing ? <Input type="date" value={editedData?.dateOfBirth || ''} onChange={e => handleChange('dateOfBirth', e.target.value)} /> : <ValueDisplay>{displayData.dateOfBirth ? new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '-'}</ValueDisplay>}
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
  );
}
