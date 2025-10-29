import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SchedulePage() {
  return (
    <>
      <AppHeader title="Agenda" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Atendimentos</CardTitle>
            <CardDescription>Visualize e gerencie os agendamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Em breve.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
