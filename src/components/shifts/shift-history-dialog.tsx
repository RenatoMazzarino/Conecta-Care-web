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
import type { ActiveShift, ShiftHistoryEvent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { mockShiftHistory } from '@/lib/data';


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
                    {mockShiftHistory.map((item, index) => (
                        <div key={index} className="relative flex items-start gap-4">
                            <div className="absolute left-9 -translate-x-1/2 mt-1.5 h-3 w-3 rounded-full bg-background border-2 border-primary" />
                            <div className={cn("flex h-6 w-6 items-center justify-center rounded-full bg-muted mt-0.5", item.bgColor)}>
                                <item.icon className={cn("h-4 w-4", item.iconColor)} />
                            </div>
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
