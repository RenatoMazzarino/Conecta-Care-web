'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, UserPlus, Clock, CheckCircle, XCircle, Video, MessageCircle, History } from 'lucide-react';
import type { Professional, Shift } from '@/lib/types';
import { professionals } from '@/lib/data';
import { ProfessionalProfileDialog } from './professional-profile-dialog';
import { PublishVacancyDialog } from './publish-vacancy-dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

type Patient = {
  id: number;
  name: string;
};

type OpenShiftInfo = {
  patient: Patient;
  dayKey: string;
  shiftType: 'diurno' | 'noturno';
};

const patients: Patient[] = [
  { id: 1, name: 'Srª. Maria Lopes' },
  { id: 2, name: 'Sr. Jorge Mendes' },
  { id: 3, name: 'Sra. Ana Costa' },
];

const shifts: Record<string, (Shift | null)[]> = {
  '1-2024-10-06': [
    { professional: professionals.find(p => p.id === 'prof-1')!, shiftType: 'day' },
    null, // night shift is open
  ],
  '1-2024-10-07': [
    { professional: professionals.find(p => p.id === 'prof-2')!, shiftType: 'day' },
    { professional: professionals.find(p => p.id === 'prof-3')!, shiftType: 'night' },
  ],
  '2-2024-10-09': [
    null, // day shift is open
    { professional: professionals.find(p => p.id === 'prof-4')!, shiftType: 'night' },
  ],
   '3-2024-10-08': [
    { professional: professionals.find(p => p.id === 'prof-2')!, shiftType: 'day' },
    { professional: professionals.find(p => p.id === 'prof-1')!, shiftType: 'night' },
  ],
};

const days = ['Segunda, 06', 'Terça, 07', 'Quarta, 08', 'Quinta, 09', 'Sexta, 10'];
const dayKeys = ['2024-10-06', '2024-10-07', '2024-10-08', '2024-10-09', '2024-10-10'];

const ShiftCard = ({ professional, onClick }: { professional: Professional, onClick: () => void }) => (
  <div onClick={onClick} className="flex items-center gap-2 p-2 rounded-lg bg-card border cursor-pointer hover:bg-accent">
    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${professional.avatarColor} text-white font-bold text-sm`}>
      {professional.initials}
    </div>
    <span className="text-sm font-medium truncate">{professional.name}</span>
  </div>
);

const OpenShiftCard = ({ shiftType, urgent = false, onClick }: { shiftType: string, urgent?: boolean, onClick: () => void }) => (
  <div onClick={onClick} className={`flex items-center gap-2 p-2 rounded-lg border-2 border-dashed cursor-pointer hover:bg-accent ${urgent ? 'border-destructive text-destructive' : 'border-muted-foreground'}`}>
    {urgent ? (
       <UserPlus className="h-5 w-5 text-destructive" />
    ) : (
      <Plus className="h-5 w-5 text-muted-foreground" />
    )}
    <span className={`text-sm font-semibold ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>{urgent ? 'URGENTE' : ''} Preencher {shiftType}</span>
  </div>
);


const ShiftScaleView = () => {
  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null);
  const [openShiftInfo, setOpenShiftInfo] = React.useState<OpenShiftInfo | null>(null);

  const handleOpenProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
  };

  const handleCloseProfile = () => {
    setSelectedProfessional(null);
  };

  const handleOpenVacancy = (patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno') => {
    setOpenShiftInfo({ patient, dayKey, shiftType });
  };
  
  const handleCloseVacancy = () => {
    setOpenShiftInfo(null);
  };

  return (
    <div className="p-4 sm:p-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-600">Vagas em Aberto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">17</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Plantões Ocupados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">352</div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center gap-2 rounded-lg border bg-card text-card-foreground shadow-sm">
              <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-lg font-semibold">Outubro, 2024</div>
              <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
              </Button>
          </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="w-64 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Paciente
              </th>
              {days.map(day => (
                <th key={day} scope="col" className="min-w-64 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{patient.name}</div>
                </td>
                {dayKeys.map(dayKey => {
                  const dayShifts = shifts[`${patient.id}-${dayKey}`] || [null, null];
                  const dayShift = dayShifts[0];
                  const nightShift = dayShifts[1];
                  return (
                    <td key={dayKey} className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        {dayShift ? <ShiftCard professional={dayShift.professional} onClick={() => handleOpenProfile(dayShift.professional)} /> : <OpenShiftCard shiftType="diurno" urgent={patient.id === 2 && dayKey === '2024-10-09'} onClick={() => handleOpenVacancy(patient, dayKey, 'diurno')} />}
                        {nightShift ? <ShiftCard professional={nightShift.professional} onClick={() => handleOpenProfile(nightShift.professional)} /> : <OpenShiftCard shiftType="noturno" onClick={() => handleOpenVacancy(patient, dayKey, 'noturno')} />}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProfessional && (
        <ProfessionalProfileDialog 
          professional={selectedProfessional}
          isOpen={!!selectedProfessional}
          onOpenChange={handleCloseProfile}
        />
      )}
      {openShiftInfo && (
        <PublishVacancyDialog
          shiftInfo={openShiftInfo}
          isOpen={!!openShiftInfo}
          onOpenChange={handleCloseVacancy}
        />
      )}
    </div>
  );
}

const activeShifts = [
    {
        patientName: "Srª. Maria Lopes",
        professional: professionals[0],
        shift: "DIURNO 12H",
        progress: 45,
        checkIn: "08:02",
        checkOut: null,
        status: "Sem Intercorrências",
        statusColor: "text-green-600"
    },
    {
        patientName: "Sr. Jorge Mendes",
        professional: professionals[2],
        shift: "NOTURNO 12H",
        progress: 80,
        checkIn: "20:00",
        checkOut: null,
        status: "Aguardando Confirmação de Presença",
        statusColor: "text-amber-600"
    },
     {
        patientName: "Sra. Ana Costa",
        professional: professionals[1],
        shift: "DIURNO 12H",
        progress: 15,
        checkIn: null,
        checkOut: null,
        status: "Atrasado",
        statusColor: "text-destructive"
    }
]

const ShiftMonitoringView = () => (
  <div className="p-4 sm:p-6 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Monitoramento em Tempo Real</CardTitle>
        <CardDescription>Acompanhe os plantões em andamento.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {activeShifts.map((shift, index) => (
            <Card key={index} className="bg-muted/30">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                    <div className="flex items-center gap-4">
                        <Avatar className={`h-12 w-12 text-xl font-bold ${shift.professional.avatarColor}`}>
                            <AvatarFallback className="bg-transparent text-white">{shift.professional.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{shift.patientName}</p>
                            <p className="text-sm text-muted-foreground">{shift.professional.name} - {shift.shift}</p>
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progresso do Plantão</span>
                            <span>{shift.progress}%</span>
                        </div>
                        <Progress value={shift.progress} className="h-2" />
                    </div>

                    <div className="flex justify-around items-center text-sm">
                        <div className="flex items-center gap-2">
                           <CheckCircle className={`h-5 w-5 ${shift.checkIn ? 'text-green-500' : 'text-muted-foreground/50'}`} />
                           <span>{shift.checkIn || '--:--'}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <XCircle className={`h-5 w-5 ${shift.checkOut ? 'text-red-500' : 'text-muted-foreground/50'}`} />
                           <span>{shift.checkOut || '--:--'}</span>
                        </div>
                    </div>

                    <div className="text-sm">
                        <p className="font-semibold">Status Atual:</p>
                        <p className={shift.statusColor}>{shift.status}</p>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon"><Video className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon"><MessageCircle className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon"><History className="h-4 w-4" /></Button>
                    </div>

                </CardContent>
            </Card>
        ))}
      </CardContent>
    </Card>
  </div>
);

export function ShiftManagement() {
  const [isPublishVacancyOpen, setIsPublishVacancyOpen] = React.useState(false);
  return (
    <div className="flex-1 flex flex-col">
       <div className="flex justify-between items-center p-4 sm:p-6 border-b">
         <div className="flex-1">
            <Tabs defaultValue="scale" className="w-full">
            <TabsList>
                <TabsTrigger value="scale">Gestão de Escala</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoramento em Tempo Real</TabsTrigger>
            </TabsList>
            <TabsContent value="scale">
                <ShiftScaleView />
            </TabsContent>
            <TabsContent value="monitoring">
                <ShiftMonitoringView />
            </TabsContent>
            </Tabs>
        </div>
         <Button onClick={() => setIsPublishVacancyOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Publicar Nova Vaga
         </Button>
       </div>
       <PublishVacancyDialog
          isOpen={isPublishVacancyOpen}
          onOpenChange={setIsPublishVacancyOpen}
        />
    </div>
  );
}
