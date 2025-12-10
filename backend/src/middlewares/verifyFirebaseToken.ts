import { NextFunction, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { verifyIdToken } from "../config/firebase";
import { isAccountLocked } from "../controllers/auth";
import { CustomRequest } from "../types/express";
import { Logger } from "../utils/logger";

/**
 * Middleware to verify Firebase ID token
 * This is the primary authentication middleware for all protected routes
 *
 * Flow:
 * 1. Extract token from Authorization header
 * 2. Verify token with Firebase Admin SDK
 * 3. Check if user's email is verified (except for OAuth providers)
 * 4. Check if account is locked
 * 5. Attach user info to request object
 */
export const verifyFirebaseToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      Logger.warn("Authentication attempt without token", {
        ip: req.socket.remoteAddress,
        path: req.path,
      });

      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token not provided",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken || idToken.trim() === "") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token format",
      });
    }

    // Verify Firebase token with revocation check
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await verifyIdToken(idToken);
    } catch (tokenError: any) {
      Logger.warn("Token verification failed", {
        error: tokenError.code || tokenError.message,
        ip: req.socket.remoteAddress,
      });

      // Handle specific token errors
      if (tokenError.code === "auth/id-token-expired") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
          code: "TOKEN_EXPIRED",
        });
      } else if (tokenError.code === "auth/id-token-revoked") {
        return res.status(401).json({
          success: false,
          message: "Token revoked",
          code: "TOKEN_REVOKED",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
          code: "INVALID_TOKEN",
        });
      }
    }

    // Check if email is verified (skip for OAuth sign-ins)
    // OAuth providers (Google, Facebook, etc.) pre-verify emails
    const oauthProviders = [
      "google.com",
      "facebook.com",
      "apple.com",
      "github.com",
    ];
    const signInProvider = decodedToken.firebase?.sign_in_provider;
    const isOAuthSignIn =
      signInProvider && oauthProviders.includes(signInProvider);

    if (!isOAuthSignIn && !decodedToken.email_verified) {
      Logger.warn("Login attempt with unverified email", {
        uid: decodedToken.uid,
        email: decodedToken.email,
      });

      return res.status(403).json({
        success: false,
        message:
          "Email not verified. Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Check if account is locked
    const locked = await isAccountLocked(decodedToken.uid);
    if (locked) {
      Logger.security("Login attempt on locked account", {
        uid: decodedToken.uid,
        ip: req.socket.remoteAddress,
      });

      return res.status(423).json({
        success: false,
        message: "Account locked due to multiple failed login attempts",
        code: "ACCOUNT_LOCKED",
      });
    }

    // Attach user details from the decoded token to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      name: decodedToken.name,
      image: decodedToken.picture ?? null,
      role: decodedToken.role, // Custom claim set from MongoDB
    };

    // Also attach the full decoded token for advanced use cases
    req.decodedToken = decodedToken;

    Logger.debug("Token verified successfully", {
      uid: decodedToken.uid,
      email: decodedToken.email,
    });

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    Logger.error("Unexpected error in token verification", {
      error: error instanceof Error ? error.message : "Unknown",
      path: req.path,
    });

    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

/**
 * Optional middleware to verify token without requiring it
 * Useful for routes that work for both authenticated and unauthenticated users
 */
export const optionalFirebaseToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided, continue without authentication
      return next();
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken || idToken.trim() === "") {
      return next();
    }

    // Try to verify token
    try {
      const decodedToken = await verifyIdToken(idToken);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email ?? null,
        name: decodedToken.name,
        image: decodedToken.picture ?? null,
        role: decodedToken.role,
      };

      req.decodedToken = decodedToken;
    } catch (tokenError) {
      // Token invalid, but we don't fail the request
      Logger.debug("Optional token verification failed", {
        error: tokenError,
      });
    }

    next();
  } catch (error) {
    // Even if there's an error, continue without authentication
    next();
  }
};
