/**
 * Quick script to check what's in your database
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/users";
import { Buyer } from "../models/buyer";
import { Seller } from "../models/seller";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/zembil";

async function checkDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log(`📍 URI: ${MONGO_URI.replace(/\/\/.*@/, '//***@')}`);
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check counts
    const userCount = await User.countDocuments();
    const buyerCount = await Buyer.countDocuments();
    const sellerCount = await Seller.countDocuments();

    console.log("📊 Database Statistics:");
    console.log(`   Users: ${userCount}`);
    console.log(`   Buyers: ${buyerCount}`);
    console.log(`   Sellers: ${sellerCount}`);

    if (userCount > 0) {
      console.log("\n👥 Sample Users:");
      const users = await User.find().limit(3);
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }

    if (buyerCount > 0) {
      console.log("\n🛍️  Checking Buyer fields:");
      const buyer = await Buyer.findOne().lean();
      console.log(`   Has email field: ${(buyer as any)?.email !== undefined}`);
      console.log(`   Has phoneNumber field: ${(buyer as any)?.phoneNumber !== undefined}`);
      console.log(`   Has profileImage field: ${buyer?.profileImage !== undefined}`);
      console.log(`   Has userId reference: ${buyer?.userId !== undefined}`);
      if (buyer?.userId) {
        const user = await User.findById(buyer.userId);
        console.log(`   Linked User email: ${user?.email || 'N/A'}`);
      }
    }

    if (sellerCount > 0) {
      console.log("\n🏪 Checking Seller fields:");
      const seller = await Seller.findOne().lean();
      console.log(`   Has email field: ${(seller as any)?.email !== undefined}`);
      console.log(`   Has phoneNumber field: ${(seller as any)?.phoneNumber !== undefined}`);
      console.log(`   Has profileImage field: ${seller?.profileImage !== undefined}`);
      console.log(`   Has userId reference: ${seller?.userId !== undefined}`);
      if (seller?.userId) {
        const user = await User.findById(seller.userId);
        console.log(`   Linked User email: ${user?.email || 'N/A'}`);
      }
    }

    if (userCount === 0 && buyerCount === 0 && sellerCount === 0) {
      console.log("\n⚠️  Database is empty!");
      console.log("   Either:");
      console.log("   1. You haven't created any users yet");
      console.log("   2. You're connected to the wrong database");
      console.log("   3. Check your MONGO_URI environment variable");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

checkDatabase();

