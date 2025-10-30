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
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20 after:left-[19px]">
          {timelineEvents.map((event, index) => (
            <div key={index} className="relative grid grid-cols-[auto_1fr] items-start gap-x-4 pb-8">
              <div className="flex-shrink-0 mt-1">
                 <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center ring-8 ring-background">
                    <event.icon className="w-5 h-5" />
                  </div>
              </div>
              <div className="pt-1">
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <h4 className="font-semibold text-base mt-1">{event.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
