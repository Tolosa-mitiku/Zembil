import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true }, // Denormalized
  
  // Business Type
  type: { type: String, enum: ["individual", "store"], required: true },
  
  // Business Information
  businessName: { type: String },
  businessRegistrationNumber: { type: String, unique: true, sparse: true },
  taxId: { type: String, unique: true, sparse: true },
  vatNumber: { type: String },
  legalName: { type: String },
  tradeName: { type: String }, // DBA (Doing Business As)
  businessType: { type: String, enum: ["sole_proprietor", "llc", "corporation", "partnership"] },
  
  // Contact Information (email/phoneNumber from User model)
  alternatePhone: { type: String },
  website: { type: String },
  
  // Profile Media
  profileImage: { type: String },
  coverImage: { type: String },
  logoImage: { type: String },
  bannerImages: [{ type: String }],
  
  // Business Address
  address: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    geolocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
  },
  
  // Verification
  verification: {
    status: { type: String, enum: ["pending", "in_review", "verified", "rejected", "suspended"], default: "pending" },
    level: { type: String, enum: ["basic", "standard", "premium"], default: "basic" },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    expiresAt: { type: Date },
    rejectionReason: { type: String },
    rejectionDetails: { type: String },
    documents: [
      {
        type: { type: String, enum: ["id_card", "business_license", "tax_cert", "utility_bill"] },
        url: { type: String },
        fileName: { type: String },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        uploadedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
      }
    ],
    identityVerified: { type: Boolean, default: false },
    businessVerified: { type: Boolean, default: false },
    bankAccountVerified: { type: Boolean, default: false },
  },
  
  // Financial Information
  bankAccount: {
    accountHolderName: { type: String },
    accountType: { type: String, enum: ["checking", "savings"] },
    accountNumber: { type: String }, // Should be encrypted
    routingNumber: { type: String },
    swiftCode: { type: String },
    iban: { type: String },
    bankName: { type: String },
    bankBranch: { type: String },
    bankAddress: {
      city: { type: String },
      country: { type: String },
    },
    currency: { type: String, default: "USD" },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
  },
  
  // Payout Settings
  payoutSettings: {
    minimumPayoutAmount: { type: Number, default: 100 },
    payoutSchedule: { type: String, enum: ["daily", "weekly", "biweekly", "monthly"], default: "weekly" },
    payoutDay: { type: Number }, // Day of week (1-7) or month (1-31)
    holdPeriod: { type: Number, default: 7 }, // Days
    autoPayoutEnabled: { type: Boolean, default: true },
  },
  
  // Store Information
  storeInfo: {
    aboutUs: { type: String, maxlength: 5000 },
    description: { type: String, maxlength: 500 },
    returnPolicy: { type: String, maxlength: 5000 },
    shippingPolicy: { type: String, maxlength: 5000 },
    privacyPolicy: { type: String, maxlength: 5000 },
    termsAndConditions: { type: String, maxlength: 5000 },
    warrantyInfo: { type: String },
    faq: [
      {
        question: { type: String },
        answer: { type: String },
        order: { type: Number },
      }
    ],
  },
  
  // Shipping Configuration
  shipping: {
    shipsFrom: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    shippingZones: [
      {
        name: { type: String },
        countries: [{ type: String }],
        regions: [{ type: String }],
        postalCodes: [{ type: String }],
        shippingMethods: [
          {
            name: { type: String },
            carrier: { type: String },
            estimatedDays: {
              min: { type: Number },
              max: { type: Number },
            },
            cost: {
              baseRate: { type: Number },
              perKg: { type: Number },
              perItem: { type: Number },
              freeShippingThreshold: { type: Number },
            },
            isActive: { type: Boolean, default: true },
          }
        ],
      }
    ],
    processingTime: {
      min: { type: Number },
      max: { type: Number },
    },
    cutoffTime: { type: String }, // '15:00'
    handlesOwnShipping: { type: Boolean, default: true },
    usesPlatformShipping: { type: Boolean, default: false },
  },
  
  // Business Hours
  businessHours: {
    monday: { isOpen: { type: Boolean }, open: { type: String }, close: { type: String } },
    tuesday: { isOpen: { type: Boolean }, open: { type: String }, close: { type: String } },
    wednesday: { isOpen: { type: Boolean }, open: { type: String }, close: { type: String } },
    thursday: { isOpen: { type: Boolean }, open: { type: String }, close: { type: String } },
    friday: { isOpen: { type: Boolean }, open: { type: String }, close: { type: String } },
    saturday: { isOpen: { type: Boolean }, open: { type: String }, close: { type: String } },
    sunday: { isOpen: { type: Boolean }, open: { type: String }, close: { type: String } },
    timezone: { type: String },
    holidays: [
      {
        name: { type: String },
        date: { type: Date },
        isClosed: { type: Boolean },
      }
    ],
  },
  
  // Performance Metrics (Cached)
  metrics: {
    // Sales Metrics
    totalOrders: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    
    // Product Metrics
    totalProducts: { type: Number, default: 0 },
    activeProducts: { type: Number, default: 0 },
    outOfStockProducts: { type: Number, default: 0 },
    
    // Customer Metrics
    totalCustomers: { type: Number, default: 0 },
    repeatCustomerRate: { type: Number, default: 0 },
    customerRetentionRate: { type: Number, default: 0 },
    
    // Performance Metrics
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    rating1Star: { type: Number, default: 0 },
    rating2Star: { type: Number, default: 0 },
    rating3Star: { type: Number, default: 0 },
    rating4Star: { type: Number, default: 0 },
    rating5Star: { type: Number, default: 0 },
    
    // Response & Fulfillment
    averageResponseTime: { type: Number, default: 0 }, // Hours
    responseRate: { type: Number, default: 0 }, // Percentage
    orderCompletionRate: { type: Number, default: 100 },
    onTimeDeliveryRate: { type: Number, default: 100 },
    orderCancellationRate: { type: Number, default: 0 },
    
    // Financial
    pendingEarnings: { type: Number, default: 0 },
    availableEarnings: { type: Number, default: 0 },
    totalPayouts: { type: Number, default: 0 },
    lastPayoutDate: { type: Date },
    nextPayoutDate: { type: Date },
    
    // Period Metrics
    last30Days: {
      sales: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      newCustomers: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
    lastUpdated: { type: Date },
  },
  
  // Customer Analytics
  customers: {
    total: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    returning: { type: Number, default: 0 },
    repeatPurchaseRate: { type: Number, default: 0 },
    averageLifetimeValue: { type: Number, default: 0 },
    topCustomers: [
      {
        buyerId: { type: Schema.Types.ObjectId, ref: "Buyer" },
        totalOrders: { type: Number },
        totalSpent: { type: Number },
        lastOrderDate: { type: Date },
      }
    ],
  },
  
  // Settings
  settings: {
    autoAcceptOrders: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
    vacationMode: {
      isEnabled: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
      message: { type: String },
      autoDisable: { type: Boolean, default: true },
    },
    inventory: {
      lowStockThreshold: { type: Number, default: 10 },
      notifyOnLowStock: { type: Boolean, default: true },
      allowBackorders: { type: Boolean, default: false },
      hideOutOfStock: { type: Boolean, default: false },
    },
    orders: {
      autoConfirmAfterHours: { type: Number, default: 24 },
      autoMarkDeliveredAfterDays: { type: Number, default: 7 },
      allowCancellation: { type: Boolean, default: true },
      cancellationWindow: { type: Number, default: 24 }, // Hours
    },
    returns: {
      acceptReturns: { type: Boolean, default: true },
      returnWindow: { type: Number, default: 30 }, // Days
      returnShippingPaidBy: { type: String, enum: ["seller", "buyer", "split"], default: "buyer" },
      restockingFee: { type: Number, default: 0 }, // Percentage
    },
  },
  
  // Subscription & Features
  subscription: {
    plan: { type: String, enum: ["free", "basic", "pro", "enterprise"], default: "free" },
    status: { type: String, enum: ["active", "canceled", "past_due", "trialing"], default: "active" },
    startDate: { type: Date },
    endDate: { type: Date },
    renewalDate: { type: Date },
    features: {
      maxProducts: { type: Number, default: 100 },
      prioritySupport: { type: Boolean, default: false },
      advancedAnalytics: { type: Boolean, default: false },
      bulkUpload: { type: Boolean, default: false },
      customBranding: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
    },
    billingCycle: { type: String, enum: ["monthly", "yearly"] },
    amount: { type: Number },
  },
  
  // Social Media
  social: {
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    tiktok: { type: String },
  },
  
  // SEO & Discovery
  seo: {
    slug: { type: String, unique: true, sparse: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    customUrl: { type: String },
  },
  
  // Compliance
  compliance: {
    gdprCompliant: { type: Boolean, default: false },
    ccpaCompliant: { type: Boolean, default: false },
    coppaCompliant: { type: Boolean, default: false },
    hipaaCompliant: { type: Boolean, default: false },
    lastAuditDate: { type: Date },
    certifications: [
      {
        name: { type: String },
        issuedBy: { type: String },
        certificateUrl: { type: String },
        issuedAt: { type: Date },
        expiresAt: { type: Date },
      }
    ],
  },
  
  // Platform Relationship
  platformRelationship: {
    joinedAt: { type: Date },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    accountManager: { type: Schema.Types.ObjectId, ref: "User" },
    preferredSupport: { type: String, enum: ["email", "phone", "chat"], default: "email" },
    notes: { type: String }, // Internal admin notes
    flags: [{ type: String }], // 'vip', 'high_risk', 'needs_attention'
  },
  
  // Badges
  badges: [
    {
      type: { type: String },
      awardedAt: { type: Date },
      expiresAt: { type: Date },
    }
  ],
  
  // Legacy fields (kept for backward compatibility)
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date },
}, {
  timestamps: true,
});

// Indexes
sellerSchema.index({ userId: 1 }, { unique: true });
sellerSchema.index({ firebaseUID: 1 }, { unique: true });
sellerSchema.index({ "verification.status": 1 });
sellerSchema.index({ "metrics.averageRating": -1 });
sellerSchema.index({ "metrics.totalSales": -1 });
sellerSchema.index({ "seo.slug": 1 }, { unique: true, sparse: true });
sellerSchema.index({ businessRegistrationNumber: 1 }, { unique: true, sparse: true });
sellerSchema.index({ createdAt: -1 });
sellerSchema.index({ "verification.status": 1, "metrics.averageRating": -1, "metrics.totalSales": -1 });
sellerSchema.index({ "address.geolocation": "2dsphere" });

// Pre-save hook
sellerSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  
  // Auto-generate slug from business name if not set
  if (this.isModified("businessName") && this.businessName && this.seo && !this.seo.slug) {
    this.seo.slug = this.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  next();
});

export const Seller = model("Seller", sellerSchema);
