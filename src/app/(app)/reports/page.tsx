import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <>
      <AppHeader title="Relatórios" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios e Análises</CardTitle>
            <CardDescription>Gere relatórios sobre a operação.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Em breve.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
