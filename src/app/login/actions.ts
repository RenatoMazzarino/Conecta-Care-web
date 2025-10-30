
'use server';

import { createSession } from '@/auth';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { redirect } from 'next/navigation';

export async function loginAction(
  prevState: { error: string | null; },
  formData: FormData
): Promise<{ error: string | null; }> {
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
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
    }
    return { error: 'Ocorreu um erro desconhecido. Tente novamente.' };
  }

  redirect('/');
}


export async function googleLoginAction(
  prevState: { error: string | null; },
  formData: FormData
): Promise<{ error: string | null; }> {
  const uid = formData.get('uid') as string;
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  if (!uid || !email) {
    return { error: 'Informações do Google inválidas.' };
  }

  try {
    await createSession(uid, email);
    // TODO: Could also create a user profile in Firestore here if one doesn't exist

  } catch (error: any) {
    console.error('Google Login Action error:', error);
    return { error: 'Ocorreu um erro ao processar o login com Google.' };
  }
  
  redirect('/');
}
