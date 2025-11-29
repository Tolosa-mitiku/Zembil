import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/express";
import { User } from "../models/users";

// Middleware to check user roles and account status
export const authorizeRole = (allowedRoles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      // Check if user has required role
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Insufficient privileges",
        });
      }

      // Check account status
      const user = await User.findOne({ uid: req.user?.uid });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.accountStatus !== "active") {
        return res.status(403).json({
          success: false,
          message: `Account ${user.accountStatus}. ${user.suspensionReason || ""}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking authorization",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
