'use client';

import * as React from 'react';
import type { Patient, Professional } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  BookLock,
  UserCog,
  User,
  CalendarDays,
  Repeat,
  MapPin as MapPinIcon,
  Briefcase,
  FileText,
  Clock,
  FileClock,
  Puzzle,
  Cog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const statusConfig: { [key: string]: { icon: React.ElementType; text: string; className: string } } = {
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

const statusOptions = Object.keys(statusConfig);
const complexityOptions = Object.keys(complexityConfig);

const InfoField = ({ label, children, icon: Icon }: { label: string; children: React.ReactNode; icon: React.ElementType }) => (
  <div>
    <dt className="text-xs text-slate-600 flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4" />
      {label}
    </dt>
    <dd className="text-sm text-slate-900 font-medium">{children}</dd>
  </div>
);

type Props = {
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: React.Dispatch<React.SetStateAction<Patient | null>>;
  isEditing: boolean;
  professionals: Professional[];
};

export function FichaAdministrativa({ displayData, editedData, setEditedData, isEditing, professionals }: Props) {
  if (!displayData || !editedData) return null;

  const adminData = editedData.adminData ?? displayData.adminData;
  const currentStatus = statusConfig[adminData.status] || statusConfig.Ativo;
  const StatusIcon = currentStatus.icon;

  const professionalMap = new Map(professionals.map((p) => [p.id, p.name]));
  const supervisor = adminData.supervisorId ? professionalMap.get(adminData.supervisorId) : 'Não definido';
  const escalista = adminData.escalistaId ? professionalMap.get(adminData.escalistaId) : 'Não definido';
  const nurseResponsible = adminData.nurseResponsibleId ? professionalMap.get(adminData.nurseResponsibleId) : 'Não definido';
  const formattedAuditDate = adminData.lastAuditDate
    ? new Date(adminData.lastAuditDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    : 'Pendente';

  const handleAdminChange = (field: keyof Patient['adminData'], value: string) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.adminData = {
        ...next.adminData,
        [field]: value,
      };
      return next;
    });
  };

  const renderDisplay = (value?: string, fallback = '-') => (value && value !== '' ? value : fallback);

  const renderDate = (field: keyof Patient['adminData']) => {
    const raw = adminData[field] as string | undefined;
    if (!isEditing) {
      return renderDisplay(raw ? new Date(raw).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : undefined);
    }
    return (
      <Input
        type="date"
        value={raw?.slice(0, 10) ?? ''}
        onChange={(e) => handleAdminChange(field, e.target.value)}
      />
    );
  };

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
          <div className="flex flex-col gap-2">
            {isEditing ? (
              <Select value={adminData.status} onValueChange={(value) => handleAdminChange('status', value)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge className={cn('text-base py-1 px-3', currentStatus.className)}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {currentStatus.text}
              </Badge>
            )}
            {isEditing ? (
              <Select value={adminData.complexity} onValueChange={(value) => handleAdminChange('complexity', value)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Complexidade" />
                </SelectTrigger>
                <SelectContent>
                  {complexityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge className={cn('text-base py-1 px-3', complexityConfig[adminData.complexity]?.className)}>
                {adminData.complexity} Complexidade
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-lg bg-muted/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-muted-foreground" />
            Responsáveis Internos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoField icon={User} label="Supervisor(a) Técnico(a)">
              {renderDisplay(supervisor)}
            </InfoField>
            <InfoField icon={User} label="Escalista">
              {renderDisplay(escalista)}
            </InfoField>
            <InfoField icon={User} label="Enfermeiro(a) Líder">
              {renderDisplay(nurseResponsible)}
            </InfoField>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-4 border rounded-lg bg-muted/30 space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              Dados Operacionais e Contratuais
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoField icon={MapPinIcon} label="Área de Operação">
                {isEditing ? (
                  <Input
                    value={adminData.operationArea ?? ''}
                    onChange={(e) => handleAdminChange('operationArea', e.target.value)}
                  />
                ) : (
                  renderDisplay(adminData.operationArea)
                )}
              </InfoField>
              <InfoField icon={Puzzle} label="Origem da Admissão">
                {isEditing ? (
                  <Input
                    value={adminData.admissionSource ?? ''}
                    onChange={(e) => handleAdminChange('admissionSource', e.target.value)}
                  />
                ) : (
                  renderDisplay(adminData.admissionSource)
                )}
              </InfoField>
              <InfoField icon={FileText} label="Pacote de Serviço">
                {isEditing ? (
                  <Input
                    value={adminData.servicePackage ?? ''}
                    onChange={(e) => handleAdminChange('servicePackage', e.target.value)}
                  />
                ) : (
                  renderDisplay(adminData.servicePackage)
                )}
              </InfoField>
              <InfoField icon={FileClock} label="Tipo de Admissão">
                {isEditing ? (
                  <Select
                    value={adminData.admissionType ?? ''}
                    onValueChange={(value) => handleAdminChange('admissionType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home Care">Home Care</SelectItem>
                      <SelectItem value="Paliativo">Paliativo</SelectItem>
                      <SelectItem value="Internação Domiciliar">Internação Domiciliar</SelectItem>
                      <SelectItem value="Acompanhamento Ambulatorial">Acompanhamento Ambulatorial</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  renderDisplay(adminData.admissionType)
                )}
              </InfoField>
              <InfoField icon={CalendarDays} label="Início do Atendimento">
                {renderDate('startDate')}
              </InfoField>
              <InfoField icon={CalendarDays} label="Fim do Atendimento">
                {renderDate('endDate')}
              </InfoField>
              <InfoField icon={Repeat} label="Frequência">
                {isEditing ? (
                  <Input
                    value={adminData.frequency ?? ''}
                    onChange={(e) => handleAdminChange('frequency', e.target.value)}
                  />
                ) : (
                  renderDisplay(adminData.frequency)
                )}
              </InfoField>
            </div>
          </div>
          <div className="md:col-span-1 p-4 border rounded-lg bg-muted/30 space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Auditoria
            </h3>
            <div className="space-y-4">
              <InfoField icon={FileClock} label="Última Auditoria">
                {formattedAuditDate}
              </InfoField>
              <InfoField icon={User} label="Auditor(a)">
                {isEditing ? (
                  <Input
                    value={adminData.lastAuditBy ?? ''}
                    onChange={(e) => handleAdminChange('lastAuditBy', e.target.value)}
                  />
                ) : (
                  renderDisplay(adminData.lastAuditBy)
                )}
              </InfoField>
              <InfoField icon={FileText} label="Contrato">
                {isEditing ? (
                  <Input
                    value={adminData.contractId ?? ''}
                    onChange={(e) => handleAdminChange('contractId', e.target.value)}
                  />
                ) : (
                  renderDisplay(adminData.contractId, 'Não vinculado')
                )}
              </InfoField>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
            <BookLock className="w-5 h-5" />
            Observações Internas
          </h3>
          {isEditing ? (
            <Textarea
              rows={4}
              value={adminData.notesInternal ?? ''}
              onChange={(e) => handleAdminChange('notesInternal', e.target.value)}
            />
          ) : (
            <p className="text-sm text-yellow-900 mt-2">{renderDisplay(adminData.notesInternal, 'Sem observações.')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
