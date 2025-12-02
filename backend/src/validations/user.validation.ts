/**
 * User Validation Schemas
 */

import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  image: Joi.string().uri().optional(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
    "string.pattern.base": "Phone number must be in valid E.164 format",
  }),
  preferences: Joi.object({
    language: Joi.string().valid("en", "am", "fr", "es").optional(),
    currency: Joi.string().valid("USD", "ETB", "EUR", "GBP").optional(),
    theme: Joi.string().valid("light", "dark", "auto").optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      push: Joi.boolean().optional(),
      sms: Joi.boolean().optional(),
    }).optional(),
  }).optional(),
}).min(1);

export const createAddressSchema = Joi.object({
  type: Joi.string().valid("home", "work", "other").default("home"),
  label: Joi.string().max(50).optional(),
  fullName: Joi.string().min(2).max(100).required(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  addressLine1: Joi.string().min(5).max(200).required(),
  addressLine2: Joi.string().max(200).optional(),
  city: Joi.string().min(2).max(100).required(),
  state: Joi.string().max(100).optional(),
  postalCode: Joi.string().min(3).max(20).required(),
  country: Joi.string().min(2).max(100).required(),
  isDefault: Joi.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.fork(
  ["fullName", "phoneNumber", "addressLine1", "city", "postalCode", "country"],
  (schema) => schema.optional()
).min(1);

