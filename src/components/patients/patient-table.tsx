
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
import { FileText, UserSquare } from 'lucide-react';
import type { Patient } from '@/lib/types';
import { Badge } from '../ui/badge';

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

const planVariant: { [key in Patient['financial']['plan']]: string } = {
    particular: 'bg-blue-100 text-blue-800 border-blue-200',
    plano_de_saude: 'bg-indigo-100 text-indigo-800 border-indigo-200',
}

export function PatientTable({ 
    patients, 
    selectedPatients, 
    onSelectionChange 
}: { 
    patients: Patient[];
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
            <TableHead>Plano</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Contato Familiar</TableHead>
            <TableHead className="text-right w-[240px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
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
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.avatarHint} />
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium group-hover:underline">{patient.name}</span>
                </Link>
              </TableCell>
              <TableCell>
                  <Badge variant="outline" className={complexityVariant[patient.complexity]}>
                      {patient.complexity.charAt(0).toUpperCase() + patient.complexity.slice(1)}
                  </Badge>
              </TableCell>
               <TableCell>
                  <Badge variant="outline" className={planVariant[patient.financial.plan]}>
                      {patient.financial.plan === 'plano_de_saude' ? 'Plano de Saúde' : 'Particular'}
                  </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{calculateAge(patient.dateOfBirth)} anos</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{patient.familyContact.name}</span>
                  <span className="text-xs text-muted-foreground">{patient.familyContact.phone}</span>
                </div>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
