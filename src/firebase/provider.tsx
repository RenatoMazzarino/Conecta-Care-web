
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Props for the provider component.
interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null; // User state is now passed as a prop
}

// Shape of the context state. Simplified to just provide the services and user.
export interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
}

// React Context.
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * A simplified FirebaseProvider that directly provides the services and user state passed to it.
 * It no longer manages auth state internally.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  user,
}) => {
  // Memoize the context value. It now depends on the user prop.
  const contextValue = useMemo((): FirebaseContextState => {
    return {
      firebaseApp,
      firestore,
      auth,
      user,
    };
  }, [firebaseApp, firestore, auth, user]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access the Firebase context state.
 * Throws an error if used outside a FirebaseProvider.
 */
const useFirebaseContext = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase hook must be used within a FirebaseProvider.');
  }
  return context;
};


/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  return useFirebaseContext().auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  return useFirebaseContext().firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  return useFirebaseContext().firebaseApp;
};

/**
 * Hook to access the authenticated user object.
 * @returns The current Firebase User object or null.
 */
export const useUser = (): User | null => {
  return useFirebaseContext().user;
};

/**
 * A hook for memoizing Firebase queries or references.
 * It's a wrapper around React's useMemo for convenience.
 */
export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps);
}

/**
 * Hook that returns the entire context state, including loading and error states.
 * This is useful for top-level components that might need to handle these states.
 */
export const useFirebase = () => {
    return useFirebaseContext();
}
