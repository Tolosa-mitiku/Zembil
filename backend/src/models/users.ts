import { Schema, model } from "mongoose";

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  phoneNumber: { type: String },
  role: { type: String, enum: ["buyer", "seller", "admin"], required: true, default: "buyer" },
  fcmToken: { type: String }, // For push notifications
  // Verification status
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  // Account status
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "banned"],
    default: "active",
  },
  suspensionReason: { type: String },
  // Activity tracking
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
  // User preferences
  preferences: {
    language: { type: String, default: "en" },
    currency: { type: String, default: "USD" },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    theme: { type: String, enum: ["light", "dark", "auto"], default: "auto" },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
userSchema.index({ uid: 1 });
userSchema.index({ email: 1 });
userSchema.index({ accountStatus: 1 });

export const User = model("User", userSchema);
