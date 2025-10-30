'use client'

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Clock, Stethoscope, Syringe, TestTube, User, Footprints, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockShiftHistory } from "@/lib/data";

export function ProntuarioTimeline({ currentProgress }: { currentProgress: number }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    Linha do Tempo do Último Plantão
                </CardTitle>
            </CardHeader>
            <CardContent className="relative pl-4">
                {/* Progress Bar Background */}
                <div className="absolute left-6 top-0 h-full w-1 bg-muted rounded-full -translate-x-1/2" />
                {/* Progress Bar Fill */}
                <div 
                    className="absolute left-6 top-0 w-1 bg-primary rounded-full -translate-x-1/2 transition-all duration-500" 
                    style={{ height: `${currentProgress}%`}} 
                />
                
                <div className="space-y-8">
                    {mockShiftHistory.map((event, index) => (
                        <div key={index} className="relative flex items-start gap-4">
                            <div className={cn(
                                "absolute left-6 -translate-x-1/2 mt-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-card",
                                index * (100 / (mockShiftHistory.length -1)) <= currentProgress ? 'bg-primary' : 'bg-muted'
                            )}>
                                <event.icon className={cn("h-4 w-4", index * (100 / (mockShiftHistory.length -1)) <= currentProgress ? 'text-primary-foreground' : 'text-muted-foreground')} />
                            </div>
                            <div className={cn("ml-12 w-full transition-opacity", index * (100 / (mockShiftHistory.length -1)) > currentProgress && "opacity-40")}>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-foreground">{event.event}</p>
                                    <p className="text-xs text-muted-foreground">{event.time}</p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
