'use client';

import * as React from 'react';
import type { Patient, ShiftReport, Notification, Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, FileText, Bell, AlertTriangle, MessageSquareWarning } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type FeedEvent = ShiftReport | Notification | Task;

function isShiftReport(event: FeedEvent): event is ShiftReport {
  return 'observations' in event;
}

function isNotification(event: FeedEvent): event is Notification {
  return 'type' in event;
}

function isTask(event: FeedEvent): event is Task {
  return 'priority' in event;
}

function formatRelativeDate(dateString: string | undefined) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInDays === 1) return 'Ontem';
    return `${diffInDays}d atrás`;
}

const eventIcons: { [key: string]: { icon: React.ElementType, color: string } } = {
    shiftReport: { icon: FileText, color: 'text-blue-500' },
    supply: { icon: MessageSquareWarning, color: 'text-orange-500' },
    alert: { icon: AlertTriangle, color: 'text-red-500' },
    info: { icon: Bell, color: 'text-gray-500' },
    task: { icon: Check, color: 'text-purple-500' },
};


export function ActivityFeed({ events, patient }: { events: FeedEvent[], patient: Patient }) {
  
  const EventItem: React.FC<{ event: FeedEvent }> = ({ event }) => {
    let icon, color, title, details, timestamp, author;
    
    if (isShiftReport(event)) {
      const config = eventIcons.shiftReport;
      icon = config.icon;
      color = config.color;
      title = `Relatório de Plantão (${event.shift})`;
      details = event.observations;
      timestamp = event.reportDate;
      author = event.careTeamMemberName;
    } else if (isNotification(event)) {
      const config = eventIcons[event.type];
      icon = config.icon;
      color = config.color;
      title = 'Notificação do Sistema';
      details = event.message;
      timestamp = event.timestamp;
      author = 'Sistema';
    } else if (isTask(event)) {
      const config = eventIcons.task;
      icon = config.icon;
      color = config.color;
      title = `Tarefa para ${event.assignee}`;
      details = event.title;
      timestamp = event.dueDate || new Date().toISOString();
      author = 'Sistema';
    } else {
        return null;
    }

    const IconComp = icon;

    return (
      <li className="relative flex items-start gap-4 pb-8 last:pb-0">
        <div className="absolute left-4 top-1 h-full w-px bg-border" />
        <div className="relative flex-shrink-0">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-background ring-4 ring-card z-10">
            <IconComp className={cn("h-5 w-5", color)} />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{title}</p>
            <time className="text-xs text-muted-foreground">{formatRelativeDate(timestamp)}</time>
          </div>
          <p className="text-sm text-muted-foreground">{details}</p>
          <p className="text-xs text-muted-foreground">Por: {author}</p>
        </div>
      </li>
    );
  };
  
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                 <CardTitle>Feed de Atividades - {patient.name}</CardTitle>
                <CardDescription>Últimos acontecimentos do paciente.</CardDescription>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" size="sm">Filtrar</Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Filtros em breve</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-6 pt-0">
        {events.length > 0 ? (
          <ScrollArea className="h-full">
            <ul className="relative">
            {events.map((event, index) => (
                <EventItem key={index} event={event} />
            ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente para este paciente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
