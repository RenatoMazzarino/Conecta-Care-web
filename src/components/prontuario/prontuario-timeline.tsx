'use client'

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Clock, Stethoscope, Syringe, TestTube, User, Footprints, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockShiftHistory } from "@/lib/data";

export function ProntuarioTimeline() {
    const currentProgress = 50; // Simulation
    const currentEventIndex = Math.floor((mockShiftHistory.length - 1) * (currentProgress / 100));

    return (
        <div className="relative pl-4">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
            
            <div className="space-y-8">
                {mockShiftHistory.map((event, index) => (
                     <div key={index} className="relative flex items-start gap-4">
                        <div className={cn(
                            "absolute left-6 -translate-x-1/2 mt-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background",
                            index <= currentEventIndex ? 'bg-primary' : 'bg-muted'
                        )}>
                            <event.icon className={cn("h-4 w-4", index <= currentEventIndex ? 'text-primary-foreground' : 'text-muted-foreground')} />
                        </div>
                        <div className={cn("ml-12 w-full transition-opacity", index > currentEventIndex && "opacity-40")}>
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-sm text-foreground">{event.event}</p>
                                <p className="text-xs text-muted-foreground">{event.time}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
