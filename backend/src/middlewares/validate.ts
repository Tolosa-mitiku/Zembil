/**
 * Validation Middleware
 * Joi-based request validation
 */

import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ErrorFactory } from "../utils/errorHandler";

/**
 * Validation middleware factory
 */
export const validate = (schema: Joi.Schema, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true, // Remove unknown fields (mass assignment protection)
      convert: true, // Convert types
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        type: detail.type,
      }));

      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Replace with validated/sanitized data
    (req as any)[source] = value;
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: Joi.Schema) => validate(schema, "body");

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.Schema) => validate(schema, "query");

/**
 * Validate URL parameters
 */
export const validateParams = (schema: Joi.Schema) => validate(schema, "params");

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // MongoDB ObjectId
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),

  // Date range
  dateRange: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref("startDate")).optional(),
  }),

  // Search query
  search: Joi.object({
    q: Joi.string().max(100).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),

  // ID parameter
  idParam: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

export default validate;

