'use client'

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Clock, Stethoscope, Syringe, TestTube, User } from "lucide-react";
import { cn } from "@/lib/utils";

const timelineEvents = [
    {
        title: "Início do Plantão",
        time: "08:00",
        professional: "Enf. Carla Nogueira",
        description: "Assumiu o plantão, paciente em bom estado geral.",
        icon: User,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50"
    },
     {
        title: "Administração de Medicação",
        time: "09:00",
        professional: "Enf. Carla Nogueira",
        description: "Administrado Losartana 50mg e Metformina 850mg.",
        icon: Syringe,
        iconColor: "text-purple-500",
        bgColor: "bg-purple-50"
    },
    {
        title: "Consulta Médica",
        time: "11:30",
        professional: "Dr. Roberto Alves",
        description: "Reavaliação de rotina. PA estável. Solicitado novo exame de sangue.",
        icon: Stethoscope,
        iconColor: "text-green-500",
        bgColor: "bg-green-50"
    },
     {
        title: "Coleta para Exame",
        time: "14:00",
        professional: "Lab. Vida & Saúde",
        description: "Coleta de sangue para hemograma completo e glicemia.",
        icon: TestTube,
        iconColor: "text-red-500",
        bgColor: "bg-red-50"
    },
];

export function ProntuarioTimeline() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary"/>
                    Linha do Tempo Recente
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6">
                    {/* Vertical line */}
                    <div className="absolute left-9 top-0 h-full w-0.5 bg-border" />
                    
                    <div className="space-y-6">
                        {timelineEvents.map((event, index) => (
                             <div key={index} className="relative flex gap-4">
                                <div className={cn("absolute left-9 -translate-x-1/2 mt-1 flex h-6 w-6 items-center justify-center rounded-full", event.bgColor)}>
                                    <event.icon className={cn("h-4 w-4", event.iconColor)} />
                                </div>
                                <div className="ml-10 w-full rounded-lg bg-muted/40 p-4">
                                     <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">{event.time}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                    <p className="text-xs text-muted-foreground mt-2">por: {event.professional}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}