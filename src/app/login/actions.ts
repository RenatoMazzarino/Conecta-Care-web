
'use server';

import { createSession } from '@/auth';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { redirect } from 'next/navigation';

export async function loginAction(
  prevState: { error: string | null; success?: boolean },
  formData: FormData
): Promise<{ error: string | null; success?: boolean }> {
  console.log('[loginAction] Iniciando login com e-mail e senha.');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    console.error('[loginAction] Campos de e-mail ou senha ausentes.');
    return { error: 'Por favor, preencha todos os campos.' };
  }

  try {
    const { auth } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('[loginAction] Autenticação com Firebase bem-sucedida. UID:', user.uid);

    console.log('[loginAction] Chamando createSession...');
    await createSession(user.uid, user.email || '');
    console.log('[loginAction] createSession concluído.');
    
  } catch (error: any) {
    console.error('[loginAction] Erro no Firebase Auth:', error.code, error.message);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
    }
    return { error: 'Ocorreu um erro desconhecido. Tente novamente.' };
  }

  console.log('[loginAction] Redirecionando para /...');
  redirect('/');
}


export async function googleLoginAction(
  prevState: { error: string | null; success?: boolean },
  formData: FormData
): Promise<{ error: string | null; success?: boolean }> {
  console.log('[googleLoginAction] Iniciando login com Google.');
  const uid = formData.get('uid') as string;
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  if (!uid || !email) {
    console.error('[googleLoginAction] UID ou e-mail do Google ausentes.');
    return { error: 'Informações do Google inválidas.' };
  }
  console.log('[googleLoginAction] Dados recebidos. UID:', uid);

  try {
    console.log('[googleLoginAction] Chamando createSession...');
    await createSession(uid, email);
    console.log('[googleLoginAction] createSession concluído.');

  } catch (error: any) {
    console.error('[googleLoginAction] Erro ao criar sessão:', error.message);
    return { error: 'Ocorreu um erro ao processar o login com Google.' };
  }
  
  console.log('[googleLoginAction] Redirecionando para /...');
  redirect('/');
}
