'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentReportsCard } from '@/components/dashboard/recent-reports-card';
import { CommunicationsCard } from '@/components/dashboard/communications-card';
import { TasksCard } from '@/components/dashboard/tasks-card';
import type { Patient, ShiftReport, Notification, Task } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTasks } from '@/lib/data';
import { AlertTriangle, Clock, FileWarning, MessageSquareWarning } from 'lucide-react';
import { useCollection, useDoc, useFirestore, useUser } from '@/firebase';
import { collection, doc, query, limit } from 'firebase/firestore';

export default function DashboardPage() {
  const firestore = useFirestore();
  const user = useUser();

  const patientDocRef = React.useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'patients', user.uid);
  }, [firestore, user]);

  const { data: patient, isLoading: patientLoading } = useDoc<Patient>(patientDocRef);

  const patientId = user?.uid ?? null;

  const reportsCollection = React.useMemo(() => {
    if (!firestore || !patientId) return null;
    return query(collection(firestore, `patients/${patientId}/shiftReports`), limit(3));
  }, [firestore, patientId]);

  const notificationsCollection = React.useMemo(() => {
    if (!firestore || !patientId) return null;
    return query(collection(firestore, `patients/${patientId}/notifications`), limit(4));
  }, [firestore, patientId]);

  const { data: reports, isLoading: reportsLoading } = useCollection<ShiftReport>(reportsCollection);
  const { data: notifications, isLoading: notifsLoading } = useCollection<Notification>(notificationsCollection);
  
  // Tasks are still mock data for now
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  
  const isLoading = patientLoading || reportsLoading || notifsLoading;
  const noData = !isLoading && !patient;
  
  const stats = [
    { title: "Vagas Abertas", value: 3, icon: FileWarning, color: "text-blue-600", link: "/shifts" },
    { title: "Plantões Atrasados", value: 1, icon: Clock, color: "text-amber-600", link: "/shifts" },
    { title: "Tarefas Urgentes", value: tasks.filter(t => t.priority === 'Urgente').length, icon: AlertTriangle, color: "text-red-600", link: "#" },
    { title: "Comunicações Pendentes", value: 2, icon: MessageSquareWarning, color: "text-orange-600", link: "/communications" },
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
                {reports && <RecentReportsCard reports={reports} patients={patient ? [patient] : []} />}
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
                    {tasks && <TasksCard tasks={tasks} />}
                    {notifications && <CommunicationsCard notifications={notifications} />}
                </>
             )}
          </div>
        </div>
      </main>
    </>
  );
}
