'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { PatientInfoCard } from '@/components/dashboard/patient-info-card';
import { LowStockCard } from '@/components/dashboard/low-stock-card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentReportsCard } from '@/components/dashboard/recent-reports-card';
import { NotificationsCard } from '@/components/dashboard/notifications-card';
import type { Patient, InventoryItem, ShiftReport, Notification } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients as mockPatients, inventory as mockInventory, mockShiftReports, mockNotifications } from '@/lib/data';
import { AlertTriangle, Clock, Package, FlaskConical } from 'lucide-react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [reports, setReports] = React.useState<ShiftReport[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      const mainPatientData = mockPatients[0];
      if (mainPatientData) {
        const lowStockCount = mockInventory.filter(item => item.stock > 0 && item.stock <= item.lowStockThreshold).length;
        const criticalStockCount = mockInventory.filter(item => item.stock === 0).length;
        setPatient({
            ...mainPatientData,
            lowStockCount,
            criticalStockCount,
        });
      }
      setInventory(mockInventory);
      setReports(mockShiftReports);
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);
  
  const noData = !isLoading && !patient;
  
  const stats = [
    { title: "Vagas Abertas", value: 3, icon: Clock, color: "text-blue-600", link: "/shifts" },
    { title: "Plantões Atrasados", value: 1, icon: AlertTriangle, color: "text-amber-600", link: "/shifts" },
    { title: "Estoque Baixo", value: patient?.lowStockCount ?? 0, icon: Package, color: "text-orange-600", link: "/inventory" },
    { title: "Estoque Crítico", value: patient?.criticalStockCount ?? 0, icon: FlaskConical, color: "text-red-600", link: "/inventory" },
  ]

  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        
         {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
         ) : noData ? (
             <Card>
                <CardHeader>
                    <CardTitle>Bem-vindo ao CareSync</CardTitle>
                    <CardDescription>Nenhum dado de paciente encontrado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Para começar, por favor, popule o sistema com dados de simulação na página de Estoque.
                    </p>
                    <Button asChild>
                        <Link href="/inventory">Ir para a página de Estoque</Link>
                    </Button>
                </CardContent>
               </Card>
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
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <>
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
