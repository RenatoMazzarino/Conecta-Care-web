
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Patient } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { User, AlertCircle, Pill, Utensils, Phone, Edit, Save, X, Plus, HeartPulse } from 'lucide-react';
import { deepEqual } from '@/lib/deep-equal';

export default function PatientDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const patientId = params.patientId as string;
  const firestore = useFirestore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedData, setEditedData] = React.useState<Patient | null>(null);

  const patientRef = useMemoFirebase(() => {
    if (!firestore || !patientId) return null;
    return doc(firestore, 'patients', patientId);
  }, [firestore, patientId]);

  const { data: patient, isLoading } = useDoc<Patient>(patientRef);
  
  // Set editedData when patient data is loaded
  React.useEffect(() => {
    if (patient) {
      setEditedData(JSON.parse(JSON.stringify(patient))); // Deep copy
    }
  }, [patient]);


  const handleEdit = () => {
    if (patient) {
      setEditedData(JSON.parse(JSON.stringify(patient))); // Reset to original on re-edit
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(patient ? JSON.parse(JSON.stringify(patient)) : null); // Revert changes
  };

  const handleSave = () => {
    if (!patientRef || !editedData) return;

    setDocumentNonBlocking(patientRef, editedData, { merge: true });
    
    toast({
      title: "Prontuário Salvo",
      description: `As informações de ${editedData.name} foram atualizadas.`,
    });
    setIsEditing(false);
  };
  
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


  const displayData = isEditing ? editedData : patient;
  const isSaveDisabled = patient && editedData ? deepEqual(patient, editedData) : true;

  if (isLoading) {
    return (
        <>
            <AppHeader title="Carregando Prontuário..." />
            <main className="p-6 space-y-6 max-w-7xl mx-auto">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid lg:grid-cols-2 gap-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                 <Skeleton className="h-48 w-full" />
                 <Skeleton className="h-72 w-full" />
                 <Skeleton className="h-48 w-full" />
            </main>
        </>
    );
  }

  if (!displayData) {
    return (
        <>
            <AppHeader title="Paciente não encontrado" />
            <main className="p-6 max-w-7xl mx-auto">
                <Card>
                <CardContent className="p-12 text-center">
                    <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Paciente não encontrado</h2>
                    <p className="text-muted-foreground">O prontuário para este ID de paciente não foi encontrado no banco de dados.</p>
                </CardContent>
                </Card>
            </main>
      </>
    );
  }

  return (
    <>
    <AppHeader title={`Prontuário de ${patient?.name || ''}`} />
    <main className="p-6 space-y-6 max-w-7xl mx-auto">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prontuário do Paciente</h1>
          <p className="text-muted-foreground mt-1">Informações clínicas e dados pessoais</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaveDisabled}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        )}
      </div>
      
       <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Nome Completo</Label>
              {isEditing ? (
                <Input
                  value={editedData?.name || ''}
                  onChange={(e) => setEditedData({ ...editedData!, name: e.target.value })}
                />
              ) : (
                <p className="font-medium mt-1">{displayData.name}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CPF</Label>
                 {isEditing ? (
                  <Input
                    value={editedData?.cpf || ''}
                    onChange={(e) => setEditedData({ ...editedData!, cpf: e.target.value })}
                  />
                ) : (
                  <p className="font-medium mt-1">{displayData.cpf}</p>
                )}
              </div>
              <div>
                <Label>Data de Nascimento</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedData?.dateOfBirth || ''}
                    onChange={(e) => setEditedData({ ...editedData!, dateOfBirth: e.target.value })}
                  />
                ) : (
                  <p className="font-medium mt-1">
                    {displayData.dateOfBirth ? new Date(displayData.dateOfBirth).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '-'}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label>Tipo Sanguíneo</Label>
              {isEditing ? (
                <Select
                  value={editedData?.bloodType || ''}
                  onValueChange={(value) => setEditedData({ ...editedData!, bloodType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                 <p className="font-medium mt-1">
                    {displayData.bloodType ? (
                      <Badge variant={displayData.bloodType.includes('O') || displayData.bloodType.includes('A') ? 'destructive' : 'secondary'}>{displayData.bloodType}</Badge>
                    ) : (
                      <span>-</span>
                    )}
                 </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-primary" />
              Contato de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Nome do Contato</Label>
              {isEditing ? (
                <Input
                  value={editedData?.familyContact.name || ''}
                  onChange={(e) => setEditedData({ ...editedData!, familyContact: { ...editedData!.familyContact, name: e.target.value }})}
                />
              ) : (
                <p className="font-medium mt-1">{displayData.familyContact.name || '-'}</p>
              )}
            </div>
            <div>
              <Label>Telefone</Label>
              {isEditing ? (
                <Input
                  value={editedData?.familyContact.phone || ''}
                  onChange={(e) => setEditedData({ ...editedData!, familyContact: { ...editedData!.familyContact, phone: e.target.value }})}
                  placeholder="+55 11 99999-9999"
                />
              ) : (
                <p className="font-medium mt-1">{displayData.familyContact.phone || '-'}</p>
              )}
            </div>
          </CardContent>
        </Card>
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
                  value={editedData?.allergies?.join(', ') || ''}
                  onChange={(e) => setEditedData({
                    ...editedData!,
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
                  value={editedData?.chronicConditions?.join(', ') || ''}
                  onChange={(e) => setEditedData({
                    ...editedData!,
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
              {editedData?.medications?.map((med, index) => (
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
                        value={med.notes}
                        onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
               {(!editedData?.medications || editedData.medications.length === 0) && (
                <p className="text-muted-foreground text-center py-4">Nenhuma medicação para editar.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayData.medications?.map((med, i) => (
                <div key={i} className="p-4 bg-secondary/30 rounded-lg">
                  <p className="font-semibold text-secondary-foreground">{med.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {med.dosage} &bull; {med.frequency}
                  </p>
                  {med.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{med.notes}</p>
                  )}
                </div>
              ))}
              {(!displayData.medications || displayData.medications.length === 0) && (
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
              value={editedData?.diet || ''}
              onChange={(e) => setEditedData({ ...editedData!, diet: e.target.value })}
              placeholder="Descreva a dieta do paciente"
              rows={4}
            />
          ) : (
            <p className="text-foreground">{displayData.diet || 'Nenhuma dieta específica registrada'}</p>
          )}
        </CardContent>
      </Card>

    </main>
    </>
  );
}

    