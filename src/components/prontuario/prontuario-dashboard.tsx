'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Stethoscope, Dumbbell, Apple, Pill } from 'lucide-react';
import { ProntuarioTimeline } from './prontuario-timeline';

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
    { title: "Resumo Médico", icon: Stethoscope, content: "Paciente estável, seguindo plano terapêutico. Pressão arterial controlada.", color: "text-blue-600" },
    { title: "Resumo de Fisioterapia", icon: Dumbbell, content: "Apresenta melhora na mobilidade. Segue com exercícios de fortalecimento.", color: "text-orange-600" },
    { title: "Resumo de Nutrição", icon: Apple, content: "Dieta com boa aceitação. Manter restrição de sódio. Acompanhar hidratação.", color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/30">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Pill className="w-5 h-5 text-primary" />
                  Medicações em Uso
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <div className="col-span-2">
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
                      <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                        <p className="font-semibold text-secondary-foreground">{med.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {med.dosage} &bull; {med.frequency}
                        </p>
                        {med.notes && (
                          <p className="text-xs text-muted-foreground mt-2 italic">"{med.notes}"</p>
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
          <ProntuarioTimeline currentProgress={50} />
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="flex flex-col">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                  Resumos da Equipe
              </CardTitle>
              <CardDescription>
                  Visão geral das últimas atualizações da equipe multidisciplinar.
              </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
              {summaryCards.map((card, index) => (
                  <div key={index} className="p-3 border-l-4 rounded-r-md" style={{ borderColor: `var(--chart-${index + 1})`}}>
                      <div className={`flex items-center gap-2 text-md font-semibold ${card.color}`}>
                          <card.icon className="w-5 h-5" />
                          {card.title}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{card.content}</p>
                  </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
