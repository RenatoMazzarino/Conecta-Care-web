
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { ArrowDown, ArrowUp, DollarSign, FileWarning, Wallet } from 'lucide-react';
import { mockTransactions, mockMonthlyRevenue } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const paidRevenue = mockTransactions.filter((t) => t.status === 'paid');
const pendingRevenueTx = mockTransactions.filter((t) => t.status === 'pending' || t.status === 'overdue');
const totalRevenue = paidRevenue.reduce((acc, t) => acc + t.amount, 0);
const pendingRevenue = pendingRevenueTx.reduce((acc, t) => acc + t.amount, 0);
const totalExpenses = 0;

const balance = totalRevenue - totalExpenses;

const chartConfig = {
  revenue: {
    label: 'Faturamento',
    color: 'hsl(var(--chart-1))',
  },
};

const statusVariants: Record<string, 'secondary' | 'default' | 'destructive'> = {
  paid: 'secondary',
  pending: 'default',
  overdue: 'destructive',
  cancelled: 'destructive',
};


export default function FinancialPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <p className="text-xs text-muted-foreground">+12.5% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">Balanço de receitas e despesas</p>
          </CardContent>
        </Card>
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas em Aberto</CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">Total de faturas pendentes e atrasadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Faturamento</CardTitle>
            <CardDescription>Faturamento dos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={mockMonthlyRevenue}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                  <YAxis
                  tickFormatter={(value) => `R$${Number(value) / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

          <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Últimas receitas e despesas registradas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.slice(0, 5).map((t, index) => (
                  <TableRow key={`${t.id}-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {t.status === 'paid' ? (
                          <ArrowDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-amber-500" />
                        )}
                        <span className="capitalize">{t.provider}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{t.patientId ?? '—'}</div>
                      <div className="text-sm text-muted-foreground hidden md:inline">
                        {t.metadata?.description ?? 'Transação'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[t.status] ?? 'default'} className="capitalize">
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString('pt-BR')
                        : t.paidAt
                          ? new Date(t.paidAt).toLocaleDateString('pt-BR')
                          : '—'}
                    </TableCell>
                    <TableCell className={cn('text-right font-medium', t.status === 'paid' ? 'text-green-600' : 'text-amber-700')}>
                      {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
