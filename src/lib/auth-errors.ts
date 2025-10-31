import type { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Endereço de email inválido.',
  'auth/user-not-found': 'Usuário não encontrado. Verifique seu email.',
  'auth/wrong-password': 'Credenciais inválidas. Revise email e senha.',
  'auth/invalid-credential': 'Credenciais inválidas. Revise email e senha.',
  'auth/user-disabled': 'A conta está desativada.',
  'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente mais tarde.',
};

export const GENERIC_AUTH_ERROR = 'Não foi possível concluir a autenticação. Tente novamente.';

function isFirebaseError(error: unknown): error is FirebaseError {
  return typeof error === 'object' && error !== null && 'code' in (error as Record<string, unknown>);
}

/**
 * Converts Firebase/Auth errors into localized, user-friendly messages.
 */
export function resolveAuthErrorMessage(error: unknown, fallback = GENERIC_AUTH_ERROR): string {
  if (isFirebaseError(error)) {
    return AUTH_ERROR_MESSAGES[error.code] ?? fallback;
  }

  if (typeof error === 'string') {
    return error || fallback;
  }

  if (error instanceof Error) {
    const normalized = error.message.toUpperCase();
    if (normalized.includes('INVALID_ID_TOKEN') || normalized.includes('TOKEN EXPIRED')) {
      return 'Sessão inválida ou expirada. Faça login novamente.';
    }
    if (normalized.includes('USER_DISABLED')) {
      return AUTH_ERROR_MESSAGES['auth/user-disabled'];
    }
  }

  return fallback;
}
