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
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const priorityVariantMap = {
    'Urgente': 'destructive',
    'Alta': 'secondary',
    'Média': 'default',
    'Baixa': 'outline'
} as const;

export function TasksCard({ tasks, onTaskUpdate, onTaskClick }: { tasks: Task[], onTaskUpdate: (task: Task) => void; onTaskClick: (task: Task) => void; }) {
  const { toast } = useToast();
  
  const handleToggle = (e: React.MouseEvent, task: Task, checked: boolean) => {
    e.stopPropagation(); // Impede que o clique no checkbox acione o clique no card principal
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
              {tasks.filter(t => t.status !== 'done').length} tarefas pendentes.
            </CardDescription>
          </div>
           <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
                <li key={task.id}>
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <div
                            onClick={() => onTaskClick(task)}
                            className="flex items-center gap-3 p-2 w-full text-left group rounded-md hover:bg-muted/50 border cursor-pointer"
                          >
                            <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox 
                                    id={`task-check-${task.id}`}
                                    checked={task.status === 'done'}
                                    onCheckedChange={(checked) => handleToggle(new MouseEvent('click') as unknown as React.MouseEvent, task, !!checked)}
                                    aria-label={`Marcar tarefa "${task.title}" como concluída`}
                                />
                            </div>
                            <div className="flex-1">
                                <p className={cn("font-medium text-sm", task.status === 'done' && 'line-through text-muted-foreground')}>{task.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    Para: {task.assignee}
                                </p>
                            </div>
                            <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
                          </div>
                      </TooltipTrigger>
                      {task.description && (
                        <TooltipContent side="top" align="start">
                           <p className="max-w-xs">{task.description}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
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
