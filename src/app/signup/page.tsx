'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, Loader2 } from 'lucide-react';

import { signupAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseBrowserClient } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { resolveAuthErrorMessage } from '@/lib/auth-errors';

type SignupState = Awaited<ReturnType<typeof signupAction>>;

function SubmitButton({ pending }: { pending?: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Criar Conta
    </Button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction, isSubmitting] = useActionState<SignupState, FormData>(signupAction, {
    error: null,
    success: false,
  });
  const [isProcessing, setIsProcessing] = React.useState(false);
  const hasRedirected = React.useRef(false);

  React.useEffect(() => {
    if (!state.error) return;
    toast({
      variant: 'destructive',
      title: 'Erro no Cadastro',
      description: state.error,
    });
  }, [state.error, toast]);

  React.useEffect(() => {
    if (state.success && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/dashboard');
    }
  }, [state.success, router]);

  React.useEffect(() => {
    if (!isProcessing) return;
    if (state.error || state.success) {
      setIsProcessing(false);
    }
  }, [isProcessing, state.error, state.success]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isProcessing || isSubmitting) return;

    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement)?.value;

    if (!email || !password || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor preencha todos os campos.',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'As senhas não coincidem.',
      });
      return;
    }

    setIsProcessing(true);

    const { data, error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
      },
    });

    if (error) {
      console.error('signUp error', error);
      toast({
        variant: 'destructive',
        title: 'Erro no Cadastro',
        description: resolveAuthErrorMessage(error),
      });
      setIsProcessing(false);
      return;
    }

    if (!data.session?.access_token) {
      toast({
        title: 'Verifique seu email',
        description: 'Enviamos um link de confirmação para completar o cadastro.',
      });
      setIsProcessing(false);
      return;
    }

    const formData = new FormData();
    formData.append('accessToken', data.session.access_token);
    React.startTransition(() => formAction(formData));
  };

  const isLoading = isProcessing || isSubmitting;

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
        <form onSubmit={handleSubmit}>
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
