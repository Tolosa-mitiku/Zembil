import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FIREBASE_CONFIG } from '../constants';

console.log('=== Firebase Configuration ===');
console.log('Firebase Config:', FIREBASE_CONFIG);

// Check if all required config values are present
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !FIREBASE_CONFIG[key as keyof typeof FIREBASE_CONFIG]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase config keys:', missingKeys);
  console.error('Please check your .env file and ensure all VITE_FIREBASE_* variables are set');
}

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(FIREBASE_CONFIG);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  console.log('Firebase auth initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { auth };
export default app;


