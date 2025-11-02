'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Professional } from '@/lib/types';
import { Star, Shield, MessageCircle, XCircle, Briefcase, FileText, Clock, UserCheck, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { useState } from 'react';
import { ShiftChatDialog } from './shift-chat-dialog';

function StarRating({ rating, reviewCount }: { rating: number, reviewCount: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={cn("h-5 w-5", i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300')} />
      ))}
       <span className="ml-2 text-sm text-muted-foreground">
        {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})
       </span>
    </div>
  );
}

export function ProfessionalProfileDialog({
  professional,
  isOpen,
  onOpenChange,
  onApprove,
  shiftContext,
}: {
  professional: Professional;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (professional: Professional) => void;
  shiftContext?: { patientName: string, date: string };
}) {
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleApprove = () => {
    if (onApprove) {
      onApprove(professional);
    }
  };

  const handleReject = () => {
    toast({
      title: 'Ação Registrada',
      description: `O profissional ${professional.name} foi marcado como reprovado para esta vaga.`,
      variant: 'destructive'
    });
    onOpenChange(false);
  }

  const compatibilityColors = {
    positive: 'border-green-200 bg-green-50 text-green-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    default: 'border-border bg-muted/50 text-foreground',
  }

  const chatInitialMessage = shiftContext 
    ? `Olá, ${professional.name.split(' ')[0]}. Estou entrando em contato sobre o plantão para ${shiftContext.patientName} no dia ${shiftContext.date}.`
    : '';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex flex-col items-center text-center gap-4 pt-4">
              <Avatar className="h-24 w-24 text-4xl font-bold border-4">
                <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
                <AvatarFallback>{professional.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <DialogTitle className="text-2xl">{professional.name}</DialogTitle>
                <StarRating rating={professional.rating} reviewCount={professional.reviews.length} />
                <div className="flex items-center justify-center gap-2 pt-1">
                    <Badge variant={professional.corenStatus === 'active' ? 'default' : 'destructive'} className={cn(professional.corenStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                        <Shield className="mr-1 h-3 w-3" />
                        COREN {professional.corenStatus === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {professional.lastActivity && (
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Clock className="h-3 w-3"/>
                            {professional.lastActivity}
                        </div>
                    )}
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh] pr-4">
              <div className="py-4 space-y-6">
                  {professional.compatibilityTags && professional.compatibilityTags.length > 0 && (
                      <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><UserCheck className="h-4 w-4"/> Destaques de Compatibilidade</h4>
                          <div className="space-y-2">
                            {professional.compatibilityTags.map(tag => (
                                <div key={tag.text} className={cn("flex items-center gap-2 p-2 rounded-md text-sm font-medium", compatibilityColors[tag.variant || 'default'])}>
                                    <tag.icon className="h-4 w-4" />
                                    <span>{tag.text}</span>
                                </div>
                            ))}
                          </div>
                      </div>
                  )}

                   {professional.recentAttendances && professional.recentAttendances.length > 0 && (
                      <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><History className="h-4 w-4"/> Histórico Rápido</h4>
                          <div className="space-y-2">
                             {professional.recentAttendances.map((item, index) => (
                                <div key={index} className="p-3 bg-muted/50 rounded-md border">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm">{item.patientName}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        {item.note}
                                    </p>
                                </div>
                           ))}
                          </div>
                      </div>
                  )}

                  <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4"/> Resumo Profissional</h4>
                      <p className="text-sm text-muted-foreground">{professional.bio}</p>
                  </div>

                  <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4"/> Especialidades</h4>
                      <div className="flex flex-wrap gap-2">
                          {professional.specialties.map(spec => (
                              <Badge key={spec} variant="secondary" className="bg-secondary/80 text-secondary-foreground">{spec}</Badge>
                          ))}
                      </div>
                  </div>

                  <div>
                      <h4 className="font-semibold mb-2">Últimas Avaliações</h4>
                      <div className="space-y-3">
                      {professional.reviews.length > 0 ? (
                          professional.reviews.map((review, index) => (
                          <div key={index} className="text-sm p-3 bg-muted/50 rounded-lg border">
                              <p className="italic">"{review.quote}"</p>
                              <p className="text-right text-xs text-muted-foreground mt-2">- {review.from}</p>
                          </div>
                          ))
                      ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma avaliação ainda.</p>
                      )}
                      </div>
              </div>
              </div>
          </ScrollArea>

          <DialogFooter className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={handleReject}><XCircle className="mr-2 h-4 w-4" />Reprovar</Button>
            <Button variant="secondary" onClick={() => setIsChatOpen(true)}><MessageCircle className="mr-2 h-4 w-4" />Chat</Button>
            <Button onClick={handleApprove} disabled={!onApprove || professional.corenStatus === 'inactive'}>Aprovar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
       {isOpen && isChatOpen && (
        <ShiftChatDialog
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          shift={shiftContext as any}
          professional={professional}
          patient={professional as any}
          initialMessage={chatInitialMessage}
        />
       )}
    </>
  );
}
