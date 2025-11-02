
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
import { FileText, MoreHorizontal, AlertTriangle, MessageSquare, CalendarPlus, FileUp } from 'lucide-react';
import type { Patient, Professional } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const complexityVariant: { [key in Patient['adminData']['complexity']]: string } = {
    Baixa: 'bg-green-100 text-green-800 border-green-200',
    Média: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Alta: 'bg-red-100 text-red-800 border-red-200',
}

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
    onSelectionChange,
    onViewDetails
}: { 
    patients: Patient[];
    professionals: Professional[];
    selectedPatients: Set<string>;
    onSelectionChange: (selection: Set<string>) => void;
    onViewDetails: (patientId: string) => void;
}) {

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

  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  selectedPatients.size > 0 &&
                  selectedPatients.size === patients.length
                }
                onCheckedChange={handleToggleSelectAll}
                aria-label="Selecionar todos"
                 ref={(el) =>
                  el &&
                  (el.indeterminate =
                    selectedPatients.size > 0 &&
                    selectedPatients.size < patients.length)
                }
              />
            </TableHead>
            <TableHead className="w-[250px]">Paciente</TableHead>
            <TableHead>Complexidade</TableHead>
            <TableHead>Próximo/Último Plantão</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Escalista</TableHead>
            <TableHead className="text-right w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const supervisorName = patient.adminData.supervisorId ? professionalMap.get(patient.adminData.supervisorId) : '-';
            const schedulerName = patient.adminData.schedulerId ? professionalMap.get(patient.adminData.schedulerId) : '-';
            const visitDate = patient.next_visit_date ? formatVisitDate(patient.next_visit_date) : formatVisitDate(patient.last_visit_date);
            const hasPendingItems = patient.consent_status === 'pending' || patient.pending_documents > 0;
            
            return (
                <TableRow key={patient.id} data-state={selectedPatients.has(patient.id) && 'selected'}>
                <TableCell>
                    <Checkbox
                        checked={selectedPatients.has(patient.id)}
                        onCheckedChange={() => handleToggleSelect(patient.id)}
                        aria-label={`Selecionar ${patient.name}`}
                    />
                </TableCell>
                <TableCell>
                    <div
                        onClick={() => onViewDetails(patient.id)}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="relative">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.avatarHint} />
                                <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className={cn(
                                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card",
                                patient.adminData.status === 'Ativo' ? 'bg-green-500' : 'bg-gray-400'
                            )} />
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="font-medium group-hover:underline">{patient.name}</span>
                             {hasPendingItems && (
                                 <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Pendências no cadastro!</p>
                                        </TooltipContent>
                                    </Tooltip>
                                 </TooltipProvider>
                             )}
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={complexityVariant[patient.adminData.complexity]}>
                        {patient.adminData.complexity}
                    </Badge>
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
                <TableCell className="text-muted-foreground">
                  {patient.adminData.schedulerId && schedulerName ? (
                    <Link href={`/team/${patient.adminData.schedulerId}`} onClick={e => e.stopPropagation()} className="hover:underline hover:text-primary transition-colors">
                      {schedulerName}
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
                            <DropdownMenuItem onClick={() => onViewDetails(patient.id)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Ver Detalhes
                            </DropdownMenuItem>
                             <DropdownMenuItem>
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Agendar Plantão
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat com a Família
                            </DropdownMenuItem>
                             <DropdownMenuItem>
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
