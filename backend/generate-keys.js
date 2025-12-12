#!/usr/bin/env node

/**
 * Generate Secure Keys for Production Deployment
 * Run with: node generate-keys.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating Secure Keys for Production...\n');
console.log('=' .repeat(70));

// Generate Encryption Key (32 bytes = 64 hex characters)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('\n📝 ENCRYPTION_KEY (64 characters hex):');
console.log(encryptionKey);
console.log('\nUse this for: Data encryption (AES-256-GCM)');

console.log('\n' + '-'.repeat(70));

// Generate Session Secret (32 bytes base64)
const sessionSecret = crypto.randomBytes(32).toString('base64');
console.log('\n📝 SESSION_SECRET (Base64):');
console.log(sessionSecret);
console.log('\nUse this for: Session token signing and verification');

console.log('\n' + '='.repeat(70));

// Additional API Key for internal services
const apiKey = crypto.randomBytes(24).toString('hex');
console.log('\n📝 API_KEY (Optional - for internal services):');
console.log(apiKey);

console.log('\n' + '='.repeat(70));

// Display .env format
console.log('\n📄 Copy these to your .env file:\n');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log(`SESSION_SECRET=${sessionSecret}`);

console.log('\n' + '='.repeat(70));

// Security tips
console.log('\n⚠️  SECURITY TIPS:');
console.log('   1. Never commit these keys to version control');
console.log('   2. Use different keys for development and production');
console.log('   3. Store securely in Vercel environment variables');
console.log('   4. Rotate keys periodically (every 6-12 months)');
console.log('   5. Keep backup of production keys in secure location\n');

// Vercel deployment instructions
console.log('🚀 To add to Vercel:');
console.log('   1. Go to your project on vercel.com');
console.log('   2. Settings → Environment Variables');
console.log('   3. Add each variable with its value');
console.log('   4. Select "Production", "Preview", and "Development"');
console.log('   5. Redeploy your application\n');

console.log('✅ Keys generated successfully!\n');

