/**
 * Payout Validation Schemas
 */

import Joi from "joi";

export const createPayoutRequestSchema = Joi.object({
  amount: Joi.number().min(100).max(1000000).optional().messages({
    "number.min": "Minimum payout amount is $100",
    "number.max": "Maximum payout amount is $1,000,000",
  }),
});

export const approvePayoutSchema = Joi.object({
  notes: Joi.string().max(500).optional(),
});

export const rejectPayoutSchema = Joi.object({
  reason: Joi.string().min(10).max(500).required().messages({
    "string.min": "Rejection reason must be at least 10 characters",
    "any.required": "Rejection reason is required",
  }),
});

export const payoutQuerySchema = Joi.object({
  status: Joi.string().valid("pending", "processing", "approved", "completed", "rejected", "failed", "all").default("all"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

