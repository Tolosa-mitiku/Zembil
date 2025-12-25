/**
 * Audit Logging Service
 * Tracks all admin actions for compliance and security
 */

import { AuditLog } from "../models";
import { Types } from "mongoose";
import Logger from "../utils/logger";

export class AuditService {
  /**
   * Log an admin action
   */
  static async logAction(
    action: string,
    adminId: string | Types.ObjectId,
    adminName: string,
    targetType: string,
    targetId: string | Types.ObjectId,
    details?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      await AuditLog.create({
        action,
        adminId,
        adminName,
        targetType,
        targetId,
        details,
        changes,
        ipAddress,
        userAgent,
        timestamp: new Date(),
        status: "success",
      });

      Logger.info(`Logged action: ${action} by ${adminName}`);
    } catch (error) {
      Logger.error("Error logging audit action:", error);
      // Don't throw - audit logging should never break the main flow
    }
  }

  /**
   * Log failed action
   */
  static async logFailedAction(
    action: string,
    adminId: string | Types.ObjectId,
    adminName: string,
    targetType: string,
    targetId: string | Types.ObjectId,
    errorMessage: string,
    ipAddress?: string
  ) {
    try {
      await AuditLog.create({
        action,
        adminId,
        adminName,
        targetType,
        targetId,
        details: `Failed: ${errorMessage}`,
        ipAddress,
        timestamp: new Date(),
        status: "failure",
        errorMessage,
      });
    } catch (error) {
      Logger.error("Error logging failed action:", error);
    }
  }

  /**
   * Get audit trail with filters
   */
  static async getAuditTrail(filters: {
    adminId?: string;
    targetType?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const skip = (page - 1) * limit;

      const query: any = {};

      if (filters.adminId) query.adminId = filters.adminId;
      if (filters.targetType) query.targetType = filters.targetType;
      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = filters.startDate;
        if (filters.endDate) query.timestamp.$lte = filters.endDate;
      }

      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate("adminId", "name email");

      const total = await AuditLog.countDocuments(query);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error("Error getting audit trail:", error);
      throw error;
    }
  }

  /**
   * Get audit statistics
   */
  static async getAuditStats() {
    try {
      const total = await AuditLog.countDocuments();
      const last24Hours = await AuditLog.countDocuments({
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      const byAction = await AuditLog.aggregate([
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      const byAdmin = await AuditLog.aggregate([
        {
          $group: {
            _id: "$adminId",
            adminName: { $first: "$adminName" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      return {
        total,
        last24Hours,
        topActions: byAction,
        topAdmins: byAdmin,
      };
    } catch (error) {
      Logger.error("Error getting audit stats:", error);
      throw error;
    }
  }
}

export default AuditService;

