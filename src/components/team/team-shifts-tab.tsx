'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const mockShifts = [
    { id: 'shift-101', patient: 'João da Silva', date: '2024-07-22', type: 'diurno', value: 150.00, status: 'pago' },
    { id: 'shift-102', patient: 'Maria Lopes', date: '2024-07-20', type: 'noturno', value: 180.00, status: 'pago' },
    { id: 'shift-103', patient: 'João da Silva', date: '2024-07-18', type: 'diurno', value: 150.00, status: 'pago' },
    { id: 'shift-104', patient: 'Jorge Mendes', date: '2024-06-15', type: 'diurno', value: 140.00, status: 'pago' },
];

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    pago: 'secondary',
    pendente: 'default'
}

export function TeamShiftsTab() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
    // Placeholder - in a real app, you'd fetch shifts for the selected date
    const shiftsForDate = [
        { patient: 'João da Silva', time: '08:00 - 20:00', status: 'completed' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de Plantões na Empresa</CardTitle>
                <CardDescription>
                   Lista de todos os plantões realizados, valores e status de pagamento.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Plantão</TableHead>
                            <TableHead className="text-right">Valor (R$)</TableHead>
                            <TableHead className="text-center">Status Pagto.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockShifts.map((shift) => (
                            <TableRow key={shift.id}>
                                <TableCell className="font-medium">{shift.patient}</TableCell>
                                <TableCell>{new Date(shift.date).toLocaleDateString('pt-BR', { timeZone: 'UTC'})}</TableCell>
                                <TableCell className="capitalize">{shift.type}</TableCell>
                                <TableCell className="text-right font-mono">{shift.value.toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={statusVariant[shift.status]}>{shift.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
