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
import type { ActiveShift } from '@/lib/types';
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
                            <div className={cn("absolute left-9 -translate-x-1/2 mt-1 flex h-6 w-6 items-center justify-center rounded-full", item.bgColor)}>
                                <item.icon className={cn("h-4 w-4", item.iconColor)} />
                            </div>
                            <div className="ml-10 w-full rounded-lg bg-muted/40 p-3">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-sm text-foreground">{item.event}</p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
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
