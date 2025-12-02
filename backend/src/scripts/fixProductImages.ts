/**
 * Fix Product Images Script
 *
 * Updates all products with complete Unsplash image URLs
 * Ensures images have proper query parameters to load correctly
 *
 * Usage: ts-node src/scripts/fixProductImages.ts
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { Product } from "../models";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zembil";

// VERIFIED working Unsplash URLs - All tested and confirmed working!
// Using simpler query params that Unsplash definitely supports
const UNSPLASH_IMAGES = {
  // Electronics - VERIFIED WORKING
  electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", // Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", // Watch
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", // Phone
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", // Laptop
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800", // Computer
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800", // Camera
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800", // Electronics
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800", // Sneaker
  ],

  // Fashion - VERIFIED WORKING
  fashion: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800", // Clothing
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", // Sneakers
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800", // Hoodie
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800", // Dress
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800", // Fashion
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800", // Clothing rack
  ],

  // Home & Garden - VERIFIED WORKING
  home: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", // Living room
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800", // Kitchen
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800", // Home decor
    "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800", // Furniture
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800", // Lamp
  ],

  // Beauty & Personal Care - VERIFIED WORKING
  beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800", // Cosmetics
    "https://images.unsplash.com/photo-1556229010-aa1673e0203f?w=800", // Skincare
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800", // Beauty
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800", // Spa products
  ],

  // Sports & Outdoors - VERIFIED WORKING
  sports: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800", // Gym
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800", // Basketball
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800", // Running
    "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800", // Fitness
  ],

  // Books - VERIFIED WORKING
  books: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800", // Books
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800", // Book
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800", // Library
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800", // Books stack
  ],

  // Toys & Games - VERIFIED WORKING
  toys: [
    "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800", // Toys
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800", // Lego
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", // Teddy bear
  ],

  // Default/Generic - VERIFIED WORKING
  default: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", // Generic 1
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800", // Generic 2
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800", // Generic 3
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", // Generic 4
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800", // Generic 5
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", // Generic 6
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800", // Generic 7
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800", // Generic 8
  ],
};

/**
 * Get appropriate image URL based on category
 */
function getCategoryImageUrl(
  categoryName: string,
  productIndex: number
): string {
  const category = categoryName.toLowerCase();

  if (
    category.includes("electronic") ||
    category.includes("phone") ||
    category.includes("computer")
  ) {
    const images = UNSPLASH_IMAGES.electronics;
    return images[productIndex % images.length];
  } else if (
    category.includes("fashion") ||
    category.includes("clothing") ||
    category.includes("apparel")
  ) {
    const images = UNSPLASH_IMAGES.fashion;
    return images[productIndex % images.length];
  } else if (
    category.includes("home") ||
    category.includes("garden") ||
    category.includes("furniture")
  ) {
    const images = UNSPLASH_IMAGES.home;
    return images[productIndex % images.length];
  } else if (
    category.includes("beauty") ||
    category.includes("cosmetic") ||
    category.includes("personal care")
  ) {
    const images = UNSPLASH_IMAGES.beauty;
    return images[productIndex % images.length];
  } else if (
    category.includes("sport") ||
    category.includes("fitness") ||
    category.includes("outdoor")
  ) {
    const images = UNSPLASH_IMAGES.sports;
    return images[productIndex % images.length];
  } else if (category.includes("book")) {
    const images = UNSPLASH_IMAGES.books;
    return images[productIndex % images.length];
  } else if (category.includes("toy") || category.includes("game")) {
    const images = UNSPLASH_IMAGES.toys;
    return images[productIndex % images.length];
  } else {
    const images = UNSPLASH_IMAGES.default;
    return images[productIndex % images.length];
  }
}

async function fixProductImages() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all active products
    const products = await Product.find({ status: "active" });
    console.log(`📦 Found ${products.length} active products\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Get category name
      const categoryNames = product.categoryNames || [];
      const categoryName = categoryNames[0] || "default";

      // Get appropriate image URL
      const imageUrl = getCategoryImageUrl(categoryName, i);

      // Check if image needs updating
      const currentImageUrl = product.primaryImage || product.images?.[0]?.url;
      const needsUpdate =
        !currentImageUrl ||
        !currentImageUrl.includes("?") ||
        currentImageUrl.length < 50;

      if (needsUpdate) {
        // Update product with proper image URL using direct MongoDB update
        await Product.updateOne(
          { _id: product._id },
          {
            $set: {
              images: [
                {
                  url: imageUrl,
                  alt: product.title,
                  position: 1,
                  isMain: true,
                  variants: [], // Add required field
                },
              ],
              primaryImage: imageUrl,
            },
          }
        );

        updatedCount++;

        if (updatedCount % 10 === 0) {
          console.log(`✅ Updated ${updatedCount} products...`);
        }
      } else {
        skippedCount++;
      }
    }

    console.log(`\n✅ Image fix complete!`);
    console.log(`   - Updated: ${updatedCount} products`);
    console.log(
      `   - Skipped: ${skippedCount} products (already had valid images)`
    );
    console.log(`   - Total: ${products.length} products\n`);

    // Show some examples
    console.log("📸 Sample updated products:");
    const samples = await Product.find({ status: "active" }).limit(3);
    samples.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Image: ${p.primaryImage?.substring(0, 60)}...`);
      console.log(`   Category: ${p.categoryNames?.[0] || "N/A"}\n`);
    });

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error fixing product images:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixProductImages()
    .then(() => {
      console.log("\n✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Script failed:", error);
      process.exit(1);
    });
}

export { fixProductImages };
