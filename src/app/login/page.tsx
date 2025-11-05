
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, Loader2 } from 'lucide-react';

import { loginAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseBrowserClient } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { resolveAuthErrorMessage } from '@/lib/auth-errors';

type LoginState = Awaited<ReturnType<typeof loginAction>>;

function SubmitButton({ pending }: { pending?: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Entrar com Email
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction, isSubmitting] = useActionState<LoginState, FormData>(loginAction, {
    error: null,
    success: false,
  });
  const [isEmailLoading, setIsEmailLoading] = React.useState(false);
  const [isOAuthSyncing, setIsOAuthSyncing] = React.useState(true);
  const hasCompletedLogin = React.useRef(false);

  React.useEffect(() => {
    if (!state.error) {
      return;
    }
    toast({
      variant: 'destructive',
      title: 'Erro de Login',
      description: state.error,
    });
  }, [state.error, toast]);

  React.useEffect(() => {
    if (state.success && !hasCompletedLogin.current) {
      hasCompletedLogin.current = true;
      router.push('/dashboard');
    }
  }, [state.success, router]);

  React.useEffect(() => {
    if (!isEmailLoading) {
      return;
    }
    if (state.error || state.success) {
      setIsEmailLoading(false);
    }
  }, [isEmailLoading, state.error, state.success]);

  React.useEffect(() => {
    let cancelled = false;
    const syncCurrentSession = async () => {
      const { data } = await supabaseBrowserClient.auth.getSession();
      if (cancelled) {
        return;
      }
      const accessToken = data.session?.access_token;
      if (!accessToken || hasCompletedLogin.current) {
        setIsOAuthSyncing(false);
        return;
      }
      const formData = new FormData();
      formData.append('accessToken', accessToken);
      React.startTransition(() => formAction(formData));
      setIsOAuthSyncing(false);
    };

    syncCurrentSession().catch((error) => {
      console.error('Erro ao sincronizar sessão Supabase', error);
      setIsOAuthSyncing(false);
    });

    return () => {
      cancelled = true;
    };
  }, [formAction]);

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmailLoading || isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor preencha email e senha.',
      });
      return;
    }

    setIsEmailLoading(true);

    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session?.access_token) {
      console.error('signInWithPassword error', error);
      toast({
        variant: 'destructive',
        title: 'Erro de Login',
        description: resolveAuthErrorMessage(error),
      });
      setIsEmailLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('accessToken', data.session.access_token);

    React.startTransition(() => formAction(formData));
  };

  const handleOAuthLogin = async () => {
    try {
      await supabaseBrowserClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        },
      });
    } catch (error) {
      console.error('Erro ao iniciar login com Google', error);
      toast({
        variant: 'destructive',
        title: 'Erro de Login com Google',
        description: resolveAuthErrorMessage(error),
      });
    }
  };

  const isLoading = isEmailLoading || isSubmitting || isOAuthSyncing;

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
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleOAuthLogin}>
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Entrar com Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton pending={isLoading} />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
