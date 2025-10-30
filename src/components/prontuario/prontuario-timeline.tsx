'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Stethoscope, Syringe, TestTube, FileText, Anchor } from 'lucide-react';

const timelineEvents = [
  {
    date: '20/07/2024',
    title: 'Consulta com Cardiologista',
    description: 'Dr. Fábio Bastos. ECG realizado, medicação ajustada.',
    icon: Stethoscope
  },
  {
    date: '15/07/2024',
    title: 'Exame de Sangue de Rotina',
    description: 'Coleta realizada em casa pela manhã. Resultados pendentes.',
    icon: TestTube
  },
  {
    date: '02/07/2024',
    title: 'Início do novo antibiótico',
    description: 'Iniciado tratamento com Amoxicilina 500mg, 8/8h por 7 dias.',
    icon: Syringe
  },
  {
    date: '28/06/2024',
    title: 'Avaliação Fisioterápica',
    description: 'Sessão com Dra. Carla Nogueira. Exercícios de fortalecimento.',
    icon: Anchor
  },
  {
    date: '10/06/2024',
    title: 'Laudo de Internação',
    description: 'Documento da última internação anexado ao prontuário.',
    icon: FileText
  }
];

export function ProntuarioTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Timeline Clínica
        </CardTitle>
        <CardDescription>Histórico de eventos importantes do paciente.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20 after:left-0">
          {timelineEvents.map((event, index) => (
            <div key={index} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 mb-6">
              <div className="flex items-center justify-center">
                 <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center ring-8 ring-background">
                    <event.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{event.date}</p>
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-muted-foreground text-sm">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
