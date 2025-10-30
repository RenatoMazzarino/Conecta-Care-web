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
import { Calendar, Clock, User, Home, DollarSign, Pencil, Save, X } from 'lucide-react';
import type { ShiftDetails, Patient } from '@/lib/types';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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

  React.useEffect(() => {
    if (shiftInfo) {
      const isDiurno = shiftInfo.shiftType === 'diurno';
      setFormData({
        patient: shiftInfo.patient,
        dayKey: shiftInfo.dayKey,
        shiftType: shiftInfo.shiftType,
        startTime: isDiurno ? '08:00' : '20:00',
        endTime: isDiurno ? '20:00' : '08:00',
        title: `Plantão ${shiftInfo.shiftType} - ${shiftInfo.patient.name}`,
        valueOffered: 150, // Default value
        isUrgent: false,
        notes: '',
        address: shiftInfo.patient.address,
      });
      setIsEditing(false); // Reset to summary view when new shift info comes in
    } else {
       setFormData(null);
    }
  }, [shiftInfo]);


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
    // Here you might want to add validation before saving
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

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Publicar Nova Vaga</DialogTitle>
              <DialogDescription>
                Revise os detalhes da vaga antes de notificar os profissionais.
              </DialogDescription>
            </div>
             {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar Vaga
                </Button>
            )}
          </div>
        </DialogHeader>

        {isEditing ? (
            // EDITING VIEW
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Paciente</Label><Input value={formData.patient.name} disabled /></div>
                    <div><Label>Data</Label><Input type="date" value={formData.dayKey} onChange={e => handleUpdate('dayKey', e.target.value)} /></div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Tipo de Plantão</Label>
                        <Select value={formData.shiftType} onValueChange={v => handleUpdate('shiftType', v)}>
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
        ) : (
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
        )}

        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center w-full">
            <div className="flex items-center space-x-2 self-start sm:self-center">
                 <Switch id="urgent-switch" name="urgent-switch" checked={formData.isUrgent} onCheckedChange={(checked) => handleUpdate('isUrgent', checked)} />
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
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
