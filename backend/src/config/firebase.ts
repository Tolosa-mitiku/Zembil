/**
 * Firebase Admin SDK Configuration
 * 
 * This module provides a centralized Firebase Admin initialization
 * and utility functions for Firebase operations.
 */

import admin from "firebase-admin";
import { Logger } from "../utils/logger";
import * as path from "path";
import * as fs from "fs";

// Flag to track initialization
let isInitialized = false;

/**
 * Initialize Firebase Admin SDK
 * Should be called once during application startup
 */
export const initializeFirebase = (): void => {
  if (isInitialized) {
    Logger.warn("Firebase Admin already initialized");
    return;
  }

  try {
    // Try to load service account from file first
    const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
    
    let serviceAccount: admin.ServiceAccount;

    if (fs.existsSync(serviceAccountPath)) {
      // Load from file (for local development)
      Logger.info("Loading Firebase service account from file");
      serviceAccount = require(serviceAccountPath);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Fallback to environment variable (for production/Vercel)
      Logger.info("Loading Firebase service account from environment variable");
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      throw new Error(
        "Firebase service account not found. Please either:\n" +
        "1. Place firebase-service-account.json in the backend folder, OR\n" +
        "2. Set FIREBASE_SERVICE_ACCOUNT environment variable\n" +
        "Download from: https://console.firebase.google.com/project/zembil1010/settings/serviceaccounts/adminsdk"
      );
    }

    // Validate required fields (JSON uses snake_case, TypeScript expects camelCase)
    const projectId = (serviceAccount as any).project_id || serviceAccount.projectId;
    const privateKey = (serviceAccount as any).private_key || serviceAccount.privateKey;
    const clientEmail = (serviceAccount as any).client_email || serviceAccount.clientEmail;

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error(
        `Missing required fields in service account. Required: project_id, private_key, client_email`
      );
    }

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId,
    });

    isInitialized = true;
    Logger.info("Firebase Admin SDK initialized successfully", {
      projectId: projectId,
    });
  } catch (error) {
    Logger.error("Failed to initialize Firebase Admin SDK", { error });
    throw error;
  }
};

/**
 * Get Firebase Auth instance
 */
export const getAuth = (): admin.auth.Auth => {
  if (!isInitialized) {
    throw new Error("Firebase Admin not initialized. Call initializeFirebase() first.");
  }
  return admin.auth();
};

/**
 * Get Firebase Firestore instance (if needed)
 */
export const getFirestore = (): admin.firestore.Firestore => {
  if (!isInitialized) {
    throw new Error("Firebase Admin not initialized. Call initializeFirebase() first.");
  }
  return admin.firestore();
};

/**
 * Verify a Firebase ID token
 * @param idToken - Firebase ID token to verify
 * @returns Decoded token with user information
 */
export const verifyIdToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken, true); // checkRevoked = true
    return decodedToken;
  } catch (error) {
    Logger.warn("Token verification failed", { error });
    throw error;
  }
};

/**
 * Set custom claims for a user (for role management)
 * @param uid - Firebase user UID
 * @param claims - Custom claims to set
 */
export const setCustomClaims = async (
  uid: string,
  claims: Record<string, any>
): Promise<void> => {
  try {
    await getAuth().setCustomUserClaims(uid, claims);
    Logger.info("Custom claims set successfully", { uid, claims });
  } catch (error) {
    Logger.error("Failed to set custom claims", { uid, error });
    throw error;
  }
};

/**
 * Get user by UID
 * @param uid - Firebase user UID
 */
export const getUserByUid = async (uid: string): Promise<admin.auth.UserRecord> => {
  try {
    return await getAuth().getUser(uid);
  } catch (error) {
    Logger.error("Failed to get user by UID", { uid, error });
    throw error;
  }
};

/**
 * Get user by email
 * @param email - User email
 */
export const getUserByEmail = async (email: string): Promise<admin.auth.UserRecord> => {
  try {
    return await getAuth().getUserByEmail(email);
  } catch (error) {
    Logger.error("Failed to get user by email", { email, error });
    throw error;
  }
};

/**
 * Update Firebase user
 * @param uid - Firebase user UID
 * @param updates - Properties to update
 */
export const updateFirebaseUser = async (
  uid: string,
  updates: admin.auth.UpdateRequest
): Promise<admin.auth.UserRecord> => {
  try {
    const updatedUser = await getAuth().updateUser(uid, updates);
    Logger.info("Firebase user updated successfully", { uid });
    return updatedUser;
  } catch (error) {
    Logger.error("Failed to update Firebase user", { uid, error });
    throw error;
  }
};

/**
 * Delete Firebase user
 * @param uid - Firebase user UID
 */
export const deleteFirebaseUser = async (uid: string): Promise<void> => {
  try {
    await getAuth().deleteUser(uid);
    Logger.info("Firebase user deleted successfully", { uid });
  } catch (error) {
    Logger.error("Failed to delete Firebase user", { uid, error });
    throw error;
  }
};

/**
 * Revoke all refresh tokens for a user (force logout)
 * @param uid - Firebase user UID
 */
export const revokeRefreshTokens = async (uid: string): Promise<void> => {
  try {
    await getAuth().revokeRefreshTokens(uid);
    Logger.info("Refresh tokens revoked successfully", { uid });
  } catch (error) {
    Logger.error("Failed to revoke refresh tokens", { uid, error });
    throw error;
  }
};

/**
 * Create a custom token for a user
 * @param uid - Firebase user UID
 * @param claims - Optional custom claims
 */
export const createCustomToken = async (
  uid: string,
  claims?: Record<string, any>
): Promise<string> => {
  try {
    const token = await getAuth().createCustomToken(uid, claims);
    Logger.info("Custom token created successfully", { uid });
    return token;
  } catch (error) {
    Logger.error("Failed to create custom token", { uid, error });
    throw error;
  }
};

export default {
  initializeFirebase,
  getAuth,
  getFirestore,
  verifyIdToken,
  setCustomClaims,
  getUserByUid,
  getUserByEmail,
  updateFirebaseUser,
  deleteFirebaseUser,
  revokeRefreshTokens,
  createCustomToken,
};


