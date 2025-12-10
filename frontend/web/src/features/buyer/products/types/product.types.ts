/**
 * Product Types
 * Comprehensive TypeScript interfaces matching the backend Product model
 */

// Seller Info (populated from Seller model)
export interface SellerInfo {
  _id: string;
  businessName: string;
  profileImage?: string;
  metrics: {
    averageRating: number;
    totalReviews: number;
    totalSales?: number;
  };
  verification?: {
    status: 'pending' | 'verified' | 'rejected';
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    responseTime?: string;
  };
}

// Product Pricing
export interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  costPrice?: number;
  currency: string;
  compareAtPrice?: number;
  marginPercentage?: number;
  taxable: boolean;
  taxRate?: number;
}

// Product Discount
export interface ProductDiscount {
  isActive: boolean;
  type?: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  value?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  minQuantity?: number;
  maxUses?: number;
  currentUses?: number;
  percentage?: number;
}

// Product Inventory
export interface ProductInventory {
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  backorderLimit?: number;
  continueSelling: boolean;
  warehouse?: string;
  binLocation?: string;
}

// Product Variant
export interface ProductVariant {
  variantId?: string;
  sku?: string;
  title?: string;
  options: {
    color?: string;
    size?: string;
    material?: string;
    style?: string;
  };
  pricing: {
    price?: number;
    salePrice?: number;
    priceModifier?: number;
  };
  inventory: {
    stockQuantity?: number;
    sku?: string;
  };
  image?: string;
  isAvailable: boolean;
  weight?: number;
}

// Product Image
export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
  isMain: boolean;
  variants?: string[];
}

// Product Video
export interface ProductVideo {
  url: string;
  type?: string;
  thumbnail?: string;
  duration?: number;
}

// Physical Attributes
export interface PhysicalAttributes {
  weight?: number;
  weightUnit: 'kg' | 'lb' | 'g' | 'oz';
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: 'cm' | 'in' | 'm';
  };
  volumetricWeight?: number;
  packageType?: string;
}

// Shipping Configuration
export interface ShippingConfig {
  requiresShipping: boolean;
  isFreeShipping: boolean;
  shippingClass?: 'standard' | 'fragile' | 'hazardous';
  customsInformation?: {
    hsCode?: string;
    countryOfOrigin?: string;
    customsValue?: number;
  };
  handlingTime?: {
    min?: number;
    max?: number;
  };
}

// Product SEO
export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

// Product Analytics
export interface ProductAnalytics {
  views: number;
  uniqueViews: number;
  clicks: number;
  addedToCart: number;
  addedToWishlist: number;
  purchased: number;
  conversionRate: number;
  averageRating: number;
  totalReviews: number;
  rating1Star: number;
  rating2Star: number;
  rating3Star: number;
  rating4Star: number;
  rating5Star: number;
  totalSold: number;
  totalRevenue: number;
  last30Days?: {
    views: number;
    sales: number;
    revenue: number;
  };
  trending: boolean;
  trendingScore: number;
  viewsHistory?: {
    date: Date;
    count: number;
  }[];
}

// Product Warranty
export interface ProductWarranty {
  hasWarranty: boolean;
  duration?: number;
  type?: 'manufacturer' | 'seller' | 'extended';
  description?: string;
}

// Product Moderation
export interface ProductModeration {
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  flaggedReasons?: string[];
  flagCount: number;
}

// Digital Product
export interface DigitalProduct {
  isDigital: boolean;
  downloadUrl?: string;
  fileSize?: number;
  fileFormat?: string;
  downloadLimit?: number;
  expirationDays?: number;
}

// Main Product Interface
export interface Product {
  _id: string;
  sellerId: string | SellerInfo;
  
  // Denormalized Seller Info
  sellerInfo?: {
    name?: string;
    slug?: string;
    rating?: number;
    verificationStatus?: string;
  };
  
  // Basic Information
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  
  // Categorization
  category?: string | { _id: string; name: string };
  categoryPath?: string[];
  categoryNames?: string[];
  subcategory?: string;
  tags?: string[];
  
  // Brand & Manufacturer
  brand?: string;
  manufacturer?: string;
  model?: string;
  manufacturerPartNumber?: string;
  
  // Identifiers
  sku?: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  asin?: string;
  barcode?: string;
  
  // Pricing
  pricing: ProductPricing;
  discount?: ProductDiscount;
  
  // Inventory
  inventory: ProductInventory;
  
  // Variants
  hasVariants: boolean;
  variants?: ProductVariant[];
  
  // Media
  images: ProductImage[] | string[];
  primaryImage?: string;
  videos?: ProductVideo[];
  
  // Physical Attributes
  physical?: PhysicalAttributes;
  
  // Shipping
  shipping?: ShippingConfig;
  
  // Specifications
  specifications?: Record<string, any>;
  attributes?: {
    name: string;
    value: string;
    unit?: string;
  }[];
  
  // SEO
  seo?: ProductSEO;
  
  // Status
  status: 'draft' | 'active' | 'inactive' | 'pending' | 'rejected' | 'archived';
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  expiresAt?: Date;
  
  // Moderation
  moderation?: ProductModeration;
  
  // Features
  features?: string[];
  highlights?: string[];
  keyFeatures?: string[];
  whatsInTheBox?: string[];
  careInstructions?: string;
  
  // Condition & Warranty
  condition: 'new' | 'refurbished' | 'used_like_new' | 'used_good' | 'used_acceptable';
  warranty?: ProductWarranty;
  
  // Analytics
  analytics: ProductAnalytics;
  
  // Flags
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  isLimitedEdition: boolean;
  isExclusive: boolean;
  
  // Related Products
  relatedProducts?: string[] | Product[];
  crossSellProducts?: string[] | Product[];
  upSellProducts?: string[] | Product[];
  
  // Digital Product
  digital?: DigitalProduct;
  
  // Bundle
  isBundle: boolean;
  bundleItems?: {
    productId: string;
    quantity: number;
  }[];
  
  // Age Restriction
  ageRestricted: boolean;
  minimumAge?: number;
  
  // Product Type & Visibility
  productType: 'physical' | 'digital' | 'service';
  visibility: 'public' | 'private' | 'hidden';
  publishDate?: Date;
  ageRestriction: '18+' | '21+' | 'none';
  
  // Policies
  returnPolicyOverride?: string;
  
  // Discovery
  collections?: string[];
  googleProductCategory?: string;
  
  // Legacy fields (for backward compatibility)
  price?: number;
  stockQuantity?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
  averageRating?: number;
  totalReviews?: number;
  totalSold?: number;
  views?: number;
  metaDescription?: string;
  
  // Custom Fields
  customFields?: Record<string, any>;
  metadata?: Record<string, any>;
  schemaVersion?: number;
  
  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
  lastRestockedAt?: Date;
}

// API Response Types
export interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product;
}

export interface ProductsResponse {
  success: boolean;
  message?: string;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  condition?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  sort?: string;
  tags?: string[];
}

// Simplified Product Card Type (for listings)
export interface ProductCard {
  _id: string;
  title: string;
  slug?: string;
  images: string[];
  primaryImage?: string;
  pricing: {
    basePrice: number;
    salePrice?: number;
  };
  discount?: {
    isActive: boolean;
    percentage?: number;
  };
  analytics: {
    averageRating: number;
    totalReviews: number;
    totalSold: number;
  };
  inventory: {
    stockQuantity: number;
    availableQuantity: number;
  };
  isOnSale: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  condition: string;
}

