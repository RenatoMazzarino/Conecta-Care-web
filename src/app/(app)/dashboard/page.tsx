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
import { mockTasks, patients as mockPatients, professionals, mockShiftReports, mockNotifications, initialShifts } from '@/lib/data';
import { AlertTriangle, Clock, FileWarning, MessageSquareWarning, RefreshCw } from 'lucide-react';
import { RecentReportsCard } from '@/components/dashboard/recent-reports-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskDialog } from '@/components/tasks/task-dialog';

export default function DashboardPage() {
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [activityEvents, setActivityEvents] = React.useState<(ShiftReport | Notification | Task)[]>([]);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  // State for Task Dialog
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const fetchData = React.useCallback(() => {
    setIsRefreshing(true);
    // Simulate fetching data
    const timer = setTimeout(() => {
      const patientReports = mockShiftReports;
      const allNotifications = mockNotifications;
      const allTasks = mockTasks;
      
      setNotifications(allNotifications);

      // Combine and sort events for the activity feed
      const allEvents = [...patientReports, ...allNotifications, ...allTasks]
          .sort((a, b) => new Date('reportDate' in a ? a.reportDate : 'timestamp' in a ? a.timestamp : a.dueDate || 0).getTime() - new Date('reportDate' in b ? b.reportDate : 'timestamp' in b ? b.timestamp : b.dueDate || 0).getTime());
      setActivityEvents(allEvents.reverse());

      setTasks(allTasks); // Keep all tasks for the tasks card
      setShifts(initialShifts);
      setLastUpdated(new Date());
      setIsLoading(false);
      setIsRefreshing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);


  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const handleCreateOrUpdateTask = (taskData: Task) => {
    if (editingTask) {
        // Update existing task
        setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
    } else {
        // Create new task
        setTasks(prev => [...prev, { ...taskData, id: `task-${Date.now()}` }]);
    }
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  }

  const noData = !isLoading && mockPatients.length === 0;

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
       <div className="flex justify-end items-center gap-4 mb-6 text-sm text-muted-foreground">
        {lastUpdated && !isRefreshing && (
            <span>
              Atualizado {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ptBR })}
            </span>
        )}
        <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isRefreshing}
        >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

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
          <Card className="mt-6">
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

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex">
          {isLoading ? (
            <Skeleton className="h-full w-full min-h-[500px]" />
          ) : !noData ? (
            <ActivityFeed events={activityEvents} />
          ) : null}
        </div>
        <div className="space-y-6">
            {isLoading ? (
              <>
                  <Skeleton className="h-[250px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
              </>
            ) : !noData ? (
              <>
                  <TasksCard tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskClick={handleTaskClick} />
                  <CommunicationsCard notifications={notifications} />
              </>
            ) : null}
        </div>
      </div>
      
      <div className="mt-6">
           {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : !noData ? (
            <RecentReportsCard reports={mockShiftReports} patients={mockPatients} />
          ) : null}
      </div>

       <TaskDialog
        isOpen={isTaskDialogOpen}
        onOpenChange={handleCloseTaskDialog}
        task={editingTask}
        onSave={handleCreateOrUpdateTask}
        professionals={professionals}
        patients={mockPatients}
      />
    </>
  );
}
