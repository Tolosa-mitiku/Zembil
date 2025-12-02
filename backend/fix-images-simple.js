/**
 * Simple JavaScript version to fix product images
 * Run with: node fix-images-simple.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zembil";

// Real, complete Unsplash URLs
const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop',
];

async function fixImages() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Get all products
    const products = await productsCollection.find({ status: 'active' }).toArray();
    console.log(`📦 Found ${products.length} active products\n`);

    let updated = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageUrl = UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length];

      await productsCollection.updateOne(
        { _id: product._id },
        {
          $set: {
            images: [
              {
                url: imageUrl,
                alt: product.title,
                position: 1,
                isMain: true,
                variants: [],
              }
            ],
            primaryImage: imageUrl,
          }
        }
      );

      updated++;
      if (updated % 10 === 0) {
        console.log(`✅ Updated ${updated}/${products.length} products...`);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} products!`);
    
    // Show samples
    console.log('\n📸 Sample products:');
    const samples = await productsCollection.find({ status: 'active' }).limit(3).toArray();
    samples.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Image: ${p.primaryImage}`);
    });

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    console.log('✅ Done! Refresh your browser to see the images.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixImages();

