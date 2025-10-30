
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Entrar
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { error: null });
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Login',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <HeartPulse className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao CareSync</CardTitle>
          <CardDescription>Insira suas credenciais para acessar o sistema.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
             <p className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
