'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }

  // When not in a production environment, we can't rely on auto-init.
  // The 403 error suggests that the SDK is trying to contact a backend
  // service that is only available in the App Hosting production environment.
  // By explicitly checking NODE_ENV, we bypass this for local development.
  if (process.env.NODE_ENV !== 'production') {
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }
  
  // In production, first try to initialize with App Hosting's auto-config.
  try {
    const firebaseApp = initializeApp();
    return getSdks(firebaseApp);
  } catch (e) {
    // If auto-init fails even in what we think is production, fall back to the config file.
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }
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