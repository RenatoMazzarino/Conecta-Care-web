
'use client';

import * as React from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentReportsCard } from '@/components/dashboard/recent-reports-card';
import { CommunicationsCard } from '@/components/dashboard/communications-card';
import { TasksCard } from '@/components/dashboard/tasks-card';
import type { Patient, ShiftReport, Notification, Task } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTasks, patients as mockPatients, mockShiftReports, mockNotifications } from '@/lib/data';
import { AlertTriangle, Clock, FileWarning, MessageSquareWarning } from 'lucide-react';

export default function DashboardPage() {
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [reports, setReports] = React.useState<ShiftReport[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setPatient(mockPatients[0] || null);
      setReports(mockShiftReports.filter(r => r.patientId === mockPatients[0]?.id));
      setNotifications(mockNotifications.filter(n => n.patientId === mockPatients[0]?.id));
      setTasks(mockTasks);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const noData = !isLoading && !patient;
  
  const stats = [
    { title: "Vagas Abertas", value: 3, icon: FileWarning, color: "text-blue-600", link: "/shifts" },
    { title: "Plantões Atrasados", value: 1, icon: Clock, color: "text-amber-600", link: "/shifts" },
    { title: "Tarefas Urgentes", value: tasks.filter(t => t.priority === 'Urgente').length, icon: AlertTriangle, color: "text-red-600", link: "#" },
    { title: "Comunicações Pendentes", value: 2, icon: MessageSquareWarning, color: "text-orange-600", link: "/communications" },
  ]

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
              [...Array(4)].map((_,i) => <Skeleton key={i} className="h-28 w-full" />)
          ) : noData ? null : (
              stats.map(stat => (
                  <StatsCard key={stat.title} {...stat} />
              ))
          )}
      </div>

      {noData && (
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
    </>
  );
}
