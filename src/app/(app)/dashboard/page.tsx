
'use client';

import * as React from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentReportsCard } from '@/components/dashboard/recent-reports-card';
import { CommunicationsCard } from '@/components/dashboard/communications-card';
import { TasksCard } from '@/components/dashboard/tasks-card';
import type { Patient, ShiftReport, Notification, Task, Shift } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTasks, patients as mockPatients, mockShiftReports, mockNotifications, initialShifts } from '@/lib/data';
import { AlertTriangle, Clock, FileWarning, MessageSquareWarning } from 'lucide-react';

export default function DashboardPage() {
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [reports, setReports] = React.useState<ShiftReport[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [shifts, setShifts] = React.useState<Shift[]>([]);

  React.useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      const mainPatient = mockPatients[0] || null;
      setPatient(mainPatient);
      if (mainPatient) {
        setReports(mockShiftReports.filter(r => r.patientId === mainPatient.id));
        setNotifications(mockNotifications.filter(n => n.patientId === mainPatient.id));
      }
      setTasks(mockTasks);
      setShifts(initialShifts);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const noData = !isLoading && !patient;

  // Dynamic stats calculated from mock data
  const openShiftsCount = shifts.filter(s => s.status === 'open').length;
  const lateShiftsCount = shifts.filter(s => s.status === 'issue').length;
  const urgentTasksCount = tasks.filter(t => t.priority === 'Urgente' && t.status !== 'done').length;
  const pendingCommunicationsCount = mockNotifications.length;

  
  const stats = [
    { title: "Vagas Abertas", value: openShiftsCount, icon: FileWarning, color: "text-blue-600", link: "/shifts" },
    { title: "Plantões com Alerta", value: lateShiftsCount, icon: Clock, color: "text-amber-600", link: "/shifts" },
    { title: "Tarefas Urgentes", value: urgentTasksCount, icon: AlertTriangle, color: "text-red-600", link: "/tasks" },
    { title: "Comunicações Pendentes", value: pendingCommunicationsCount, icon: MessageSquareWarning, color: "text-orange-600", link: "/communications" },
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
                  <CardDescription>Parece que você ainda não tem pacientes cadastrados.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                      Para começar a gerenciar, adicione seu primeiro paciente.
                  </p>
                  <Button asChild>
                      <Link href="/patients">Adicionar Paciente</Link>
                  </Button>
              </CardContent>
          </Card>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : patient ? (
            <RecentReportsCard reports={reports} patients={patient ? [patient] : []} />
          ) : null}
        </div>
        <div className="space-y-6">
            {isLoading ? (
              <>
                  <Skeleton className="h-[250px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
              </>
            ) : patient ? (
              <>
                  <TasksCard tasks={tasks} />
                  <CommunicationsCard notifications={notifications} />
              </>
            ) : null}
        </div>
      </div>
    </>
  );
}
