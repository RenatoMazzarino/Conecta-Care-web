'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // If a Firebase app is already initialized, return its SDKs.
  if (getApps().length) {
    return getSdks(getApp());
  }
  
  // Otherwise, initialize a new app using the local firebaseConfig.
  // This approach is robust for both local development and production
  // as it bypasses the App Hosting auto-init that fails in dev.
  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
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
