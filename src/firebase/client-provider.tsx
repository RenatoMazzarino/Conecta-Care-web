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
    </FirebaseProvider>
  );
}
