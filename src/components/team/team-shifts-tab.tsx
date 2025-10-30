'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export function TeamShiftsTab() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
    // Placeholder - in a real app, you'd fetch shifts for the selected date
    const shiftsForDate = [
        { patient: 'João da Silva', time: '08:00 - 20:00', status: 'completed' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Calendário de Plantões</CardTitle>
                        <CardDescription>Selecione uma data para ver os plantões.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border p-0"
                            // You can add modifiers to highlight days with shifts
                        />
                    </CardContent>
                </Card>
            </div>
             <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Plantões Agendados</CardTitle>
                        <CardDescription>
                           {date ? `Plantões para ${date.toLocaleDateString('pt-BR')}` : 'Nenhuma data selecionada'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-80">
                            <h3 className="text-lg font-semibold">Nenhum plantão nesta data</h3>
                            <p className="text-sm text-muted-foreground mt-2">Selecione outra data no calendário para ver os detalhes.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
