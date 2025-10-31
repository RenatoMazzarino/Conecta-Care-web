'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import type { Professional } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamTable } from '@/components/team/team-table';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function TeamPage() {
  const firestore = useFirestore();
  const adminFeaturesEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN_FEATURES === '1';
  const profCollection = React.useMemo(() => {
    if (!firestore || !adminFeaturesEnabled) return null;
    return collection(firestore, 'professionals');
  }, [firestore, adminFeaturesEnabled]);

  const { data: allProfessionals, isLoading } = useCollection<Professional>(profCollection);

  const [filteredProfessionals, setFilteredProfessionals] = React.useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (allProfessionals) {
      const results = allProfessionals.filter(prof =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProfessionals(results);
    } else {
        setFilteredProfessionals([]);
    }
  }, [searchTerm, allProfessionals]);

  const noData = !isLoading && (!allProfessionals || allProfessionals.length === 0);

  if (!adminFeaturesEnabled) {
    return (
      <>
        <AppHeader title="Equipe" />
        <main className="flex-1 p-4 sm:p-6 bg-background">
          <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
            Este módulo é restrito a administradores. Para habilitar, defina{' '}
            <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs font-semibold">
              NEXT_PUBLIC_ENABLE_ADMIN_FEATURES=1
            </code>{' '}
            no ambiente ou utilize uma conta com privilégios administrativos.
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Equipe" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Membros da Equipe</h1>
            <p className="text-muted-foreground">Gerencie todos os profissionais da sua equipe.</p>
          </div>
           <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                placeholder="Buscar por nome ou especialidade..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Profissional
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="rounded-lg border shadow-sm">
             <div className="p-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : noData ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-96">
            <div className="text-lg font-semibold mb-2">Nenhum profissional encontrado.</div>
            <p className="text-sm text-muted-foreground">
              {searchTerm 
                ? `Nenhum profissional corresponde à sua busca por "${searchTerm}".` 
                : "Parece que não há profissionais cadastrados. Popule os dados na página de 'Estoque'."
              }
            </p>
          </div>
        ) : (
          <TeamTable professionals={filteredProfessionals} />
        )}
      </main>
    </>
  );
}
