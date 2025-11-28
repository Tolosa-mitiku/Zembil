/**
 * Authentication Synchronization Service
 * 
 * Handles synchronization between Firebase Authentication and MongoDB
 * Ensures data consistency and role management across both systems
 */

import { User } from "../models/users";
import { Buyer } from "../models/buyer";
import { Seller } from "../models/seller";
import { Logger } from "../utils/logger";
import { setCustomClaims, getUserByUid } from "../config/firebase";
import { DecodedIdToken } from "firebase-admin/auth";

interface CreateUserParams {
  uid: string;
  email: string;
  name?: string;
  image?: string;
  phoneNumber?: string;
  role?: "buyer" | "seller" | "admin";
  isEmailVerified?: boolean;
}

interface UpdateUserParams {
  name?: string;
  image?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
}

/**
 * Create or update user in MongoDB after Firebase authentication
 * This is the main entry point for user synchronization
 */
export const syncUserWithDatabase = async (
  decodedToken: DecodedIdToken,
  additionalData?: Partial<CreateUserParams>
): Promise<any> => {
  try {
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    if (!email) {
      throw new Error("Email is required for user synchronization");
    }

    Logger.info("Syncing user with database", { uid, email });

    // Check if user exists by UID OR email (to handle existing users)
    let user = await User.findOne({ $or: [{ uid }, { email }] });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = await createNewUser({
        uid,
        email,
        name: additionalData?.name || decodedToken.name,
        image: additionalData?.image || decodedToken.picture,
        phoneNumber: additionalData?.phoneNumber || decodedToken.phone_number,
        role: additionalData?.role || "buyer", // Default role
        isEmailVerified: decodedToken.email_verified || false,
      });
      
      if (!user) {
        throw new Error("Failed to create user");
      }
      
      isNewUser = true;

      // Sync role to Firebase custom claims
      await syncRoleToFirebase(uid, user.role);
    } else {
      // User exists - update UID if needed (in case email exists but UID doesn't match)
      if (user.uid !== uid) {
        Logger.info("Updating existing user UID", {
          oldUid: user.uid,
          newUid: uid,
          email,
        });
        user.uid = uid;
      }

      // Update existing user
      await updateExistingUser(user, {
        name: decodedToken.name,
        image: decodedToken.picture,
        isEmailVerified: decodedToken.email_verified,
      });

      // Ensure Firebase custom claims match MongoDB role
      if (decodedToken.role !== user.role) {
        await syncRoleToFirebase(uid, user.role);
      }
    }

    return { user, isNewUser };
  } catch (error) {
    Logger.error("Error syncing user with database", {
      uid: decodedToken.uid,
      error,
    });
    throw error;
  }
};

/**
 * Create a new user in MongoDB
 */
export const createNewUser = async (params: CreateUserParams): Promise<any> => {
  try {
    const {
      uid,
      email,
      name,
      image,
      phoneNumber,
      role = "buyer",
      isEmailVerified = false,
    } = params;

    Logger.info("Creating new user", { uid, email, role });

    // Create user in main users collection
    const user = new User({
      uid,
      email,
      name: name || email.split("@")[0], // Use email username as fallback
      image,
      phoneNumber,
      role,
      isEmailVerified,
      emailVerifiedAt: isEmailVerified ? new Date() : undefined,
      accountStatus: "active",
      loginCount: 1,
      lastLogin: new Date(),
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        totalReviews: 0,
        accountAge: 0,
      },
    });

    await user.save();

    Logger.info("User created successfully in MongoDB", {
      userId: user._id,
      uid: user.uid,
      role: user.role,
    });

    // Create role-specific profile
    await createRoleProfile(user);

    return user;
  } catch (error) {
    Logger.error("Error creating new user", { params, error });
    throw error;
  }
};

/**
 * Update existing user in MongoDB
 */
export const updateExistingUser = async (
  user: any,
  updates: UpdateUserParams
): Promise<any> => {
  try {
    // Update user fields
    if (updates.name) user.name = updates.name;
    if (updates.image) user.image = updates.image;
    if (updates.phoneNumber) user.phoneNumber = updates.phoneNumber;
    
    if (updates.isEmailVerified && !user.isEmailVerified) {
      user.isEmailVerified = true;
      user.emailVerifiedAt = new Date();
    }

    // Update login tracking
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;

    await user.save();

    Logger.info("User updated successfully", {
      userId: user._id,
      uid: user.uid,
    });

    return user;
  } catch (error) {
    Logger.error("Error updating existing user", {
      userId: user._id,
      error,
    });
    throw error;
  }
};

/**
 * Create role-specific profile (Buyer or Seller)
 */
const createRoleProfile = async (user: any): Promise<void> => {
  try {
    if (user.role === "buyer") {
      // Create buyer profile
      const existingBuyer = await Buyer.findOne({ userId: user._id });
      if (!existingBuyer) {
        const buyer = new Buyer({
          userId: user._id,
          firebaseUID: user.uid,
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          displayName: user.name,
          // email and phoneNumber come from User model via reference
          profileImage: user.image,
        });
        await buyer.save();
        Logger.info("Buyer profile created", { userId: user._id });
      }
    } else if (user.role === "seller") {
      // Create seller profile
      const existingSeller = await Seller.findOne({ userId: user._id });
      if (!existingSeller) {
        const seller = new Seller({
          userId: user._id,
          firebaseUID: user.uid,
          type: "individual", // Default type
          // email and phoneNumber come from User model via reference
          profileImage: user.image,
          address: {
            addressLine1: "",
            city: "",
            postalCode: "",
            country: "",
          },
          verification: {
            status: "pending",
          },
        });
        await seller.save();
        Logger.info("Seller profile created", { userId: user._id });
      }
    }
  } catch (error) {
    Logger.error("Error creating role profile", {
      userId: user._id,
      role: user.role,
      error,
    });
    // Don't throw - profile creation is not critical for authentication
  }
};

/**
 * Sync user role from MongoDB to Firebase custom claims
 */
export const syncRoleToFirebase = async (
  uid: string,
  role: string
): Promise<void> => {
  try {
    await setCustomClaims(uid, { role });
    Logger.info("Role synced to Firebase custom claims", { uid, role });
  } catch (error) {
    Logger.error("Error syncing role to Firebase", { uid, role, error });
    // Don't throw - custom claims are not critical for basic auth
  }
};

/**
 * Update user role (both MongoDB and Firebase)
 */
export const updateUserRole = async (
  uid: string,
  newRole: "buyer" | "seller" | "admin"
): Promise<void> => {
  try {
    // Update MongoDB
    const user = await User.findOne({ uid });
    if (!user) {
      throw new Error("User not found");
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    // Update Firebase custom claims
    await syncRoleToFirebase(uid, newRole);

    // Create role-specific profile if needed
    await createRoleProfile(user);

    Logger.info("User role updated successfully", {
      uid,
      oldRole,
      newRole,
    });
  } catch (error) {
    Logger.error("Error updating user role", { uid, newRole, error });
    throw error;
  }
};

/**
 * Sync Firebase user data to MongoDB
 * Useful for keeping profiles in sync
 */
export const syncFirebaseToMongo = async (uid: string): Promise<void> => {
  try {
    const firebaseUser = await getUserByUid(uid);
    const mongoUser = await User.findOne({ uid });

    if (!mongoUser) {
      throw new Error("User not found in MongoDB");
    }

    // Update MongoDB with Firebase data
    let updated = false;

    if (firebaseUser.displayName && firebaseUser.displayName !== mongoUser.name) {
      mongoUser.name = firebaseUser.displayName;
      updated = true;
    }

    if (firebaseUser.photoURL && firebaseUser.photoURL !== mongoUser.image) {
      mongoUser.image = firebaseUser.photoURL;
      updated = true;
    }

    if (firebaseUser.phoneNumber && firebaseUser.phoneNumber !== mongoUser.phoneNumber) {
      mongoUser.phoneNumber = firebaseUser.phoneNumber;
      updated = true;
    }

    if (firebaseUser.emailVerified && !mongoUser.isEmailVerified) {
      mongoUser.isEmailVerified = true;
      mongoUser.emailVerifiedAt = new Date();
      updated = true;
    }

    if (updated) {
      await mongoUser.save();
      Logger.info("MongoDB user synced with Firebase data", { uid });
    }
  } catch (error) {
    Logger.error("Error syncing Firebase to MongoDB", { uid, error });
    throw error;
  }
};

/**
 * Track user login with IP and location
 */
export const trackLogin = async (
  uid: string,
  ip: string,
  userAgent?: string
): Promise<void> => {
  try {
    const user = await User.findOne({ uid });
    if (!user) return;

    user.lastLogin = new Date();
    user.lastLoginIp = ip;
    user.loginCount = (user.loginCount || 0) + 1;

    // You can integrate with IP geolocation service here
    // For now, we'll just track the IP
    
    await user.save();
    
    Logger.info("Login tracked", {
      uid,
      ip,
      loginCount: user.loginCount,
    });
  } catch (error) {
    Logger.error("Error tracking login", { uid, error });
    // Don't throw - tracking is not critical
  }
};

export default {
  syncUserWithDatabase,
  createNewUser,
  updateExistingUser,
  syncRoleToFirebase,
  updateUserRole,
  syncFirebaseToMongo,
  trackLogin,
};


