
'use client'

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockShiftHistory } from "@/lib/data";
import { TimelineEventItem } from "./timeline-event-item";

export function ProntuarioTimeline({ currentProgress }: { currentProgress: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    Linha do Tempo do Plantão
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6">
                <div className="relative">
                    {/* A barra de progresso animada, posicionada por trás de tudo */}
                    <div className="absolute left-4 top-0 bottom-0 w-2 bg-muted rounded-full">
                         <div
                            className="w-full bg-primary rounded-full"
                            style={{
                                height: `${currentProgress}%`,
                                backgroundImage: 'linear-gradient(110deg, hsl(var(--primary)), 45%, hsl(var(--primary-foreground)), 55%, hsl(var(--primary)))',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s linear infinite',
                                transition: 'height 0.5s ease-in-out',
                            }}
                        />
                    </div>

                     {mockShiftHistory.map((event, index) => {
                        const eventProgress = (index / (mockShiftHistory.length - 1)) * 100;
                        const isComplete = eventProgress <= currentProgress;

                        return (
                            <div key={index} className="grid grid-cols-[auto_1fr] items-start gap-4 mb-8 last:mb-0">
                                {/* O novo componente de evento da timeline */}
                                <TimelineEventItem
                                    icon={event.icon}
                                    isComplete={isComplete}
                                />
                                {/* O conteúdo de texto ao lado */}
                                <div className={cn("pt-1 transition-opacity", !isComplete && "opacity-50")}>
                                     <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm text-foreground">{event.event}</p>
                                        <p className="text-xs text-muted-foreground">{event.time}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">{event.details}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
