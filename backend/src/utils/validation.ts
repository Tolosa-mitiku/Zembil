/**
 * Validation Utilities
 * Input validation and sanitization helpers
 */

import mongoose from "mongoose";
import validator from "validator";
import { Request, Response, NextFunction } from "express";

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Sanitize string input (prevent XSS)
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return validator.escape(input.trim());
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

/**
 * Normalize email (lowercase, remove dots in Gmail)
 */
export const normalizeEmail = (email: string): string => {
  return validator.normalizeEmail(email) || email;
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  return validator.isURL(url, {
    protocols: ["http", "https"],
    require_protocol: true,
  });
};

/**
 * Validate phone number (E.164 format)
 */
export const isValidPhone = (phone: string): boolean => {
  return validator.isMobilePhone(phone, "any", { strictMode: false });
};

/**
 * Sanitize filename (prevent directory traversal)
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .substring(0, 255);
};

/**
 * Validate and sanitize pagination parameters
 */
export const validatePagination = (
  page?: string,
  limit?: string
): { page: number; limit: number } => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 100;

  let pageNum = parseInt(page || String(DEFAULT_PAGE), 10);
  let limitNum = parseInt(limit || String(DEFAULT_LIMIT), 10);

  // Validate and constrain
  pageNum = isNaN(pageNum) || pageNum < 1 ? DEFAULT_PAGE : pageNum;
  limitNum = isNaN(limitNum) || limitNum < 1 ? DEFAULT_LIMIT : limitNum;
  limitNum = Math.min(limitNum, MAX_LIMIT);

  return { page: pageNum, limit: limitNum };
};

/**
 * Middleware to validate ObjectId in URL params
 */
export const validateObjectIdMiddleware = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
    }

    next();
  };
};

/**
 * Middleware to validate multiple ObjectIds
 */
export const validateMultipleObjectIds = (paramNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      if (id && !validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${paramName} format`,
        });
      }
    }
    next();
  };
};

/**
 * Validate sort field against whitelist
 */
export const validateSortField = (
  field: string,
  allowedFields: string[]
): string => {
  return allowedFields.includes(field) ? field : allowedFields[0];
};

/**
 * Validate enum value
 */
export const validateEnum = <T extends string>(
  value: string,
  allowedValues: T[],
  defaultValue: T
): T => {
  return allowedValues.includes(value as T) ? (value as T) : defaultValue;
};

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query) return "";
  
  // Remove special regex characters
  return query
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .substring(0, 100);
};

/**
 * Validate price/amount
 */
export const validateAmount = (
  amount: number,
  min: number = 0,
  max: number = 1000000
): boolean => {
  return (
    typeof amount === "number" &&
    !isNaN(amount) &&
    amount >= min &&
    amount <= max
  );
};

/**
 * Validate rating (1-5)
 */
export const validateRating = (rating: number): boolean => {
  return (
    typeof rating === "number" &&
    Number.isInteger(rating) &&
    rating >= 1 &&
    rating <= 5
  );
};

/**
 * Validate quantity
 */
export const validateQuantity = (
  quantity: number,
  max: number = 1000
): boolean => {
  return (
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= max
  );
};

export default {
  validateObjectId,
  sanitizeInput,
  isValidEmail,
  normalizeEmail,
  isValidUrl,
  isValidPhone,
  sanitizeFilename,
  validatePagination,
  validateSortField,
  validateEnum,
  sanitizeSearchQuery,
  validateAmount,
  validateRating,
  validateQuantity,
};

