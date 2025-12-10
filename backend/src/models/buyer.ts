import { Schema, model } from "mongoose";

const buyerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true }, // Denormalized for quick lookup
  
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  displayName: { type: String }, // Auto-generated: firstName + lastName
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
  
  // Profile Media (synced from User)
  profileImage: { type: String },
  
  // Shopping Preferences
  preferences: {
    favoriteCategories: [{ type: String }],
    preferredBrands: [{ type: String }],
    sizePreferences: {
      clothing: { type: String },
      shoes: { type: String },
    },
    priceRange: {
      min: { type: Number },
      max: { type: Number },
    },
    notifyWhenBackInStock: { type: Boolean, default: true },
    saveForLater: { type: Boolean, default: true },
  },
  
  // Loyalty & Rewards Program
  loyalty: {
    tier: { type: String, enum: ["bronze", "silver", "gold", "platinum"], default: "bronze" },
    points: { type: Number, default: 0 },
    pointsLifetime: { type: Number, default: 0 },
    tierUpgradeDate: { type: Date },
    nextTierRequirement: { type: Number },
  },
  
  // Shopping Behavior Analytics
  analytics: {
    averageOrderValue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    favoritePaymentMethod: { type: String },
    mostOrderedCategory: { type: String },
    viewedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Last 50
    searchHistory: [
      {
        query: { type: String },
        timestamp: { type: Date, default: Date.now },
        resultsCount: { type: Number },
      }
    ],
    abandonedCarts: { type: Number, default: 0 },
  },
  
  // Communication Preferences
  communicationPreferences: {
    preferredContactMethod: { type: String, enum: ["email", "sms", "phone", "push"], default: "email" },
    bestTimeToContact: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "18:00" },
      timezone: { type: String },
    },
  },
  
  // Saved Payment Methods (Tokenized)
  savedPaymentMethods: [
    {
      id: { type: String },
      type: { type: String, enum: ["card", "paypal", "bank_account"] },
      provider: { type: String }, // 'stripe', 'paypal'
      last4: { type: String },
      brand: { type: String }, // 'visa', 'mastercard'
      expiryMonth: { type: Number },
      expiryYear: { type: Number },
      isDefault: { type: Boolean, default: false },
      billingAddress: { type: Schema.Types.ObjectId, ref: "Address" },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  
  // Social Features
  social: {
    followedSellers: [{ type: Schema.Types.ObjectId, ref: "Seller" }],
    followedBy: { type: Number, default: 0 },
    publicProfile: { type: Boolean, default: false },
    allowReviews: { type: Boolean, default: true },
  },
  
  // Trust & Safety
  trust: {
    trustScore: { type: Number, default: 50, min: 0, max: 100 },
    fraudAlerts: { type: Number, default: 0 },
    lastFraudCheck: { type: Date },
    verifiedPurchaser: { type: Boolean, default: false },
    verifiedReviewer: { type: Boolean, default: false },
  },
  
  // Delivery Addresses (Deprecated - moved to Address collection)
  deliveryAddresses: [
    {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
      geolocation: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
  ],
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
buyerSchema.index({ userId: 1 }, { unique: true });
buyerSchema.index({ firebaseUID: 1 }, { unique: true });
buyerSchema.index({ "loyalty.tier": 1 });
buyerSchema.index({ "trust.trustScore": 1 });
buyerSchema.index({ "loyalty.tier": 1, "analytics.totalSpent": -1 });

// Pre-save hook to auto-generate display name
buyerSchema.pre("save", function (next) {
  if (this.firstName && this.lastName) {
    this.displayName = `${this.firstName} ${this.lastName}`;
  }
  this.updatedAt = new Date();
  
  // Limit search history to last 20 items
  if (this.analytics && this.analytics.searchHistory && Array.isArray(this.analytics.searchHistory) && this.analytics.searchHistory.length > 20) {
    this.analytics.searchHistory = this.analytics.searchHistory.slice(-20) as any;
  }
  
  // Limit viewed products to last 50
  if (this.analytics && this.analytics.viewedProducts && Array.isArray(this.analytics.viewedProducts) && this.analytics.viewedProducts.length > 50) {
    this.analytics.viewedProducts = this.analytics.viewedProducts.slice(-50) as any;
  }
  
  next();
});

export const Buyer = model("Buyer", buyerSchema);
