'use client';

import * as React from 'react';
import type { Patient, ShiftReport, Notification, Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, FileText, Bell, AlertTriangle, MessageSquareWarning, ListFilter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"


type FeedEvent = ShiftReport | Notification | Task;
type EventType = 'shiftReport' | 'supply' | 'alert' | 'info' | 'task';

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

const eventIcons: { [key: string]: { icon: React.ElementType, color: string, label: string } } = {
    shiftReport: { icon: FileText, color: 'text-blue-500', label: 'Evoluções' },
    supply: { icon: MessageSquareWarning, color: 'text-orange-500', label: 'Notificações' },
    alert: { icon: AlertTriangle, color: 'text-red-500', label: 'Notificações' },
    info: { icon: Bell, color: 'text-gray-500', label: 'Notificações' },
    task: { icon: Check, color: 'text-purple-500', label: 'Tarefas' },
};


export function ActivityFeed({ events }: { events: FeedEvent[] }) {
  
  const [filters, setFilters] = React.useState<Record<EventType, boolean>>({
    shiftReport: true,
    supply: true,
    alert: true,
    info: true,
    task: true,
  });

  const handleFilterChange = (type: EventType, checked: boolean) => {
    setFilters(prev => ({ ...prev, [type]: checked }));
  };
  
  const activeFilterCount = Object.values(filters).filter(v => !v).length;
  
  const clearFilters = () => {
    setFilters({
      shiftReport: true,
      supply: true,
      alert: true,
      info: true,
      task: true,
    });
  }

  const getEventType = (event: FeedEvent): EventType => {
      if (isShiftReport(event)) return 'shiftReport';
      if (isTask(event)) return 'task';
      if (isNotification(event)) return event.type;
      return 'info';
  }

  const filteredEvents = events.filter(event => {
      const type = getEventType(event);
      return filters[type];
  });


  const EventItem: React.FC<{ event: FeedEvent }> = ({ event }) => {
    let icon, color, title, details, timestamp, author, href;
    const eventType = getEventType(event);
    
    if (isShiftReport(event)) {
      const config = eventIcons.shiftReport;
      icon = config.icon;
      color = config.color;
      title = `Evolução de Plantão (${event.shift})`;
      details = event.observations;
      timestamp = event.reportDate;
      author = event.careTeamMemberName;
      href = `/patients/${event.patientId}`;
    } else if (isNotification(event)) {
      const config = eventIcons[event.type];
      icon = config.icon;
      color = config.color;
      title = 'Notificação do Sistema';
      details = event.message;
      timestamp = event.timestamp;
      author = 'Sistema';
      href = `/communications`;
    } else if (isTask(event)) {
      const config = eventIcons.task;
      icon = config.icon;
      color = config.color;
      title = `Tarefa para ${event.assignee}`;
      details = event.title;
      timestamp = event.dueDate || new Date().toISOString();
      author = 'Sistema';
      href = `/tasks`;
    } else {
        return null;
    }

    const IconComp = icon;

    return (
      <li className="relative flex items-start gap-4 pb-8 group">
          {/* Timeline line */}
          <div className="absolute left-4 top-5 h-full w-px bg-border group-last:hidden" />

          <Link href={href} className="flex-shrink-0 z-10 -m-2 p-2 rounded-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card ring-4 ring-card">
              <IconComp className={cn("h-5 w-5", color)} />
            </div>
          </Link>
          
          <div className="flex-1 min-w-0">
              <Link href={href} className="block hover:bg-accent/50 p-2 -m-2 rounded-md transition-colors">
                  <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">{title}</p>
                      <time className="text-xs text-muted-foreground flex-shrink-0 ml-2">{formatRelativeDate(timestamp)}</time>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{details}</p>
                  <p className="text-xs text-muted-foreground mt-1">Por: {author}</p>
              </Link>
          </div>
      </li>
    );
  };
  
  return (
    <Card className="flex flex-col flex-1 max-h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                 <CardTitle>Feed de Atividades</CardTitle>
                <CardDescription>Últimos acontecimentos dos seus pacientes.</CardDescription>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ListFilter className="mr-2 h-4 w-4" />
                      Filtrar
                      {activeFilterCount > 0 && <span className="ml-2 bg-primary text-primary-foreground h-5 w-5 text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                    <DropdownMenuLabel>Filtrar por tipo de evento</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={filters.shiftReport}
                        onCheckedChange={(checked) => handleFilterChange('shiftReport', !!checked)}
                    >
                       Evoluções
                    </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem
                        checked={filters.task}
                        onCheckedChange={(checked) => handleFilterChange('task', !!checked)}
                    >
                        Tarefas
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={filters.alert || filters.supply || filters.info}
                        onCheckedChange={(checked) => {
                            handleFilterChange('alert', !!checked);
                            handleFilterChange('supply', !!checked);
                            handleFilterChange('info', !!checked);
                        }}
                    >
                        Notificações
                    </DropdownMenuCheckboxItem>
                    {activeFilterCount > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={clearFilters} className="text-destructive">
                          <X className="mr-2 h-4 w-4" />
                          Limpar Filtros
                        </DropdownMenuItem>
                      </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-6 pt-0">
        {filteredEvents.length > 0 ? (
          <ScrollArea className="h-full">
            <ul className="relative pr-4">
            {filteredEvents.map((event, index) => (
                <EventItem key={index} event={event} />
            ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="flex h-full flex-1 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente para os filtros selecionados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
