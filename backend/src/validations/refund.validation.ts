/**
 * Refund Validation Schemas
 */

import Joi from "joi";

export const requestRefundSchema = Joi.object({
  orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid order ID format",
    "any.required": "Order ID is required",
  }),

  reason: Joi.string().min(10).max(500).required().messages({
    "string.min": "Reason must be at least 10 characters",
    "string.max": "Reason cannot exceed 500 characters",
    "any.required": "Refund reason is required",
  }),

  type: Joi.string().valid("full", "partial").default("full"),

  amount: Joi.number().min(0).when("type", {
    is: "partial",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }).messages({
    "any.required": "Amount is required for partial refunds",
  }),
});

export const approveRefundSchema = Joi.object({
  notes: Joi.string().max(500).optional(),
});

export const rejectRefundSchema = Joi.object({
  reason: Joi.string().min(10).max(500).required().messages({
    "string.min": "Rejection reason must be at least 10 characters",
    "any.required": "Rejection reason is required",
  }),
});

