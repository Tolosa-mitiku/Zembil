/**
 * Firebase Service Account JSON Formatter
 * 
 * This script helps you format your Firebase service account JSON
 * for use in the .env file as a single-line string.
 * 
 * Usage:
 * 1. Save your downloaded Firebase service account JSON as 'service-account.json'
 * 2. Run: node format-firebase-json.js
 * 3. Copy the output to your .env file
 */

const fs = require('fs');
const path = require('path');

const SERVICE_ACCOUNT_FILE = 'service-account.json';

try {
  // Check if the service account file exists
  const filePath = path.join(__dirname, SERVICE_ACCOUNT_FILE);
  
  if (!fs.existsSync(filePath)) {
    console.error('\n❌ Error: service-account.json not found!\n');
    console.log('📋 Instructions:');
    console.log('1. Go to https://console.firebase.google.com/project/zembil1010/settings/serviceaccounts/adminsdk');
    console.log('2. Click "Generate New Private Key"');
    console.log('3. Save the downloaded JSON file as "service-account.json" in the backend folder');
    console.log('4. Run this script again: node format-firebase-json.js\n');
    process.exit(1);
  }

  // Read and parse the JSON file
  const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Validate required fields
  const requiredFields = ['project_id', 'private_key', 'client_email'];
  const missingFields = requiredFields.filter(field => !serviceAccount[field]);

  if (missingFields.length > 0) {
    console.error('\n❌ Error: Missing required fields in service account JSON:');
    missingFields.forEach(field => console.error(`   - ${field}`));
    console.log('\nPlease make sure you downloaded the correct file from Firebase.\n');
    process.exit(1);
  }

  // Convert to single-line JSON string (minified)
  const minifiedJson = JSON.stringify(serviceAccount);

  console.log('\n✅ Success! Your Firebase service account is formatted.\n');
  console.log('📝 Copy this line to your .env file:\n');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`FIREBASE_SERVICE_ACCOUNT=${minifiedJson}`);
  console.log('─────────────────────────────────────────────────────────\n');

  console.log('🔐 Project Info:');
  console.log(`   Project ID: ${serviceAccount.project_id}`);
  console.log(`   Client Email: ${serviceAccount.client_email}`);
  console.log(`   Private Key: ${serviceAccount.private_key ? '✓ Present' : '✗ Missing'}\n`);

  console.log('⚠️  Important:');
  console.log('   - DO NOT commit service-account.json to git');
  console.log('   - Keep your .env file secure and never commit it');
  console.log('   - Delete service-account.json after copying to .env\n');

} catch (error) {
  console.error('\n❌ Error processing service account file:');
  console.error(error.message);
  
  if (error.message.includes('JSON')) {
    console.log('\n💡 Tip: Make sure the file is valid JSON format.\n');
  }
  
  process.exit(1);
}

