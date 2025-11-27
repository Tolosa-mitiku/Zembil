/**
 * Firebase Admin SDK Configuration
 * 
 * This module provides a centralized Firebase Admin initialization
 * and utility functions for Firebase operations.
 */

import admin from "firebase-admin";
import { Logger } from "../utils/logger";

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
    // Parse service account from environment variable
    const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountJSON) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
    }

    const serviceAccount = JSON.parse(serviceAccountJSON);

    // Validate required fields
    const requiredFields = ['project_id', 'private_key', 'client_email'];
    for (const field of requiredFields) {
      if (!serviceAccount[field]) {
        throw new Error(`Missing required field in service account: ${field}`);
      }
    }

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: serviceAccount.project_id,
    });

    isInitialized = true;
    Logger.info("Firebase Admin SDK initialized successfully", {
      projectId: serviceAccount.project_id,
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


