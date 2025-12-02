import { Request, Response } from "express";
import { SystemConfig } from "../models";
import { AuditService } from "../services";

/**
 * Get system configuration (Admin only)
 */
export const getSystemConfig = async (req: Request, res: Response) => {
  try {
    let config = await SystemConfig.findOne();

    // Create default if doesn't exist
    if (!config) {
      config = await SystemConfig.create({
        siteName: "Zembil Marketplace",
        currency: "USD",
        commissionRate: 10,
      });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get system configuration",
    });
  }
};

/**
 * Update system configuration (Admin only)
 */
export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user._id;
    const adminName = (req as any).user.name;
    const updates = req.body;

    let config = await SystemConfig.findOne();

    if (!config) {
      config = await SystemConfig.create(updates);
    } else {
      // Track changes for audit
      const changes: Record<string, any> = {};
      for (const [key, value] of Object.entries(updates)) {
        const oldValue = (config as any)[key];
        if (oldValue !== value) {
          changes[key] = { old: oldValue, new: value };
        }
      }

      // Add to change history
      config.changeHistory = config.changeHistory || [];
      for (const [field, change] of Object.entries(changes)) {
        config.changeHistory.push({
          field,
          oldValue: String(change.old),
          newValue: String(change.new),
          modifiedBy: adminId,
          modifiedAt: new Date(),
        } as any);
      }

      config.lastModifiedBy = adminId;
      config.lastModifiedAt = new Date();

      Object.assign(config, updates);
      await config.save();

      // Log audit
      await AuditService.logAction(
        "UPDATE_SYSTEM_CONFIG",
        adminId,
        adminName,
        "system",
        config._id,
        `Updated system configuration`,
        changes
      );
    }

    res.json({
      success: true,
      message: "System configuration updated successfully",
      data: config,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update system configuration",
    });
  }
};

/**
 * Toggle maintenance mode (Admin only)
 */
export const toggleMaintenanceMode = async (req: Request, res: Response) => {
  try {
    const { enabled, message } = req.body;
    const adminId = (req as any).user._id;
    const adminName = (req as any).user.name;

    const config = await SystemConfig.findOne();
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "System configuration not found",
      });
    }

    config.maintenanceMode = enabled;
    if (message) {
      config.maintenanceMessage = message;
    }
    config.lastModifiedBy = adminId;
    config.lastModifiedAt = new Date();
    await config.save();

    // Log audit
    await AuditService.logAction(
      "TOGGLE_MAINTENANCE_MODE",
      adminId,
      adminName,
      "system",
      config._id,
      `Maintenance mode ${enabled ? "enabled" : "disabled"}`
    );

    res.json({
      success: true,
      message: `Maintenance mode ${enabled ? "enabled" : "disabled"}`,
      data: { maintenanceMode: enabled },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle maintenance mode",
    });
  }
};

