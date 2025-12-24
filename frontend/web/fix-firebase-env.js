/**
 * Fix Frontend Firebase Environment Variables
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Your Firebase Web Configuration (from earlier)
const firebaseConfig = {
  apiKey: "AIzaSyBRiu3QIw5khGWQO7BDHEv3S9zAmbbGUCw",
  authDomain: "zembil1010.firebaseapp.com",
  projectId: "zembil1010",
  storageBucket: "zembil1010.firebasestorage.app",
  messagingSenderId: "772526343310",
  appId: "1:772526343310:web:dc27141e6d1e97f269f5df",
  measurementId: "G-3GJTEMH1QQ"
};

// Create proper .env content
const envContent = `# Frontend Environment Variables

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Firebase Configuration (Client-side - Safe to expose)
VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}
VITE_FIREBASE_MEASUREMENT_ID=${firebaseConfig.measurementId}

# Feature Flags
VITE_ENABLE_ANALYTICS=true
`;

// Write the file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Frontend .env file updated with Firebase credentials!\n');
console.log('📝 Configuration:');
console.log(`   API Key: ${firebaseConfig.apiKey}`);
console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
console.log(`   Project ID: ${firebaseConfig.projectId}`);
console.log('\n🚀 Restart your frontend development server:');
console.log('   npm run dev');
console.log('\n✅ Firebase auth should now work!');

