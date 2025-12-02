import { Schema, model } from "mongoose";

const systemConfigSchema = new Schema({
  // General Settings
  siteName: { type: String, default: "Zembil Marketplace" },
  siteUrl: { type: String },
  supportEmail: { type: String },
  supportPhone: { type: String },
  
  // Operational Settings
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String },
  allowNewRegistrations: { type: Boolean, default: true },
  allowGuestCheckout: { type: Boolean, default: false },
  
  // Financial Settings
  currency: { type: String, default: "USD" },
  commissionRate: { type: Number, default: 10 }, // Platform commission percentage
  taxRate: { type: Number, default: 0 },
  minimumOrderAmount: { type: Number, default: 0 },
  minimumPayoutAmount: { type: Number, default: 100 },
  
  // Payment Methods
  paymentMethods: {
    stripe: {
      enabled: { type: Boolean, default: true },
      publicKey: { type: String },
    },
    paypal: {
      enabled: { type: Boolean, default: true },
      clientId: { type: String },
    },
    cashOnDelivery: {
      enabled: { type: Boolean, default: true },
    },
  },
  
  // Email Settings
  emailProvider: { type: String, enum: ["sendgrid", "mailgun", "ses"], default: "sendgrid" },
  emailFrom: { type: String },
  emailReplyTo: { type: String },
  
  // Storage Settings
  storageProvider: { type: String, enum: ["s3", "cloudinary", "local"], default: "cloudinary" },
  maxUploadSize: { type: Number, default: 10485760 }, // 10MB in bytes
  allowedFileTypes: [{ type: String }],
  
  // Feature Flags
  features: {
    reviews: { type: Boolean, default: true },
    wishlist: { type: Boolean, default: true },
    chat: { type: Boolean, default: true },
    multivendor: { type: Boolean, default: true },
    subscriptions: { type: Boolean, default: false },
    analytics: { type: Boolean, default: true },
    socialLogin: { type: Boolean, default: true },
  },
  
  // Security Settings
  security: {
    sessionTimeout: { type: Number, default: 30 }, // Minutes
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 15 }, // Minutes
    requireEmailVerification: { type: Boolean, default: false },
    requirePhoneVerification: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  
  // SEO Settings
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    googleAnalyticsId: { type: String },
    facebookPixelId: { type: String },
  },
  
  // Social Media Links
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
  },
  
  // Legal
  termsOfServiceUrl: { type: String },
  privacyPolicyUrl: { type: String },
  refundPolicyUrl: { type: String },
  
  // Version & Audit
  version: { type: String, default: "1.0.0" },
  lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  lastModifiedAt: { type: Date },
  
  changeHistory: [
    {
      field: { type: String },
      oldValue: { type: String },
      newValue: { type: String },
      modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
      modifiedAt: { type: Date, default: Date.now },
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

export const SystemConfig = model("SystemConfig", systemConfigSchema);

