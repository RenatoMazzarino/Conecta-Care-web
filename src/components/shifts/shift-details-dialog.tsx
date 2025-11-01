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
import { FileText, MessageCircle, User, Calendar, CheckSquare } from 'lucide-react';
import { ShiftAuditDialog } from './shift-audit-dialog';
import { ShiftChatDialog } from './shift-chat-dialog';
import { ProntuarioTimeline } from '../prontuario/prontuario-timeline';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function ShiftDetailsDialog({ isOpen, onOpenChange, shift, professional, patient, onOpenProfile }: { 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void; 
    shift: Shift;
    professional?: Professional;
    patient?: Patient;
    onOpenProfile: (professional: Professional) => void;
}) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  if (!shift || !professional || !patient) return null;

  const currentProgress = shift.progress ?? 0;
  
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
                  <Button variant="outline" onClick={() => setIsChatOpen(true)}><MessageCircle /> Chat</Button>
                  <Button variant="outline" asChild><Link href={`/patients/${patient.id}`}><FileText /> Prontuário</Link></Button>
                  <Button variant="outline" disabled><CheckSquare /> Criar Tarefa</Button>
               </div>
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
                          <ProntuarioTimeline currentProgress={currentProgress} />
                      </ScrollArea>
                      <div className="space-y-4">
                           <ShiftAuditDialog shift={shift} professional={professional} patient={patient} />
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
      {isChatOpen && (
        <ShiftChatDialog
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          shift={shift}
          professional={professional}
          patient={patient}
        />
      )}
   </>
  );
}
