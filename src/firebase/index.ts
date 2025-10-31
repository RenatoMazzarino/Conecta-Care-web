
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


// This function can be called from anywhere.
export function initializeFirebase(): FirebaseServices {
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH) {
    // On the server, or if we are bypassing auth, return nulls to prevent any SDK operations.
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

  const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
  if (!firebaseConfig.apiKey) {
      console.error("Firebase config is missing on the client.");
      return { firebaseApp: null, auth: null, firestore: null };
  }

  const clientApp = initializeApp(firebaseConfig);
  
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

export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
