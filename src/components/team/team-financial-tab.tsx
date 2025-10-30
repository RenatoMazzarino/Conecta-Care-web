'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Download, Filter } from 'lucide-react';

const mockPayments = [
    { id: 'pay-01', date: '15/07/2024', description: 'Plantão Diurno - João da Silva', value: 150.00, status: 'pago' },
    { id: 'pay-02', date: '16/07/2024', description: 'Plantão Noturno - João da Silva', value: 180.00, status: 'pago' },
    { id: 'pay-03', date: '18/07/2024', description: 'Plantão Diurno - Jorge Mendes', value: 150.00, status: 'pendente' },
    { id: 'pay-04', date: '20/07/2024', description: 'Plantão Diurno - João da Silva', value: 150.00, status: 'pendente' },
];

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    pago: 'secondary',
    pendente: 'default'
}

export function TeamFinancialTab() {
    const totalPendente = mockPayments.filter(p => p.status === 'pendente').reduce((acc, p) => acc + p.value, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                         <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Histórico de Pagamentos</CardTitle>
                                <CardDescription>Registro de todos os pagamentos de plantões.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                 <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filtrar</Button>
                                 <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Exportar</Button>
                            </div>
                         </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockPayments.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.date}</TableCell>
                                        <TableCell>{p.description}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">R$ {p.value.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Resumo Financeiro</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total a Pagar</p>
                            <p className="text-2xl font-bold">R$ {totalPendente.toFixed(2)}</p>
                        </div>
                        <Button className="w-full">Realizar Pagamento</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
