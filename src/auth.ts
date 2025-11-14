
import { cookies } from 'next/headers';
 
const SESSION_COOKIE_NAME = 'user_session';

type Session = {
  uid: string;
  email: string;
} | null;
 
export async function createSession(uid: string, email: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = { uid, email };
 
  // Always await cookies() to get the store
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}
 
export async function auth(): Promise<Session> {
  // Always await cookies() to get the store
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionCookie);
    return session;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
