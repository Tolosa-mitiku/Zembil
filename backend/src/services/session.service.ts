/**
 * Session Management Service
 * Handles user session creation, validation, and tracking
 */

import { UserSession, User } from "../models";
import { Types } from "mongoose";
import crypto from "crypto";

interface DeviceInfo {
  type: "ios" | "android" | "web" | "desktop";
  deviceId?: string;
  model?: string;
  os?: string;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  appVersion?: string;
}

interface LocationInfo {
  ip: string;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  timezone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export class SessionService {
  /**
   * Generate secure session token
   */
  private static generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Create new session
   */
  static async createSession(
    userId: string | Types.ObjectId,
    deviceInfo: DeviceInfo,
    locationInfo: LocationInfo,
    loginMethod: string = "password"
  ) {
    try {
      const sessionToken = this.generateToken();
      const refreshToken = this.generateToken();

      // Create session
      const session = await UserSession.create({
        userId,
        sessionToken,
        refreshToken,
        device: deviceInfo,
        location: locationInfo,
        isActive: true,
        lastActivity: new Date(),
        loginMethod,
      });

      // Update user's active sessions
      await User.updateOne(
        { _id: userId },
        {
          $push: {
            activeSessions: {
              sessionId: session._id,
              device: deviceInfo.type,
              lastActivity: new Date(),
            },
          },
          $set: {
            lastLogin: new Date(),
            lastLoginIp: locationInfo.ip,
            lastLoginLocation: {
              country: locationInfo.country,
              city: locationInfo.city,
              coordinates: locationInfo.coordinates,
            },
          },
          $inc: {
            loginCount: 1,
          },
        }
      );

      console.log(`✅ Created session for user ${userId}`);
      return {
        sessionToken,
        refreshToken,
        session,
      };
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  /**
   * Validate session
   */
  static async validateSession(sessionToken: string) {
    try {
      const session = await UserSession.findOne({
        sessionToken,
        isActive: true,
        expiresAt: { $gt: new Date() },
      }).populate("userId");

      if (!session) {
        return null;
      }

      // Update last activity
      session.lastActivity = new Date();
      await session.save();

      // Update user's session activity
      await User.updateOne(
        { _id: session.userId, "activeSessions.sessionId": session._id },
        {
          $set: {
            "activeSessions.$.lastActivity": new Date(),
          },
        }
      );

      return session;
    } catch (error) {
      console.error("Error validating session:", error);
      return null;
    }
  }

  /**
   * Logout session
   */
  static async logoutSession(sessionToken: string) {
    try {
      const session = await UserSession.findOne({ sessionToken });
      if (!session) throw new Error("Session not found");

      // Mark session as inactive
      session.isActive = false;
      session.loggedOutAt = new Date();
      await session.save();

      // Remove from user's active sessions
      await User.updateOne(
        { _id: session.userId },
        {
          $pull: {
            activeSessions: { sessionId: session._id },
          },
        }
      );

      console.log(`✅ Logged out session ${session._id}`);
    } catch (error) {
      console.error("Error logging out session:", error);
      throw error;
    }
  }

  /**
   * Logout all sessions for a user
   */
  static async logoutAllSessions(userId: string | Types.ObjectId) {
    try {
      // Mark all sessions as inactive
      await UserSession.updateMany(
        { userId, isActive: true },
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

      console.log(`✅ Logged out all sessions for user ${userId}`);
    } catch (error) {
      console.error("Error logging out all sessions:", error);
      throw error;
    }
  }

  /**
   * Get active sessions for user
   */
  static async getActiveSessions(userId: string | Types.ObjectId) {
    try {
      const sessions = await UserSession.find({
        userId,
        isActive: true,
      }).sort({ lastActivity: -1 });

      return sessions;
    } catch (error) {
      console.error("Error getting active sessions:", error);
      throw error;
    }
  }

  /**
   * Clean up inactive sessions (cron job)
   */
  static async cleanupInactiveSessions() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const expiredSessions = await UserSession.find({
        isActive: false,
        updatedAt: { $lt: sevenDaysAgo },
      });

      // Remove from user records
      for (const session of expiredSessions) {
        await User.updateOne(
          { _id: session.userId },
          {
            $pull: {
              activeSessions: { sessionId: session._id },
            },
          }
        );
      }

      console.log(`✅ Cleaned up ${expiredSessions.length} expired sessions`);
    } catch (error) {
      console.error("Error cleaning up sessions:", error);
      throw error;
    }
  }

  /**
   * Check if device is trusted
   */
  static async markDeviceAsTrusted(
    userId: string | Types.ObjectId,
    sessionToken: string
  ) {
    try {
      await UserSession.updateOne(
        { userId, sessionToken },
        {
          $set: {
            isTrusted: true,
          },
        }
      );

      console.log(`✅ Marked device as trusted`);
    } catch (error) {
      console.error("Error marking device as trusted:", error);
      throw error;
    }
  }
}

export default SessionService;

