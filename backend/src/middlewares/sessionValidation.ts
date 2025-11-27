/**
 * Session Validation Middleware
 * 
 * Validates that user sessions are active and not expired
 * Tracks user activity and manages session lifecycle
 */

import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/express";
import { UserSession } from "../models/userSession";
import { User } from "../models/users";
import { Logger } from "../utils/logger";

/**
 * Middleware to validate active user session
 * Use this on routes that require an active session
 */
export const validateSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find user in database
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Get client IP
    const clientIp = (
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress ||
      ""
    ).toString().split(",")[0].trim();

    // Find active session for this user and IP
    const session = await UserSession.findOne({
      firebaseUID: user.uid,
      "location.ip": clientIp,
      isActive: true,
    });

    if (!session) {
      Logger.warn("No active session found for user", {
        uid: user.uid,
        ip: clientIp,
      });

      // Don't fail the request, just log it
      // Sessions are created on login, but we don't want to block all requests
    }

    // Update session last activity if exists
    if (session) {
      const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
      const timeSinceLastActivity = Date.now() - session.lastActivity.getTime();

      // Check if session has timed out
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        session.isActive = false;
        session.loggedOutAt = new Date();
        await session.save();

        Logger.info("Session timed out", {
          sessionId: session._id,
          userId: user._id,
        });

      return res.status(401).json({
        success: false,
          message: "Session expired. Please login again.",
          code: "SESSION_EXPIRED",
      });
    }

      // Update last activity
      session.lastActivity = new Date();
      await session.save();
    }

    // Attach user to request for next handlers
    req.user = {
      ...req.user,
      _id: user._id.toString(),
      role: user.role,
    } as any;

    next();
  } catch (error) {
    Logger.error("Session validation error", {
      uid: req.user?.uid,
      error,
    });

    return res.status(500).json({
      success: false,
      message: "Session validation failed",
    });
  }
};

/**
 * Middleware to track user activity
 * Updates session and user last activity timestamps
 */
export const trackActivity = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next();
    }

    // Update session activity in background (don't wait)
    const clientIp = (
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress ||
      ""
    ).toString().split(",")[0].trim();

    UserSession.updateMany(
      {
        firebaseUID: req.user.uid,
        "location.ip": clientIp,
        isActive: true,
      },
      {
        $set: {
          lastActivity: new Date(),
        },
      }
    ).catch((error) => {
      Logger.error("Error tracking activity", {
        uid: req.user?.uid,
        error,
      });
      });

    next();
  } catch (error) {
    // Don't fail request on tracking error
    next();
  }
};

/**
 * Clean up expired sessions for a user
 */
export const cleanupExpiredSessions = async (userId: string): Promise<number> => {
  try {
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
    const expiryTime = new Date(Date.now() - SESSION_TIMEOUT);

    const result = await UserSession.updateMany(
      {
        userId,
        isActive: true,
        lastActivity: { $lt: expiryTime },
      },
      {
        $set: {
          isActive: false,
          loggedOutAt: new Date(),
        },
      }
    );

    Logger.info("Expired sessions cleaned up", {
      userId,
      count: result.modifiedCount,
    });

    return result.modifiedCount || 0;
  } catch (error) {
    Logger.error("Error cleaning up expired sessions", {
      userId,
      error,
    });
    return 0;
  }
};

/**
 * Revoke all sessions for a user (force logout from all devices)
 */
export const revokeAllSessions = async (userId: string): Promise<void> => {
  try {
    await UserSession.updateMany(
      {
        userId,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
          loggedOutAt: new Date(),
        },
      }
    );

    // Clear user's active sessions
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          activeSessions: [],
        },
      }
    );

    Logger.info("All sessions revoked for user", { userId });
  } catch (error) {
    Logger.error("Error revoking all sessions", {
      userId,
      error,
    });
    throw error;
  }
};

export default {
  validateSession,
  trackActivity,
  cleanupExpiredSessions,
  revokeAllSessions,
};
