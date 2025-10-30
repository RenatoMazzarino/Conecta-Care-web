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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Home, DollarSign, Pencil, Save, X, Search } from 'lucide-react';
import type { ShiftDetails, Patient } from '@/lib/types';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { patients as allPatients } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function PublishVacancyDialog({
  isOpen,
  onOpenChange,
  shiftInfo,
  onVacancyPublished,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shiftInfo?: { patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno' } | null;
  onVacancyPublished?: (shiftInfo: ShiftDetails) => void;
}) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<ShiftDetails | null>(null);

  const [patientSearchTerm, setPatientSearchTerm] = React.useState('');
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

  const filteredPatients = allPatients.filter(p => 
    p.name.toLowerCase().includes(patientSearchTerm.toLowerCase())
  );

  React.useEffect(() => {
    if (isOpen) {
        if (shiftInfo) {
            setSelectedPatient(shiftInfo.patient);
            initializeFormData(shiftInfo.patient, shiftInfo.dayKey, shiftInfo.shiftType);
        } else {
            // Reset for "publish from scratch" flow
            setSelectedPatient(null);
            setFormData(null);
            setPatientSearchTerm('');
        }
        setIsEditing(false);
    }
  }, [shiftInfo, isOpen]);

  const initializeFormData = (patient: Patient, dayKey?: string, shiftType?: 'diurno' | 'noturno') => {
      const isDiurno = shiftType === 'diurno';
      const today = new Date().toISOString().split('T')[0];

      setFormData({
        patient: patient,
        dayKey: dayKey || today,
        shiftType: shiftType || 'diurno',
        startTime: isDiurno ? '08:00' : '20:00',
        endTime: isDiurno ? '20:00' : '08:00',
        title: `Plantão ${shiftType || 'diurno'} - ${patient.name}`,
        valueOffered: 150, // Default value
        isUrgent: false,
        notes: '',
        address: patient.address,
      });
  }

  const handlePatientSelect = (patient: Patient) => {
      setSelectedPatient(patient);
      initializeFormData(patient);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData) return;
    
    toast({
      title: 'Vaga Publicada com Sucesso!',
      description: `A vaga ${formData.isUrgent ? 'URGENTE ' : ''}para ${formData.patient.name} foi publicada.`,
    });
    
    if (onVacancyPublished) {
        onVacancyPublished(formData);
    }
    
    onOpenChange(false);
  };
  
  const handleUpdate = (field: keyof ShiftDetails, value: any) => {
    if(formData) {
        if(field === 'address') {
            setFormData({ ...formData, address: { ...formData.address, ...value } });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    }
  }

  const handleSave = () => {
    setIsEditing(false);
    toast({ title: 'Alterações salvas localmente.' });
  }

  const ValueDisplay = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon: React.ElementType }) => (
      <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-muted-foreground mt-1"/>
          <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-medium">{value}</p>
          </div>
      </div>
  );

  const formattedDate = formData ? new Date(formData.dayKey).toLocaleDateString('pt-BR', {timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  const fullAddress = formData ? `${formData.address.street}, ${formData.address.number} - ${formData.address.neighborhood}, ${formData.address.city} - ${formData.address.state}`: '';

  const renderContent = () => {
    if (!selectedPatient || !formData) {
        return (
            <div className="space-y-4 pt-4">
                 <DialogDescription>
                    Para publicar uma nova vaga, primeiro selecione o paciente correspondente.
                </DialogDescription>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar paciente por nome..."
                        className="pl-10"
                        value={patientSearchTerm}
                        onChange={(e) => setPatientSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-64 border rounded-md">
                    <div className="p-2 space-y-1">
                    {filteredPatients.length > 0 ? filteredPatients.map(p => (
                        <div key={p.id} onClick={() => handlePatientSelect(p)} className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={p.avatarUrl} alt={p.name} />
                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-sm text-muted-foreground">{p.cpf}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center p-8 text-muted-foreground">
                            Nenhum paciente encontrado.
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
        )
    }

    if (isEditing) {
        return (
            // EDITING VIEW
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Paciente</Label><Input value={formData.patient.name} disabled /></div>
                    <div><Label>Data</Label><Input type="date" value={formData.dayKey} onChange={e => handleUpdate('dayKey', e.target.value)} /></div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Tipo de Plantão</Label>
                        <Select value={formData.shiftType} onValueChange={(v: 'diurno' | 'noturno') => handleUpdate('shiftType', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="diurno">Diurno</SelectItem>
                                <SelectItem value="noturno">Noturno</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div><Label>Início</Label><Input type="time" value={formData.startTime} onChange={e => handleUpdate('startTime', e.target.value)} /></div>
                    <div><Label>Fim</Label><Input type="time" value={formData.endTime} onChange={e => handleUpdate('endTime', e.target.value)} /></div>
                </div>
                <div><Label>Título da Vaga</Label><Input value={formData.title} onChange={e => handleUpdate('title', e.target.value)} /></div>
                <div><Label>Valor Oferecido (R$)</Label><Input type="number" value={formData.valueOffered} onChange={e => handleUpdate('valueOffered', parseFloat(e.target.value))} /></div>
                 <div><Label>Requisitos e Observações</Label><Textarea value={formData.notes} onChange={e => handleUpdate('notes', e.target.value)} placeholder="Ex: Necessário experiência com pacientes acamados..." /></div>
                
                 <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Endereço do Plantão</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Logradouro</Label><Input value={formData.address.street} onChange={e => handleUpdate('address', { street: e.target.value })}/></div>
                        <div><Label>Número</Label><Input value={formData.address.number} onChange={e => handleUpdate('address', { number: e.target.value })}/></div>
                        <div><Label>Bairro</Label><Input value={formData.address.neighborhood} onChange={e => handleUpdate('address', { neighborhood: e.target.value })}/></div>
                        <div><Label>Cidade</Label><Input value={formData.address.city} onChange={e => handleUpdate('address', { city: e.target.value })}/></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        // SUMMARY VIEW
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg bg-muted/50 border">
                <ValueDisplay label="Paciente" value={formData.patient.name} icon={User} />
                <ValueDisplay label="Data" value={formattedDate} icon={Calendar} />
                <ValueDisplay label="Horário" value={`${formData.shiftType.charAt(0).toUpperCase() + formData.shiftType.slice(1)} (${formData.startTime} - ${formData.endTime})`} icon={Clock} />
                <ValueDisplay label="Valor" value={formData.valueOffered.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={DollarSign} />
                <div className="col-span-1 sm:col-span-2">
                    <ValueDisplay label="Endereço" value={fullAddress} icon={Home} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="notes-summary">Requisitos e Observações</Label>
                <Textarea id="notes-summary" name="notes" placeholder="Nenhuma observação adicional." value={formData.notes} onChange={e => handleUpdate('notes', e.target.value)} />
            </div>
        </div>
    );
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Publicar Nova Vaga</DialogTitle>
              {selectedPatient && (
                <DialogDescription>
                  Revise os detalhes da vaga antes de notificar os profissionais.
                </DialogDescription>
              )}
            </div>
             {!isEditing && selectedPatient && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar Vaga
                </Button>
            )}
          </div>
        </DialogHeader>

        {renderContent()}

        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center w-full pt-4">
           {selectedPatient ? (
            <>
                 <div className="flex items-center space-x-2 self-start sm:self-center">
                    <Switch id="urgent-switch" name="urgent-switch" checked={formData?.isUrgent || false} onCheckedChange={(checked) => handleUpdate('isUrgent', checked)} />
                    <Label htmlFor="urgent-switch" className="font-semibold text-destructive">Marcar como URGENTE</Label>
                </div>
                <div className="flex gap-2 self-end">
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    {isEditing ? (
                        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Salvar Alterações</Button>
                    ): (
                        <Button onClick={handleSubmit}>Publicar Vaga</Button>
                    )}
                </div>
            </>
           ) : (
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
           )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
