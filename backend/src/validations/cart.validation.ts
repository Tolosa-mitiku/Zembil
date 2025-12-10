/**
 * Cart Validation Schemas
 */

import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid product ID format",
    "any.required": "Product ID is required",
  }),

  quantity: Joi.number().integer().min(1).max(1000).default(1).messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be a whole number",
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 1000",
  }),

  variant: Joi.object({
    name: Joi.string().optional(),
    options: Joi.object().optional(),
  }).optional(),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(1000).required().messages({
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 1000",
    "any.required": "Quantity is required",
  }),
});

export const cartItemIdSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

