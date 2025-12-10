/**
 * Force cleanup of duplicate fields
 * This script directly removes the fields from the MongoDB documents
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/zembil";

async function forceCleanup() {
  try {
    console.log("🚀 Force Cleanup of Duplicate Fields");
    console.log("=".repeat(50));
    console.log(`🔌 Connecting to: ${MONGO_URI.replace(/\/\/.*@/, "//***@")}`);
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    // Get collections directly
    const buyersCollection = db.collection("buyers");
    const sellersCollection = db.collection("sellers");

    // Check current state
    console.log("📊 Current State:");
    const buyerSample = await buyersCollection.findOne({});
    const sellerSample = await sellersCollection.findOne({});
    
    console.log("\nBuyer sample fields:", buyerSample ? Object.keys(buyerSample) : "No buyers");
    console.log("Seller sample fields:", sellerSample ? Object.keys(sellerSample) : "No sellers");

    // Force unset on buyers
    console.log("\n🧹 Cleaning Buyer collection...");
    const buyerResult = await buyersCollection.updateMany(
      {},
      {
        $unset: {
          email: "",
          phoneNumber: "",
        },
      }
    );
    console.log(`✅ Matched: ${buyerResult.matchedCount}, Modified: ${buyerResult.modifiedCount}`);

    // Force unset on sellers
    console.log("\n🧹 Cleaning Seller collection...");
    const sellerResult = await sellersCollection.updateMany(
      {},
      {
        $unset: {
          email: "",
          phoneNumber: "",
        },
      }
    );
    console.log(`✅ Matched: ${sellerResult.matchedCount}, Modified: ${sellerResult.modifiedCount}`);

    // Verify after cleanup
    console.log("\n🔍 Verifying cleanup...");
    const buyerAfter = await buyersCollection.findOne({});
    const sellerAfter = await sellersCollection.findOne({});

    const buyerHasEmail = buyerAfter && "email" in buyerAfter;
    const buyerHasPhone = buyerAfter && "phoneNumber" in buyerAfter;
    const sellerHasEmail = sellerAfter && "email" in sellerAfter;
    const sellerHasPhone = sellerAfter && "phoneNumber" in sellerAfter;

    console.log("\n✅ Verification Results:");
    console.log(`   Buyer has email: ${buyerHasEmail ? "❌ YES (still there!)" : "✅ NO (removed)"}`);
    console.log(`   Buyer has phoneNumber: ${buyerHasPhone ? "❌ YES (still there!)" : "✅ NO (removed)"}`);
    console.log(`   Seller has email: ${sellerHasEmail ? "❌ YES (still there!)" : "✅ NO (removed)"}`);
    console.log(`   Seller has phoneNumber: ${sellerHasPhone ? "❌ YES (still there!)" : "✅ NO (removed)"}`);

    if (!buyerHasEmail && !buyerHasPhone && !sellerHasEmail && !sellerHasPhone) {
      console.log("\n🎉 Success! All duplicate fields removed!");
    } else {
      console.log("\n⚠️  Some fields still exist. Manual inspection needed.");
      if (buyerAfter) {
        console.log("\nBuyer document sample:");
        console.log(JSON.stringify(buyerAfter, null, 2).substring(0, 500));
      }
    }

    console.log("\n" + "=".repeat(50));
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

forceCleanup();

