'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { PatientInfoCard } from '@/components/dashboard/patient-info-card';
import { LowStockCard } from '@/components/dashboard/low-stock-card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentReportsCard } from '@/components/dashboard/recent-reports-card';
import { NotificationsCard } from '@/components/dashboard/notifications-card';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Patient, InventoryItem, ShiftReport, Notification } from '@/lib/types';
import { doc, collection, orderBy, limit, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients as mockPatients } from '@/lib/data';
import { AlertTriangle, Clock, Package, FlaskConical } from 'lucide-react';

export default function DashboardPage() {
  const firestore = useFirestore();
  
  // For the dashboard, we'll focus on the first patient from our mock data.
  const mainPatientId = mockPatients[0]?.id;

  const patientRef = useMemoFirebase(() => {
    if (!firestore || !mainPatientId) return null;
    return doc(firestore, 'patients', mainPatientId);
  }, [firestore, mainPatientId]);

  const inventoryCollectionRef = useMemoFirebase(() => {
    if (!firestore || !mainPatientId) return null;
    return collection(firestore, 'patients', mainPatientId, 'inventories');
  }, [firestore, mainPatientId]);

  const reportsQuery = useMemoFirebase(() => {
    if (!firestore || !mainPatientId) return null;
    return query(collection(firestore, 'patients', mainPatientId, 'shiftReports'), orderBy('reportDate', 'desc'), limit(3));
  }, [firestore, mainPatientId]);

  const notificationsQuery = useMemoFirebase(() => {
    if (!firestore || !mainPatientId) return null;
    return query(collection(firestore, 'patients', mainPatientId, 'notifications'), orderBy('timestamp', 'desc'), limit(4));
  }, [firestore, mainPatientId]);


  const { data: patient, isLoading: isPatientLoading } = useDoc<Patient>(patientRef);
  const { data: inventory, isLoading: isInventoryLoading } = useCollection<InventoryItem>(inventoryCollectionRef);
  const { data: reports, isLoading: isReportsLoading } = useCollection<ShiftReport>(reportsQuery);
  const { data: notifications, isLoading: isNotificationsLoading } = useCollection<Notification>(notificationsQuery);

  const isLoading = isPatientLoading || isInventoryLoading || isReportsLoading || isNotificationsLoading;
  const noData = !isLoading && !patient;
  
  const lowStockCount = inventory?.filter(item => item.stock > 0 && item.stock <= item.lowStockThreshold).length ?? 0;
  const criticalStockCount = inventory?.filter(item => item.stock === 0).length ?? 0;


  const stats = [
    { title: "Vagas Abertas", value: 3, icon: Clock, color: "text-blue-600", link: "/shifts" },
    { title: "Plantões Atrasados", value: 1, icon: AlertTriangle, color: "text-amber-600", link: "/shifts" },
    { title: "Estoque Baixo", value: lowStockCount, icon: Package, color: "text-orange-600", link: "/inventory" },
    { title: "Estoque Crítico", value: criticalStockCount, icon: FlaskConical, color: "text-red-600", link: "/inventory" },
  ]

  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        
         {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
         ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>
         )}


        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <>
                <Skeleton className="h-[180px] w-full" />
                <Skeleton className="h-[300px] w-full" />
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
                {patient && <PatientInfoCard patient={patient} />}
                {reports && <RecentReportsCard reports={reports} />}
              </>
            )}
          </div>
          <div className="space-y-6">
             {isLoading ? (
                <>
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                </>
             ) : (
                <>
                    {inventory && <LowStockCard items={inventory} />}
                    {notifications && <NotificationsCard notifications={notifications} />}
                </>
             )}
          </div>
        </div>
      </main>
    </>
  );
}
