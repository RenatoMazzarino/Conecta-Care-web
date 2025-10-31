
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction, googleLoginAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { initializeFirebase } from '@/firebase';
import { useUser } from '@/firebase/provider';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { resolveAuthErrorMessage } from '@/lib/auth-errors';

function SubmitButton({ pending }: { pending?: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Entrar com Email
    </Button>
  );
}

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
)

export default function LoginPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(loginAction, { error: null, success: false });
  const [googleState, googleFormAction] = useActionState(googleLoginAction, { error: null, success: false });
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(true); // Start as true to check for redirect
  const [awaitingEmailSignIn, setAwaitingEmailSignIn] = React.useState(false);
  const user = useUser();

  React.useEffect(() => {
    const error = state.error || googleState.error;
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Login',
        description: error,
      });
    }
  }, [state.error, googleState.error, toast]);
  
  const router = useRouter();

  React.useEffect(() => {
    if (state.success || googleState.success) {
      router.push('/dashboard');
    }
  }, [state.success, googleState.success, router]);

  React.useEffect(() => {
    if (!awaitingEmailSignIn) {
      return;
    }
    if (state.error || state.success) {
      setAwaitingEmailSignIn(false);
    }
  }, [awaitingEmailSignIn, state.error, state.success]);

  React.useEffect(() => {
    if (!isGoogleLoading) {
      return;
    }
    if (googleState.error || googleState.success) {
      setIsGoogleLoading(false);
    }
  }, [isGoogleLoading, googleState.error, googleState.success]);

  React.useEffect(() => {
    const { auth } = initializeFirebase();

    const resolveRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) {
          setIsGoogleLoading(false);
          return;
        }

        const idToken = await result.user.getIdToken();
        const formData = new FormData();
        formData.append('idToken', idToken);
        setIsGoogleLoading(true);
        googleFormAction(formData);
      } catch (error) {
        console.error('Google Redirect Result Error', error);
        toast({
          variant: 'destructive',
          title: 'Erro de Login com Google',
          description: resolveAuthErrorMessage(error),
        });
        setIsGoogleLoading(false);
      }
    };

    resolveRedirect();
  }, [googleFormAction, toast]);


  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { auth } = initializeFirebase();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('signInWithRedirect error', error);
      toast({
        variant: 'destructive',
        title: 'Erro de Login com Google',
        description: resolveAuthErrorMessage(error),
      });
      setIsGoogleLoading(false);
    }
  };

  // Watch for client-side email sign-in completion (non-blocking flow).
  React.useEffect(() => {
    if (!user || !awaitingEmailSignIn) {
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
        formAction(formData);
      } catch (error) {
        console.error('Erro ao obter ID token', error);
        toast({
          variant: 'destructive',
          title: 'Erro de Login',
          description: resolveAuthErrorMessage(error),
        });
        setAwaitingEmailSignIn(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, awaitingEmailSignIn, formAction, toast]);

  if (isGoogleLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40">
            <Card className="w-full max-w-sm p-8 text-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto"/>
                <p className="mt-4 text-muted-foreground">Processando login com Google...</p>
            </Card>
        </div>
    )
  }

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
           <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
             <GoogleIcon />
              Entrar com Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                    </span>
                </div>
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                if (awaitingEmailSignIn) {
                  return;
                }
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);
                const email = fd.get('email') as string;
                const password = fd.get('password') as string;

                if (!email || !password) {
                  toast({ variant: 'destructive', title: 'Erro', description: 'Por favor preencha email e senha.' });
                  return;
                }

                const { auth } = initializeFirebase();
                // start non-blocking client-side sign-in
                setAwaitingEmailSignIn(true);
                initiateEmailSignIn(auth, email, password).catch((error) => {
                  console.error('signInWithEmailAndPassword error', error);
                  toast({
                    variant: 'destructive',
                    title: 'Erro de Login',
                    description: resolveAuthErrorMessage(error),
                  });
                  setAwaitingEmailSignIn(false);
                });
              }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <SubmitButton pending={awaitingEmailSignIn} />
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
