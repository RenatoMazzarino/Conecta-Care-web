'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// This function can be called from anywhere, but the dynamic config part
// should only happen on the client.
export function initializeFirebase() {
  if (getApps().length) {
    const app = getApp();
    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app)
    };
  }

  // If on the server, initialize with the base config.
  // The client-provider will handle re-initialization if needed for authDomain.
  // This path is less likely with the new structure but provides a safe fallback.
  if (typeof window === 'undefined') {
    const serverApp = initializeApp(firebaseConfig);
    return {
      firebaseApp: serverApp,
      auth: getAuth(serverApp),
      firestore: getFirestore(serverApp)
    };
  }
  
  // On the client, create the dynamic config.
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
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';