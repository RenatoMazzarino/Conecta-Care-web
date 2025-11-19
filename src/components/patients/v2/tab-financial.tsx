import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Calendar, Bell } from 'lucide-react';

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function TabFinancial({ patient }: { patient: Patient }) {
  const payments = patient.financial.paymentHistory ?? [];

  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" />
            Situação atual
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 text-sm">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Vínculo</p>
            <p className="text-lg font-semibold">{patient.financial.vinculo}</p>
            <p className="text-muted-foreground">{patient.financial.operadora ?? 'Sem operadora'}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Carteirinha</p>
            <p className="text-lg font-semibold">{patient.financial.carteirinha ?? 'Não informado'}</p>
            {patient.financial.validadeCarteirinha && (
              <p className="text-muted-foreground">
                Válida até {new Date(patient.financial.validadeCarteirinha).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Status de cobrança</p>
            <p className="text-lg font-semibold">{patient.financial.billingStatus ?? '—'}</p>
            <p className="text-muted-foreground">
              Último pagamento:{' '}
              {patient.financial.lastPaymentDate
                ? new Date(patient.financial.lastPaymentDate).toLocaleDateString('pt-BR')
                : 'Nunca'}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-muted-foreground">Mensalidade</p>
            <p className="text-lg font-semibold">{formatCurrency(patient.financial.monthlyFee)}</p>
            <p className="text-muted-foreground">Vencimento dia {patient.financial.billingDay}</p>
          </div>
        </CardContent>
        <CardContent className="flex flex-wrap gap-3 border-t pt-4">
          <Button variant="outline" size="sm" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Marcar como pago
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Gerar boleto
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            Enviar lembrete
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Histórico de pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Mês</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Pago em</th>
                <th className="px-4 py-3">Método</th>
              </tr>
            </thead>
            <tbody>
              {payments.length ? (
                payments.map((payment) => (
                  <tr key={payment.month} className="border-t">
                    <td className="px-4 py-3 font-semibold text-foreground">{payment.month}</td>
                    <td className="px-4 py-3">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          payment.status === 'Pago'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : payment.status === 'Pendente'
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-4 py-3">{payment.method ?? '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    Nenhum pagamento registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
