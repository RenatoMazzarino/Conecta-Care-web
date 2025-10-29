'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { PatientCard } from '@/components/dashboard/patient-card';
import { LowStockCard } from '@/components/dashboard/low-stock-card';
import { QuickActionsCard } from '@/components/dashboard/quick-actions-card';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Patient, InventoryItem } from '@/lib/types';
import { doc, collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const firestore = useFirestore();

  const patientRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'patients', 'patient-123');
  }, [firestore]);

  const inventoryCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'patients', 'patient-123', 'inventories');
  }, [firestore]);

  const { data: patient, isLoading: isPatientLoading } = useDoc<Patient>(patientRef);
  const { data: inventory, isLoading: isInventoryLoading } = useCollection<InventoryItem>(inventoryCollectionRef);

  const isLoading = isPatientLoading || isInventoryLoading;
  const noData = !isLoading && !patient;

  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <>
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-[250px] w-full" />
              </>
            ) : (
              <>
                {noData && (
                   <Card>
                    <CardHeader>
                        <CardTitle>Bem-vindo ao CareSync</CardTitle>
                        <CardDescription>Nenhum dado de paciente encontrado no Firestore.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Para começar, por favor, popule o banco de dados com dados de simulação.
                        </p>
                        <Button asChild>
                            <Link href="/inventory">Ir para a página de Estoque</Link>
                        </Button>
                    </CardContent>
                   </Card>
                )}
                {patient && <PatientCard patient={patient} />}
                {inventory && <LowStockCard items={inventory} />}
              </>
            )}
          </div>
          <div>
            <QuickActionsCard />
          </div>
        </div>
        <div className="mt-6 grid gap-6">
           <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Você tem 5 agendamentos para hoje.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Upcoming appointments list will go here */}
              <p className="text-sm text-muted-foreground">Em breve.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
