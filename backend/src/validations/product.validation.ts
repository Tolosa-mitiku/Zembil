/**
 * Product Validation Schemas
 */

import Joi from "joi";

export const createProductSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    "string.min": "Product title must be at least 3 characters",
    "string.max": "Product title cannot exceed 200 characters",
    "any.required": "Product title is required",
  }),

  description: Joi.string().min(10).max(5000).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 5000 characters",
    "any.required": "Description is required",
  }),

  price: Joi.number().min(0).max(1000000).required().messages({
    "number.min": "Price cannot be negative",
    "number.max": "Price cannot exceed $1,000,000",
    "any.required": "Price is required",
  }),

  stockQuantity: Joi.number().integer().min(0).max(1000000).required().messages({
    "number.base": "Stock quantity must be a number",
    "number.integer": "Stock quantity must be a whole number",
    "number.min": "Stock quantity cannot be negative",
    "any.required": "Stock quantity is required",
  }),

  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),

  brand: Joi.string().max(100).optional(),

  images: Joi.array().items(Joi.string().uri()).min(1).max(10).optional().messages({
    "array.max": "Maximum 10 images allowed",
    "string.uri": "Image must be a valid URL",
  }),

  tags: Joi.array().items(Joi.string().max(50)).max(20).optional().messages({
    "array.max": "Maximum 20 tags allowed",
  }),

  variants: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        options: Joi.array().items(Joi.string()).required(),
        priceModifier: Joi.number().default(0),
      })
    )
    .max(10)
    .optional(),

  specifications: Joi.object().pattern(Joi.string(), Joi.alternatives().try(Joi.string(), Joi.number())).optional(),

  weight: Joi.number().min(0).optional(),
  dimensions: Joi.object({
    length: Joi.number().min(0),
    width: Joi.number().min(0),
    height: Joi.number().min(0),
    unit: Joi.string().valid("cm", "in", "m"),
  }).optional(),
});

export const updateProductSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(5000).optional(),
  price: Joi.number().min(0).max(1000000).optional(),
  stockQuantity: Joi.number().integer().min(0).max(1000000).optional(),
  category: Joi.string().optional(),
  brand: Joi.string().max(100).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  status: Joi.string().valid("active", "inactive", "draft").optional(),
  isFeatured: Joi.boolean().optional(),
  variants: Joi.array().max(10).optional(),
  specifications: Joi.object().optional(),
  weight: Joi.number().min(0).optional(),
  dimensions: Joi.object().optional(),
}).min(1); // At least one field must be provided

export const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(Joi.ref("minPrice")).optional(),
  search: Joi.string().max(100).optional(),
  sort: Joi.string().valid("createdAt", "price", "rating", "sold", "title").default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  status: Joi.string().valid("active", "inactive", "pending", "all").default("active"),
  isFeatured: Joi.boolean().optional(),
  isOnSale: Joi.boolean().optional(),
});

