'use client'

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockShiftHistory } from "@/lib/data";

const statusConfig = {
    ok: {
        icon: 'bg-primary text-primary-foreground',
    },
    pending: {
        icon: 'bg-amber-500 text-white',
    },
    late: {
        icon: 'bg-destructive text-white',
    },
     default: {
        icon: 'bg-muted-foreground text-muted',
    }
}

export function ProntuarioTimeline({ currentProgress }: { currentProgress: number }) {
    const totalEvents = mockShiftHistory.length;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    Linha do Tempo do Plantão
                </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-6">
                {/* Vertical track bar */}
                <div className="absolute left-4 top-6 bottom-6 w-2 bg-muted rounded-full" style={{ transform: 'translateX(-50%)' }}>
                     {/* Progress bar with shimmer */}
                     <div 
                        className="absolute top-0 left-0 w-full bg-primary rounded-full"
                        style={{ 
                            height: `${currentProgress}%`,
                            backgroundImage: 'linear-gradient(110deg, hsl(var(--primary)), 45%, hsl(var(--primary-foreground)), 55%, hsl(var(--primary)))',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s linear infinite',
                         }}
                    />
                </div>

                <div className="relative space-y-8">
                     {mockShiftHistory.map((event, index) => {
                        const eventProgress = (index / (totalEvents -1)) * 100;
                        const isEventActive = eventProgress <= currentProgress;
                        const config = statusConfig[event.status || 'default'];

                        return (
                             <div key={index} className="grid grid-cols-[auto_1fr] items-start gap-4">
                                <div className="flex-shrink-0 z-10">
                                    <div
                                        className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-card transition-all",
                                            isEventActive ? config.icon : 'bg-muted border'
                                        )}
                                    >
                                        <event.icon className="h-4 w-4" />
                                    </div>
                                </div>
                                
                                <div className={cn("pt-1 transition-opacity", !isEventActive && "opacity-50")}>
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
