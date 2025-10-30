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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import { FileText, MessageCircle, User } from 'lucide-react';
import { ShiftAuditDialog } from './shift-audit-dialog';

export function ShiftDetailsDialog({ isOpen, onOpenChange, shift, professional, patient, onOpenProfile }: { 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void; 
    shift: Shift;
    professional?: Professional;
    patient?: Patient;
    onOpenProfile: (professional: Professional) => void;
}) {
  const [isAuditOpen, setIsAuditOpen] = React.useState(false);

  if (!shift || !professional || !patient) return null;

  const currentProgress = shift.progress ?? 0;
  const currentEventIndex = Math.floor((mockShiftHistory.length - 1) * (currentProgress / 100));

  const handleOpenProfile = () => {
    onOpenProfile(professional);
  };
  
  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.avatarHint} />
                  <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <DialogTitle className="text-2xl">{patient.name}</DialogTitle>
                  <DialogDescription>
                      Plantão {shift.shiftType} - Em andamento com <Button variant="link" className="p-0 h-auto text-base" onClick={handleOpenProfile}>{professional.name}</Button>
                  </DialogDescription>
              </div>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline"><MessageCircle /> Chat</Button>
                <Button variant="outline" asChild><Link href={`/patients/${patient.id}`}><FileText /> Prontuário</Link></Button>
             </div>
          </div>
           <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Progresso do Plantão</span>
                    <span className="text-foreground">{currentProgress}%</span>
                </div>
                <Progress value={currentProgress} />
           </div>
        </DialogHeader>

        <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                <TabsTrigger value="notes">Anotações Internas</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
                    <ScrollArea className="h-96 pr-4 -mr-4">
                        <div className="relative px-2 py-4">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
                            
                            <div className="space-y-8">
                                {mockShiftHistory.map((event, index) => (
                                    <div key={index} className="relative flex items-start gap-4">
                                        <div className={cn(
                                            "absolute left-6 -translate-x-1/2 mt-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background",
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
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-muted/50 cursor-pointer hover:bg-muted" onClick={() => setIsAuditOpen(true)}>
                            <h4 className="font-semibold mb-2">Auditoria</h4>
                             <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Check-in:</span><span className="font-mono text-green-600">{shift.checkIn} (OK)</span></div>
                                <div className="flex justify-between"><span>Check-out:</span><span className="font-mono text-muted-foreground">{shift.checkOut || 'Pendente'}</span></div>
                            </div>
                            <p className="text-xs text-center mt-3 text-muted-foreground">Clique para ver detalhes</p>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
                <div className="h-96 flex flex-col gap-4">
                    <h3 className="font-semibold">Anotações Internas sobre Paciente/Família</h3>
                    <Textarea className="flex-1" placeholder="Ex: Família não gosta que o ar condicionado fique ligado. Preferem ventilação natural."/>
                    <div className="flex justify-end">
                        <Button>Salvar Anotação</Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    {isAuditOpen && (
        <ShiftAuditDialog
            isOpen={isAuditOpen}
            onOpenChange={setIsAuditOpen}
            shift={shift}
            professional={professional}
            patient={patient}
        />
    )}
   </>
  );
}
