/**
 * Promotion Validation Schemas
 */

import Joi from "joi";

export const createPromotionSchema = Joi.object({
  productIds: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(100)
    .required()
    .messages({
      "array.min": "At least 1 product required",
      "array.max": "Maximum 100 products per promotion",
      "any.required": "Product IDs are required",
    }),

  discountPercentage: Joi.number().min(1).max(99).required().messages({
    "number.min": "Discount must be at least 1%",
    "number.max": "Discount cannot exceed 99%",
    "any.required": "Discount percentage is required",
  }),

  startDate: Joi.date().iso().min("now").required().messages({
    "date.min": "Start date cannot be in the past",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.min": "End date must be after start date",
    "any.required": "End date is required",
  }),
});

export const updatePromotionSchema = Joi.object({
  productIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).max(100).optional(),
  discountPercentage: Joi.number().min(1).max(99).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

