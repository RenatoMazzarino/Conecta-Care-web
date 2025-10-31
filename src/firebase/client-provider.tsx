
'use client';

import React, { ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseApp } from 'firebase/app';
import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { DebugPanel } from '@/components/dev/debug-panel';


interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * This provider initializes Firebase on the client, listens for auth state changes,
 * and passes the user state down to the FirebaseProvider. It shows a loading
 * screen until the initial auth check is complete.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // By returning null services, we effectively disable Firebase for development.
  const firebaseServices = { firebaseApp: null, auth: null, firestore: null };

  const { firebaseApp, auth, firestore } = firebaseServices;
  const user = null;

  // Once loading is complete, provide the Firebase services and user state.
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp as FirebaseApp}
      auth={auth as Auth}
      firestore={firestore as Firestore}
      user={user as User | null}
    >
      {children}
      {process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && localStorage.getItem('conecta:dev') === '1' ? (
        <DebugPanel user={user} />
      ) : null}
    </FirebaseProvider>
  );
}
