
'use client';

import * as React from 'react';
import type { Patient, Professional } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
    Activity, ShieldCheck, ShieldX, ShieldAlert, BookLock, UserCog, User, CalendarDays, Repeat, MapPin as Map, Briefcase, FileText, Clock, FileClock, Puzzle, Cog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { professionals as allProfessionals } from '@/lib/data';

const statusConfig: { [key: string]: { icon: React.ElementType, text: string, className: string } } = {
  Ativo: { icon: ShieldCheck, text: 'Ativo', className: 'bg-green-100 text-green-800 border-green-200' },
  Inativo: { icon: ShieldX, text: 'Inativo', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  Suspenso: { icon: ShieldAlert, text: 'Suspenso', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  Alta: { icon: ShieldCheck, text: 'Alta', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  'Internado Temporário': { icon: ShieldAlert, text: 'Internado', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  Óbito: { icon: BookLock, text: 'Óbito', className: 'bg-black/5 text-black/60 border-black/10' },
};

const complexityConfig: { [key: string]: { className: string } } = {
  Baixa: { className: 'bg-green-100 text-green-800' },
  Média: { className: 'bg-yellow-100 text-yellow-800' },
  Alta: { className: 'bg-red-100 text-red-800' },
  Crítica: { className: 'bg-red-200 text-red-900 border-red-300 ring-2 ring-red-500' },
};


const InfoField = ({ label, children, icon: Icon }: { label: string, children: React.ReactNode, icon: React.ElementType }) => (
    <div>
        <dt className="text-xs text-slate-600 flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4"/>
            {label}
        </dt>
        <dd className="text-sm text-slate-900 font-medium">
            {children}
        </dd>
    </div>
);

type FichaAdministrativaProps = {
  displayData: Patient | null;
  professionals: Professional[];
};

export function FichaAdministrativa({ displayData, professionals }: FichaAdministrativaProps) {
  if (!displayData) return null;

  const { adminData } = displayData;
  const currentStatus = statusConfig[adminData.status] || statusConfig.Inativo;
  const StatusIcon = currentStatus.icon;
  
  const professionalMap = new Map(professionals.map(p => [p.id, p.name]));
  const supervisor = adminData.supervisorId ? professionalMap.get(adminData.supervisorId) : 'Não definido';
  const escalista = adminData.escalistaId ? professionalMap.get(adminData.escalistaId) : 'Não definido';
  const nurseResponsible = adminData.nurseResponsibleId ? professionalMap.get(adminData.nurseResponsibleId) : 'Não definido';
  
  const formattedStartDate = adminData.startDate ? new Date(adminData.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
  const formattedEndDate = adminData.endDate ? new Date(adminData.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Vigente';
  const formattedAuditDate = adminData.lastAuditDate ? new Date(adminData.lastAuditDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Pendente';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cog className="w-6 h-6 text-primary" />
              Gestão Administrativa
            </CardTitle>
            <CardDescription>Painel de controle interno do paciente.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("text-base py-1 px-3", currentStatus.className)}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {currentStatus.text}
            </Badge>
            <Badge className={cn("text-base py-1 px-3", complexityConfig[adminData.complexity]?.className)}>
              {adminData.complexity} Complexidade
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seção de Responsáveis */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><UserCog className="w-5 h-5 text-muted-foreground"/>Responsáveis Internos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoField icon={User} label="Supervisor(a) Técnico(a)">{supervisor}</InfoField>
            <InfoField icon={User} label="Escalista">{escalista}</InfoField>
            <InfoField icon={User} label="Enfermeiro(a) Líder">{nurseResponsible}</InfoField>
          </div>
        </div>

        {/* Seção de Dados Operacionais e Contratuais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-4 border rounded-lg bg-muted/30 space-y-4">
                 <h3 className="font-semibold mb-3 flex items-center gap-2"><Briefcase className="w-5 h-5 text-muted-foreground"/>Dados Operacionais e Contratuais</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoField icon={Map} label="Área de Operação">{adminData.operationArea || '-'}</InfoField>
                    <InfoField icon={Puzzle} label="Origem da Admissão">{adminData.admissionSource || '-'}</InfoField>
                    <InfoField icon={FileText} label="Pacote de Serviço">{adminData.servicePackage}</InfoField>
                    <InfoField icon={FileClock} label="Tipo de Admissão">{adminData.admissionType || '-'}</InfoField>
                    <InfoField icon={CalendarDays} label="Início do Atendimento">{formattedStartDate}</InfoField>
                    <InfoField icon={CalendarDays} label="Fim do Atendimento">{formattedEndDate}</InfoField>
                    <InfoField icon={Repeat} label="Frequência">{adminData.frequency || '-'}</InfoField>
                 </div>
            </div>
            <div className="md:col-span-1 p-4 border rounded-lg bg-muted/30 space-y-4">
                 <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-muted-foreground"/>Auditoria</h3>
                  <div className="space-y-4">
                    <InfoField icon={FileClock} label="Última Auditoria">{formattedAuditDate}</InfoField>
                    <InfoField icon={User} label="Auditor(a)">{adminData.lastAuditBy || 'Não definido'}</InfoField>
                    <InfoField icon={FileText} label="Contrato">{adminData.contractId || 'Não vinculado'}</InfoField>
                  </div>
            </div>
        </div>

        {adminData.notesInternal && (
            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold text-yellow-800 flex items-center gap-2"><BookLock className="w-5 h-5"/>Observações Internas</h3>
                <p className="text-sm text-yellow-900 mt-2">{adminData.notesInternal}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
