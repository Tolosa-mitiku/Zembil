/**
 * Database Initialization Script
 * 
 * This script ensures all indexes are created and validation rules are applied
 * Run this after deploying new schema changes
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

// Import all models to ensure schemas are registered
import {
  User,
  Buyer,
  Seller,
  Product,
  Category,
  Address,
  Order,
  Payment,
  SellerEarnings,
  PayoutRequest,
  Cart,
  Wishlist,
  Review,
  Chat,
  Message,
  Notification,
  Banner,
  FeatureRequest,
  SupportTicket,
  Dispute,
  Refund,
  AuditLog,
  SystemConfig,
  SystemHealth,
  BulkOperation,
  ReportConfig,
  PlatformEvent,
  UserSession,
  Promotion,
  ProductDraft,
} from "../models";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/zembil";

async function initializeDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    console.log("\n📊 Initializing Database Schema...\n");
    
    // List of all models
    const models = [
      { name: "User", model: User },
      { name: "Buyer", model: Buyer },
      { name: "Seller", model: Seller },
      { name: "Product", model: Product },
      { name: "Category", model: Category },
      { name: "Address", model: Address },
      { name: "Order", model: Order },
      { name: "Payment", model: Payment },
      { name: "SellerEarnings", model: SellerEarnings },
      { name: "PayoutRequest", model: PayoutRequest },
      { name: "Cart", model: Cart },
      { name: "Wishlist", model: Wishlist },
      { name: "Review", model: Review },
      { name: "Chat", model: Chat },
      { name: "Message", model: Message },
      { name: "Notification", model: Notification },
      { name: "Banner", model: Banner },
      { name: "FeatureRequest", model: FeatureRequest },
      { name: "SupportTicket", model: SupportTicket },
      { name: "Dispute", model: Dispute },
      { name: "Refund", model: Refund },
      { name: "AuditLog", model: AuditLog },
      { name: "SystemConfig", model: SystemConfig },
      { name: "SystemHealth", model: SystemHealth },
      { name: "BulkOperation", model: BulkOperation },
      { name: "ReportConfig", model: ReportConfig },
      { name: "PlatformEvent", model: PlatformEvent },
      { name: "UserSession", model: UserSession },
      { name: "Promotion", model: Promotion },
      { name: "ProductDraft", model: ProductDraft },
    ];
    
    // Create indexes for all models
    for (const { name, model } of models) {
      try {
        console.log(`   Creating indexes for ${name}...`);
        await model.createIndexes();
        console.log(`   ✅ ${name} indexes created`);
      } catch (error: any) {
        console.error(`   ❌ Failed to create ${name} indexes:`, error.message);
      }
    }
    
    console.log("\n🎯 Database Initialization Summary:\n");
    console.log(`   Total Collections: ${models.length}`);
    console.log(`   Status: ✅ Complete`);
    
    // Create default system config if it doesn't exist
    const configExists = await SystemConfig.findOne();
    if (!configExists) {
      console.log("\n🔧 Creating default system configuration...");
      await SystemConfig.create({
        siteName: "Zembil Marketplace",
        currency: "USD",
        commissionRate: 10,
        maintenanceMode: false,
        allowNewRegistrations: true,
        paymentMethods: {
          stripe: { enabled: true },
          paypal: { enabled: true },
          cashOnDelivery: { enabled: true },
        },
        features: {
          reviews: true,
          wishlist: true,
          chat: true,
          multivendor: true,
          subscriptions: false,
          analytics: true,
          socialLogin: true,
        },
      });
      console.log("✅ Default system configuration created");
    } else {
      console.log("\n✅ System configuration already exists");
    }
    
    console.log("\n✨ Database initialization completed successfully!\n");
    
  } catch (error) {
    console.error("\n❌ Database initialization failed:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

export default initializeDatabase;

