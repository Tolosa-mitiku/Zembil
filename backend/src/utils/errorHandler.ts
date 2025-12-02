/**
 * Error Handler Utilities
 * Centralized error handling and logging
 */

import { Request, Response, NextFunction } from "express";

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error creators
 */
export class ErrorFactory {
  static badRequest(message: string = "Bad Request") {
    return new AppError(message, 400, true, "BAD_REQUEST");
  }

  static unauthorized(message: string = "Unauthorized") {
    return new AppError(message, 401, true, "UNAUTHORIZED");
  }

  static forbidden(message: string = "Forbidden") {
    return new AppError(message, 403, true, "FORBIDDEN");
  }

  static notFound(resource: string = "Resource") {
    return new AppError(`${resource} not found`, 404, true, "NOT_FOUND");
  }

  static conflict(message: string = "Conflict") {
    return new AppError(message, 409, true, "CONFLICT");
  }

  static validationError(message: string = "Validation failed") {
    return new AppError(message, 422, true, "VALIDATION_ERROR");
  }

  static internalError(message: string = "Internal server error") {
    return new AppError(message, 500, false, "INTERNAL_ERROR");
  }

  static tooManyRequests(message: string = "Too many requests") {
    return new AppError(message, 429, true, "TOO_MANY_REQUESTS");
  }
}

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Convert non-AppError errors
  if (!(error instanceof AppError)) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((e: any) => e.message)
        .join(", ");
      error = new AppError(message, 400, true, "VALIDATION_ERROR");
    }
    // Mongoose duplicate key error
    else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      error = new AppError(
        `${field} already exists`,
        409,
        true,
        "DUPLICATE_KEY"
      );
    }
    // Mongoose cast error (invalid ObjectId)
    else if (error.name === "CastError") {
      error = new AppError("Invalid ID format", 400, true, "INVALID_ID");
    }
    // JWT errors
    else if (error.name === "JsonWebTokenError") {
      error = new AppError("Invalid token", 401, true, "INVALID_TOKEN");
    } else if (error.name === "TokenExpiredError") {
      error = new AppError("Token expired", 401, true, "TOKEN_EXPIRED");
    }
    // Default error
    else {
      error = new AppError(
        error.message || "Something went wrong",
        error.statusCode || 500,
        false
      );
    }
  }

  // Log error securely (NEVER log sensitive data)
  const logData: any = {
    timestamp: new Date().toISOString(),
    requestId: (req as any).id,
    method: req.method,
    path: req.path,
    statusCode: error.statusCode,
    message: error.message,
    code: error.code,
    userId: (req as any).user?.uid,
    userRole: (req as any).user?.role,
    ip: req.ip || req.socket.remoteAddress,
  };

  // Log based on severity
  if (error.statusCode >= 500) {
    console.error("❌ Server Error:", logData);
    if (process.env.NODE_ENV === "development") {
      console.error("Stack:", error.stack);
    }
  } else if (error.statusCode >= 400) {
    console.warn("⚠️ Client Error:", logData);
  }

  // Send error response (NEVER expose stack trace in production)
  const response: any = {
    success: false,
    message: error.isOperational
      ? error.message
      : "An unexpected error occurred",
    code: error.code,
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV === "development" && !error.isOperational) {
    response.stack = error.stack;
    response.error = error.message;
  }

  res.status(error.statusCode).json(response);
};

/**
 * Async error wrapper (eliminates try-catch)
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found Handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, true, "NOT_FOUND"));
};

export default {
  AppError,
  ErrorFactory,
  errorHandler,
  catchAsync,
  notFoundHandler,
};

