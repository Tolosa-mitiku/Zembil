/**
 * Script to check for duplicate users in the database
 * Run with: npx ts-node src/scripts/check-duplicate-users.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/users";
import { Wishlist } from "../models/wishlist";

dotenv.config();

async function checkDuplicateUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/zembil";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    console.log("\n=== CHECKING FOR DUPLICATE USERS ===\n");

    // Find duplicate UIDs
    const duplicateUids = await User.aggregate([
      { $group: { _id: "$uid", count: { $sum: 1 }, users: { $push: { id: "$_id", email: "$email", name: "$name" } } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (duplicateUids.length > 0) {
      console.log("⚠️ FOUND DUPLICATE UIDs:");
      duplicateUids.forEach((dup) => {
        console.log(`  UID: ${dup._id}`);
        console.log(`  Count: ${dup.count}`);
        console.log(`  Users:`, dup.users);
        console.log("");
      });
    } else {
      console.log("✅ No duplicate UIDs found");
    }

    // Find duplicate emails
    const duplicateEmails = await User.aggregate([
      { $group: { _id: "$email", count: { $sum: 1 }, users: { $push: { id: "$_id", uid: "$uid", name: "$name" } } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (duplicateEmails.length > 0) {
      console.log("\n⚠️ FOUND DUPLICATE EMAILS:");
      duplicateEmails.forEach((dup) => {
        console.log(`  Email: ${dup._id}`);
        console.log(`  Count: ${dup.count}`);
        console.log(`  Users:`, dup.users);
        console.log("");
      });
    } else {
      console.log("✅ No duplicate emails found");
    }

    console.log("\n=== CHECKING WISHLIST ASSOCIATIONS ===\n");

    // Get all wishlists and check if their userIds exist
    const wishlists = await Wishlist.find({}).lean();
    console.log(`Found ${wishlists.length} wishlists total`);

    for (const wishlist of wishlists) {
      const user = await User.findById(wishlist.userId).lean();
      console.log(`\nWishlist ${wishlist._id}:`);
      console.log(`  userId: ${wishlist.userId}`);
      console.log(`  products count: ${wishlist.products?.length || 0}`);
      
      if (user) {
        console.log(`  ✅ User found: ${user.email} (uid: ${user.uid})`);
      } else {
        console.log(`  ❌ NO USER FOUND for this wishlist!`);
      }
    }

    // Check specific user from the issue
    const targetUid = "dGfgu91dCHNA9s2fSCEbYfgFHhG2";
    console.log(`\n=== CHECKING SPECIFIC USER (${targetUid}) ===\n`);
    
    const usersWithUid = await User.find({ uid: targetUid }).lean();
    console.log(`Users found with uid "${targetUid}": ${usersWithUid.length}`);
    usersWithUid.forEach((u, i) => {
      console.log(`  User ${i + 1}:`);
      console.log(`    _id: ${u._id}`);
      console.log(`    email: ${u.email}`);
      console.log(`    name: ${u.name}`);
    });

    // Find wishlist for this user
    if (usersWithUid.length > 0) {
      for (const u of usersWithUid) {
        const userWishlist = await Wishlist.findOne({ userId: u._id }).lean();
        console.log(`\n  Wishlist for user ${u._id}:`);
        if (userWishlist) {
          console.log(`    ✅ Found: ${userWishlist._id}`);
          console.log(`    Products: ${userWishlist.products?.length || 0}`);
        } else {
          console.log(`    ❌ No wishlist found`);
          
          // Try to find any wishlist with similar ID
          const allWishlistUserIds = await Wishlist.distinct('userId');
          console.log(`\n    All wishlist userIds in DB:`);
          allWishlistUserIds.forEach(uid => {
            const match = uid?.toString() === u._id?.toString();
            console.log(`      ${uid} ${match ? '✅ MATCH' : ''}`);
          });
        }
      }
    }

    console.log("\n=== CHECK COMPLETE ===\n");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

checkDuplicateUsers();

