/**
 * Review Validation Schemas
 */

import Joi from "joi";

export const createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be a whole number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot be more than 5",
    "any.required": "Rating is required",
  }),

  title: Joi.string().max(200).optional(),

  comment: Joi.string().min(10).max(2000).required().messages({
    "string.min": "Comment must be at least 10 characters",
    "string.max": "Comment cannot exceed 2000 characters",
    "any.required": "Comment is required",
  }),

  images: Joi.array().items(Joi.string().uri()).max(5).optional().messages({
    "array.max": "Maximum 5 images allowed",
  }),

  orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  title: Joi.string().max(200).optional(),
  comment: Joi.string().min(10).max(2000).optional(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional(),
}).min(1);

export const reviewQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  rating: Joi.number().integer().min(1).max(5).optional(),
  sort: Joi.string().valid("createdAt", "rating", "helpful", "-createdAt", "-rating", "-helpful").default("-createdAt"),
});

