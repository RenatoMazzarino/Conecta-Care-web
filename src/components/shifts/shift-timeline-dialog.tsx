'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { mockShiftHistory } from '@/lib/data';
import type { Shift, Professional, Patient } from '@/lib/types';
import { cn } from '@/lib/utils';


export function ShiftTimelineDialog({ isOpen, onOpenChange, shift, professional, patient }: { 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void; 
    shift: Shift;
    professional?: Professional;
    patient?: Patient;
}) {
  
  if (!shift || !professional || !patient) return null;

  const currentProgress = shift.progress ?? 0;
  const currentEventIndex = Math.floor((mockShiftHistory.length - 1) * (currentProgress / 100));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
             <Avatar className="h-10 w-10">
                <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
                <AvatarFallback>{professional.initials}</AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle>Linha do Tempo do Plantão</DialogTitle>
                <DialogDescription>
                    {patient.name} - {professional.name}
                </DialogDescription>
            </div>
          </div>
           <div className="pt-4 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Progresso do Plantão</span>
                    <span className="text-foreground">{currentProgress}%</span>
                </div>
                <Progress value={currentProgress} />
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
