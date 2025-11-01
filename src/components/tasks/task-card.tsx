'use client';

import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { professionals } from '@/lib/data';

const priorityVariantMap = {
  Urgente: 'destructive',
  Alta: 'secondary',
  Média: 'default',
  Baixa: 'outline',
} as const;

type TaskCardProps = {
  task: Task;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskCard({ task, isDragging, onDragStart, onEdit, onDelete }: TaskCardProps) {
    const professional = professionals.find(p => p.name === task.assignee);
    const assigneeInitials = professional ? professional.initials : task.assignee?.charAt(0) || '?';
  
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      className={cn(
        'cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow',
        isDragging && 'opacity-50 ring-2 ring-primary'
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-base leading-snug pr-8">{task.title}</CardTitle>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4"/>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Excluir</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent>
            <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
           {task.dueDate && <span className="text-xs text-muted-foreground">{task.dueDate}</span>}
        </div>
        <Avatar className="h-7 w-7">
            <AvatarFallback>{assigneeInitials}</AvatarFallback>
        </Avatar>
      </CardFooter>
    </Card>
  );
}
