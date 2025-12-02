import { Request, Response } from "express";
import { AuditService } from "../services";

/**
 * Get audit logs (Admin only)
 */
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { adminId, targetType, startDate, endDate, page, limit } = req.query;

    const filters: any = {};
    if (adminId) filters.adminId = adminId;
    if (targetType) filters.targetType = targetType;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);

    const result = await AuditService.getAuditTrail(filters);

    res.json({
      success: true,
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get audit logs",
    });
  }
};

/**
 * Get audit statistics (Admin only)
 */
export const getAuditStats = async (req: Request, res: Response) => {
  try {
    const stats = await AuditService.getAuditStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get audit statistics",
    });
  }
};

