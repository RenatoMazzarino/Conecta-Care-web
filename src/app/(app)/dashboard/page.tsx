'use client';

import * as React from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/stats-card';
import { CommunicationsCard } from '@/components/dashboard/communications-card';
import { TasksCard } from '@/components/dashboard/tasks-card';
import type { Patient, ShiftReport, Notification, Task, Shift } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTasks, patients as mockPatients, mockShiftReports, mockNotifications, initialShifts } from '@/lib/data';
import { AlertTriangle, Clock, FileWarning, MessageSquareWarning } from 'lucide-react';
import { RecentReportsCard } from '@/components/dashboard/recent-reports-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

export default function DashboardPage() {
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [reports, setReports] = React.useState<ShiftReport[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [activityEvents, setActivityEvents] = React.useState<(ShiftReport | Notification | Task)[]>([]);

  React.useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      const mainPatient = mockPatients[0] || null;
      setPatient(mainPatient);
      if (mainPatient) {
        const patientReports = mockShiftReports.filter(r => r.patientId === mainPatient.id);
        const patientNotifications = mockNotifications.filter(n => n.patientId === mainPatient.id);
        const patientTasks = mockTasks.filter(t => t.patientId === mainPatient.id);
        
        setReports(patientReports);
        setNotifications(patientNotifications);

        // Combine and sort events for the activity feed
        const allEvents = [...patientReports, ...patientNotifications, ...patientTasks]
            .sort((a, b) => new Date('reportDate' in a ? a.reportDate : 'timestamp' in a ? a.timestamp : a.dueDate || 0).getTime() - new Date('reportDate' in b ? b.reportDate : 'timestamp' in b ? b.timestamp : b.dueDate || 0).getTime());
        setActivityEvents(allEvents);
      }
      setTasks(mockTasks); // Keep all tasks for the tasks card
      setShifts(initialShifts);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }

  const noData = !isLoading && !patient;

  const openShiftsCount = shifts.filter(s => s.status === 'open').length;
  const lateShiftsCount = shifts.filter(s => s.status === 'issue').length;
  const urgentTasksCount = tasks.filter(t => t.priority === 'Urgente' && t.status !== 'done').length;
  const pendingCommunicationsCount = mockNotifications.filter(n => !n.read).length;
  
  const stats = [
    { title: "Vagas Abertas", value: openShiftsCount, icon: FileWarning, trend: "+2", trendDirection: "up" as const, actions: [{label: "Criar Vaga", href: "/shifts"}, {label: "Publicar em Massa", action: () => {}}] },
    { title: "Plantões com Alerta", value: lateShiftsCount, icon: Clock, trend: "0", trendDirection: "none" as const, actions: [{label: "Ver Plantões", href: "/shifts"}, {label: "Resolver Alertas", action: () => {}}] },
    { title: "Tarefas Urgentes", value: urgentTasksCount, icon: AlertTriangle, trend: "-1", trendDirection: "down" as const, actions: [{label: "Ver Tarefas", href: "/tasks"}, {label: "Criar Tarefa", action: () => {}}]},
    { title: "Comunicações Pendentes", value: pendingCommunicationsCount, icon: MessageSquareWarning, trend: "+3", trendDirection: "up" as const, actions: [{label: "Ver Comunicações", href: "/communications"}] },
  ]

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
              [...Array(4)].map((_,i) => <Skeleton key={i} className="h-32 w-full" />)
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
                      <Link href="/patients/new">Adicionar Paciente</Link>
                  </Button>
              </CardContent>
          </Card>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : patient ? (
            <ActivityFeed events={activityEvents} patient={patient}/>
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
                  <TasksCard tasks={tasks} onTaskUpdate={handleTaskUpdate}/>
                  <CommunicationsCard notifications={notifications} />
              </>
            ) : null}
        </div>
      </div>
      
      <div className="mt-6">
           {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : patient ? (
            <RecentReportsCard reports={reports} patients={patient ? [patient] : []} />
          ) : null}
      </div>
    </>
  );
}
