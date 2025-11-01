
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
import Link from 'next/link';
import { FileText, UserSquare, Edit } from 'lucide-react';
import type { Patient, Professional } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

function calculateAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const complexityVariant: { [key in Patient['complexity']]: string } = {
    baixa: 'bg-green-100 text-green-800 border-green-200',
    media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    alta: 'bg-red-100 text-red-800 border-red-200',
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
                checked={selectedPatients.size > 0 && selectedPatients.size === patients.length}
                indeterminate={selectedPatients.size > 0 && selectedPatients.size < patients.length}
                onCheckedChange={handleToggleSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead className="w-[250px]">Paciente</TableHead>
            <TableHead>Complexidade</TableHead>
            <TableHead>Pacote de Serviços</TableHead>
            <TableHead>Vínculo</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Escalista</TableHead>
            <TableHead className="text-right w-[240px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const supervisorName = patient.supervisorId ? professionalMap.get(patient.supervisorId) : '-';
            const schedulerName = patient.schedulerId ? professionalMap.get(patient.schedulerId) : '-';
            
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
                    <Link
                    href={`/patients/${patient.id}`}
                    className="flex items-center gap-3 group"
                    >
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.avatarHint} />
                            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className={cn(
                            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card",
                            patient.status === 'Ativo' ? 'bg-green-500' : 'bg-gray-400'
                        )} />
                    </div>
                    <span className="font-medium group-hover:underline">{patient.name}</span>
                    </Link>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={complexityVariant[patient.complexity]}>
                        {patient.complexity.charAt(0).toUpperCase() + patient.complexity.slice(1)}
                    </Badge>
                </TableCell>
                 <TableCell>
                    <Badge variant="outline">
                        {patient.servicePackage}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">
                        {patient.financial.plan === 'plano_de_saude' 
                        ? `Plano: ${patient.financial.healthPlan || 'Não especificado'}` 
                        : 'Particular'}
                    </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.supervisorId && supervisorName ? (
                    <Link href={`/team/${patient.supervisorId}`} className="hover:underline hover:text-primary transition-colors">
                      {supervisorName}
                    </Link>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.schedulerId && schedulerName ? (
                    <Link href={`/team/${patient.schedulerId}`} className="hover:underline hover:text-primary transition-colors">
                      {schedulerName}
                    </Link>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                    <Link href={`/patients/${patient.id}/profile`}>
                        <UserSquare className="mr-2 h-4 w-4" />
                        Ficha
                    </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                    <Link href={`/patients/${patient.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Prontuário
                    </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                    <Link href={`/patients/${patient.id}/profile`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Link>
                    </Button>
                </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
