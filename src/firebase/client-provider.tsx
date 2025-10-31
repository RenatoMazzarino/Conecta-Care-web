
'use client';

import React, { useState, useEffect, useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { onAuthStateChanged, User, Auth } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { DebugPanel } from '@/components/dev/debug-panel';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

const LoadingSkeleton = () => (
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

// --- DEVELOPMENT BYPASS ---
// This creates a mock user object to bypass the login requirement for development.
// The real onAuthStateChanged is commented out below.
const createMockUser = (uid: string): User => {
  return {
    uid: uid,
    email: 'dev.user@example.com',
    displayName: 'Dev User',
    photoURL: null,
    phoneNumber: null,
    emailVerified: true,
    isAnonymous: false,
    tenantId: null,
    providerData: [],
    metadata: {},
    providerId: 'password',
    getIdToken: async () => 'mock-id-token',
    getIdTokenResult: async () => ({ token: 'mock-id-token' } as any),
    reload: async () => {},
    delete: async () => {},
    toJSON: () => ({}),
  };
};
// --- END DEVELOPMENT BYPASS ---


/**
 * This provider initializes Firebase on the client, listens for auth state changes,
 * and passes the user state down to the FirebaseProvider. It shows a loading
 * screen until the initial auth check is complete.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      return;
    }
    
    // --- DEVELOPMENT BYPASS ---
    // We're using a mock user to avoid login.
    const mockUser = createMockUser('3Z9uhaJbnUdBNwMXWXaw0m1B9ey2');
    setUser(mockUser);
    setIsUserLoading(false);
    // --- END DEVELOPMENT BYPASS ---

    /*
    // --- REAL AUTHENTICATION LOGIC (Currently disabled) ---
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsUserLoading(false);
    });

    return () => unsubscribe();
    */
  }, [auth]);

  // While initializing Firebase or waiting for the first auth state change, show a skeleton.
  if (!firebaseApp || !auth || !firestore || isUserLoading) {
    return <LoadingSkeleton />;
  }

  // Once loading is complete, provide the Firebase services and user state.
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
      user={user}
    >
      {children}
      {process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && localStorage.getItem('conecta:dev') === '1' ? (
        <DebugPanel user={user} />
      ) : null}
    </FirebaseProvider>
  );
}
