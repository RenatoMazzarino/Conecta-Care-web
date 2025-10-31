
'use client';

import { initializeApp, getApps, getApp, FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | {
  firebaseApp: null;
  auth: null;
  firestore: null;
};


// This function can be called from anywhere, but the dynamic config part
// should only happen on the client.
export function initializeFirebase(firebaseConfig?: FirebaseOptions): FirebaseServices {
  if (typeof window === 'undefined') {
    // On the server, return nulls to prevent any SDK operations.
    return { firebaseApp: null, auth: null, firestore: null };
  }
  
  // On the client, proceed with initialization.
  if (getApps().length) {
    const app = getApp();
    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app)
    };
  }
  
  if (!firebaseConfig) {
      console.error("Firebase config is missing on the client.");
      return { firebaseApp: null, auth: null, firestore: null };
  }

  // Use dynamic hostname on the client to solve auth domain issues in dev environments.
  const clientConfig = {
    ...firebaseConfig,
    authDomain: window.location.hostname,
  };

  const clientApp = initializeApp(clientConfig);
  
  return {
    firebaseApp: clientApp,
    auth: getAuth(clientApp),
    firestore: getFirestore(clientApp)
  };
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
