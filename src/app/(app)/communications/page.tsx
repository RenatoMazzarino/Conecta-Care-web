import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunicationsPage() {
  return (
    <>
      <AppHeader title="Comunicações" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Central de Comunicações</CardTitle>
            <CardDescription>Todas as mensagens, alertas e notificações em um só lugar.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Em breve.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
