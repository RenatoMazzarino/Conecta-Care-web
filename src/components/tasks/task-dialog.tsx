'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, Professional, Patient } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type TaskDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (task: Task) => void;
  professionals: Professional[];
  patients: Patient[];
};

export function TaskDialog({
  isOpen,
  onOpenChange,
  task,
  onSave,
  professionals,
  patients
}: TaskDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<Partial<Task>>({});
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
        if (task) {
            setFormData(task);
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'Média',
                assignee: undefined,
                dueDate: undefined,
                patientId: undefined,
            });
        }
    }
  }, [task, isOpen]);
  
  const handleChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
        toast({ title: "Título obrigatório", description: "Por favor, preencha o título da tarefa.", variant: "destructive" });
        return;
    }
    onSave(formData as Task);
    onOpenChange(false);
  };
  
  // Efeito para desfocar o input e remover a seleção de texto
  const handleOpenAutoFocus = (e: Event) => {
    e.preventDefault();
    titleInputRef.current?.blur();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" onOpenAutoFocus={handleOpenAutoFocus}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
            <DialogDescription>
              {task ? 'Atualize os detalhes da tarefa.' : 'Preencha as informações para criar uma nova tarefa.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                ref={titleInputRef}
                value={formData.title || ''}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="Ex: Comprar novos suprimentos para o paciente X"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea id="description" value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} placeholder="Adicione mais detalhes sobre a tarefa..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                 <Label htmlFor="assignee">Responsável</Label>
                 <Select value={formData.assignee || ''} onValueChange={v => handleChange('assignee', v)}>
                    <SelectTrigger id="assignee"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Enf. Chefe">Enf. Chefe</SelectItem>
                        {professionals.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                    </SelectContent>
                 </Select>
               </div>
                <div className="grid gap-2">
                 <Label htmlFor="priority">Prioridade</Label>
                 <Select value={formData.priority || 'Média'} onValueChange={v => handleChange('priority', v)}>
                    <SelectTrigger id="priority"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="dueDate">Data de Vencimento (Opcional)</Label>
                    <Input id="dueDate" type="date" value={formData.dueDate || ''} onChange={e => handleChange('dueDate', e.target.value)} />
                 </div>
                 <div className="grid gap-2">
                    <Label htmlFor="patientId">Vincular Paciente (Opcional)</Label>
                     <Select value={formData.patientId || ''} onValueChange={v => handleChange('patientId', v)}>
                        <SelectTrigger id="patientId"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                             {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                     </Select>
                 </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
