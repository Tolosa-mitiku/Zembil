import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
  firebaseUID: { type: String, ref: "User", required: true }, // Firebase UID reference to User
  type: { type: String, enum: ["individual", "store"], required: true },
  businessName: { type: String }, // Only for store sellers
  phoneNumber: { type: String, required: true },
  profileImage: { type: String }, // URL to profile image
  coverImage: { type: String }, // Store cover/banner image
  address: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    geolocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  // Verification
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verificationDocuments: [{ type: String }], // URLs to ID, business license, etc.
  taxId: { type: String }, // Tax ID or EIN
  rejectionReason: { type: String }, // If verification rejected
  // Financial
  bankAccount: {
    accountHolderName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    routingNumber: { type: String },
    swiftCode: { type: String },
  },
  // Store Information
  aboutUs: { type: String },
  returnPolicy: { type: String },
  shippingPolicy: { type: String },
  shippingZones: [
    {
      region: { type: String },
      shippingFee: { type: Number },
      estimatedDays: { type: Number },
    },
  ],
  // Business Hours (optional)
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  // Products & Performance
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  // Metrics
  metrics: {
    averageResponseTime: { type: Number, default: 0 }, // in hours
    orderCompletionRate: { type: Number, default: 0 }, // percentage
    onTimeDeliveryRate: { type: Number, default: 0 }, // percentage
    totalOrders: { type: Number, default: 0 },
  },
  // Settings
  settings: {
    autoAcceptOrders: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
    vacationMode: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
sellerSchema.index({ firebaseUID: 1 });
sellerSchema.index({ verificationStatus: 1 });
sellerSchema.index({ averageRating: -1 });
sellerSchema.index({ totalSales: -1 });

export const Seller = model("Seller", sellerSchema);
