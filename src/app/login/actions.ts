
'use server';

import { createSession } from '@/auth';
import { verifyIdToken } from '@/server/firebase-auth';

type LoginState = { error: string | null; success?: boolean };

async function verifyAndCreateSession(idToken: string) {
  const { uid, email } = await verifyIdToken(idToken);

  try {
    await createSession(uid, email);
  } catch (error) {
    throw new Error('Erro ao criar sessão no servidor.');
  }
}

/**
 * Server action for login: validates the Firebase ID token and persists the session cookie.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const idToken = formData.get('idToken') as string | null;

  if (!idToken) {
    return { error: 'Token de autenticação ausente.' };
  }

  try {
    await verifyAndCreateSession(idToken);
    return { error: null, success: true };
  } catch (error: any) {
    return { error: 'Não foi possível validar o token de login.' };
  }
}

/**
 * Server action for Google login redirect: validates ID token and persists the session cookie.
 */
export async function googleLoginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const idToken = formData.get('idToken') as string | null;

  if (!idToken) {
    return { error: 'Token de autenticação do Google ausente.' };
  }

  try {
    await verifyAndCreateSession(idToken);
    return { error: null, success: true };
  } catch (error: any) {
    return { error: 'Não foi possível validar o login com Google.' };
  }
}
