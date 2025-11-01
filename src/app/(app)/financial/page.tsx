
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { ArrowDown, ArrowUp, DollarSign, FileWarning, Wallet } from 'lucide-react';
import { mockTransactions, mockMonthlyRevenue } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const totalRevenue = mockTransactions
  .filter(t => t.type === 'receita' && t.data.status === 'Paga')
  .reduce((acc, t) => acc + t.data.amount, 0);

const totalExpenses = mockTransactions
  .filter(t => t.type === 'despesa' && t.data.status === 'Paga')
  .reduce((acc, t) => acc + t.data.amount, 0);
  
const pendingRevenue = mockTransactions
    .filter(t => t.type === 'receita' && (t.data.status === 'Pendente' || t.data.status === 'Atrasada'))
    .reduce((acc, t) => acc + t.data.amount, 0);

const balance = totalRevenue - totalExpenses;

const chartConfig = {
  revenue: {
    label: 'Faturamento',
    color: 'hsl(var(--chart-1))',
  },
};

const statusVariants = {
  Paga: 'secondary',
  Pendente: 'default',
  Atrasada: 'destructive',
} as const;


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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.slice(0, 5).map((t, index) => (
                    <TableRow key={`${t.type}-${t.data.id}-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {t.type === 'receita' ? <ArrowDown className="h-4 w-4 text-green-500"/> : <ArrowUp className="h-4 w-4 text-red-500"/>}
                        <span className="capitalize">{t.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{t.type === 'receita' ? t.data.patientName : t.data.professionalName}</div>
                        <div className="text-sm text-muted-foreground hidden md:inline">{t.type === 'despesa' ? t.data.description : `Fatura ref. ${new Date(t.data.issueDate).toLocaleDateString('pt-BR', { month: 'long' })}`}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[t.data.status as keyof typeof statusVariants] || 'default'}>{t.data.status}</Badge>
                    </TableCell>
                      <TableCell className={cn("text-right font-medium", t.type === 'receita' ? 'text-green-600' : 'text-red-600')}>
                      {t.data.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
