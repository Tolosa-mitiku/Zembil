/**
 * Profile Synchronization Service
 * 
 * Handles synchronization of shared fields between User, Buyer, and Seller collections
 * Ensures data consistency across related collections
 */

import { User } from "../models/users";
import { Buyer } from "../models/buyer";
import { Seller } from "../models/seller";
import { Logger } from "../utils/logger";
import { Types } from "mongoose";

/**
 * Sync profile image across all related collections
 */
export const syncProfileImage = async (
  userId: string | Types.ObjectId,
  imageUrl: string
): Promise<void> => {
  try {
    const userIdObj = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Update User
    await User.findByIdAndUpdate(userIdObj, { image: imageUrl });

    // Get user to check role
    const user = await User.findById(userIdObj);
    if (!user) {
      Logger.warn("User not found during profile image sync", { userId });
      return;
    }

    // Update role-specific profile
    if (user.role === "buyer") {
      await Buyer.findOneAndUpdate(
        { userId: userIdObj },
        { profileImage: imageUrl },
        { new: true }
      );
      Logger.info("Buyer profile image synced", { userId });
    } else if (user.role === "seller") {
      await Seller.findOneAndUpdate(
        { userId: userIdObj },
        { profileImage: imageUrl },
        { new: true }
      );
      Logger.info("Seller profile image synced", { userId });
    }
  } catch (error) {
    Logger.error("Error syncing profile image", { userId, error });
    throw error;
  }
};

/**
 * Sync name from User to Buyer profile
 * Updates firstName, lastName, and displayName in Buyer
 */
export const syncNameToBuyer = async (
  userId: string | Types.ObjectId,
  fullName: string
): Promise<void> => {
  try {
    const userIdObj = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    
    // Parse name into first and last
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const displayName = fullName;

    await Buyer.findOneAndUpdate(
      { userId: userIdObj },
      { 
        firstName,
        lastName,
        displayName,
      },
      { new: true }
    );

    Logger.info("Buyer name synced", { userId, fullName });
  } catch (error) {
    Logger.error("Error syncing name to buyer", { userId, error });
    // Don't throw - name sync is not critical
  }
};

/**
 * Sync all common fields from User to role-specific profile
 */
export const syncUserToProfile = async (
  userId: string | Types.ObjectId
): Promise<void> => {
  try {
    const userIdObj = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const user = await User.findById(userIdObj);

    if (!user) {
      Logger.warn("User not found during full profile sync", { userId });
      return;
    }

    // Sync to role-specific profile
    if (user.role === "buyer") {
      const nameParts = (user.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await Buyer.findOneAndUpdate(
        { userId: userIdObj },
        {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          displayName: user.name || undefined,
          profileImage: user.image || undefined,
        },
        { new: true }
      );
      Logger.info("Full buyer profile synced", { userId });
    } else if (user.role === "seller") {
      await Seller.findOneAndUpdate(
        { userId: userIdObj },
        {
          profileImage: user.image || undefined,
        },
        { new: true }
      );
      Logger.info("Full seller profile synced", { userId });
    }
  } catch (error) {
    Logger.error("Error in full profile sync", { userId, error });
    throw error;
  }
};

/**
 * Sync profile image from role-specific profile back to User
 * Useful when image is updated directly in Buyer/Seller
 */
export const syncProfileImageToUser = async (
  userId: string | Types.ObjectId,
  imageUrl: string
): Promise<void> => {
  try {
    const userIdObj = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    
    await User.findByIdAndUpdate(
      userIdObj,
      { image: imageUrl },
      { new: true }
    );

    Logger.info("Profile image synced back to User", { userId });
  } catch (error) {
    Logger.error("Error syncing profile image to user", { userId, error });
    throw error;
  }
};

/**
 * Get combined profile data (User + Buyer/Seller)
 * Returns a unified view of user data without duplication
 */
export const getCombinedProfile = async (
  userId: string | Types.ObjectId
): Promise<any> => {
  try {
    const userIdObj = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const user = await User.findById(userIdObj);

    if (!user) {
      return null;
    }

    let roleProfile = null;
    if (user.role === "buyer") {
      roleProfile = await Buyer.findOne({ userId: userIdObj });
    } else if (user.role === "seller") {
      roleProfile = await Seller.findOne({ userId: userIdObj });
    }

    return {
      // Core user data (single source of truth)
      _id: user._id,
      uid: user.uid,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      accountStatus: user.accountStatus,
      
      // Name and image (from User)
      name: user.name,
      image: user.image,
      
      // Role-specific profile
      roleProfile,
      
      // Metadata
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  } catch (error) {
    Logger.error("Error getting combined profile", { userId, error });
    throw error;
  }
};

export default {
  syncProfileImage,
  syncNameToBuyer,
  syncUserToProfile,
  syncProfileImageToUser,
  getCombinedProfile,
};

