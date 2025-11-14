
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Patient, Professional } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface AssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPatientIds: string[];
  allPatients: Patient[];
  allProfessionals: Professional[];
  onSuccess: () => void;
}

export function AssignmentDialog({
  isOpen,
  onOpenChange,
  selectedPatientIds,
  allPatients,
  allProfessionals,
  onSuccess,
}: AssignmentDialogProps) {
  const [supervisor, setSupervisor] = React.useState('');
  const [scheduler, setScheduler] = React.useState('');

  const supervisors = allProfessionals.filter(p => p.role === 'Supervisor(a)');
  const schedulers = allProfessionals.filter(p => p.role === 'Escalista');
  const selectedPatients = allPatients.filter(p => selectedPatientIds.includes(p.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
    onOpenChange(false);
  };
  
  React.useEffect(() => {
    if (!isOpen) {
        setSupervisor('');
        setScheduler('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Atribuir Responsáveis</DialogTitle>
            <DialogDescription>
              Selecione o supervisor e o escalista para os pacientes selecionados.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div>
                <Label className="font-semibold">Pacientes Selecionados ({selectedPatients.length})</Label>
                <ScrollArea className="h-32 mt-2 p-3 border rounded-md bg-muted/50">
                    <ul className="space-y-1">
                        {selectedPatients.map(p => <li key={p.id} className="text-sm">{p.name}</li>)}
                    </ul>
                </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor(a)</Label>
              <Select value={supervisor} onValueChange={setSupervisor}>
                <SelectTrigger id="supervisor">
                  <SelectValue placeholder="Selecione um supervisor..." />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduler">Escalista</Label>
              <Select value={scheduler} onValueChange={setScheduler}>
                <SelectTrigger id="scheduler">
                  <SelectValue placeholder="Selecione um escalista..." />
                </SelectTrigger>
                <SelectContent>
                  {schedulers.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!supervisor && !scheduler}>Confirmar Atribuição</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
