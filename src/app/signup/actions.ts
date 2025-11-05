
'use server';

import { createSession } from '@/auth';
import { verifyAccessToken } from '@/server/supabase-auth';

type SignupState = { error: string | null; success?: boolean };

export async function signupAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const accessToken = formData.get('accessToken') as string | null;

  if (!accessToken) {
    return { error: 'Token de autenticação ausente.' };
  }

  try {
    const { uid, email } = await verifyAccessToken(accessToken);
    await createSession(uid, email);
    return { error: null, success: true };
  } catch {
    return { error: 'Não foi possível validar o cadastro.' };
  }
}
