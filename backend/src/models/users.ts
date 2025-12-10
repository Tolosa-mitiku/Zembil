import { Schema, model } from "mongoose";

const userSchema = new Schema({
  // Authentication
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  phoneNumber: { type: String },
  phoneCountryCode: { type: String }, // '+1', '+251'
  role: { type: String, enum: ["buyer", "seller", "admin"], required: true, default: "buyer" },
  
  // FCM Tokens (Multiple devices)
  fcmTokens: [
    {
      token: { type: String, required: true },
      device: { type: String, enum: ["ios", "android", "web"], required: true },
      deviceId: { type: String },
      lastUsed: { type: Date, default: Date.now },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  
  // Verification Status
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date },
  phoneVerifiedAt: { type: Date },
  
  // Account Status & Security
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "banned", "deleted"],
    default: "active",
  },
  suspensionReason: { type: String },
  suspendedAt: { type: Date },
  suspendedBy: { type: Schema.Types.ObjectId, ref: "User" },
  bannedAt: { type: Date },
  bannedBy: { type: Schema.Types.ObjectId, ref: "User" },
  deleteRequestedAt: { type: Date },
  deletedAt: { type: Date },
  
  // Activity Tracking
  lastLogin: { type: Date },
  lastLoginIp: { type: String },
  lastLoginLocation: {
    country: { type: String },
    city: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  loginCount: { type: Number, default: 0 },
  consecutiveLoginDays: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  failedLoginAttempts: { type: Number, default: 0 },
  lastFailedLogin: { type: Date },
  lockedUntil: { type: Date },
  
  // User Preferences
  preferences: {
    language: { type: String, default: "en" },
    currency: { type: String, default: "USD" },
    timezone: { type: String, default: "UTC" },
    dateFormat: { type: String, default: "MM/DD/YYYY" },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      priceAlerts: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
    },
    emailDigest: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ["daily", "weekly", "monthly"], default: "weekly" },
      preferredDay: { type: Number, min: 0, max: 6 }, // 0-6 for Sunday-Saturday
      preferredTime: { type: String, default: "09:00" },
    },
    theme: { type: String, enum: ["light", "dark", "auto"], default: "auto" },
    accessibility: {
      fontSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
      reducedMotion: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
    },
  },
  
  // Marketing & Analytics
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: Schema.Types.ObjectId, ref: "User" },
  referralCount: { type: Number, default: 0 },
  marketingConsent: { type: Boolean, default: false },
  analyticsConsent: { type: Boolean, default: false },
  cookieConsent: { type: Boolean, default: false },
  termsAcceptedAt: { type: Date },
  privacyPolicyAcceptedAt: { type: Date },
  
  // Social Profiles
  socialProfiles: {
    google: { type: String },
    facebook: { type: String },
    apple: { type: String },
    twitter: { type: String },
  },
  
  // Platform Statistics (Cached)
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    accountAge: { type: Number, default: 0 }, // Days since creation
  },
  
  // Active Sessions (Denormalized for quick access)
  activeSessions: [
    {
      sessionId: { type: Schema.Types.ObjectId },
      device: { type: String },
      lastActivity: { type: Date },
    }
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
userSchema.index({ uid: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ accountStatus: 1 });
userSchema.index({ role: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1, accountStatus: 1, createdAt: -1 });

// Pre-save hook to update timestamps
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  
  // Calculate account age if not set
  if (this.isNew && this.createdAt && this.stats) {
    const now = new Date();
    const created = new Date(this.createdAt);
    this.stats.accountAge = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  next();
});

// Post-save hook to sync changes to role-specific profiles
userSchema.post("save", async function (doc) {
  try {
    // Import here to avoid circular dependency
    const { Buyer } = await import("./buyer");
    const { Seller } = await import("./seller");
    
    // Sync profile image if changed
    if (this.isModified("image") && doc.image) {
      if (doc.role === "buyer") {
        await Buyer.updateOne(
          { userId: doc._id },
          { profileImage: doc.image }
        );
      } else if (doc.role === "seller") {
        await Seller.updateOne(
          { userId: doc._id },
          { profileImage: doc.image }
        );
      }
    }
    
    // Sync name to buyer profile if changed
    if (this.isModified("name") && doc.name && doc.role === "buyer") {
      const nameParts = doc.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      await Buyer.updateOne(
        { userId: doc._id },
        {
          firstName,
          lastName,
          displayName: doc.name,
        }
      );
    }
  } catch (error) {
    // Log error but don't throw - sync failures shouldn't block user updates
    console.error("Error syncing user changes to profile:", error);
  }
});

export const User = model("User", userSchema);
