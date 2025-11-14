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
import { FileText, MessageCircle, User, CheckSquare, FileUp, UserCheck, Star, Shield, Search, AlertTriangle, MapPin, DollarSign, Megaphone, CalendarClock, FileDown } from 'lucide-react';
import { ShiftAuditDialog } from './shift-audit-dialog';
import { ShiftChatDialog } from './shift-chat-dialog';
import { ProntuarioTimeline } from '../prontuario/prontuario-timeline';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '../ui/alert';

// Mock candidates for pending shifts
const mockCandidates: Professional[] = [
    allProfessionals.find(p => p.id === 'prof-1')!,
    allProfessionals.find(p => p.id === 'prof-2')!,
    allProfessionals.find(p => p.id === 'prof-4')!,
    allProfessionals.find(p => p.id === 'prof-5')!,
].filter(Boolean);

const complexityVariant: { [key in Patient['adminData']['complexity']]: string } = {
    Baixa: 'bg-green-100 text-green-800 border-green-200',
    Média: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Alta: 'bg-red-100 text-red-800 border-red-200',
    Crítica: 'bg-red-200 text-red-900 border-red-300',
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
  
  const defaultStartTime = shift.shiftType === 'diurno' ? '08:00' : '20:00';
  const defaultEndTime = shift.shiftType === 'diurno' ? '20:00' : '08:00';

  const [publishData, setPublishData] = React.useState({
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    valueOffered: 150,
    notes: '',
    isUrgent: shift.isUrgent || false,
  });
  const hasTimeRange = Boolean(publishData.startTime && publishData.endTime);
  const isTimeInvalid = hasTimeRange && publishData.startTime > publishData.endTime;


  const { toast } = useToast();
  
  React.useEffect(() => {
    if (isOpen) {
      setView('default');
      setSearch('');
      setPublishData({
        startTime: defaultStartTime,
        endTime: defaultEndTime,
        valueOffered: 150,
        notes: '',
        isUrgent: shift.isUrgent || false,
      });
    }
  }, [isOpen, shift.isUrgent, defaultStartTime, defaultEndTime]);

  const handlePublishVacancy = () => {
    onVacancyPublished({ ...shift, status: 'pending', isUrgent: publishData.isUrgent });
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
  
  const renderOpenContent = () => {
    if (view === 'assign') {
        const previousAssignments = [allProfessionals[0], allProfessionals[2], allProfessionals[4]].filter(Boolean) as Professional[];
        return (
             <div className="py-4 max-h-[70vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">Atribuir Profissional Diretamente</h4>
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
                
                 <Card className="mb-4 bg-amber-50 border-amber-200">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                            <User className="h-5 w-5" />
                            Histórico de Plantões do Paciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4 overflow-x-auto pb-4">
                        {previousAssignments.map(prof => (
                            <div key={prof.id} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card border w-36 text-center shrink-0">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={prof.avatarUrl} data-ai-hint={prof.avatarHint} />
                                    <AvatarFallback>{prof.initials}</AvatarFallback>
                                </Avatar>
                                <p className="text-sm font-semibold truncate w-full">{prof.name}</p>
                                <p className="text-xs text-muted-foreground">Último plantão: 2 sem. atrás</p>
                                <Button size="sm" variant="secondary" className="w-full h-8 mt-1" onClick={() => handleAssignDirectly(prof)}>Re-atribuir</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

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
      const fullAddress = `${patient.address.street}, ${patient.address.number} - ${patient.address.neighborhood}, ${patient.address.city}/${patient.address.state}`;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
      const formattedDate = new Date(shift.dayKey).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' });
      return (
        <div className="py-4 max-h-[70vh]">
            <h4 className="font-semibold text-lg text-center mb-4">Revisar e Publicar Vaga</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScrollArea className="md:col-span-2 h-[55vh] pr-6">
                    <div className="space-y-6">
                        <Card>
                          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="h-5 w-5 text-primary" />Detalhes do Plantão</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Data</Label>
                                  <Input value={formattedDate} disabled />
                                </div>
                                <div>
                                  <Label>Tipo de Plantão</Label>
                                  <Input value={`Plantão ${shift.shiftType}`} disabled />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Hora Início</Label>
                                    <Input value={publishData.startTime} onChange={e => setPublishData({...publishData, startTime: e.target.value})} type="time" />
                                </div>
                                <div>
                                    <Label>Hora Fim</Label>
                                    <Input value={publishData.endTime} onChange={e => setPublishData({...publishData, endTime: e.target.value})} type="time" />
                                </div>
                            </div>
                             {isTimeInvalid && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        O horário de início não pode ser posterior ao horário de término.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                                <div className="flex items-center space-x-3">
                                    <Megaphone className="h-6 w-6 text-amber-600"/>
                                    <div>
                                        <Label htmlFor="urgent-switch-publish" className="font-semibold">
                                            Marcação Urgente
                                        </Label>
                                        <p className="text-xs text-muted-foreground">A vaga será destacada para atrair mais profissionais.</p>
                                    </div>
                                </div>
                                <Switch 
                                    id="urgent-switch-publish"
                                    checked={publishData.isUrgent} 
                                    onCheckedChange={(checked) => setPublishData({...publishData, isUrgent: checked === true})} 
                                    className="data-[state=checked]:bg-amber-500"
                                />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                              <MapPin className="h-5 w-5 text-primary" />
                              Localização do atendimento
                            </CardTitle>
                            <CardDescription>Confirme o endereço antes de publicar.</CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground break-words">{fullAddress}</p>
                            <Button asChild variant="outline" size="sm" className="self-start">
                              <Link href={mapsUrl} target="_blank" rel="noreferrer">
                                Abrir no Google Maps
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><DollarSign className="h-5 w-5 text-primary" />Valores e Informações Adicionais</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                               <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Título da Vaga</Label>
                                        <Input defaultValue={`Plantão ${shift.shiftType} - ${patient.name}`} />
                                    </div>
                                     <div>
                                        <Label>Valor Oferecido (R$)</Label>
                                        <Input type="number" value={publishData.valueOffered} onChange={e => setPublishData({...publishData, valueOffered: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <div>
                                  <Label htmlFor="notes">Observações para os Profissionais</Label>
                                  <Textarea id="notes" placeholder="Ex: Paciente necessita de atenção especial para mobilidade." value={publishData.notes} onChange={e => setPublishData({...publishData, notes: e.target.value})} />
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </ScrollArea>

                <div className="md:col-span-1">
                    <Card className="sticky top-0 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Preview da Vaga</CardTitle>
                            <CardDescription>É assim que os profissionais verão a vaga.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between font-bold text-lg text-primary">
                                <span>{patient.name}</span>
                                {publishData.isUrgent && <Badge variant="destructive" className="bg-amber-500 text-white">Urgente</Badge>}
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-muted-foreground">Localização</p>
                                    <p>{patient.address.neighborhood}, {patient.address.city} - {patient.address.state}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-muted-foreground">Data e Horário</p>
                                    <p>{formattedDate}</p>
                                    <p>{publishData.startTime} às {publishData.endTime}</p>
                                </div>
                                 <div>
                                    <p className="font-semibold text-muted-foreground">Valor</p>
                                    <p className="font-bold text-green-600 text-base">{publishData.valueOffered.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                </div>
                                {publishData.notes && (
                                    <div>
                                        <p className="font-semibold text-muted-foreground">Observações</p>
                                        <p className="italic">"{publishData.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                    <Megaphone className="h-6 w-6 text-amber-600"/>
                    <div>
                        <Label htmlFor="urgent-switch" className="font-semibold">
                            Marcação Urgente
                        </Label>
                        <p className="text-xs text-muted-foreground">A vaga será destacada para atrair mais profissionais.</p>
                    </div>
                </div>
                <Switch 
                    id="urgent-switch"
                    checked={publishData.isUrgent} 
                    onCheckedChange={(checked) => setPublishData({...publishData, isUrgent: checked === true})} 
                    className="data-[state=checked]:bg-amber-500"
                />
            </div>
            
            <div className="h-80 text-center grid grid-cols-2 gap-6 items-center justify-center">
                <div 
                  className="flex flex-col items-center justify-center gap-4 p-6 border rounded-lg h-full cursor-pointer hover:bg-accent hover:border-primary/50 transition-colors"
                  onClick={() => setView('assign')}
                >
                  <UserCheck className="h-16 w-16 text-primary" />
                  <h3 className="text-xl font-semibold">Atribuir Diretamente</h3>
                  <p className="text-muted-foreground">Escolha um profissional específico da sua equipe para este plantão.</p>
                </div>
                 <div 
                  className="flex flex-col items-center justify-center gap-4 p-6 border rounded-lg h-full cursor-pointer hover:bg-accent hover:border-primary/50 transition-colors"
                  onClick={() => setView('publish')}
                >
                  <FileUp className="h-16 w-16 text-primary" />
                  <h3 className="text-xl font-semibold">Publicar Vaga</h3>
                  <p className="text-muted-foreground">Torne a vaga visível para que profissionais qualificados possam se candidatar.</p>
                </div>
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
              <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                  <TabsTrigger value="notes">Anotações Internas</TabsTrigger>
                  <TabsTrigger value="export">Exportar</TabsTrigger>
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
               <TabsContent value="export" className="mt-4">
                  <div className="h-96 flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed rounded-lg">
                      <FileDown className="w-12 h-12 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">Gerar Relatório do Plantão</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">Exporte um arquivo PDF consolidado com todas as informações, linha do tempo e anotações deste plantão para seus registros.</p>
                      <Button>Gerar PDF do Plantão</Button>
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

  const isActive = shift.status === 'active';
  const patientComplexity = patient.adminData?.complexity;

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
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                         <DialogTitle className="text-2xl">
                            <Link href={`/patients/${patient.id}`} className="hover:underline">{patient.name || 'Nova Vaga'}</Link>
                         </DialogTitle>
                        {patientComplexity && (
                           <Badge className={cn("hidden sm:inline-flex", complexityVariant[patientComplexity])}>
                                {patientComplexity.charAt(0).toUpperCase() + patientComplexity.slice(1)} Complexidade
                           </Badge>
                        )}
                    </div>
                    <DialogDescription className="flex items-center flex-wrap gap-x-2">
                        {professional ? (
                           <>
                                {isActive && <span className="relative flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> }
                                <span>Plantão {shift.shiftType} - </span>
                                <span className="flex items-center gap-1">
                                    {isActive ? `Em atendimento com ` : ' com '}
                                    <Button variant="link" className="p-0 h-auto text-base" onClick={() => onOpenProfile(professional)}>{professional.name}</Button>
                                </span>
                                {isActive && shift.checkIn && <span>desde {shift.checkIn}</span>}
                           </>
                        ) : (
                            <>Plantão {shift.shiftType} - {new Date(shift.dayKey).toLocaleDateString('pt-BR', { timeZone: 'UTC', weekday: 'long', day: '2-digit', month: 'long' })}</>
                        )}
                    </DialogDescription>
                </div>
              </div>
               <div className="flex items-center gap-4">
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
            {view === 'publish' && <Button onClick={handlePublishVacancy} disabled={isTimeInvalid}><FileUp className="mr-2 h-4 w-4" />Confirmar e Publicar</Button>}
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
