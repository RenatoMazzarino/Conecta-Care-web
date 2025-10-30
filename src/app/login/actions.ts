
'use server';

import { redirect } from 'next/navigation';
import { createSession } from '@/auth';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function loginAction(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor, preencha todos os campos.' };
  }

  try {
    const { auth } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createSession(user.uid, user.email || '');
    
  } catch (error: any) {
    console.error('Login error:', error);
    // Map Firebase auth errors to user-friendly messages
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
    }
    return { error: 'Ocorreu um erro desconhecido. Tente novamente.' };
  }

  redirect('/');
}

