const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Credenciais inválidas. Revise email e senha.',
  'Email not confirmed': 'Confirme o email antes de fazer login.',
  'User already registered': 'Já existe uma conta com este email.',
  'Password strength': 'A senha não atende aos requisitos mínimos.',
  'AuthApiError': 'Falha na autenticação. Revise seus dados.',
};

export const GENERIC_AUTH_ERROR = 'Não foi possível concluir a autenticação. Tente novamente.';

type SupabaseErrorShape = {
  message: string;
  code?: string;
  status?: number;
  name?: string;
};

function isSupabaseError(error: unknown): error is SupabaseErrorShape {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in (error as Record<string, unknown>) &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Converte erros de autenticação (Supabase/Fetch) em mensagens amigáveis.
 */
export function resolveAuthErrorMessage(error: unknown, fallback = GENERIC_AUTH_ERROR): string {
  if (isSupabaseError(error)) {
    const specific =
      AUTH_ERROR_MESSAGES[error.message] ??
      (error.code ? AUTH_ERROR_MESSAGES[error.code] : undefined) ??
      (error.name ? AUTH_ERROR_MESSAGES[error.name] : undefined);
    return specific ?? error.message ?? fallback;
  }

  if (typeof error === 'string') {
    return error || fallback;
  }

  if (error instanceof Error) {
    const normalized = error.message.toUpperCase();
    if (normalized.includes('INVALID_ID_TOKEN') || normalized.includes('TOKEN EXPIRED')) {
      return 'Sessão inválida ou expirada. Faça login novamente.';
    }
    if (normalized.includes('EMAIL NOT CONFIRMED')) {
      return AUTH_ERROR_MESSAGES['Email not confirmed'];
    }
    if (normalized.includes('USER ALREADY REGISTERED')) {
      return AUTH_ERROR_MESSAGES['User already registered'];
    }
  }

  return fallback;
}
