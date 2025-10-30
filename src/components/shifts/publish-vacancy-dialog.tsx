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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User } from 'lucide-react';
import type { OpenShiftInfo } from '@/lib/types';

export function PublishVacancyDialog({
  isOpen,
  onOpenChange,
  shiftInfo,
  onVacancyPublished,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shiftInfo?: OpenShiftInfo | null;
  onVacancyPublished?: (shiftInfo: OpenShiftInfo) => void;
}) {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const notes = formData.get('notes');
    const isUrgent = formData.get('urgent-switch') === 'on';

    toast({
      title: 'Vaga Publicada com Sucesso!',
      description: `A vaga ${isUrgent ? 'URGENTE ' : ''}para o paciente ${shiftInfo?.patient.name} foi publicada. Os profissionais adequados serão notificados.`,
    });
    
    if (shiftInfo && onVacancyPublished) {
        onVacancyPublished(shiftInfo);
    }
    
    onOpenChange(false);
  };
  
  const formattedDate = shiftInfo ? new Date(shiftInfo.dayKey).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  const shiftTime = shiftInfo?.shiftType === 'diurno' ? '08:00 - 20:00' : '20:00 - 08:00';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Publicar Nova Vaga</DialogTitle>
          <DialogDescription>
            Confirme os detalhes da vaga antes de notificar os profissionais.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {shiftInfo && (
                <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{shiftInfo.patient.name}</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formattedDate}</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Plantão {shiftInfo.shiftType} ({shiftTime})</span>
                    </div>
                </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="notes">Requisitos e Observações</Label>
              <Textarea id="notes" name="notes" placeholder="Ex: Necessário experiência com pacientes acamados, troca de fraldas, etc." />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="urgent-switch">Vaga Urgente</Label>
                    <p className="text-xs text-muted-foreground">
                        Marcar esta vaga como urgente para priorizar a notificação.
                    </p>
                </div>
              <Switch id="urgent-switch" name="urgent-switch" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Publicar Vaga</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
