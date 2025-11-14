'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import type { Professional } from '@/lib/types';
import { History } from 'lucide-react';

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

export function TeamShiftsTab({ professional }: { professional?: Professional }) {
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
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
            </div>
            
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <History className="w-5 h-5 text-primary" />
                            Histórico Rápido
                        </CardTitle>
                        <CardDescription>Últimos atendimentos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       {professional?.recentAttendances && professional.recentAttendances.length > 0 ? (
                           professional.recentAttendances.map((item, index) => (
                                <div key={index} className="p-3 bg-muted/50 rounded-md border">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm">{item.patientName}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        {item.note}
                                    </p>
                                </div>
                           ))
                       ) : (
                           <p className="text-sm text-muted-foreground text-center py-4">Nenhum atendimento recente.</p>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
