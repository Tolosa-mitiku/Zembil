import { Schema, model } from "mongoose";

const productSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  
  // Denormalized Seller Info (for performance)
  sellerInfo: {
    name: { type: String },
    slug: { type: String },
    rating: { type: Number },
    verificationStatus: { type: String },
  },
  
  // Basic Information
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 500 },
  
  // Categorization
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  categoryPath: [{ type: Schema.Types.ObjectId, ref: "Category" }], // Full hierarchy
  categoryNames: [{ type: String }], // Denormalized
  subcategory: { type: String },
  tags: [{ type: String }],
  
  // Brand & Manufacturer
  brand: { type: String },
  manufacturer: { type: String },
  model: { type: String },
  manufacturerPartNumber: { type: String },
  
  // Identifiers
  sku: { type: String, unique: true, sparse: true },
  upc: { type: String },
  ean: { type: String },
  isbn: { type: String },
  asin: { type: String },
  barcode: { type: String },
  
  // Pricing
  pricing: {
    basePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number },
    costPrice: { type: Number }, // Private - seller's cost
    currency: { type: String, default: "USD" },
    compareAtPrice: { type: Number }, // Original price for comparison
    marginPercentage: { type: Number },
    taxable: { type: Boolean, default: true },
    taxRate: { type: Number },
  },
  
  // Discount Configuration
  discount: {
    isActive: { type: Boolean, default: false },
    type: { type: String, enum: ["percentage", "fixed_amount", "buy_x_get_y"] },
    value: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    minQuantity: { type: Number },
    maxUses: { type: Number },
    currentUses: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }, // Legacy field
  },
  
  // Inventory Management
  inventory: {
    stockQuantity: { type: Number, required: true, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    availableQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    trackInventory: { type: Boolean, default: true },
    allowBackorder: { type: Boolean, default: false },
    backorderLimit: { type: Number },
    continueSelling: { type: Boolean, default: false },
    warehouse: { type: String },
    binLocation: { type: String },
  },
  
  // Variants (Color, Size, Material, etc.)
  hasVariants: { type: Boolean, default: false },
  variants: [
    {
      variantId: { type: Schema.Types.ObjectId },
      sku: { type: String },
      title: { type: String },
      options: {
        color: { type: String },
        size: { type: String },
        material: { type: String },
        style: { type: String },
      },
      pricing: {
        price: { type: Number },
        salePrice: { type: Number },
        priceModifier: { type: Number, default: 0 },
      },
      inventory: {
        stockQuantity: { type: Number },
        sku: { type: String },
      },
      image: { type: String },
      isAvailable: { type: Boolean, default: true },
      weight: { type: Number },
      name: { type: String }, // Legacy
      priceModifier: { type: Number, default: 0 }, // Legacy
    }
  ],
  
  // Media
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String },
      position: { type: Number },
      isMain: { type: Boolean, default: false },
      variants: [{ type: String }],
    }
  ],
  primaryImage: { type: String },
  videos: [
    {
      url: { type: String },
      type: { type: String },
      thumbnail: { type: String },
      duration: { type: Number },
    }
  ],
  
  // Physical Attributes
  physical: {
    weight: { type: Number },
    weightUnit: { type: String, enum: ["kg", "lb", "g", "oz"], default: "kg" },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      unit: { type: String, enum: ["cm", "in", "m"], default: "cm" },
    },
    volumetricWeight: { type: Number },
    packageType: { type: String },
  },
  
  // Shipping Configuration
  shipping: {
    requiresShipping: { type: Boolean, default: true },
    isFreeShipping: { type: Boolean, default: false },
    shippingClass: { type: String, enum: ["standard", "fragile", "hazardous"] },
    customsInformation: {
      hsCode: { type: String },
      countryOfOrigin: { type: String },
      customsValue: { type: Number },
    },
    handlingTime: {
      min: { type: Number },
      max: { type: Number },
    },
  },
  
  // Detailed Specifications
  specifications: { type: Map, of: Schema.Types.Mixed },
  
  // Product Attributes (Searchable)
  attributes: [
    {
      name: { type: String },
      value: { type: String },
      unit: { type: String },
    }
  ],
  
  // SEO & Marketing
  seo: {
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    focusKeyword: { type: String },
    keywords: [{ type: String }],
    canonicalUrl: { type: String },
  },
  
  // Product Status
  status: {
    type: String,
    enum: ["draft", "active", "inactive", "pending", "rejected", "archived"],
    default: "active",
  },
  publishedAt: { type: Date },
  scheduledPublishAt: { type: Date },
  expiresAt: { type: Date },
  
  // Admin Moderation
  moderation: {
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },
    flaggedReasons: [{ type: String }],
    flagCount: { type: Number, default: 0 },
  },
  
  // Product Features
  features: [{ type: String }],
  highlights: [{ type: String }],
  keyFeatures: [{ type: String }],
  whatsInTheBox: [{ type: String }],
  careInstructions: { type: String },
  
  // Condition & Warranty
  condition: {
    type: String,
    enum: ["new", "refurbished", "used_like_new", "used_good", "used_acceptable"],
    default: "new",
  },
  warranty: {
    hasWarranty: { type: Boolean, default: false },
    duration: { type: Number }, // Months
    type: { type: String, enum: ["manufacturer", "seller", "extended"] },
    description: { type: String },
  },
  
  // Analytics (Cached)
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    addedToCart: { type: Number, default: 0 },
    addedToWishlist: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    rating1Star: { type: Number, default: 0 },
    rating2Star: { type: Number, default: 0 },
    rating3Star: { type: Number, default: 0 },
    rating4Star: { type: Number, default: 0 },
    rating5Star: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    last30Days: {
      views: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
    },
    trending: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
    viewsHistory: [
      {
        date: { type: Date },
        count: { type: Number },
      }
    ],
  },
  
  // Flags & Special States
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  isLimitedEdition: { type: Boolean, default: false },
  isExclusive: { type: Boolean, default: false },
  
  // Related Products
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  crossSellProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  upSellProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  
  // Digital Product Fields
  digital: {
    isDigital: { type: Boolean, default: false },
    downloadUrl: { type: String },
    fileSize: { type: Number },
    fileFormat: { type: String },
    downloadLimit: { type: Number },
    expirationDays: { type: Number },
  },
  
  // Bundle
  isBundle: { type: Boolean, default: false },
  bundleItems: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    }
  ],
  
  // Age Restriction
  ageRestricted: { type: Boolean, default: false },
  minimumAge: { type: Number },
  
  // Product Type & Visibility
  productType: { type: String, enum: ["physical", "digital", "service"], default: "physical" },
  visibility: { type: String, enum: ["public", "private", "hidden"], default: "public" },
  publishDate: { type: Date },
  ageRestriction: { type: String, enum: ["18+", "21+", "none"], default: "none" },
  
  // Policies
  returnPolicyOverride: { type: String },
  
  // Discovery
  collections: [{ type: String }],
  googleProductCategory: { type: String },
  
  // Legacy fields (backward compatibility)
  price: { type: Number }, // Use pricing.basePrice instead
  stockQuantity: { type: Number }, // Use inventory.stockQuantity instead
  weight: { type: Number }, // Use physical.weight instead
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, default: "cm" },
  },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  metaDescription: { type: String },
  
  // Custom Fields
  customFields: { type: Map, of: Schema.Types.Mixed },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastRestockedAt: { type: Date },
}, {
  timestamps: true,
});

// Indexes
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });
productSchema.index({ slug: 1 }, { unique: true, sparse: true });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ title: "text", description: "text", tags: "text", brand: "text" });
productSchema.index({ "pricing.basePrice": 1 });
productSchema.index({ "analytics.averageRating": -1 });
productSchema.index({ "analytics.totalSold": -1 });
productSchema.index({ "analytics.views": -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "inventory.stockQuantity": 1 });
productSchema.index({ status: 1, sellerId: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1, "pricing.basePrice": 1 });
productSchema.index({ status: 1, "analytics.averageRating": -1, "analytics.totalSold": -1 });

// Pre-save hook
productSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  
  // Auto-generate slug from title if not set
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  // Calculate available quantity
  if (this.inventory) {
    this.inventory.availableQuantity = this.inventory.stockQuantity - (this.inventory.reservedQuantity || 0);
  }
  
  // Update legacy fields for backward compatibility
  if (this.pricing?.basePrice !== undefined) {
    this.price = this.pricing.basePrice;
  }
  if (this.inventory?.stockQuantity !== undefined) {
    this.stockQuantity = this.inventory.stockQuantity;
  }
  if (this.analytics?.averageRating !== undefined) {
    this.averageRating = this.analytics.averageRating;
  }
  if (this.analytics?.totalReviews !== undefined) {
    this.totalReviews = this.analytics.totalReviews;
  }
  if (this.analytics?.totalSold !== undefined) {
    this.totalSold = this.analytics.totalSold;
  }
  if (this.analytics?.views !== undefined) {
    this.views = this.analytics.views;
  }
  
  // Update isOnSale flag based on discount
  if (this.discount?.isActive && this.discount?.endDate && new Date(this.discount.endDate) > new Date()) {
    this.isOnSale = true;
  } else {
    this.isOnSale = false;
  }
  
  next();
});

export const Product = model("Product", productSchema);
