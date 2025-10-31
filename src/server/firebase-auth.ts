'use server';

import { firebaseConfig } from '@/firebase/config';

interface AccountsLookupResponse {
  users?: Array<{
    localId: string;
    email?: string;
    emailVerified?: boolean;
    disabled?: boolean;
  }>;
  error?: {
    message?: string;
  };
}

const LOOKUP_ENDPOINT = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';

/**
 * Verifies a Firebase ID token against Google Identity Toolkit and returns the user record.
 * Falls back to descriptive errors so the caller can surface a friendly message.
 */
export async function verifyIdToken(idToken: string) {
  if (!idToken) {
    throw new Error('Token de autenticação ausente.');
  }

  const apiKey = firebaseConfig.apiKey;
  if (!apiKey) {
    throw new Error('firebaseConfig.apiKey não está configurado.');
  }

  const response = await fetch(`${LOOKUP_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
    // We rely on Next.js fetch caching defaults (no-store in server actions).
  });

  let payload: AccountsLookupResponse;
  try {
    payload = (await response.json()) as AccountsLookupResponse;
  } catch (error) {
    throw new Error('Não foi possível analisar a resposta do serviço de autenticação.');
  }

  if (!response.ok) {
    const message = payload?.error?.message ?? 'Token inválido.';
    throw new Error(message);
  }

  const user = payload.users?.[0];
  if (!user) {
    throw new Error('Nenhum usuário encontrado para o token.');
  }

  if (user.disabled) {
    throw new Error('A conta está desativada.');
  }

  if (!user.email) {
    throw new Error('Nenhum e-mail associado à conta.');
  }

  return {
    uid: user.localId,
    email: user.email,
    emailVerified: user.emailVerified ?? false,
  };
}
