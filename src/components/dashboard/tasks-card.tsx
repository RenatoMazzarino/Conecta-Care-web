'use client';

import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const priorityVariantMap = {
    'Urgente': 'destructive',
    'Alta': 'secondary',
    'Média': 'default',
    'Baixa': 'outline'
} as const;

export function TasksCard({ tasks, onTaskUpdate }: { tasks: Task[], onTaskUpdate: (task: Task) => void; }) {
  const { toast } = useToast();
  const urgentTasks = tasks
    .filter((task) => (task.priority === 'Urgente' || task.priority === 'Alta') && task.status !== 'done')
    .slice(0, 4);
    
  const handleToggle = (e: React.MouseEvent, task: Task, checked: boolean) => {
    e.stopPropagation(); // Impede que o clique no checkbox acione o CollapsibleTrigger
    const newStatus = checked ? 'done' : 'inprogress';
    onTaskUpdate({ ...task, status: newStatus });
    
    if(newStatus === 'done') {
        toast({
            title: "Tarefa Concluída!",
            description: `"${task.title}" foi marcada como concluída.`,
            action: (
              <Button variant="secondary" size="sm" onClick={() => onTaskUpdate(task)}>
                Desfazer
              </Button>
            ),
        });
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>
              <Link href="/tasks" className="hover:underline">
                Tarefas da Equipe
              </Link>
            </CardTitle>
            <CardDescription>
              {urgentTasks.length} tarefas precisam de atenção.
            </CardDescription>
          </div>
           <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
                <li key={task.id} className="rounded-md hover:bg-muted/50 border">
                    <Collapsible>
                        <div className="flex items-center gap-3 p-2 w-full text-left group">
                            <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox 
                                    id={`task-check-${task.id}`}
                                    checked={task.status === 'done'}
                                    onCheckedChange={(checked) => handleToggle(new MouseEvent('click') as unknown as React.MouseEvent, task, !!checked)}
                                    aria-label={`Marcar tarefa "${task.title}" como concluída`}
                                />
                            </div>
                            <CollapsibleTrigger className="flex-1 flex items-center justify-between text-left cursor-pointer">
                                <div className="flex-1">
                                    <p className={cn("font-medium text-sm", task.status === 'done' && 'line-through text-muted-foreground')}>{task.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Para: {task.assignee}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
                                </div>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                            <div className="px-4 pb-3 space-y-3 border-t pt-3">
                                <p className="text-sm text-muted-foreground">
                                    {task.description || "Nenhuma descrição fornecida."}
                                </p>
                                <Button variant="secondary" size="sm" asChild>
                                    <Link href="/tasks">Ver Detalhes</Link>
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma tarefa no momento.</p>
        )}
      </CardContent>
    </Card>
  );
}
