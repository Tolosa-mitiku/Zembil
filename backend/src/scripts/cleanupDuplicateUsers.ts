/**
 * Cleanup Script for Duplicate Users
 * 
 * Run this if you have users with duplicate emails or mismatched UIDs
 * 
 * Usage:
 * ts-node src/scripts/cleanupDuplicateUsers.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/users";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zembil";

async function cleanupDuplicateUsers() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find all users
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users in database`);

    // Group by email
    const emailMap = new Map<string, any[]>();
    users.forEach((user) => {
      const email = user.email;
      if (!emailMap.has(email)) {
        emailMap.set(email, []);
      }
      emailMap.get(email)!.push(user);
    });

    // Find duplicates
    const duplicates: string[] = [];
    emailMap.forEach((userList, email) => {
      if (userList.length > 1) {
        duplicates.push(email);
      }
    });

    if (duplicates.length === 0) {
      console.log("\n✅ No duplicate emails found!");
    } else {
      console.log(`\n⚠️  Found ${duplicates.length} duplicate email(s):`);

      for (const email of duplicates) {
        const userList = emailMap.get(email)!;
        console.log(`\n📧 Email: ${email}`);
        console.log(`   Found ${userList.length} users:`);

        userList.forEach((user, index) => {
          console.log(`   ${index + 1}. UID: ${user.uid}`);
          console.log(`      Name: ${user.name}`);
          console.log(`      Created: ${user.createdAt}`);
          console.log(`      Last Login: ${user.lastLogin || "Never"}`);
        });

        // Keep the most recently used one, delete others
        const sorted = userList.sort((a, b) => {
          const aTime = a.lastLogin || a.createdAt;
          const bTime = b.lastLogin || b.createdAt;
          return bTime.getTime() - aTime.getTime();
        });

        const toKeep = sorted[0];
        const toDelete = sorted.slice(1);

        console.log(`\n   ✅ Keeping: ${toKeep.uid} (${toKeep.name})`);
        console.log(`   🗑️  Deleting ${toDelete.length} duplicate(s)...`);

        for (const user of toDelete) {
          await User.deleteOne({ _id: user._id });
          console.log(`      Deleted: ${user.uid}`);
        }
      }

      console.log(`\n✅ Cleanup complete!`);
    }

    // Show summary
    const finalCount = await User.countDocuments();
    console.log(`\n📊 Final user count: ${finalCount}`);

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  cleanupDuplicateUsers()
    .then(() => {
      console.log("\n✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Script failed:", error);
      process.exit(1);
    });
}

export { cleanupDuplicateUsers };

