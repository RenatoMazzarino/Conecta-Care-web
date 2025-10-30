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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import type { OpenShiftInfo, Professional } from '@/lib/types';
import { professionals, patients } from '@/lib/data';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star, MessageSquare, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockPendingShifts: OpenShiftInfo[] = [
    {
        patient: patients.find(p => p.id === 'patient-123')!,
        dayKey: '2024-10-06',
        shiftType: 'noturno',
    }
];

const mockCandidates: Professional[] = [
    professionals.find(p => p.id === 'prof-1')!,
    professionals.find(p => p.id === 'prof-2')!,
    professionals.find(p => p.id === 'prof-4')!,
    professionals.find(p => p.id === 'prof-5')!,
];


export function CandidacyListDialog({
  isOpen,
  onOpenChange,
  onOpenProfile,
  onApprove,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenProfile: (professional: Professional) => void;
  onApprove: (professional: Professional, shift: OpenShiftInfo) => void;
}) {
  const { toast } = useToast();

  const handleApprove = (professional: Professional, shift: OpenShiftInfo) => {
    onApprove(professional, shift);
    toast({
      title: 'Profissional Aprovado!',
      description: `${professional.name} foi alocado para o plantão.`,
    });
  };

  const handleReject = (professional: Professional) => {
    toast({
        title: 'Candidatura Rejeitada',
        description: `A candidatura de ${professional.name} foi rejeitada.`,
        variant: 'destructive',
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Vagas com Candidatos</DialogTitle>
          <DialogDescription>
            Revise os candidatos e aprove o profissional ideal para cada plantão.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-4">
            <Accordion type="single" collapsible className="w-full">
                {mockPendingShifts.map((shift) => {
                     const formattedDate = new Date(shift.dayKey).toLocaleDateString('pt-BR', {timeZone: 'UTC', day: '2-digit', month: 'long' });
                     const shiftTime = shift.shiftType === 'diurno' ? '08:00 - 20:00' : '20:00 - 08:00';
                    return (
                        <AccordionItem value={shift.dayKey} key={shift.dayKey}>
                            <AccordionTrigger className="font-semibold hover:bg-muted/50 px-2 rounded-md">
                                <div>
                                    <p>{shift.patient.name}</p>
                                    <p className="text-sm font-normal text-muted-foreground">{formattedDate} - {shift.shiftType} ({shiftTime})</p>
                                </div>
                                <div className="text-sm text-muted-foreground mr-2">{mockCandidates.length} candidatos</div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {mockCandidates.map(candidate => (
                                    <div key={candidate.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50">
                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onOpenProfile(candidate)}>
                                            <Avatar className={`h-10 w-10 text-md font-bold ${candidate.avatarColor}`}>
                                                <AvatarFallback className={`bg-transparent text-white`}>{candidate.initials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{candidate.name}</p>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                    <span>{candidate.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground"><MessageSquare className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleReject(candidate)}><X className="h-4 w-4" /></Button>
                                            <Button size="sm" onClick={() => handleApprove(candidate, shift)}><Check className="mr-2 h-4 w-4" />Aprovar</Button>
                                        </div>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
