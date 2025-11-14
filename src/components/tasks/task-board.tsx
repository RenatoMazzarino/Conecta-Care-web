'use client';

import * as React from 'react';
import type { Task } from '@/lib/types';
import { TaskCard } from './task-card';
import { Plus } from 'lucide-react';

type TaskBoardProps = {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

const columns = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'inprogress', title: 'Em Andamento' },
  { id: 'done', title: 'Concluído' },
] as const;

export function TaskBoard({ tasks, onUpdateTask, onEditTask, onDeleteTask }: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Task['status']) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      onUpdateTask({ ...draggedTask, status: newStatus });
    }
    setDraggedTask(null);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => (
        <div
          key={column.id}
          className="bg-muted/50 rounded-lg p-4 h-full"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
            {column.title}
            <span className="text-sm font-normal text-muted-foreground bg-background rounded-full px-2 py-0.5">
                {tasks.filter((task) => task.status === column.id).length}
            </span>
          </h2>
          <div className="space-y-4">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isDragging={draggedTask?.id === task.id}
                  onDragStart={(e) => handleDragStart(e, task)}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))}
            <div className="flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 cursor-pointer hover:bg-muted hover:border-muted-foreground transition-colors">
                <Plus className="h-4 w-4 mr-2"/> Adicionar Tarefa
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
