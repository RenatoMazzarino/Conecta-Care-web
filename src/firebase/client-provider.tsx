'use client';

import React, { useState, useEffect, useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { onAuthStateChanged, User, Auth } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * This provider initializes Firebase on the client, listens for auth state changes,
 * and passes the user state down to the FirebaseProvider. It shows a loading
 * screen until the initial auth check is complete.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Memoize Firebase service initialization to run only once on the client.
  const { firebaseApp, auth, firestore } = useMemo(() => {
    // This function is now safe to call inside useMemo because the logic
    // to access `window` is handled within `initializeFirebase` itself,
    // and this entire component is a Client Component.
    return initializeFirebase();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Subscribe to auth state changes.
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsUserLoading(false); // Auth check is complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // While the initial user state is being determined, show a loading UI.
  // This helps prevent hydration mismatches.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-4">
          <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-48 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-12 w-24" />
            </div>
        </div>
      </div>
    );
  }

  // Once loading is complete, provide the Firebase services and user state.
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
      user={user} // Pass the resolved user state
    >
      {children}
      {process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && localStorage.getItem('conecta:dev') === '1' ? (
        <DebugPanel user={user} />
      ) : null}
    </FirebaseProvider>
  );
}

function DebugPanel({ user }: { user: any }) {
  const [serverSession, setServerSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/session');
      const json = await res.json();
      setServerSession(json.session ?? null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('fetch /api/session error', err);
      setServerSession(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSession();
  }, []);

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 100, pointerEvents: 'auto' }}>
      <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: 12, borderRadius: 8, fontSize: 12, maxWidth: 360 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>DEV DEBUG PANEL</div>
        <div><strong>Client user:</strong> {user ? (user.email ?? user.uid) : 'null'}</div>
        <div><strong>Client UID:</strong> {user ? user.uid : '-'}</div>
        <div><strong>Client cookie (document.cookie):</strong> {typeof window !== 'undefined' ? (document.cookie || '(empty)') : 'n/a'}</div>
        <div style={{ marginTop: 6 }}><strong>Server session:</strong> {loading ? 'checking...' : (serverSession ? (serverSession.email ?? serverSession.uid) : 'missing')}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button onClick={() => location.reload()} style={{ padding: '6px 8px' }}>Reload</button>
          <button onClick={() => (location.href = '/')} style={{ padding: '6px 8px' }}>Go /</button>
          <button onClick={fetchSession} style={{ padding: '6px 8px' }}>Check session</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#ddd' }}>
          Nota: cookies httpOnly não aparecem em document.cookie. Use "Check session" para verificar se o servidor recebeu a sessão.
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: '#ddd' }}>
          Para habilitar este painel automaticamente no dev: execute no Console
          <div style={{ marginTop: 4 }}><code>localStorage.setItem('conecta:dev','1')</code> e recarregue a página.</div>
        </div>
      </div>
    </div>
  );
}
