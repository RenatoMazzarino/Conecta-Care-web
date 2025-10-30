
'use server';

import { redirect } from 'next/navigation';
import { createSession } from '@/auth';
import { initializeFirebase } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export async function signupAction(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password || !confirmPassword) {
    return { error: 'Por favor, preencha todos os campos.' };
  }
  
  if (password !== confirmPassword) {
    return { error: 'As senhas não coincidem.' };
  }

  if (password.length < 6) {
    return { error: 'A senha deve ter pelo menos 6 caracteres.' };
  }

  try {
    const { auth } = initializeFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createSession(user.uid, user.email || '');

  } catch (error: any) {
    console.error('Signup error:', error);
     if (error.code === 'auth/email-already-in-use') {
      return { error: 'Este e-mail já está em uso.' };
    }
    return { error: 'Ocorreu um erro desconhecido. Tente novamente.' };
  }

  redirect('/');
}
