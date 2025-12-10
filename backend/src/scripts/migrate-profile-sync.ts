/**
 * Migration Script: Remove Duplicate Email/PhoneNumber from Buyer/Seller
 *
 * Run this script ONCE after deploying the profile sync changes
 * This removes the now-unused email and phoneNumber fields from Buyer and Seller collections
 *
 * Usage:
 *   npx ts-node src/scripts/migrate-profile-sync.ts
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { Buyer } from "../models/buyer";
import { Seller } from "../models/seller";
import { User } from "../models/users";
import { Logger } from "../utils/logger";

// Load environment variables
dotenv.config();

// Use MONGO_URI to match server.ts configuration
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/zembil";

async function migrateBuyerProfiles() {
  console.log("\n📦 Migrating Buyer profiles...");

  try {
    // Remove email and phoneNumber fields from all Buyer documents
    const result = await Buyer.updateMany(
      {},
      {
        $unset: {
          email: "",
          phoneNumber: "",
        },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} buyer profiles`);
    Logger.info("Buyer profiles migrated", { count: result.modifiedCount });

    return result.modifiedCount;
  } catch (error) {
    console.error("❌ Error migrating buyer profiles:", error);
    throw error;
  }
}

async function migrateSellerProfiles() {
  console.log("\n📦 Migrating Seller profiles...");

  try {
    // Remove email and phoneNumber fields from all Seller documents
    const result = await Seller.updateMany(
      {},
      {
        $unset: {
          email: "",
          phoneNumber: "",
        },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} seller profiles`);
    Logger.info("Seller profiles migrated", { count: result.modifiedCount });

    return result.modifiedCount;
  } catch (error) {
    console.error("❌ Error migrating seller profiles:", error);
    throw error;
  }
}

async function syncProfileImages() {
  console.log("\n🖼️  Syncing profile images...");

  try {
    let syncCount = 0;

    // Sync User images to Buyer profiles
    const buyers = await Buyer.find().populate("userId");
    for (const buyer of buyers) {
      const user = buyer.userId as any;
      if (user && user.image && buyer.profileImage !== user.image) {
        buyer.profileImage = user.image;
        await buyer.save();
        syncCount++;
      }
    }

    // Sync User images to Seller profiles
    const sellers = await Seller.find().populate("userId");
    for (const seller of sellers) {
      const user = seller.userId as any;
      if (user && user.image && seller.profileImage !== user.image) {
        seller.profileImage = user.image;
        await seller.save();
        syncCount++;
      }
    }

    console.log(`✅ Synced ${syncCount} profile images`);
    Logger.info("Profile images synced", { count: syncCount });

    return syncCount;
  } catch (error) {
    console.error("❌ Error syncing profile images:", error);
    throw error;
  }
}

async function verifyMigration() {
  console.log("\n🔍 Verifying migration...");

  try {
    // Check for any remaining email/phoneNumber fields
    const buyersWithEmail = await Buyer.countDocuments({
      $or: [
        { email: { $exists: true, $ne: null } },
        { phoneNumber: { $exists: true, $ne: null } },
      ],
    });

    const sellersWithEmail = await Seller.countDocuments({
      $or: [
        { email: { $exists: true, $ne: null } },
        { phoneNumber: { $exists: true, $ne: null } },
      ],
    });

    if (buyersWithEmail === 0 && sellersWithEmail === 0) {
      console.log("✅ Verification passed! No duplicate fields found.");
      return true;
    } else {
      console.log(
        `⚠️  Found ${buyersWithEmail} buyers and ${sellersWithEmail} sellers with duplicate fields`
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Error verifying migration:", error);
    throw error;
  }
}

async function runMigration() {
  console.log("🚀 Starting Profile Sync Migration");
  console.log("=".repeat(50));

  try {
    // Connect to MongoDB
    console.log(`🔌 Connecting to: ${MONGO_URI.replace(/\/\/.*@/, "//***@")}`); // Hide credentials in log
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get current counts
    const userCount = await User.countDocuments();
    const buyerCount = await Buyer.countDocuments();
    const sellerCount = await Seller.countDocuments();

    console.log("\n📊 Current Statistics:");
    console.log(`   Users: ${userCount}`);
    console.log(`   Buyers: ${buyerCount}`);
    console.log(`   Sellers: ${sellerCount}`);

    // Run migrations
    const buyersUpdated = await migrateBuyerProfiles();
    const sellersUpdated = await migrateSellerProfiles();
    const imagesSynced = await syncProfileImages();

    // Verify
    const verified = await verifyMigration();

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📋 Migration Summary:");
    console.log(`   Buyers updated: ${buyersUpdated}`);
    console.log(`   Sellers updated: ${sellersUpdated}`);
    console.log(`   Images synced: ${imagesSynced}`);
    console.log(`   Verification: ${verified ? "PASSED ✅" : "FAILED ❌"}`);
    console.log("=".repeat(50));

    if (verified) {
      console.log("\n🎉 Migration completed successfully!");
    } else {
      console.log("\n⚠️  Migration completed with warnings. Please review.");
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

// Run if executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log("\n✨ Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Fatal error:", error);
      process.exit(1);
    });
}

export {
  migrateBuyerProfiles,
  migrateSellerProfiles,
  runMigration,
  syncProfileImages,
  verifyMigration,
};
