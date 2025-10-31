
'use server';

import { createSession } from '@/auth';
import { verifyIdToken } from '@/server/firebase-auth';

type SignupState = { error: string | null; success?: boolean };

export async function signupAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const idToken = formData.get('idToken') as string | null;

  if (!idToken) {
    return { error: 'Token de autenticação ausente.' };
  }

  try {
    const { uid, email } = await verifyIdToken(idToken);
    await createSession(uid, email);
    return { error: null, success: true };
  } catch (error: any) {
    return { error: 'Não foi possível validar o token de cadastro.' };
  }
}
