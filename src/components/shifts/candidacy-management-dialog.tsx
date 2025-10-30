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
import type { OpenShiftInfo, Professional } from '@/lib/types';
import { professionals } from '@/lib/data';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Star, MessageSquare, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const mockCandidates = [
    professionals.find(p => p.id === 'prof-1')!,
    professionals.find(p => p.id === 'prof-2')!,
    professionals.find(p => p.id === 'prof-4')!,
    professionals.find(p => p.id === 'prof-5')!,
]

export function CandidacyManagementDialog({
  isOpen,
  onOpenChange,
  shiftInfo,
  onOpenProfile,
  onApprove,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shiftInfo: OpenShiftInfo;
  onOpenProfile: (professional: Professional) => void;
  onApprove: (professional: Professional, shiftInfo: OpenShiftInfo) => void;
}) {
  const { toast } = useToast();

  const handleViewProfile = (professional: Professional) => {
    onOpenProfile(professional);
  }

  const handleDirectApprove = (professional: Professional) => {
     onApprove(professional, shiftInfo);
     toast({
        title: 'Profissional Aprovado!',
        description: `${professional.name} foi alocado para o plantão.`,
      });
  }

  const handleReject = (professional: Professional) => {
    toast({
        title: 'Candidatura Rejeitada',
        description: `A candidatura de ${professional.name} foi rejeitada.`,
        variant: 'destructive',
      });
  }


  const formattedDate = new Date(shiftInfo.dayKey).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
  const shiftTime = shiftInfo.shiftType === 'diurno' ? '08:00 - 20:00' : '20:00 - 08:00';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Candidaturas</DialogTitle>
          <DialogDescription>
            {`Vaga para ${shiftInfo.patient.name} em ${formattedDate} (${shiftTime})`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto pr-2 space-y-3">
            <h4 className="font-semibold">{mockCandidates.length} Candidatos</h4>
            {mockCandidates.map(candidate => (
                <div key={candidate.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewProfile(candidate)}>
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
                     <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleReject(candidate)}>
                            <X className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-green-600" onClick={() => handleDirectApprove(candidate)} disabled={candidate.corenStatus === 'inactive'}>
                            <Check className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
