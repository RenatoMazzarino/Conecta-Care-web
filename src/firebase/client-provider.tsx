
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
  // Memoize Firebase service initialization to run only once.
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Subscribe to auth state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsUserLoading(false); // Auth check is complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // While the initial user state is being determined, show a loading UI.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-12 w-full" />
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
    </FirebaseProvider>
  );
}
