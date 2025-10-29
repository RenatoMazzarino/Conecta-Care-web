import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamPage() {
  return (
    <>
      <AppHeader title="Equipe" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento da Equipe</CardTitle>
            <CardDescription>Adicione e gerencie os membros da equipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Em breve.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
