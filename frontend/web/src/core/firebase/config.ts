import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { FIREBASE_CONFIG } from '../constants';

// Check if all required config values are present
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !FIREBASE_CONFIG[key as keyof typeof FIREBASE_CONFIG]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase config keys:', missingKeys);
  console.error('Please check your .env file and ensure all VITE_FIREBASE_* variables are set');
}

// Suppress Firebase "read only property" warnings in development
// This is a known issue with Firebase + Vite HMR
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const firstArg = typeof args[0] === 'string' ? args[0] : String(args[0]);
    const secondArg = args[1] ? String(args[1]) : '';
    const combinedArgs = firstArg + ' ' + secondArg;
    
    if (
      combinedArgs.includes('Cannot assign to read only property') ||
      combinedArgs.includes('read only property') ||
      combinedArgs.includes('operations') ||
      combinedArgs.includes('currentUser') ||
      combinedArgs.includes('firebase:authUser') ||
      combinedArgs.includes('IndexedDBLocalPersistence') ||
      combinedArgs.includes('directlySetCurrentUser') ||
      combinedArgs.includes('AuthImpl')
    ) {
      // Suppress this specific error - it's a Firebase HMR issue
      return;
    }
    originalError.apply(console, args);
  };
}

// Initialize Firebase only if not already initialized
let app: FirebaseApp;
let auth: Auth;

const existingApps = getApps();

if (existingApps.length === 0) {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
} else {
  app = existingApps[0];
  auth = getAuth(app);
}

export { auth };
export default app;


