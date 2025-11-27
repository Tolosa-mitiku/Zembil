/**
 * Maintenance Mode Middleware
 * Blocks access when system is in maintenance mode
 */

import { Request, Response, NextFunction } from "express";
import { SystemConfig } from "../models";

/**
 * Check if system is in maintenance mode
 */
export const checkMaintenanceMode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await SystemConfig.findOne();

    // If maintenance mode is enabled
    if (config?.maintenanceMode) {
      const user = (req as any).user;

      // Allow admins to access during maintenance
      if (user && user.role === "admin") {
        return next();
      }

      return res.status(503).json({
        success: false,
        message: "System under maintenance",
        maintenanceMessage: config.maintenanceMessage || "We'll be back soon!",
      });
    }

    next();
  } catch (error) {
    // If config check fails, allow request to proceed
    console.error("Maintenance mode check failed:", error);
    next();
  }
};

export default checkMaintenanceMode;

