'use server';

import { getSupabaseServiceRoleClient } from '@/server/supabaseServiceClient';

type VerifiedUser = {
  uid: string;
  email: string;
  emailVerified: boolean;
};

export async function verifyAccessToken(accessToken: string): Promise<VerifiedUser> {
  if (!accessToken) {
    throw new Error('Token de acesso ausente.');
  }

  const serviceClient = await getSupabaseServiceRoleClient();

  const { data, error } = await serviceClient.auth.getUser(accessToken);

  if (error || !data?.user) {
    throw new Error(error?.message ?? 'Token inválido.');
  }

  const user = data.user;

  if (!user.email) {
    throw new Error('Usuário sem email associado.');
  }

  return {
    uid: user.id,
    email: user.email,
    emailVerified: Boolean(user.email_confirmed_at),
  };
}
