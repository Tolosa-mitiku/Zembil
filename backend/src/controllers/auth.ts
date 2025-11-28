import { Response } from "express";
import { UserSession } from "../models/userSession";
import { User } from "../models/users";
import { syncUserWithDatabase, trackLogin } from "../services/authSync.service";
import { CustomRequest } from "../types/express";
import { Logger } from "../utils/logger";

/**
 * Controller to handle login/register
 * This endpoint is called after Firebase authentication is complete
 * It syncs the Firebase user with MongoDB and returns user data
 *
 * SECURITY: Role is NEVER accepted from user input
 */
export const loginUser = async (req: CustomRequest, res: Response) => {
  try {
    Logger.info("Login endpoint hit", {
      hasUser: !!req.user,
      hasDecodedToken: !!req.decodedToken,
    });

    if (!req.user) {
      Logger.error("No user in request", {
        headers: req.headers.authorization?.substring(0, 20),
      });
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!req.decodedToken) {
      Logger.error("No decoded token in request");
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    Logger.info("Login request received", {
      uid: req.user.uid,
      email: req.user.email,
    });

    // Get client IP for security tracking
    const clientIp = (
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress ||
      ""
    )
      .toString()
      .split(",")[0]
      .trim();

    // Sync user with database (creates or updates user in MongoDB)
    const { user, isNewUser } = await syncUserWithDatabase(req.decodedToken!, {
      name: req.body.name,
      role: undefined, // Never accept role from client
    });

    // Check account status
    if (user.accountStatus !== "active") {
      Logger.security("Login attempt on non-active account", {
        uid: user.uid,
        status: user.accountStatus,
      });

      return res.status(403).json({
        success: false,
        message: `Account ${user.accountStatus}. ${
          user.suspensionReason || ""
        }`,
        accountStatus: user.accountStatus,
      });
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000
      );

      Logger.security("Login attempt on locked account", {
        uid: user.uid,
        lockedUntil: user.lockedUntil,
      });

      return res.status(423).json({
        success: false,
        message: `Account locked due to multiple failed login attempts. Try again in ${minutesLeft} minutes.`,
        lockedUntil: user.lockedUntil,
      });
    }

    // Track login (IP, user agent, etc.)
    await trackLogin(user.uid, clientIp, req.headers["user-agent"]);

    // Create or update user session
    try {
      const userAgent = req.headers["user-agent"] || "Unknown";
      const deviceType = detectDeviceType(userAgent);
      const deviceId = userAgent.substring(0, 50); // Use part of user agent as device ID

      let session = await UserSession.findOne({
        firebaseUID: user.uid,
        "device.deviceId": deviceId,
        isActive: true,
      });

      if (session) {
        // Update existing session
        session.lastActivity = new Date();
        if (session.location) {
          session.location.ip = clientIp;
        } else {
          session.location = { ip: clientIp };
        }
        await session.save();
      } else {
        // Create new session
        session = new UserSession({
          userId: user._id,
          firebaseUID: user.uid,
          device: {
            type: deviceType,
            deviceId: deviceId,
            userAgent: userAgent,
          },
          location: {
            ip: clientIp,
          },
          loginMethod:
            req.decodedToken?.firebase?.sign_in_provider === "google.com"
              ? "google"
              : "email",
          isActive: true,
          lastActivity: new Date(),
        });
        await session.save();

        // Add to user's active sessions
        user.activeSessions = user.activeSessions || [];
        user.activeSessions.push({
          sessionId: session._id,
          device: deviceType,
          lastActivity: new Date(),
        });
        await user.save();
      }

      Logger.info("Session created/updated", {
        sessionId: session._id,
        userId: user._id,
      });
    } catch (sessionError) {
      Logger.error("Error managing user session", {
        uid: user.uid,
        error: sessionError,
      });
      // Don't fail login if session creation fails
    }

    Logger.info(
      isNewUser ? "New user created and logged in" : "Existing user logged in",
      {
        userId: user._id,
        uid: user.uid,
        role: user.role,
        loginCount: user.loginCount,
      }
    );

    // Return user data (NEVER include sensitive information)
    return res.status(200).json({
      success: true,
      message: isNewUser ? "Account created successfully" : "Login successful",
      user: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        image: user.image,
        phoneNumber: user.phoneNumber,
        role: user.role, // From database, not user input
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      isNewUser,
    });
  } catch (error) {
    Logger.error("Login error", {
      uid: req.user?.uid,
      error: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : undefined,
    });

    console.error("Full login error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get current user profile
 * Requires valid Firebase authentication
 */
export const getCurrentUser = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        image: user.image,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        stats: user.stats,
      },
    });
  } catch (error) {
    Logger.error("Get current user error", {
      uid: req.user?.uid,
      error,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
};

/**
 * Refresh user token
 * Returns fresh user data from database
 */
export const refreshUserData = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update last activity
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User data refreshed",
      user: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        image: user.image,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    Logger.error("Refresh user data error", {
      uid: req.user?.uid,
      error,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to refresh user data",
    });
  }
};

/**
 * Logout user
 * Invalidates the current session
 */
export const logoutUser = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findOne({ uid: req.user.uid });

    if (user) {
      // Find and deactivate the current session
      const clientIp = (
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.socket.remoteAddress ||
        ""
      )
        .toString()
        .split(",")[0]
        .trim();

      await UserSession.updateMany(
        {
          firebaseUID: user.uid,
          "location.ip": clientIp,
          isActive: true,
        },
        {
          $set: {
            isActive: false,
            loggedOutAt: new Date(),
          },
        }
      );

      Logger.info("User logged out", {
        userId: user._id,
        uid: user.uid,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    Logger.error("Logout error", {
      uid: req.user?.uid,
      error,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

/**
 * Handle failed login attempt
 * @param uid - User Firebase UID
 */
export const handleFailedLogin = async (uid: string, ip: string) => {
  try {
    const user = await User.findOne({ uid });
    if (!user) return;

    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    user.lastFailedLogin = new Date();

    // Lock account after 5 failed attempts
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

    if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);

      Logger.security("Account locked due to failed login attempts", {
        uid,
        attempts: user.failedLoginAttempts,
        lockedUntil: user.lockedUntil,
        ip,
      });
    }

    await user.save();
  } catch (error) {
    Logger.error("Error handling failed login", { uid, error });
  }
};

/**
 * Check if account is locked
 */
export const isAccountLocked = async (uid: string): Promise<boolean> => {
  try {
    const user = await User.findOne({ uid });
    if (!user) return false;

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return true;
    }

    // Unlock if time has passed
    if (user.lockedUntil) {
      user.lockedUntil = undefined;
      user.failedLoginAttempts = 0;
      await user.save();
    }

    return false;
  } catch (error) {
    Logger.error("Error checking account lock status", { uid, error });
    return false;
  }
};

/**
 * Detect device type from user agent
 */
const detectDeviceType = (
  userAgent: string
): "mobile" | "tablet" | "desktop" | "web" => {
  userAgent = userAgent.toLowerCase();

  if (userAgent.includes("mobile") || userAgent.includes("android")) {
    return "mobile";
  } else if (userAgent.includes("tablet") || userAgent.includes("ipad")) {
    return "tablet";
  } else {
    return "web"; // Changed from "desktop" to match schema
  }
};
