
'use server';

import { createSession } from '@/auth';
import { verifyAccessToken } from '@/server/supabase-auth';

type LoginState = { error: string | null; success?: boolean };

async function verifyAndCreateSession(accessToken: string) {
  const { uid, email } = await verifyAccessToken(accessToken);

  try {
    await createSession(uid, email);
  } catch {
    throw new Error('Erro ao criar sessão no servidor.');
  }
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const accessToken = formData.get('accessToken') as string | null;

  if (!accessToken) {
    return { error: 'Token de autenticação ausente.' };
  }

  try {
    await verifyAndCreateSession(accessToken);
    return { error: null, success: true };
  } catch {
    return { error: 'Não foi possível validar o login.' };
  }
}
