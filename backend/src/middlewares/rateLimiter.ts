/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per user/IP
 */

import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limiter options
 */
interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Max requests per window
  message?: string;
}

/**
 * Create rate limiter middleware
 */
export const rateLimiter = (options: RateLimitOptions = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests || 100;
  const message = options.message || "Too many requests, please try again later";

  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = (req as any).user?._id || req.ip || "anonymous";
    const now = Date.now();

    // Clean up old entries
    if (store[identifier] && store[identifier].resetTime < now) {
      delete store[identifier];
    }

    // Initialize or get current count
    if (!store[identifier]) {
      store[identifier] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    store[identifier].count++;

    // Check if limit exceeded
    if (store[identifier].count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((store[identifier].resetTime - now) / 1000),
      });
    }

    // Add rate limit headers
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", maxRequests - store[identifier].count);
    res.setHeader("X-RateLimit-Reset", new Date(store[identifier].resetTime).toISOString());

    next();
  };
};

/**
 * Strict rate limiter for sensitive operations
 */
export const strictRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // Only 10 requests
  message: "Too many attempts, please try again later",
});

/**
 * Login rate limiter
 */
export const loginRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Only 5 login attempts
  message: "Too many login attempts, please try again in 15 minutes",
});

export default rateLimiter;

