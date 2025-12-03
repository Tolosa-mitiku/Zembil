/**
 * MongoDB Sample Data Import Script
 * 
 * This script will:
 * 1. Connect to your MongoDB database
 * 2. Drop all existing collections
 * 3. Import all sample data from mongodb-sample-data folder
 * 
 * Usage:
 *   node import-sample-data.js
 * 
 * Or with custom MongoDB URI:
 *   MONGO_URI="your-connection-string" node import-sample-data.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection string - use environment variable or default
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/zembil';
const DB_NAME = 'zembil'; // Database name

// Sample data folder
const SAMPLE_DATA_DIR = path.join(__dirname, 'mongodb-sample-data');

// Collection mapping (filename -> collection name)
const COLLECTIONS = {
  'users.json': 'users',
  'buyers.json': 'buyers',
  'sellers.json': 'sellers',
  'categories.json': 'categories',
  'products.json': 'products',
  'addresses.json': 'addresses',
  'orders.json': 'orders',
  'payments.json': 'payments',
  'sellerearnings.json': 'sellerearnings',
  'payoutrequests.json': 'payoutrequests',
  'reviews.json': 'reviews',
  'wishlists.json': 'wishlists',
  'carts.json': 'carts',
  'notifications.json': 'notifications',
  'promotions.json': 'promotions',
  'banners.json': 'banners',
  'refunds.json': 'refunds',
  'chats.json': 'chats',
  'messages.json': 'messages',
  'disputes.json': 'disputes',
  'supporttickets.json': 'supporttickets'
};

async function importSampleData() {
  let client;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  MongoDB Sample Data Import Script                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    
    // Step 1: Drop all existing collections
    console.log('🗑️  Cleaning existing data...');
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      try {
        await db.collection(collection.name).drop();
        console.log(`   ✅ Dropped collection: ${collection.name}`);
      } catch (error) {
        console.log(`   ⚠️  Could not drop ${collection.name}: ${error.message}`);
      }
    }
    console.log(`\n✅ Cleaned ${collections.length} collections\n`);
    
    // Step 2: Import sample data
    console.log('📥 Importing sample data...\n');
    
    let totalImported = 0;
    const importResults = [];
    
    for (const [filename, collectionName] of Object.entries(COLLECTIONS)) {
      const filePath = path.join(SAMPLE_DATA_DIR, filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  File not found: ${filename}`);
        continue;
      }
      
      try {
        // Read and parse JSON file
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const documents = JSON.parse(fileContent);
        
        if (!Array.isArray(documents) || documents.length === 0) {
          console.log(`   ⚠️  ${collectionName}: No documents to import`);
          continue;
        }
        
        // Convert MongoDB extended JSON to proper MongoDB types
        const { ObjectId } = require('mongodb');
        
        const convertExtendedJSON = (obj) => {
          if (obj === null || obj === undefined) return obj;
          
          // Handle arrays
          if (Array.isArray(obj)) {
            return obj.map(item => convertExtendedJSON(item));
          }
          
          // Handle objects
          if (typeof obj === 'object') {
            // Convert $oid to ObjectId
            if (obj.$oid) {
              return new ObjectId(obj.$oid);
            }
            
            // Convert $date to Date
            if (obj.$date) {
              return new Date(obj.$date);
            }
            
            // Recursively process all properties
            const converted = {};
            for (const [key, value] of Object.entries(obj)) {
              converted[key] = convertExtendedJSON(value);
            }
            return converted;
          }
          
          return obj;
        };
        
        const processedDocs = documents.map(doc => convertExtendedJSON(doc));
        
        // Import documents
        const result = await db.collection(collectionName).insertMany(processedDocs);
        const count = result.insertedCount;
        totalImported += count;
        
        importResults.push({ collection: collectionName, count });
        console.log(`   ✅ ${collectionName.padEnd(20)} → ${count} documents`);
        
      } catch (error) {
        console.error(`   ❌ ${collectionName}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  Import Summary                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('Collections imported:\n');
    importResults.forEach(({ collection, count }) => {
      console.log(`   ${collection.padEnd(25)} ${String(count).padStart(4)} documents`);
    });
    
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`   TOTAL:                     ${String(totalImported).padStart(4)} documents`);
    console.log(`${'─'.repeat(60)}\n`);
    
    console.log('✨ Sample data import completed successfully!\n');
    
    // Verify data
    console.log('🔍 Verifying import...');
    const verifyCollections = await db.listCollections().toArray();
    console.log(`   Collections in database: ${verifyCollections.length}`);
    
    console.log('\n✅ All done! Your database is ready for testing.\n');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('👋 Disconnected from MongoDB\n');
    }
  }
}

// Check if sample data directory exists
if (!fs.existsSync(SAMPLE_DATA_DIR)) {
  console.error(`\n❌ Error: Sample data directory not found: ${SAMPLE_DATA_DIR}`);
  console.error('   Make sure you run this script from the project root directory.\n');
  process.exit(1);
}

// Run the import
importSampleData().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

