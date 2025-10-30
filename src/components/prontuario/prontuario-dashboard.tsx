'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Pill, Utensils, Plus, X, Stethoscope, Dumbbell, Apple } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type ProntuarioDashboardProps = {
    isEditing: boolean;
    editedData: Patient | null;
    setEditedData: (data: Patient | null) => void;
};

export function ProntuarioDashboard({ isEditing, editedData, setEditedData }: ProntuarioDashboardProps) {

   const addMedication = () => {
    if (!editedData) return;
    const newMeds = [...(editedData.medications || []), { name: '', dosage: '', frequency: '', notes: '' }];
    setEditedData({ ...editedData, medications: newMeds });
  };

  const removeMedication = (index: number) => {
    if (!editedData) return;
    const newMeds = editedData.medications.filter((_, i) => i !== index);
    setEditedData({ ...editedData, medications: newMeds });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    if (!editedData) return;
    const newMeds = [...editedData.medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setEditedData({ ...editedData, medications: newMeds });
  };

  const displayData = editedData;

  if (!displayData) return null;

  const summaryCards = [
    { title: "Resumo Médico", icon: Stethoscope, content: "Paciente estável, seguindo plano terapêutico. Pressão arterial controlada com medicação. Reavaliação em 30 dias.", color: "text-blue-600" },
    { title: "Resumo de Fisioterapia", icon: Dumbbell, content: "Realizando exercícios de fortalecimento para membros inferiores. Apresenta melhora na mobilidade.", color: "text-orange-600" },
    { title: "Resumo de Nutrição", icon: Apple, content: "Dieta com boa aceitação. Manter restrição de sódio e açúcar. Acompanhar hidratação.", color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
            <Card key={index} className="flex flex-col">
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-lg ${card.color}`}>
                        <card.icon className="w-5 h-5" />
                        {card.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{card.content}</p>
                </CardContent>
            </Card>
        ))}
      </div>


       <Card>
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Alergias e Condições Crônicas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Alergias</Label>
              {isEditing ? (
                <Textarea
                  value={displayData.allergies?.join(', ') || ''}
                  onChange={(e) => setEditedData({
                    ...displayData,
                    allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Separe por vírgula"
                  className="mt-1"
                />
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {displayData.allergies?.length > 0 ? (
                    displayData.allergies.map((allergy, i) => (
                      <Badge key={i} variant="destructive">{allergy}</Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhuma alergia registrada</p>
                  )}
                </div>
              )}
            </div>
            <div>
              <Label>Condições Crônicas</Label>
              {isEditing ? (
                <Textarea
                  value={displayData.chronicConditions?.join(', ') || ''}
                  onChange={(e) => setEditedData({
                    ...displayData,
                    chronicConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Separe por vírgula"
                  className="mt-1"
                />
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {displayData.chronicConditions?.length > 0 ? (
                    displayData.chronicConditions.map((condition, i) => (
                      <Badge key={i} variant="secondary">{condition}</Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhuma condição registrada</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-muted/30">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="w-5 h-5 text-primary" />
              Medicações
            </CardTitle>
            {isEditing && (
              <Button onClick={addMedication} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              {displayData.medications?.map((med, index) => (
                <Card key={index} className="p-4 bg-background">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Medicação {index + 1}</h4>
                    <Button
                      onClick={() => removeMedication(index)}
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Dosagem</Label>
                      <Input
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Frequência</Label>
                      <Input
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <Label>Observações</Label>
                      <Input
                        value={med.notes || ''}
                        onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
               {(!displayData.medications || displayData.medications.length === 0) && (
                <p className="text-muted-foreground text-center py-4">Nenhuma medicação para editar.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayData.medications?.length > 0 ? (
                displayData.medications.map((med, i) => (
                  <div key={i} className="p-4 bg-secondary/30 rounded-lg">
                    <p className="font-semibold text-secondary-foreground">{med.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {med.dosage} &bull; {med.frequency}
                    </p>
                    {med.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{med.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                 <p className="text-muted-foreground text-center py-4">Nenhuma medicação cadastrada</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Utensils className="w-5 h-5 text-primary" />
            Dieta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isEditing ? (
            <Textarea
              value={displayData.diet || ''}
              onChange={(e) => setEditedData({ ...displayData, diet: e.target.value })}
              placeholder="Descreva a dieta do paciente"
              rows={4}
            />
          ) : (
            <p className="text-foreground">{displayData.diet || 'Nenhuma dieta específica registrada'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
