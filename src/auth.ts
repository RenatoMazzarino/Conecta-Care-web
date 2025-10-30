
import { cookies } from 'next/headers';
 
const SESSION_COOKIE_NAME = 'user_session';

type Session = {
  uid: string;
  email: string;
} | null;
 
export async function createSession(uid: string, email: string) {
  console.log('[createSession] Criando sessão para UID:', uid);
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = { uid, email };
 
  // Force a call to cookies() to ensure it's in the right context
  const cookieStore = cookies();
  
  console.log('[createSession] Configurando cookie de sessão.');
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  console.log('[createSession] Cookie de sessão configurado.');
}
 
export async function auth(): Promise<Session> {
  console.log('[auth] Verificando sessão...');
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!sessionCookie) {
    console.log('[auth] Nenhum cookie de sessão encontrado.');
    return null;
  }
  
  try {
    const session = JSON.parse(sessionCookie);
    console.log('[auth] Sessão encontrada para UID:', session.uid);
    return session;
  } catch (error) {
    console.log('[auth] Erro ao analisar o cookie de sessão:', error);
    return null;
  }
}

export async function deleteSession() {
  console.log('[deleteSession] Deletando cookie de sessão.');
  cookies().delete(SESSION_COOKIE_NAME);
}
