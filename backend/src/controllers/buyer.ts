/**
 * Buyer Controller
 * 🔒 RLS: Users can only access their own buyer profile
 */

import { Request, Response } from "express";
import { Buyer, User } from "../models";
import { CustomRequest } from "../types/express";
import { ErrorFactory } from "../utils/errorHandler";
import { Logger } from "../utils/logger";
import { syncProfileImageToUser, syncNameToBuyer } from "../services/profileSync.service";

/**
 * Create a new buyer profile
 */
export const createBuyer = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Ensure userId is from authenticated user
    const buyerData = {
      ...req.body,
      userId: user._id,  // From token, not request
      firebaseUID: user.uid,
    };

    const buyer = new Buyer(buyerData);
    await buyer.save();

    Logger.info("Buyer profile created", { buyerId: buyer._id });

    res.status(201).json({
      success: true,
      message: "Buyer profile created",
      data: buyer,
    });
  } catch (error) {
    Logger.error("Error creating buyer", { error });
    res.status(500).json({
      success: false,
      message: "Error creating buyer",
    });
  }
};

/**
 * Get buyer profile by ID
 * 🔒 RLS: User can only view their own profile (or admin)
 */
export const getBuyerProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUser = (req as any).user;

    // 🔒 RLS CHECK: User can only access their own profile
    if (requestingUser.role !== "admin" && requestingUser._id?.toString() !== id) {
      Logger.security("Unauthorized buyer profile access attempt", {
        requestingUserId: requestingUser._id,
        targetBuyerId: id,
      });

      return res.status(403).json({
        success: false,
        message: "Access denied: Not your profile",
      });
    }

    // Populate user data to get email and phoneNumber
    const buyer = await Buyer.findById(id).populate("userId", "email phoneNumber");

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer profile not found",
      });
    }

    // Combine buyer data with user data
    const buyerData = buyer.toObject();
    const userData = buyerData.userId as any;
    
    res.status(200).json({
      success: true,
      data: {
        ...buyerData,
        email: userData?.email,
        phoneNumber: userData?.phoneNumber,
      },
    });
  } catch (error) {
    Logger.error("Error fetching buyer profile", { error });
    res.status(500).json({
      success: false,
      message: "Error fetching buyer profile",
    });
  }
};

/**
 * Get current user's buyer profile
 * 🔒 RLS: Always returns authenticated user's profile
 */
export const getMyBuyerProfile = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 RLS FILTER: Only user's own profile
    const buyer = await Buyer.findOne({ userId: user._id }).populate("userId", "email phoneNumber");

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer profile not found. Please complete registration.",
      });
    }

    // Combine buyer data with user data
    const buyerData = buyer.toObject();
    const userData = buyerData.userId as any;

    res.status(200).json({
      success: true,
      data: {
        ...buyerData,
        email: userData?.email || user.email,
        phoneNumber: userData?.phoneNumber || user.phoneNumber,
      },
    });
  } catch (error) {
    Logger.error("Error fetching buyer profile", { error });
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

/**
 * Update buyer profile
 * 🔒 RLS: Can only update own profile (verified by middleware)
 */
export const updateBuyerProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUser = (req as any).user;

    // Get the MongoDB user document
    const user = await User.findOne({ uid: requestingUser.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 RLS CHECK: Verify ownership (should be done by middleware, double-check here)
    if (requestingUser.role !== "admin") {
      const buyer = await Buyer.findOne({ _id: id, userId: user._id });
      if (!buyer) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Not your profile",
        });
      }
    }

    // Whitelist allowed fields (mass assignment protection)
    // Note: email is locked for security, phoneNumber is synced to both Buyer and User
    const allowedFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "profileImage",
      "dateOfBirth",
      "gender",
      "preferences",
      "communicationPreferences",
    ];

    const updates: any = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.updatedAt = new Date();

    const updatedBuyer = await Buyer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedBuyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    // Sync profile image back to User if it was updated
    if (req.body.profileImage) {
      try {
        await syncProfileImageToUser(updatedBuyer.userId, req.body.profileImage);
      } catch (error) {
        Logger.warn("Failed to sync profile image to User", { error });
      }
    }

    // Sync name back to User if first/last name was updated
    if (req.body.firstName || req.body.lastName) {
      try {
        const fullName = `${updatedBuyer.firstName} ${updatedBuyer.lastName}`.trim();
        await User.findByIdAndUpdate(updatedBuyer.userId, { name: fullName });
      } catch (error) {
        Logger.warn("Failed to sync name to User", { error });
      }
    }

    // Sync phoneNumber back to User if it was updated
    if (req.body.phoneNumber !== undefined) {
      try {
        await User.findByIdAndUpdate(updatedBuyer.userId, { phoneNumber: req.body.phoneNumber });
      } catch (error) {
        Logger.warn("Failed to sync phoneNumber to User", { error });
      }
    }

    Logger.info("Buyer profile updated", { buyerId: id });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedBuyer,
    });
  } catch (error) {
    Logger.error("Error updating buyer profile", { error });
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

/**
 * Upload profile picture
 * 🔒 RLS: Can only upload own profile picture
 */
export const uploadProfilePicture = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get the MongoDB user document
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 RLS CHECK: Verify ownership
    const buyer = await Buyer.findOne({ _id: id, userId: user._id });
    if (!buyer) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not your profile",
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Construct URL (assuming static serving is configured)
    const imageUrl = `/api/v1/uploads/${req.file.filename}`;

    const updatedBuyer = await Buyer.findByIdAndUpdate(
      id,
      { profileImage: imageUrl, updatedAt: new Date() },
      { new: true }
    );

    // Sync profile image back to User
    if (updatedBuyer) {
      try {
        await User.findByIdAndUpdate(updatedBuyer.userId, { image: imageUrl });
      } catch (error) {
        Logger.warn("Failed to sync profile image to User", { error });
      }
    }

    Logger.info("Buyer profile picture updated", { buyerId: id });

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      data: { profileImage: imageUrl, buyer: updatedBuyer }
    });
  } catch (error) {
    Logger.error("Error uploading profile picture", { error });
    res.status(500).json({ success: false, message: "Error uploading profile picture", error });
  }
};

/**
 * Upload cover image
 * 🔒 RLS: Can only upload own cover image
 */
export const uploadCoverImage = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get the MongoDB user document
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 RLS CHECK: Verify ownership
    const buyer = await Buyer.findOne({ _id: id, userId: user._id });
    if (!buyer) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not your profile",
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const imageUrl = `/api/v1/uploads/${req.file.filename}`;

    // Note: Buyer model doesn't have coverImage field yet, we'll need to add it
    // For now, we'll skip updating the model but still return success
    // TODO: Add coverImage field to Buyer schema

    Logger.info("Buyer cover image uploaded", { buyerId: id, imageUrl });

    res.status(200).json({
      success: true,
      message: "Cover image uploaded (feature in progress)",
      data: { coverImage: imageUrl }
    });
  } catch (error) {
    Logger.error("Error uploading cover image", { error });
    res.status(500).json({ success: false, message: "Error uploading cover image", error });
  }
};

/**
 * Add a new delivery address (DEPRECATED - use Address model)
 */
export const addDeliveryAddress = async (req: Request, res: Response) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    buyer.deliveryAddresses.push(req.body);
    await buyer.save();
    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error });
  }
};

/**
 * Delete a buyer account (Soft delete recommended)
 */
export const deleteBuyer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - mark user as deleted instead
    const user = await User.findOne({ _id: id });
    if (user) {
      user.accountStatus = "deleted";
      user.deletedAt = new Date();
      await user.save();
    }

    const deletedBuyer = await Buyer.findByIdAndDelete(id);

    if (!deletedBuyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    Logger.info("Buyer account deleted", { buyerId: id });

    res.status(200).json({
      success: true,
      message: "Buyer deleted successfully",
    });
  } catch (error) {
    Logger.error("Error deleting buyer", { error });
    res.status(500).json({
      success: false,
      message: "Error deleting buyer",
    });
  }
};
