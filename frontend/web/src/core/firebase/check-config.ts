// Simple script to check Firebase configuration
// Run this in your browser console to verify setup

console.log('='.repeat(50));
console.log('🔍 FIREBASE CONFIGURATION CHECK');
console.log('='.repeat(50));

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('\n📋 Configuration Status:');
Object.entries(config).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = value ? `${value.substring(0, 20)}...` : 'MISSING';
  console.log(`${status} ${key}: ${displayValue}`);
});

const missingKeys = Object.entries(config)
  .filter(([_, value]) => !value)
  .map(([key, _]) => key);

if (missingKeys.length > 0) {
  console.log('\n❌ MISSING CONFIGURATION:');
  console.log(`Missing keys: ${missingKeys.join(', ')}`);
  console.log('\n📝 Action Required:');
  console.log('1. Create .env file in frontend/web/');
  console.log('2. Add missing variables with VITE_ prefix');
  console.log('3. Restart dev server');
} else {
  console.log('\n✅ All configuration keys present!');
}

console.log('\n🌐 API URL:', import.meta.env.VITE_API_BASE_URL || 'Using default');
console.log('='.repeat(50));

export {};





