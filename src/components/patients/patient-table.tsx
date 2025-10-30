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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, UserSquare } from 'lucide-react';
import type { Patient } from '@/lib/types';

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

export function PatientTable({ patients }: { patients: Patient[] }) {
  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Paciente</TableHead>
            <TableHead>ID do Paciente</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Contato Familiar</TableHead>
            <TableHead className="text-right w-[240px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
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
              <TableCell className="text-muted-foreground font-mono text-xs">{patient.id}</TableCell>
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
                    Ficha Cadastral
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
