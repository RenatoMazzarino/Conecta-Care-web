
import { cookies } from 'next/headers';
 
const SESSION_COOKIE_NAME = 'user_session';

type Session = {
  uid: string;
  email: string;
} | null;
 
export async function createSession(uid: string, email: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = { uid, email };
 
  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}
 
export async function auth(): Promise<Session> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  
  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
