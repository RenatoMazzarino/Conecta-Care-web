

'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FileText, MoreHorizontal, AlertTriangle, MessageSquare, CalendarPlus, FileUp, CheckCircle, CircleOff } from 'lucide-react';
import type { Patient, Professional } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const complexityVariant: { [key in Patient['adminData']['complexity']]: string } = {
    Baixa: 'bg-green-100 text-green-800 border-green-200',
    Média: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Alta: 'bg-red-100 text-red-800 border-red-200',
    Crítica: 'bg-red-200 text-red-900 border-red-300',
}

const patientStatusConfig: { [key: string]: { text: string; icon: React.ElementType; className: string; } } = {
  active: { text: 'Ativo', icon: CheckCircle, className: 'text-green-500' },
  pending: { text: 'Com Pendência', icon: AlertTriangle, className: 'text-amber-500' },
  inactive: { text: 'Inativo', icon: CircleOff, className: 'text-gray-400' },
};


function formatVisitDate(dateString?: string) {
    if (!dateString) return { text: '-', inPast: false };
    const date = new Date(dateString);
    const now = new Date();
    const isPast = date < now;
    const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    return {
        text: formattedDate,
        inPast: isPast
    }
}

export function PatientTable({ 
    patients,
    professionals,
    selectedPatients, 
    onSelectionChange
}: { 
    patients: Patient[];
    professionals: Professional[];
    selectedPatients: Set<string>;
    onSelectionChange: (selection: Set<string>) => void;
}) {
  const { toast } = useToast();
  const allSelected = patients.length > 0 && selectedPatients.size === patients.length;
  const isIndeterminate = selectedPatients.size > 0 && selectedPatients.size < patients.length;

  const handleToggleSelect = (patientId: string) => {
    const newSelection = new Set(selectedPatients);
    if (newSelection.has(patientId)) {
      newSelection.delete(patientId);
    } else {
      newSelection.add(patientId);
    }
    onSelectionChange(newSelection);
  };

  const handleToggleSelectAll = () => {
    if (selectedPatients.size === patients.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(patients.map((p) => p.id)));
    }
  };
  
  const professionalMap = React.useMemo(() => 
    new Map(professionals.map(p => [p.id, p.name])),
    [professionals]
  );
  
  const handleFeaturePlaceholder = (featureName: string) => {
    toast({
        title: "Funcionalidade em Breve",
        description: `A funcionalidade de "${featureName}" será implementada em breve.`,
    })
  }

  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isIndeterminate ? 'indeterminate' : allSelected}
                onCheckedChange={() => handleToggleSelectAll()}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead className="w-[40px]">Status</TableHead>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Complexidade</TableHead>
            <TableHead>Vínculo</TableHead>
            <TableHead>Pacote</TableHead>
            <TableHead>Próximo/Último Plantão</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead className="text-right w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const supervisorName = patient.adminData.supervisorId ? professionalMap.get(patient.adminData.supervisorId) : '-';
            const visitDate = patient.next_visit_date ? formatVisitDate(patient.next_visit_date) : formatVisitDate(patient.last_visit_date);
            
            const hasPendingConsent = patient.consent_status === 'pending';
            const hasPendingDocuments = patient.pending_documents > 0;
            const hasPendingItems = hasPendingConsent || hasPendingDocuments;
            
            let patientStatusKey: 'active' | 'pending' | 'inactive';
            if (patient.adminData.status === 'Inativo') {
                patientStatusKey = 'inactive';
            } else if (hasPendingItems) {
                patientStatusKey = 'pending';
            } else {
                patientStatusKey = 'active';
            }
            const patientStatus = patientStatusConfig[patientStatusKey];
            const StatusIcon = patientStatus.icon;

            const tooltipContent = () => {
              if (patientStatusKey !== 'pending') {
                return patientStatus.text;
              }
              const reasons = [];
              if (hasPendingConsent) reasons.push("Termo de consentimento");
              if (hasPendingDocuments) reasons.push(`${patient.pending_documents} documento(s)`);
              return `${patientStatus.text} - ${reasons.join(' e ')} pendente(s).`;
            };

            const bondType = patient.financialProfile?.bondType ?? '—';
            const vinculoDisplay = bondType === 'Plano de Saúde' && patient.financialProfile?.insurerName
                ? `${bondType} - ${patient.financialProfile.insurerName}`
                : bondType;
            const fullName = `${patient.firstName} ${patient.lastName}`;
            return (
                <TableRow key={patient.id} data-state={selectedPatients.has(patient.id) && 'selected'}>
                <TableCell>
                    <Checkbox
                        checked={selectedPatients.has(patient.id)}
                        onCheckedChange={() => handleToggleSelect(patient.id)}
                        aria-label={`Selecionar ${fullName}`}
                    />
                </TableCell>
                <TableCell>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <StatusIcon className={cn("h-5 w-5", patientStatus.className)} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltipContent()}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableCell>
                <TableCell>
                    <Link href={`/patients/${patient.id}`}>
                      <div
                          className="flex items-center gap-3 group cursor-pointer"
                      >
                          <Avatar className="h-9 w-9">
                              <AvatarImage src={patient.avatarUrl} alt={fullName} data-ai-hint={patient.avatarHint} />
                              <AvatarFallback>{patient.firstName.charAt(0)}{patient.lastName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium group-hover:underline">{patient.displayName}</span>
                      </div>
                    </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(complexityVariant[patient.adminData.complexity])}>
                    {patient.adminData.complexity}
                  </Badge>
                </TableCell>
                <TableCell>
                    <div className="text-sm text-muted-foreground">{vinculoDisplay}</div>
                </TableCell>
                 <TableCell>
                    <Badge variant="outline">{patient.adminData.servicePackage}</Badge>
                </TableCell>
                <TableCell>
                     <div className={cn("text-sm", visitDate.inPast ? "text-muted-foreground" : "text-foreground")}>
                        {visitDate.text}
                    </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.adminData.supervisorId && supervisorName ? (
                    <Link href={`/team/${patient.adminData.supervisorId}`} onClick={e => e.stopPropagation()} className="hover:underline hover:text-primary transition-colors">
                      {supervisorName}
                    </Link>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/patients/${patient.id}`}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Ver Detalhes
                                </Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                <Link href="/shifts">
                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                    Agendar Plantão
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFeaturePlaceholder('Chat com Família')}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat com a Família
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleFeaturePlaceholder('Anexar Documento')}>
                                <FileUp className="mr-2 h-4 w-4" />
                                Anexar Documento
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
