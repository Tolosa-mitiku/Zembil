/**
 * Secure Logger Utility
 * Structured logging without sensitive data exposure
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

/**
 * Sensitive field patterns to redact
 */
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /apikey/i,
  /api_key/i,
  /authorization/i,
  /cookie/i,
  /session/i,
  /accountnumber/i,
  /account_number/i,
  /routingnumber/i,
  /ssn/i,
  /cvv/i,
  /card/i,
];

/**
 * Check if field name is sensitive
 */
const isSensitiveField = (fieldName: string): boolean => {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(fieldName));
};

/**
 * Redact sensitive data from object
 */
export const redactSensitiveData = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const redacted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveField(key)) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
};

/**
 * Structured logger
 */
export class Logger {
  private static formatMessage(
    level: LogLevel,
    message: string,
    meta?: any
  ): string {
    const timestamp = new Date().toISOString();
    const logEntry: any = {
      timestamp,
      level,
      message,
      ...(meta && { meta: redactSensitiveData(meta) }),
    };

    return JSON.stringify(logEntry);
  }

  static error(message: string, meta?: any) {
    console.error(this.formatMessage(LogLevel.ERROR, message, meta));
  }

  static warn(message: string, meta?: any) {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  static info(message: string, meta?: any) {
    console.log(this.formatMessage(LogLevel.INFO, message, meta));
  }

  static debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === "development") {
      console.log(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }

  /**
   * Log security event
   */
  static security(event: string, meta?: any) {
    this.warn(`SECURITY: ${event}`, meta);
  }

  /**
   * Log API request
   */
  static request(req: any, meta?: any) {
    this.info("API Request", {
      requestId: req.id,
      method: req.method,
      path: req.path,
      userId: req.user?.uid,
      userRole: req.user?.role,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      ...meta,
    });
  }

  /**
   * Log API response
   */
  static response(req: any, statusCode: number, duration: number) {
    this.info("API Response", {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
    });
  }
}

/**
 * Request logging middleware
 */
export const requestLogger: RequestHandler = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  Logger.request(req);

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    Logger.response(req, res.statusCode, duration);
  });

  next();
};

export default Logger;

