/**
 * Audit Logger Middleware
 * Automatically logs admin actions for compliance
 */

import { Request, Response, NextFunction } from "express";
import { AuditService } from "../services";

interface AuditOptions {
  action: string;
  targetType: string;
}

/**
 * Middleware to log admin actions
 */
export const auditLogger = (options: AuditOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    // Override res.json to log after successful response
    res.json = function (data: any) {
      // Only log successful actions (status < 400)
      if (res.statusCode < 400) {
        const user = (req as any).user;
        
        if (user && user.role === "admin") {
          const targetId = req.params.id || req.body._id || "unknown";
          const changes = req.body;

          AuditService.logAction(
            options.action,
            user._id,
            user.name || user.email,
            options.targetType,
            targetId,
            `${options.action} performed successfully`,
            changes,
            req.ip,
            req.get("user-agent")
          ).catch((error) => {
            console.error("Failed to log audit action:", error);
          });
        }
      }

      return originalJson(data);
    };

    next();
  };
};

/**
 * Helper to get IP address
 */
export const getClientIp = (req: Request): string => {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    (req.headers["x-real-ip"] as string) ||
    req.socket.remoteAddress ||
    "unknown"
  );
};

export default auditLogger;

