import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FinancialPage() {
  return (
    <>
      <AppHeader title="Financeiro" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Controle Financeiro</CardTitle>
            <CardDescription>Acompanhe o faturamento e as despesas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Em breve.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
