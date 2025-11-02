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
import { professionals, patients } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Star, MessageSquare, Check, X, Shield, Filter, UserCheck, Heart, CalendarCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';


// --- Mock Data Simulation ---
const mockPendingShifts: OpenShiftInfo[] = [
    {
        patient: patients.find(p => p.id === 'patient-123')!,
        dayKey: '2024-10-06',
        shiftType: 'noturno',
    }
];

const mockCandidates: Professional[] = [
    { ...professionals.find(p => p.id === 'prof-1')!, compatibilityTags: [{text: 'Já atendeu este paciente', icon: UserCheck}] },
    { ...professionals.find(p => p.id === 'prof-2')!, compatibilityTags: [] },
    { ...professionals.find(p => p.id === 'prof-6')!, compatibilityTags: [{text: 'Especialista em Curativos', icon: Heart}] },
    { ...professionals.find(p => p.id === 'prof-4')!, compatibilityTags: [] }, // COREN Inativo
    { ...professionals.find(p => p.id === 'prof-5')!, compatibilityTags: [{text: 'Disponível no período', icon: CalendarCheck}] },
].filter(Boolean);
// --- End Mock Data ---


export function CandidacyManagementDialog({
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
  const [minRating, setMinRating] = React.useState(4.0);

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

  const sortedAndFilteredCandidates = React.useMemo(() => {
    return mockCandidates
      .filter(c => c.rating >= minRating)
      .sort((a, b) => {
        // 1. COREN Ativo
        if (a.corenStatus === 'active' && b.corenStatus !== 'active') return -1;
        if (a.corenStatus !== 'active' && b.corenStatus === 'active') return 1;

        // 2. Já atendeu o paciente
        const aHasWorked = a.compatibilityTags?.some(t => t.text.includes('Já atendeu'));
        const bHasWorked = b.compatibilityTags?.some(t => t.text.includes('Já atendeu'));
        if (aHasWorked && !bHasWorked) return -1;
        if (!aHasWorked && bHasWorked) return 1;

        // 3. Avaliação (Rating)
        if (a.rating > b.rating) return -1;
        if (a.rating < b.rating) return 1;
        
        return 0;
      });
  }, [minRating]);

  const shift = mockPendingShifts[0]; // Assuming one shift for simplicity
  const formattedDate = shift?.dayKey ? new Date(shift.dayKey).toLocaleDateString('pt-BR', {timeZone: 'UTC', day: '2-digit', month: 'long' }) : 'data indefinida';
  const shiftTime = shift?.shiftType === 'diurno' ? '08:00 - 20:00' : '20:00 - 08:00';

  if (!shift) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
            <DialogTitle>Gerenciar Candidatos</DialogTitle>
            <DialogDescription>
                Revise, filtre e aprove o profissional ideal para o plantão de <strong>{shift.patient.name}</strong> em {formattedDate} ({shift.shiftType}).
            </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-[280px_1fr] gap-6 flex-1 min-h-0">
            {/* Coluna de Filtros */}
            <div className="rounded-lg bg-muted/50 p-4 flex flex-col gap-6">
                <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4"/>Filtros Rápidos</h3>
                <div className="space-y-4">
                    <div className='space-y-3'>
                        <Label>Nota Mínima: {minRating.toFixed(1)}</Label>
                         <Slider
                            defaultValue={[minRating]}
                            max={5}
                            min={0}
                            step={0.1}
                            onValueChange={(value) => setMinRating(value[0])}
                        />
                    </div>
                     <div className='space-y-2'>
                        <Label>Especialidade</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Todas as especialidades"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="geriatria">Geriatria</SelectItem>
                                <SelectItem value="curativos">Curativos</SelectItem>
                                <SelectItem value="uti">UTI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Coluna de Candidatos */}
            <div className="flex flex-col min-h-0">
                <p className="text-sm text-muted-foreground mb-2">{sortedAndFilteredCandidates.length} de {mockCandidates.length} profissionais exibidos.</p>
                <ScrollArea className="flex-1 -mr-4 pr-4">
                    <div className="space-y-3">
                        {sortedAndFilteredCandidates.map(candidate => (
                             <div key={candidate.id} className={cn("rounded-lg border p-4 bg-card transition-all", candidate.corenStatus !== 'active' && 'opacity-60 bg-muted')}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => onOpenProfile(candidate)}>
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint={candidate.avatarHint} />
                                            <AvatarFallback>{candidate.initials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{candidate.name}</p>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                <span>{candidate.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Button variant="outline" size="sm" onClick={() => handleReject(candidate)}><X className="mr-2 h-4 w-4" />Rejeitar</Button>
                                        <Button size="sm" onClick={() => handleApprove(candidate, shift)} disabled={candidate.corenStatus !== 'active'}><Check className="mr-2 h-4 w-4" />Aprovar</Button>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                     <div className="flex flex-wrap gap-2">
                                         {candidate.corenStatus !== 'active' && (
                                            <Badge variant="destructive"><Shield className="mr-1.5 h-3 w-3" />COREN Inativo</Badge>
                                         )}
                                        {candidate.compatibilityTags?.map(tag => {
                                            const TagIcon = tag.icon;
                                            return <Badge key={tag.text} variant="secondary" className="bg-primary/10 text-primary border-primary/20"><TagIcon className="mr-1.5 h-3 w-3" />{tag.text}</Badge>
                                        })}
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8"><MessageSquare className="h-4 w-4" /></Button>
                                </div>
                             </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
