import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log Firebase config for debugging
console.log('Environment check:', {
  nodeEnv: process.env.NODE_ENV,
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

console.log('Firebase Config:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  // Log partial API key for verification (first 5 chars)
  apiKeyPrefix: firebaseConfig.apiKey?.substring(0, 5),
});

// Check if any required config is missing
const missingConfig = Object.entries(firebaseConfig).filter(([key, value]) => !value);
if (missingConfig.length > 0) {
  console.error('Missing Firebase configuration:', missingConfig.map(([key]) => key));
  throw new Error('Missing required Firebase configuration');
}

let app;
try {
  // Initialize Firebase
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
