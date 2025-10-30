import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityVariantMap = {
    'Urgente': 'destructive',
    'Alta': 'secondary',
    'Média': 'default',
    'Baixa': 'outline'
} as const;

export function TasksCard({ tasks }: { tasks: Task[] }) {
  const urgentTasks = tasks
    .filter((task) => task.priority === 'Urgente' || task.priority === 'Alta')
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Tarefas Urgentes</CardTitle>
            <CardDescription>
              {urgentTasks.length} tarefas precisam de atenção.
            </CardDescription>
          </div>
           <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {urgentTasks.length > 0 ? (
          <ul className="space-y-3">
            {urgentTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Responsável: {task.assignee}
                  </p>
                </div>
                <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma tarefa urgente no momento.</p>
        )}
      </CardContent>
    </Card>
  );
}
