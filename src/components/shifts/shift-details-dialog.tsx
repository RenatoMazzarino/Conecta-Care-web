'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { professionals as allProfessionals } from '@/lib/data';
import type { Shift, Professional, Patient } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import { FileText, MessageCircle, User, CheckSquare, FileUp, UserCheck, Star, Shield, Search, Edit, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { ShiftAuditDialog } from './shift-audit-dialog';
import { ShiftChatDialog } from './shift-chat-dialog';
import { ProntuarioTimeline } from '../prontuario/prontuario-timeline';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '@/components/ui/card';

// Mock candidates for pending shifts
const mockCandidates: Professional[] = [
    allProfessionals.find(p => p.id === 'prof-1')!,
    allProfessionals.find(p => p.id === 'prof-2')!,
    allProfessionals.find(p => p.id === 'prof-4')!,
    allProfessionals.find(p => p.id === 'prof-5')!,
].filter(Boolean);

const complexityVariant: { [key in Patient['complexity']]: string } = {
    baixa: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800',
}

export function ShiftDetailsDialog({ isOpen, onOpenChange, shift, professional, patient, onOpenProfile, onApprove, onVacancyPublished }: { 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void; 
    shift: Shift;
    professional?: Professional;
    patient: Patient;
    onOpenProfile: (professional: Professional) => void;
    onApprove: (professional: Professional, shift: Shift) => void;
    onVacancyPublished: (shift: Shift) => void;
}) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [view, setView] = React.useState<'default' | 'assign' | 'publish'>('default');
  const [search, setSearch] = React.useState('');
  const [isUrgent, setIsUrgent] = React.useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (isOpen) {
      setView('default');
      setSearch('');
      setIsUrgent(shift.isUrgent || false);
    }
  }, [isOpen, shift.isUrgent]);

  const handlePublishVacancy = () => {
    onVacancyPublished({ ...shift, status: 'pending', isUrgent: isUrgent });
     toast({
      title: 'Vaga Publicada com Sucesso!',
      description: `A vaga para ${patient.name} agora está visível para os profissionais.`,
    });
    onOpenChange(false);
  }
  
  const handleAssignDirectly = (prof: Professional) => {
    onApprove(prof, shift);
  }
  
  const filteredProfessionals = allProfessionals.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && p.corenStatus === 'active');
  const shiftTime = shift.shiftType === 'diurno' ? '08:00 - 20:00' : '20:00 - 08:00';

  const renderOpenContent = () => {
    if (view === 'assign') {
        return (
             <div className="py-4 max-h-[60vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Atribuir Profissional Diretamente</h4>
                    <div className="relative w-72">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input 
                            placeholder="Buscar por nome..." 
                            className="pl-8" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1 -mr-2 pr-2">
                    <div className="space-y-2">
                    {filteredProfessionals.map(prof => (
                        <div key={prof.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer" onClick={() => handleAssignDirectly(prof)}>
                             <div className="flex items-center gap-3">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={prof.avatarUrl} alt={prof.name} data-ai-hint={prof.avatarHint} />
                                    <AvatarFallback>{prof.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{prof.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                        <span>{prof.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                             <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                <Button variant="outline" size="sm" onClick={() => onOpenProfile(prof)}>Ver Perfil</Button>
                                <Button size="sm" onClick={() => handleAssignDirectly(prof)}>Atribuir</Button>
                            </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
             </div>
        )
    }

    if (view === 'publish') {
      return (
        <div className="py-4 max-h-[60vh] flex flex-col gap-6">
          <h4 className="font-semibold text-lg text-center">Revisar e Publicar Vaga</h4>
          <Card className="bg-muted/50">
            <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-medium">{new Date(shift.dayKey).toLocaleDateString('pt-BR', { timeZone: 'UTC', weekday: 'long', day: '2-digit', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-medium">Plantão {shift.shiftType} ({shiftTime})</span>
                </div>
                <div className="col-span-2">
                    <p className="text-muted-foreground">Esta vaga será publicada para que profissionais qualificados possam se candidatar.</p>
                </div>
            </CardContent>
          </Card>
          <div className="grid gap-2">
            <Label htmlFor="notes">Observações para os Profissionais (Opcional)</Label>
            <Textarea id="notes" placeholder="Ex: Paciente necessita de atenção especial para mobilidade." />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive"/>
                <div>
                    <Label htmlFor="urgent-switch" className="font-semibold">Publicação Urgente</Label>
                    <p className="text-xs text-muted-foreground">Vagas urgentes são destacadas e notificam mais profissionais.</p>
                </div>
            </div>
            <Switch id="urgent-switch" checked={isUrgent} onCheckedChange={setIsUrgent} />
          </div>
        </div>
      )
    }

    return (
        <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
            <h3 className="text-xl font-semibold">Preencher Vaga em Aberto</h3>
            <p className="text-muted-foreground max-w-md">
                Você pode publicar esta vaga para que os profissionais disponíveis se candidatem, ou pode atribuir diretamente a um profissional específico da sua equipe.
            </p>
            <div className="flex gap-4">
                 <Button size="lg" variant="secondary" onClick={() => setView('assign')}>
                    <UserCheck className="mr-2 h-4 w-4" /> Atribuir Diretamente
                </Button>
                <Button size="lg" onClick={() => setView('publish')}>
                    <FileUp className="mr-2 h-4 w-4" /> Publicar Vaga
                </Button>
            </div>
        </div>
    );
  }

  const renderPendingContent = () => (
     <div className="py-4 max-h-[60vh] overflow-y-auto pr-2 space-y-3">
        <h4 className="font-semibold">{mockCandidates.length} Candidatos</h4>
        {mockCandidates.map(candidate => (
            <div key={candidate.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer" onClick={() => onOpenProfile(candidate)}>
                <div className="flex items-center gap-3">
                     <Avatar className="h-10 w-10">
                        <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint={candidate.avatarHint} />
                        <AvatarFallback>{candidate.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">{candidate.name}</p>
                            <Badge variant={candidate.corenStatus === 'active' ? 'secondary' : 'destructive'} className="py-0 px-1.5 text-xs">
                                 <Shield className="mr-1 h-3 w-3" />
                                COREN {candidate.corenStatus === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span>{candidate.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                 <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" onClick={() => onApprove(candidate, shift)}>
                        <CheckSquare className="mr-2 h-4 w-4" />Aprovar
                    </Button>
                </div>
            </div>
        ))}
    </div>
  );

  const renderActiveContent = () => {
      if (!professional) return <div className="text-center p-8">Profissional não encontrado.</div>;
      const currentProgress = shift.progress ?? 0;
      return (
         <Tabs defaultValue="timeline" className="w-full mt-4">
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
      );
  };

  const renderContent = () => {
    switch (shift.status) {
      case 'open':
        return renderOpenContent();
      case 'pending':
        return renderPendingContent();
      case 'active':
      case 'filled':
      case 'completed':
      case 'issue':
        return renderActiveContent();
      default:
        return <div className="h-96 flex items-center justify-center">Status do plantão desconhecido.</div>;
    }
  };
  
  if (!shift || !patient) return null;

  const isCreatingNew = !patient.id;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                 {patient.avatarUrl && 
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.avatarHint} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                 }
                <div>
                    <div className="flex items-center gap-3">
                         <DialogTitle className="text-2xl">
                            <Link href={`/patients/${patient.id}`} className="hover:underline">{patient.name || 'Nova Vaga'}</Link>
                         </DialogTitle>
                         {patient.complexity && (
                            <Badge className={complexityVariant[patient.complexity]}>
                                {patient.complexity.charAt(0).toUpperCase() + patient.complexity.slice(1)} Complexidade
                            </Badge>
                         )}
                    </div>
                    <DialogDescription>
                        {professional ? (
                            <>Plantão {shift.shiftType} - Em andamento com <Button variant="link" className="p-0 h-auto text-base" onClick={() => onOpenProfile(professional)}>{professional.name}</Button></>
                        ) : (
                            <>Plantão {shift.shiftType} - {new Date(shift.dayKey).toLocaleDateString('pt-BR', { timeZone: 'UTC', weekday: 'long', day: '2-digit', month: 'long' })}</>
                        )}
                    </DialogDescription>
                </div>
              </div>
               <div className="flex items-center gap-2">
                   {patient.id && (
                     <>
                        <Button variant="outline" onClick={() => professional && setIsChatOpen(true)} disabled={!professional}><MessageCircle /> Chat</Button>
                        <Button variant="outline" asChild><Link href={`/patients/${patient.id}`}><FileText /> Prontuário</Link></Button>
                        <Button variant="outline"><CheckSquare /> Criar Tarefa</Button>
                     </>
                   )}
               </div>
            </div>
          </DialogHeader>

          {renderContent()}
          
          <DialogFooter className="pt-4 mt-4 border-t">
            {(view === 'assign' || view === 'publish') && <Button variant="outline" onClick={() => setView('default')}>Voltar</Button>}
            {view === 'publish' && <Button onClick={handlePublishVacancy}><FileUp className="mr-2 h-4 w-4" />Confirmar e Publicar</Button>}
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isChatOpen && professional && patient && (
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
