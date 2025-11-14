'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Props = {
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: React.Dispatch<React.SetStateAction<Patient | null>>;
  isEditing: boolean;
};

const bondOptions: Patient['financial']['vinculo'][] = [
  'Plano de Saúde',
  'Particular',
  'Convênio',
  'Público',
];

const paymentMethods = ['Boleto', 'Pix', 'Cartão', 'Débito automático', 'Depósito'];

export function FichaFinanceira({
  displayData,
  editedData,
  setEditedData,
  isEditing,
}: Props) {
  if (!displayData || !editedData) return null;

  const financial = editedData.financial ?? displayData.financial;

  const handleChange = (field: keyof Patient['financial'], value: string | number) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.financial = {
        vinculo: next.financial?.vinculo ?? 'Particular',
        monthlyFee: next.financial?.monthlyFee ?? 0,
        billingDay: next.financial?.billingDay ?? 1,
        ...next.financial,
      };
      (next.financial as any)[field] = value;
      return next;
    });
  };

  const readValue = (value: React.ReactNode, fallback = '-') =>
    value && value !== '' ? value : fallback;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informações Financeiras</CardTitle>
        <CardDescription>Dados usados para faturamento e cobranças.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Vínculo</Label>
            {isEditing ? (
              <Select
                value={financial.vinculo}
                onValueChange={(v) => handleChange('vinculo', v as Patient['financial']['vinculo'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o vínculo" />
                </SelectTrigger>
                <SelectContent>
                  {bondOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{financial.vinculo}</p>
            )}
          </div>
          <div>
            <Label>Operadora / Plano</Label>
            {isEditing ? (
              <Input
                value={financial.operadora ?? ''}
                onChange={(e) => handleChange('operadora', e.target.value)}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {readValue(financial.operadora)}
              </p>
            )}
          </div>
          <div>
            <Label>Carteirinha</Label>
            {isEditing ? (
              <Input
                value={financial.carteirinha ?? ''}
                onChange={(e) => handleChange('carteirinha', e.target.value)}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {readValue(financial.carteirinha)}
              </p>
            )}
          </div>
          <div>
            <Label>Validade da carteirinha</Label>
            {isEditing ? (
              <Input
                type="month"
                value={financial.validadeCarteirinha ?? ''}
                onChange={(e) => handleChange('validadeCarteirinha', e.target.value)}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {readValue(
                  financial.validadeCarteirinha
                    ? new Date(financial.validadeCarteirinha).toLocaleDateString('pt-BR')
                    : ''
                )}
              </p>
            )}
          </div>
          <div>
            <Label>Mensalidade</Label>
            {isEditing ? (
              <Input
                type="number"
                min={0}
                value={financial.monthlyFee ?? 0}
                onChange={(e) => handleChange('monthlyFee', Number(e.target.value))}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {financial.monthlyFee?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            )}
          </div>
          <div>
            <Label>Dia de vencimento</Label>
            {isEditing ? (
              <Input
                type="number"
                min={1}
                max={31}
                value={financial.billingDay ?? 1}
                onChange={(e) => handleChange('billingDay', Number(e.target.value))}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{financial.billingDay}</p>
            )}
          </div>
          <div>
            <Label>Forma de pagamento</Label>
            {isEditing ? (
              <Select
                value={financial.formaPagamento ?? ''}
                onValueChange={(v) => handleChange('formaPagamento', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {readValue(financial.formaPagamento)}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Observações</Label>
          {isEditing ? (
            <Textarea
              rows={4}
              value={financial.observacoesFinanceiras ?? ''}
              onChange={(e) => handleChange('observacoesFinanceiras', e.target.value)}
            />
          ) : (
            <p className={cn('text-sm text-muted-foreground mt-1')}>
              {readValue(financial.observacoesFinanceiras, 'Sem observações.')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
