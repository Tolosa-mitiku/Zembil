/**
 * Create Text Index for Product Search
 * Run with: node create-search-index.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zembil";

async function createSearchIndex() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Check existing indexes
    console.log('📋 Checking existing indexes...');
    const existingIndexes = await productsCollection.indexes();
    console.log('Current indexes:', existingIndexes.map(idx => idx.name));

    // Check if text index already exists
    const hasTextIndex = existingIndexes.some(idx => 
      idx.name.includes('text') || 
      (idx.key && (idx.key.title === 'text' || idx.key.description === 'text'))
    );

    if (hasTextIndex) {
      console.log('\n⚠️  Text index already exists. Dropping old one...');
      
      // Drop existing text indexes
      for (const idx of existingIndexes) {
        if (idx.name.includes('text') || (idx.key && (idx.key.title === 'text' || idx.key.description === 'text'))) {
          await productsCollection.dropIndex(idx.name);
          console.log(`   Dropped index: ${idx.name}`);
        }
      }
    }

    // Create comprehensive text index
    console.log('\n🔨 Creating text index on products...');
    await productsCollection.createIndex(
      {
        title: 'text',
        description: 'text',
        shortDescription: 'text',
        'categoryNames': 'text',
        brand: 'text',
        tags: 'text',
      },
      {
        name: 'product_text_search',
        weights: {
          title: 10,           // Highest priority
          brand: 8,
          tags: 6,
          categoryNames: 5,
          shortDescription: 3,
          description: 1,      // Lowest priority
        },
        default_language: 'english',
      }
    );

    console.log('✅ Text index created successfully!\n');

    // Test the search
    console.log('🧪 Testing search functionality...');
    
    const testQueries = ['phone', 'laptop', 'headphones'];
    
    for (const query of testQueries) {
      const results = await productsCollection.find(
        { $text: { $search: query }, status: 'active' },
        { score: { $meta: 'textScore' } }
      ).limit(3).toArray();
      
      console.log(`\n   Search "${query}": Found ${results.length} results`);
      if (results.length > 0) {
        results.forEach((p, idx) => {
          console.log(`   ${idx + 1}. ${p.title}`);
        });
      }
    }

    console.log('\n✅ Search is working!');
    console.log('You can now search for products in your application.\n');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSearchIndex();







