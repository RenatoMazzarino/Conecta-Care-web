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
                <div className="flex gap-4">
                    {/* Vertical Progress Bar */}
                    <div className="relative w-10 flex-shrink-0 flex justify-center">
                        <div className="w-2 h-full bg-muted rounded-full">
                            <div 
                                className="w-full bg-primary rounded-full animate-pulse"
                                style={{ height: `${currentProgress}%` }}
                            />
                        </div>
                         {/* Event Icons inside the bar */}
                        {mockShiftHistory.map((event, index) => {
                            const eventProgress = (index / (totalEvents -1)) * 100;
                            const isEventActive = eventProgress <= currentProgress;
                            const config = statusConfig[event.status || 'default'];

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-card transition-all",
                                        isEventActive ? config.icon : 'bg-muted border'
                                    )}
                                    style={{ top: `calc(${eventProgress}% - 16px)` }}
                                >
                                    <event.icon className="h-4 w-4" />
                                </div>
                            )
                        })}
                    </div>
                    {/* Event Details */}
                    <div className="flex-1 relative">
                         {mockShiftHistory.map((event, index) => {
                            const eventProgress = (index / (totalEvents - 1)) * 100;
                            const isEventActive = eventProgress <= currentProgress;
                            return (
                                <div 
                                    key={index} 
                                    className={cn(
                                        "absolute w-full -translate-y-1/2 pl-4 transition-opacity",
                                        !isEventActive && "opacity-40"
                                    )}
                                    style={{ top: `${eventProgress}%` }}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm text-foreground">{event.event}</p>
                                        <p className="text-xs text-muted-foreground">{event.time}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* Empty div to create space for the timeline content */}
                <div style={{ height: `${(totalEvents - 1) * 80}px` }}></div>
            </CardContent>
        </Card>
    )
}
