'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import type { Patient } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientTable } from '@/components/patients/patient-table';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function PatientsPage() {
  const firestore = useFirestore();
  const patientsCollection = React.useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'patients');
  }, [firestore]);
  
  const { data: allPatients, isLoading } = useCollection<Patient>(patientsCollection);

  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (allPatients) {
      const results = allPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(results);
    } else {
        setFilteredPatients([]);
    }
  }, [searchTerm, allPatients]);

  const noData = !isLoading && (!filteredPatients || filteredPatients.length === 0);

  return (
    <>
      <AppHeader title="Pacientes" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
            <p className="text-muted-foreground">Gerencie todos os pacientes em um só lugar.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar paciente por nome..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="rounded-lg border shadow-sm">
             <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : noData ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-96">
            <div className="text-lg font-semibold mb-2">Nenhum paciente encontrado.</div>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchTerm 
                ? `Nenhum paciente corresponde à sua busca por "${searchTerm}".` 
                : "Parece que não há pacientes cadastrados. Popule os dados na página de 'Estoque'."
              }
            </p>
             <Button asChild>
                <Link href="/inventory">Popular dados de simulação</Link>
            </Button>
          </div>
        ) : (
          <PatientTable patients={filteredPatients} />
        )}
      </main>
    </>
  );
}
