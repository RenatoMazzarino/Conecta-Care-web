'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, UserPlus, Star } from 'lucide-react';

const patients = [
  { id: 1, name: 'Srª. Maria Lopes' },
  { id: 2, name: 'Sr. Jorge Mendes' },
  { id: 3, name: 'Sra. Ana Costa' },
];

const shifts = {
  '1-2024-10-06': [
    { professional: 'Carla Nogueira', initials: 'CN', color: 'bg-cyan-500', shift: 'day' },
    null, // night shift is open
  ],
  '1-2024-10-07': [
    { professional: 'Fábio Bastos', initials: 'FB', color: 'bg-green-500', shift: 'day' },
    { professional: 'Diogo Lima', initials: 'DL', color: 'bg-orange-400', shift: 'night' },
  ],
  '2-2024-10-09': [
    null, // day shift is open
    { professional: 'Diana Magalhães', initials: 'DM', color: 'bg-pink-500', shift: 'night' },
  ],
};

const days = ['Segunda, 06', 'Terça, 07', 'Quarta, 08', 'Quinta, 09', 'Sexta, 10'];
const dayKeys = ['2024-10-06', '2024-10-07', '2024-10-08', '2024-10-09', '2024-10-10'];

const ShiftCard = ({ professional, initials, color }) => (
  <div className="flex items-center gap-2 p-2 rounded-lg bg-card border cursor-pointer hover:bg-accent">
    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${color} text-white font-bold text-sm`}>
      {initials}
    </div>
    <span className="text-sm font-medium truncate">{professional}</span>
  </div>
);

const OpenShiftCard = ({ shiftType, urgent = false }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg border-2 border-dashed cursor-pointer hover:bg-accent ${urgent ? 'border-destructive text-destructive' : 'border-muted-foreground'}`}>
    {urgent ? (
       <UserPlus className="h-5 w-5 text-destructive" />
    ) : (
      <Plus className="h-5 w-5 text-muted-foreground" />
    )}
    <span className={`text-sm font-semibold ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>{urgent ? 'URGENTE' : ''} Preencher {shiftType}</span>
  </div>
);


const ShiftScaleView = () => (
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
                      {dayShift ? <ShiftCard {...dayShift} /> : <OpenShiftCard shiftType="diurno" urgent={patient.id === 2 && dayKey === '2024-10-09'} />}
                      {nightShift ? <ShiftCard {...nightShift} /> : <OpenShiftCard shiftType="noturno" />}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ShiftMonitoringView = () => (
  <div className="p-4 sm:p-6">
    <Card>
      <CardHeader>
        <CardTitle>Monitoramento em Tempo Real</CardTitle>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Em breve.</p>
        </CardContent>
      </CardHeader>
    </Card>
  </div>
);

export function ShiftManagement() {
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
         <Button>
            <Plus className="mr-2 h-4 w-4" />
            Publicar Nova Vaga
         </Button>
       </div>
    </div>
  );
}
