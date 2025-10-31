
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { signupAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initializeFirebase } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { resolveAuthErrorMessage } from '@/lib/auth-errors';

function SubmitButton({ pending }: { pending?: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Criar Conta
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, { error: null, success: false });
  const { toast } = useToast();
  const [isEmailLoading, setIsEmailLoading] = React.useState(false);
  const user = useUser();

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Erro no Cadastro',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const router = useRouter();

  React.useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state.success, router]);

  React.useEffect(() => {
    if (isEmailLoading && (state.error || state.success)) {
        setIsEmailLoading(false);
    }
  }, [isEmailLoading, state.error, state.success]);

  React.useEffect(() => {
    if (!user || !isEmailLoading) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const idToken = await user.getIdToken();
        if (cancelled) {
          return;
        }
        const formData = new FormData();
        formData.append('idToken', idToken);
        React.startTransition(() => {
            formAction(formData);
        });
      } catch (error) {
        console.error('Erro ao obter ID token para cadastro', error);
        toast({
          variant: 'destructive',
          title: 'Erro no Cadastro',
          description: resolveAuthErrorMessage(error),
        });
        setIsEmailLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, isEmailLoading, formAction, toast]);
  
  const isLoading = isPending || isEmailLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center mb-4">
             <HeartPulse className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Crie sua conta</CardTitle>
          <CardDescription>Forneça seus dados para começar.</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => {
            e.preventDefault();
            if (isLoading) {
              return;
            }
            const form = e.currentTarget as HTMLFormElement;
            const fd = new FormData(form);
            const email = fd.get('email') as string;
            const password = fd.get('password') as string;
            const confirmPassword = fd.get('confirmPassword') as string;

            if (!email || !password || !confirmPassword) {
              toast({ variant: 'destructive', title: 'Erro', description: 'Por favor preencha todos os campos.' });
              return;
            }

            if (password !== confirmPassword) {
              toast({ variant: 'destructive', title: 'Erro', description: 'As senhas não coincidem.' });
              return;
            }

            const { auth } = initializeFirebase();
            if (!auth) return;
            
            setIsEmailLoading(true);
            initiateEmailSignUp(auth, email, password).catch((error) => {
              console.error('createUserWithEmailAndPassword error', error);
              toast({
                variant: 'destructive',
                title: 'Erro no Cadastro',
                description: resolveAuthErrorMessage(error),
              });
              setIsEmailLoading(false);
            });
          }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton pending={isLoading} />
             <p className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
