/**
 * Comprehensive Product Types for View & Edit Pages
 * Matching backend schema with extended frontend requirements
 */

export interface ProductVariant {
  name: string; // e.g., "Size", "Color"
  options: string[]; // e.g., ["Small", "Medium", "Large"]
  priceModifier: number; // Additional cost for this variant
  stock?: number; // Stock for this specific variant
  sku?: string; // SKU for this variant
  image?: string; // Optional variant-specific image
}

export interface ProductDiscount {
  percentage?: number;
  fixedAmount?: number;
  type?: 'percentage' | 'fixed';
  startDate?: Date | string;
  endDate?: Date | string;
  isActive: boolean;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: 'cm' | 'inch' | 'm';
}

export interface ProductSpecification {
  [key: string]: string | number | boolean;
}

export interface ProductSEO {
  title?: string;
  metaDescription?: string;
  urlSlug?: string;
  keywords?: string[];
}

export interface ProductShipping {
  requiresShipping: boolean;
  shippingClass?: 'standard' | 'express' | 'heavy' | 'fragile';
  handlingTime?: string; // e.g., "1-3 days"
  originCountry?: string;
  hsTariffCode?: string;
}

export interface ProductAnalytics {
  views: number;
  addedToCart: number;
  purchased: number;
  conversionRate: number;
  revenue: number;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  viewsHistory?: Array<{ date: string; count: number }>;
}

export interface DetailedProduct {
  _id: string;
  sellerId: string;
  
  // Basic Information
  title: string;
  description: string;
  category: string;
  brand?: string;
  sku?: string;
  
  // Pricing
  price: number;
  compareAtPrice?: number; // For showing discounts
  costPerItem?: number; // For profit calculations
  discount?: ProductDiscount;
  taxable?: boolean;
  
  // Inventory
  stockQuantity: number;
  trackInventory: boolean;
  continueSellingWhenOutOfStock: boolean;
  lowStockAlert?: number;
  barcode?: string;
  
  // Physical Properties
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: ProductDimensions;
  
  // Media
  images: string[];
  primaryImage?: string; // The main hero image
  
  // Variants
  variants?: ProductVariant[];
  
  // Product Details
  specifications?: ProductSpecification;
  keyFeatures?: string[];
  whatsInTheBox?: string[];
  careInstructions?: string;
  warrantyInfo?: string;
  
  // SEO & Discoverability
  tags: string[];
  seo?: ProductSEO;
  metaDescription?: string;
  collections?: string[];
  googleProductCategory?: string;
  
  // Shipping
  shipping?: ProductShipping;
  
  // Status & Visibility
  status: 'active' | 'inactive' | 'pending' | 'draft' | 'rejected';
  isFeatured: boolean;
  visibility?: 'public' | 'private' | 'hidden';
  publishDate?: Date | string;
  productType?: 'physical' | 'digital' | 'service';
  condition?: 'new' | 'used' | 'refurbished';
  ageRestriction?: '18+' | '21+' | 'none';
  
  // Performance & Analytics
  analytics?: ProductAnalytics;
  averageRating?: number;
  totalReviews?: number;
  totalSold?: number;
  views?: number;
  
  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
  
  // Return Policy
  returnPolicyOverride?: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  images: string[];
  brand?: string;
  sku?: string;
  compareAtPrice?: number;
  costPerItem?: number;
  discount?: ProductDiscount;
  taxable?: boolean;
  trackInventory?: boolean;
  continueSellingWhenOutOfStock?: boolean;
  lowStockAlert?: number;
  barcode?: string;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: ProductDimensions;
  variants?: ProductVariant[];
  specifications?: ProductSpecification;
  keyFeatures?: string[];
  whatsInTheBox?: string[];
  careInstructions?: string;
  warrantyInfo?: string;
  tags?: string[];
  seo?: ProductSEO;
  metaDescription?: string;
  collections?: string[];
  googleProductCategory?: string;
  shipping?: ProductShipping;
  status?: 'active' | 'inactive' | 'pending' | 'draft';
  isFeatured?: boolean;
  visibility?: 'public' | 'private' | 'hidden';
  publishDate?: Date | string;
  productType?: 'physical' | 'digital' | 'service';
  condition?: 'new' | 'used' | 'refurbished';
  ageRestriction?: '18+' | '21+' | 'none';
  returnPolicyOverride?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  _id: string;
}

export interface ProductFormData extends Omit<CreateProductInput, 'images'> {
  images: (File | string)[];
  existingImages?: string[];
  newImages?: File[];
}

export interface ProductDraft {
  _id?: string;
  data: Partial<ProductFormData>;
  lastSaved: Date;
  autoSaved: boolean;
}

export interface ImageUploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  url?: string;
  error?: string;
}

export interface ProductValidationError {
  field: string;
  message: string;
}

export type ProductStatus = 'active' | 'inactive' | 'pending' | 'draft' | 'rejected';
export type ProductVisibility = 'public' | 'private' | 'hidden';
export type ProductType = 'physical' | 'digital' | 'service';
export type ProductCondition = 'new' | 'used' | 'refurbished';
export type ShippingClass = 'standard' | 'express' | 'heavy' | 'fragile';
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';
export type DimensionUnit = 'cm' | 'inch' | 'm';

