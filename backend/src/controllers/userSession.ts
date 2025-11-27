import { Request, Response } from "express";
import { SessionService } from "../services";

/**
 * Get user active sessions
 */
export const getActiveSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const sessions = await SessionService.getActiveSessions(userId);

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get active sessions",
    });
  }
};

/**
 * Logout specific session
 */
export const logoutSession = async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        message: "Session token is required",
      });
    }

    await SessionService.logoutSession(sessionToken);

    res.json({
      success: true,
      message: "Session logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to logout session",
    });
  }
};

/**
 * Logout all devices
 */
export const logoutAllDevices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    await SessionService.logoutAllSessions(userId);

    res.json({
      success: true,
      message: "All sessions logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to logout all sessions",
    });
  }
};

/**
 * Mark device as trusted
 */
export const markDeviceAsTrusted = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        message: "Session token is required",
      });
    }

    await SessionService.markDeviceAsTrusted(userId, sessionToken);

    res.json({
      success: true,
      message: "Device marked as trusted",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark device as trusted",
    });
  }
};

/**
 * Get all active sessions (Admin)
 */
export const getAllActiveSessions = async (req: Request, res: Response) => {
  try {
    const { UserSession } = require("../models");
    
    const sessions = await UserSession.find({ isActive: true })
      .populate("userId", "name email role")
      .sort({ lastActivity: -1 })
      .limit(100);

    res.json({
      success: true,
      data: sessions,
      count: sessions.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get active sessions",
    });
  }
};

