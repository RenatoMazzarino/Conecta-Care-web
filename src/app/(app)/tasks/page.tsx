'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListFilter } from 'lucide-react';
import { TaskBoard } from '@/components/tasks/task-board';
import type { Task } from '@/lib/types';
import { mockTasks, professionals, patients } from '@/lib/data';
import { TaskDialog } from '@/components/tasks/task-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleCreateTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, { ...newTask, id: `task-${Date.now()}` }]);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  }
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciador de Tarefas</h1>
          <p className="text-muted-foreground">
            Organize, atribua e acompanhe todas as suas tarefas.
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-muted-foreground" />
                <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por responsável" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Responsáveis</SelectItem>
                        {professionals.map(p => (
                            <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                        ))}
                         <SelectItem value="Admin">Admin</SelectItem>
                         <SelectItem value="Enf. Chefe">Enf. Chefe</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Tarefa
            </Button>
        </div>
      </div>

      <TaskBoard 
        tasks={tasks} 
        onUpdateTask={handleUpdateTask} 
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        professionals={professionals}
        patients={patients}
      />
    </div>
  );
}
