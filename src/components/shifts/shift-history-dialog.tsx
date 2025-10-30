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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Footprints, Pill, CircleCheck, CircleX } from 'lucide-react';
import type { ActiveShift, ShiftHistoryEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

const mockHistory: ShiftHistoryEvent[] = [
    { time: '08:02', event: 'Início do Plantão', details: 'Profissional iniciou o plantão via app.', icon: Footprints, iconColor: 'text-blue-500' },
    { time: '08:15', event: 'Check-in Realizado', details: 'Presença confirmada na residência.', icon: CircleCheck, iconColor: 'text-green-500' },
    { time: '09:00', event: 'Medicação Administrada', details: 'Administrado 10mg de Lexapro.', icon: Pill, iconColor: 'text-indigo-500' },
    { time: '12:30', event: 'Medição de Sinais Vitais', details: 'PA: 120/80 mmHg, FC: 75bpm, SpO2: 98%', icon: Pill, iconColor: 'text-indigo-500' },
    { time: '14:00', event: 'Paciente reportou dor', details: 'Dor leve na região lombar. Escala 3/10.', icon: Pill, iconColor: 'text-amber-500' },
    { time: '18:00', event: 'Medicação Administrada', details: 'Administrado 500mg de Dipirona.', icon: Pill, iconColor: 'text-indigo-500' },
    { time: '20:05', event: 'Check-out Realizado', details: 'Saída da residência confirmada.', icon: CircleX, iconColor: 'text-red-500' },
    { time: '20:10', event: 'Fim do Plantão', details: 'Profissional finalizou o plantão via app.', icon: Footprints, iconColor: 'text-slate-500' },
];


export function ShiftHistoryDialog({
  isOpen,
  onOpenChange,
  shift,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shift: ActiveShift;
}) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
             <Avatar className="h-10 w-10">
                <AvatarImage src={shift.professional.avatarUrl} alt={shift.professional.name} data-ai-hint={shift.professional.avatarHint} />
                <AvatarFallback>{shift.professional.initials}</AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle>Histórico do Plantão</DialogTitle>
                <DialogDescription>
                    {shift.patientName} - {shift.professional.name}
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-96 w-full pr-4">
            <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-9 top-0 h-full w-0.5 bg-border" />

                <div className="space-y-6">
                    {mockHistory.map((item, index) => (
                        <div key={index} className="relative flex items-start gap-4">
                            <div className="absolute left-9 -translate-x-1/2 mt-1.5 h-3 w-3 rounded-full bg-background border-2 border-[--icon-color]" style={{ '--icon-color': `var(--${item.iconColor.replace('text-', 'color-')})` } as React.CSSProperties} />
                            <item.icon className={cn("h-6 w-6 flex-shrink-0", item.iconColor)} />
                            <div className="flex-1">
                                <p className="font-semibold">{item.event} <span className="ml-2 text-xs font-normal text-muted-foreground">{item.time}</span></p>
                                {item.details && <p className="text-sm text-muted-foreground">{item.details}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
        
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
