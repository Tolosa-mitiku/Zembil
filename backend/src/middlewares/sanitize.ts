/**
 * Input Sanitization Middleware
 * Sanitizes all user inputs to prevent XSS and injection attacks
 */

import { Request, Response, NextFunction } from "express";
import { sanitizeInput } from "../utils/validation";

/**
 * Sanitize string fields recursively
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj === "string") {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Don't sanitize certain fields
      const skipSanitization = [
        "password", // Will be hashed anyway
        "image",
        "profileImage",
        "images",
        "url",
        "link",
        "_id",
        "id",
      ];

      if (skipSanitization.includes(key)) {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Sanitize middleware
 */
export const sanitizeRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Sanitize body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    // Don't sanitize params (usually IDs, validated separately)

    next();
  } catch (error) {
    next(error);
  }
};

export default sanitizeRequest;

