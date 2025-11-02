
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
import { AlertTriangle, Clock, FileWarning, MessageSquareWarning, RefreshCw, Loader2 } from 'lucide-react';
import { RecentEvolutionsCard } from '@/components/dashboard/recent-evolutions-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { cn } from '@/lib/utils';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { trackEvent } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

const LoadingOverlay = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function DashboardPage() {
  const { data, isLoading, isRefreshing, refetch } = useDashboardData();
  const { toast } = useToast();

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  
  React.useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
    }
  }, [data?.tasks]);


  const handleTaskUpdate = (updatedTask: Task) => {
    const oldTask = tasks.find(t => t.id === updatedTask.id);
    if(oldTask?.status !== 'done' && updatedTask.status === 'done') {
        trackEvent({
            eventName: 'task_marked_done',
            properties: {
                task_id: updatedTask.id,
                userId: 'user-123', // Placeholder
                old_status: oldTask?.status || 'unknown',
                new_status: updatedTask.status
            }
        });
        toast({
            title: "Tarefa Concluída!",
            description: `"${updatedTask.title}" foi marcada como concluída.`,
            action: (
              <Button variant="secondary" size="sm" onClick={() => handleTaskUpdate(oldTask!)}>
                Desfazer
              </Button>
            ),
        });
    }
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const handleCreateOrUpdateTask = (taskData: Task) => {
    if (editingTask) {
        setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
    } else {
        const newTask = { ...taskData, id: `task-${Date.now()}` };
        setTasks(prev => [...prev, newTask]);
    }
    trackEvent({
        eventName: 'quick_action',
        properties: {
            action: editingTask ? 'update_task' : 'create_task',
            target_type: 'task',
            target_id: taskData.id
        }
    })
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  }
  
  const handleKpiClick = (kpiName: string) => {
    trackEvent({
        eventName: 'kpi_card_clicked',
        properties: {
            kpi_name: kpiName,
            userId: 'user-123', // placeholder
            timestamp: new Date().toISOString()
        }
    });
  }

  if (isLoading) {
    return (
      <>
         <div className="flex justify-end items-center gap-4 mb-6 text-sm text-muted-foreground">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
             <div className="lg:col-span-1 space-y-6 flex flex-col">
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[200px] w-full" />
             </div>
             <div className="lg:col-span-1 h-full">
                <Skeleton className="h-full w-full min-h-[500px]" />
             </div>
        </div>
      </>
    );
  }
  
  const noData = !data || !data.patients || data.patients.length === 0;

  const stats = [
    { title: "Vagas Abertas", value: data?.summary.kpis.vagasAbertas, icon: FileWarning, href: "/shifts", onClick: () => handleKpiClick("Vagas Abertas")},
    { title: "Plantões com Alerta", value: data?.summary.kpis.plantoesComAlerta, icon: Clock, href: "/shifts", onClick: () => handleKpiClick("Plantões com Alerta") },
    { title: "Tarefas Urgentes", value: data?.summary.kpis.tarefasUrgentes, icon: AlertTriangle, href: "/tasks", onClick: () => handleKpiClick("Tarefas Urgentes")},
    { title: "Comunicações Pendentes", value: data?.summary.kpis.comunicacoesPendentes, icon: MessageSquareWarning, href: "/communications", onClick: () => handleKpiClick("Comunicações Pendentes") },
  ]

  return (
    <>
       <div className="flex justify-end items-center gap-4 mb-6 text-sm text-muted-foreground">
        {data?.summary.lastUpdated && !isRefreshing && (
            <span>
              Atualizado {formatDistanceToNow(new Date(data.summary.lastUpdated), { addSuffix: true, locale: ptBR })}
            </span>
        )}
        <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isRefreshing}
        >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {noData ? null : (
              stats.map(stat => (
                  <Link href={stat.href} key={stat.title} onClick={stat.onClick}>
                      <StatsCard 
                          title={stat.title} 
                          value={stat.value ?? 0}
                          icon={stat.icon} 
                          trend="+2" /* Mock data */
                          trendDirection="up" /* Mock data */
                      />
                  </Link>
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

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6 flex flex-col">
           {!noData && (
              <>
                  <div className="relative flex-1">
                    {isRefreshing && <LoadingOverlay />}
                    <TasksCard tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskClick={handleTaskClick} />
                  </div>
                  <div className="relative flex-1">
                     {isRefreshing && <LoadingOverlay />}
                    <CommunicationsCard notifications={data.notifications} />
                  </div>
                  <div className="relative flex-1">
                     {isRefreshing && <LoadingOverlay />}
                    <RecentEvolutionsCard reports={data.evolutions} patients={data.patients} />
                  </div>
              </>
            )}
        </div>
        <div className="lg:col-span-1 relative h-full">
          {!noData && (
            <>
              {isRefreshing && <LoadingOverlay />}
              <ActivityFeed events={data.activityEvents} />
            </>
          )}
        </div>
      </div>
      
       <TaskDialog
        isOpen={isTaskDialogOpen}
        onOpenChange={handleCloseTaskDialog}
        task={editingTask}
        onSave={handleCreateOrUpdateTask}
        professionals={data?.professionals || []}
        patients={data?.patients || []}
      />
    </>
  );
}
