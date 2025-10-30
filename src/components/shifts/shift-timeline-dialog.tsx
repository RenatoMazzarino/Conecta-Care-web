'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { mockShiftHistory } from '@/lib/data';
import type { ActiveShift } from '@/lib/types';
import { cn } from '@/lib/utils';


export function ShiftTimelineDialog({ isOpen, onOpenChange, shift }: { isOpen: boolean; onOpenChange: (open: boolean) => void; shift: ActiveShift; }) {
  
  // Find the index of the event that corresponds to the current progress
  const currentEventIndex = Math.floor((mockShiftHistory.length - 1) * (shift.progress / 100));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
             <Avatar className="h-10 w-10">
                <AvatarImage src={shift.professional.avatarUrl} alt={shift.professional.name} data-ai-hint={shift.professional.avatarHint} />
                <AvatarFallback>{shift.professional.initials}</AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle>Linha do Tempo do Plantão</DialogTitle>
                <DialogDescription>
                    {shift.patientName} - {shift.professional.name}
                </DialogDescription>
            </div>
          </div>
           <div className="pt-4 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Progresso do Plantão</span>
                    <span className="text-foreground">{shift.progress}%</span>
                </div>
                <Progress value={shift.progress} />
           </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2 -mx-4">
          <div className="relative px-6 py-4">
              {/* Vertical line */}
              <div className="absolute left-9 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
              
              <div className="space-y-8">
                  {mockShiftHistory.map((event, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className={cn(
                            "absolute left-9 -translate-x-1/2 mt-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background",
                            index <= currentEventIndex ? 'bg-primary' : 'bg-muted'
                          )}>
                              <event.icon className={cn("h-4 w-4", index <= currentEventIndex ? 'text-primary-foreground' : 'text-muted-foreground')} />
                          </div>
                          <div className={cn("ml-12 w-full transition-opacity", index > currentEventIndex && "opacity-40")}>
                                <p className="font-semibold text-sm text-foreground">{event.event}</p>
                                <p className="text-xs text-muted-foreground">{event.time}</p>
                              <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
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
