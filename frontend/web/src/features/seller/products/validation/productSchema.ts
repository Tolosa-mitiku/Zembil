import { z } from 'zod';

/**
 * Comprehensive Zod Validation Schema for Product Forms
 * Provides real-time validation with helpful error messages
 */

// Nested schemas
const discountSchema = z.object({
  type: z.enum(['percentage', 'fixed']).optional(),
  percentage: z.number().min(0).max(100).optional(),
  fixedAmount: z.number().min(0).optional(),
  startDate: z.union([z.date(), z.string()]).optional(),
  endDate: z.union([z.date(), z.string()]).optional(),
  isActive: z.boolean().default(false),
}).optional();

const dimensionsSchema = z.object({
  length: z.number().positive('Length must be positive').optional(),
  width: z.number().positive('Width must be positive').optional(),
  height: z.number().positive('Height must be positive').optional(),
  unit: z.enum(['cm', 'inch', 'm']).default('cm'),
}).optional();

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  options: z.array(z.string()).min(1, 'At least one option is required'),
  priceModifier: z.number().default(0),
  stock: z.number().int().nonnegative().optional(),
  sku: z.string().optional(),
  image: z.string().url().optional(),
});

const seoSchema = z.object({
  title: z.string().max(60, 'SEO title should be 60 characters or less').optional(),
  metaDescription: z.string().max(160, 'Meta description should be 160 characters or less').optional(),
  urlSlug: z.string().regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  keywords: z.array(z.string()).optional(),
}).optional();

const shippingSchema = z.object({
  requiresShipping: z.boolean().default(true),
  shippingClass: z.enum(['standard', 'express', 'heavy', 'fragile']).optional(),
  handlingTime: z.string().optional(),
  originCountry: z.string().optional(),
  hsTariffCode: z.string().optional(),
}).optional();

// Base product schema (before refinements)
const baseProductSchema = z.object({
  // Basic Information (REQUIRED)
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  
  category: z.string().min(1, 'Category is required'),
  
  // Pricing (REQUIRED)
  price: z.number()
    .positive('Price must be greater than 0')
    .min(0.01, 'Price must be at least $0.01'),
  
  compareAtPrice: z.number().positive().optional(),
  costPerItem: z.number().nonnegative().optional(),
  
  // Inventory (REQUIRED)
  stockQuantity: z.number()
    .int('Stock must be a whole number')
    .nonnegative('Stock cannot be negative'),
  
  // Optional Basic Fields
  brand: z.string().max(100).optional(),
  sku: z.string().max(100).optional(),
  
  // Discount
  discount: discountSchema,
  
  // Tax & Financial
  taxable: z.boolean().default(true).optional(),
  
  // Inventory Settings
  trackInventory: z.boolean().default(true).optional(),
  continueSellingWhenOutOfStock: z.boolean().default(false).optional(),
  lowStockAlert: z.number().int().nonnegative().optional(),
  barcode: z.string().optional(),
  
  // Physical Properties
  weight: z.number().positive().optional(),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz']).default('kg').optional(),
  dimensions: dimensionsSchema,
  
  // Media (At least one image is recommended)
  images: z.array(z.union([z.string().url(), z.any()])).min(1, 'At least one product image is required'),
  primaryImage: z.string().optional(),
  
  // Variants
  variants: z.array(variantSchema).optional(),
  
  // Product Details
  specifications: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  keyFeatures: z.array(z.string()).optional(),
  whatsInTheBox: z.array(z.string()).optional(),
  careInstructions: z.string().max(1000).optional(),
  warrantyInfo: z.string().max(1000).optional(),
  
  // SEO & Discoverability
  tags: z.array(z.string()).default([]).optional(),
  seo: seoSchema,
  metaDescription: z.string().max(160).optional(),
  collections: z.array(z.string()).optional(),
  googleProductCategory: z.string().optional(),
  
  // Shipping
  shipping: shippingSchema,
  
  // Status & Visibility
  status: z.enum(['active', 'inactive', 'pending', 'draft']).default('active'),
  isFeatured: z.boolean().default(false).optional(),
  visibility: z.enum(['public', 'private', 'hidden']).default('public').optional(),
  publishDate: z.union([z.date(), z.string()]).optional(),
  productType: z.enum(['physical', 'digital', 'service']).default('physical').optional(),
  condition: z.enum(['new', 'used', 'refurbished']).default('new').optional(),
  ageRestriction: z.enum(['18+', '21+', 'none']).default('none').optional(),
  
  // Return Policy
  returnPolicyOverride: z.string().max(1000).optional(),
});

// Main product schema for creation/editing (with refinements)
export const productFormSchema = baseProductSchema
  // Custom refinements for cross-field validation
  .refine(
    (data) => {
      // If compareAtPrice is provided, it should be greater than price
      if (data.compareAtPrice && data.compareAtPrice <= data.price) {
        return false;
      }
      return true;
    },
    {
      message: 'Compare at price must be greater than the regular price',
      path: ['compareAtPrice'],
    }
  )
  .refine(
    (data) => {
      // If discount is active, validate dates
      if (data.discount?.isActive && data.discount.startDate && data.discount.endDate) {
        const start = new Date(data.discount.startDate);
        const end = new Date(data.discount.endDate);
        return end > start;
      }
      return true;
    },
    {
      message: 'Discount end date must be after start date',
      path: ['discount', 'endDate'],
    }
  );

export type ProductFormData = z.infer<typeof productFormSchema>;

// Partial schema for draft validation (less strict) - use base schema before refinements
export const productDraftSchema = baseProductSchema.partial();

export type ProductDraftData = z.infer<typeof productDraftSchema>;

// Quick validation for required fields only
export const productQuickSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  price: z.number().positive(),
  stockQuantity: z.number().nonnegative(),
  images: z.array(z.any()).min(1),
});

// Helper to get field-specific errors
export const getFieldError = (errors: any, fieldPath: string): string | undefined => {
  const pathParts = fieldPath.split('.');
  let error = errors;
  
  for (const part of pathParts) {
    if (!error) return undefined;
    error = error[part];
  }
  
  return error?.message;
};

// Validation messages
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  min: (field: string, min: number) => `${field} must be at least ${min} characters`,
  max: (field: string, max: number) => `${field} must not exceed ${max} characters`,
  positive: (field: string) => `${field} must be a positive number`,
  email: 'Please enter a valid email address',
  url: 'Please enter a valid URL',
  number: (field: string) => `${field} must be a number`,
};

