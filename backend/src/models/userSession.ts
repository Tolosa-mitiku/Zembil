import { Schema, model } from "mongoose";

const userSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firebaseUID: { type: String, required: true }, // For easier Firebase user lookups
  
  sessionToken: { type: String, unique: true, sparse: true }, // Auto-generated, optional
  refreshToken: { type: String },
  
  // Device Information
  device: {
    type: { type: String, enum: ["ios", "android", "web", "desktop", "mobile", "tablet"] },
    deviceId: { type: String },
    model: { type: String },
    os: { type: String },
    osVersion: { type: String },
    browser: { type: String },
    browserVersion: { type: String },
    appVersion: { type: String },
    userAgent: { type: String }, // Full user agent string
  },
  
  // Location Information
  location: {
    ip: { type: String },
    country: { type: String },
    countryCode: { type: String },
    city: { type: String },
    region: { type: String },
    timezone: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  
  // Session Status
  isActive: { type: Boolean, default: true },
  lastActivity: { type: Date, default: Date.now },
  
  // Security
  loginMethod: { type: String, enum: ["password", "google", "apple", "facebook", "email"] },
  isTwoFactorVerified: { type: Boolean, default: false },
  isTrusted: { type: Boolean, default: false },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now }, // Login time
  expiresAt: { type: Date }, // Session expiration
  loggedOutAt: { type: Date },
}, {
  timestamps: true,
});

// Pre-save hook to set expiration and generate session token
userSessionSchema.pre("save", function (next) {
  if (this.isNew) {
    // Set expiration (30 days from creation)
    if (!this.expiresAt) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      this.expiresAt = expirationDate;
    }
    
    // Generate session token if not provided
    if (!this.sessionToken) {
      this.sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
  }
  next();
});

// Indexes
userSessionSchema.index({ userId: 1 });
userSessionSchema.index({ firebaseUID: 1 });
userSessionSchema.index({ sessionToken: 1 }, { unique: true, sparse: true });
userSessionSchema.index({ isActive: 1 });
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
userSessionSchema.index({ userId: 1, isActive: 1 });
userSessionSchema.index({ firebaseUID: 1, isActive: 1 });

export const UserSession = model("UserSession", userSessionSchema);

