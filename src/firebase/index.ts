
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Load configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


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

  // On the server, initialize with the base config if needed for other services,
  // but most auth-related client logic will re-initialize on the client.
  if (typeof window === 'undefined') {
    const serverApp = initializeApp(firebaseConfig);
    return {
      firebaseApp: serverApp,
      auth: getAuth(serverApp),
      firestore: getFirestore(serverApp)
    };
  }
  
  // On the client, ensure the authDomain is correct for the environment.
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
