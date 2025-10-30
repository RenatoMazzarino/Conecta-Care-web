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
import { Input } from '@/components/ui/input';
import { Search, Check, Award } from 'lucide-react';
import type { OpenShiftInfo, Professional } from '@/lib/types';
import { professionals as allProfessionals } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// Simulação: em um app real, isso viria do histórico de plantões.
const recommendedProfessionalIds = ['prof-1', 'prof-3'];

export function DirectAssignmentDialog({
  isOpen,
  onOpenChange,
  shiftInfo,
  onApprove,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shiftInfo: OpenShiftInfo;
  onApprove: (professional: Professional, shift: OpenShiftInfo) => void;
}) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');

  const recommendedProfessionals = allProfessionals.filter(p => recommendedProfessionalIds.includes(p.id));
  const otherProfessionals = allProfessionals.filter(p => !recommendedProfessionalIds.includes(p.id));

  const filteredProfessionals = otherProfessionals.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAssign = (professional: Professional) => {
    onApprove(professional, shiftInfo);
    toast({
        title: 'Profissional Atribuído!',
        description: `${professional.name} foi alocado para o plantão.`,
    });
  }
  
  const formattedDate = new Date(shiftInfo.dayKey).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long' });

  const ProfessionalItem = ({ professional }: { professional: Professional }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
          <AvatarFallback>{professional.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{professional.name}</p>
          <p className="text-sm text-muted-foreground">{professional.specialties[0]}</p>
        </div>
      </div>
      <Button size="sm" onClick={() => handleAssign(professional)}>
          <Check className="mr-2 h-4 w-4"/>
          Atribuir
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Atribuir Profissional Diretamente</DialogTitle>
          <DialogDescription>
            Atribua um profissional para o plantão de {shiftInfo.patient.name} em {formattedDate}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar profissional por nome..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <ScrollArea className="h-80 pr-3">
                 <div className="space-y-4">
                    {/* Recommended Section */}
                    {searchTerm === '' && recommendedProfessionals.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm mb-2 px-2 flex items-center gap-2 text-primary">
                                <Award className="h-4 w-4" />
                                Nossas Recomendações
                            </h4>
                            <div className="space-y-1">
                                {recommendedProfessionals.map(prof => (
                                    <ProfessionalItem key={prof.id} professional={prof} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* All Professionals Section */}
                    <div>
                        <h4 className="font-semibold text-sm mb-2 px-2 text-muted-foreground">
                            {searchTerm === '' ? "Outros Profissionais" : "Resultados da Busca"}
                        </h4>
                        <div className="space-y-1">
                            {filteredProfessionals.length > 0 ? (
                                filteredProfessionals.map(prof => (
                                    <ProfessionalItem key={prof.id} professional={prof} />
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground p-8">Nenhum profissional encontrado.</p>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
