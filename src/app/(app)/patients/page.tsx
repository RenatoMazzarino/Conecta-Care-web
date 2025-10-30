
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Patient } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PatientListItem({ patient }: { patient: Patient }) {
  const birthDate = new Date(patient.dateOfBirth);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.avatarHint} />
              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl leading-none">{patient.name}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{age} anos</span>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/patients/${patient.id}`}>Ver Prontuário</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <h3 className="font-medium text-foreground mb-2">Contato Familiar</h3>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{patient.familyContact.name}</span>
          </div>
          <div className="flex items-center mt-2">
            <Phone className="mr-2 h-4 w-4" />
            <span>{patient.familyContact.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function PatientsPage() {
  const firestore = useFirestore();

  const patientsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'patients');
  }, [firestore]);

  const { data: patients, isLoading } = useCollection<Patient>(patientsCollectionRef);
  
  const noData = !isLoading && (!patients || patients.length === 0);

  return (
    <>
      <AppHeader title="Pacientes" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <div className="mb-6">
            <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
            <p className="text-muted-foreground">Gerencie todos os pacientes em um só lugar.</p>
        </div>
        {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        )}
         {noData && (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-96">
                <div className="text-lg font-semibold mb-2">Nenhum paciente encontrado.</div>
                <p className="mb-4 text-sm text-muted-foreground">
                    Parece que não há pacientes cadastrados no sistema. Vá para a página de Estoque para popular os dados.
                </p>
                <Button asChild>
                    <Link href="/inventory">Popular dados de simulação</Link>
                </Button>
            </div>
        )}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {patients?.map(patient => (
                <PatientListItem key={patient.id} patient={patient} />
            ))}
        </div>
      </main>
    </>
  );
}
