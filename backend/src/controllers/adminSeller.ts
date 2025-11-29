import { Request, Response } from "express";
import { Seller } from "../models/seller";
import { User } from "../models/users";
import { Product } from "../models/product";
import { Notification } from "../models/notification";

// Get all sellers
export const getAllSellers = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      verificationStatus,
      search,
      sort = "-createdAt",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
    }

    const [sellers, total] = await Promise.all([
      Seller.find(filter).sort(sort as string).skip(skip).limit(limitNum),
      Seller.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: sellers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sellers",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get pending verifications
export const getPendingVerifications = async (req: Request, res: Response) => {
  try {
    const sellers = await Seller.find({ verificationStatus: "pending" }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      data: sellers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching pending verifications",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get seller details
export const getSellerDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Get user account
    const user = await User.findOne({ uid: seller.firebaseUID });

    // Get product count
    const productCount = await Product.countDocuments({ sellerId: seller._id });

    return res.status(200).json({
      success: true,
      data: {
        seller,
        user,
        productCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching seller details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Verify seller
export const verifySeller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findByIdAndUpdate(
      id,
      {
        verificationStatus: "verified",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Update user role to seller
    await User.findOneAndUpdate(
      { uid: seller.firebaseUID },
      { role: "seller" }
    );

    // Send notification
    const user = await User.findOne({ uid: seller.firebaseUID });
    if (user) {
      await Notification.create({
        userId: user._id,
        type: "system",
        title: "Seller Account Verified",
        message: "Your seller account has been verified. You can now start selling!",
        priority: "high",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seller verified successfully",
      data: seller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying seller",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Reject seller
export const rejectSeller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      id,
      {
        verificationStatus: "rejected",
        rejectionReason: reason,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Send notification
    const user = await User.findOne({ uid: seller.firebaseUID });
    if (user) {
      await Notification.create({
        userId: user._id,
        type: "system",
        title: "Seller Verification Rejected",
        message: `Your seller verification was rejected. Reason: ${reason}`,
        priority: "high",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seller verification rejected",
      data: seller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error rejecting seller",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Suspend seller
export const suspendSeller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Update user status
    const user = await User.findOneAndUpdate(
      { uid: seller.firebaseUID },
      {
        accountStatus: "suspended",
        suspensionReason: reason,
      },
      { new: true }
    );

    // Deactivate all seller products
    await Product.updateMany(
      { sellerId: seller._id },
      { status: "inactive" }
    );

    // Send notification
    if (user) {
      await Notification.create({
        userId: user._id,
        type: "system",
        title: "Account Suspended",
        message: `Your seller account has been suspended. Reason: ${reason}`,
        priority: "high",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seller suspended successfully",
      data: { seller, user },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error suspending seller",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get seller statistics
export const getSellerStats = async (req: Request, res: Response) => {
  try {
    const [
      totalSellers,
      verifiedSellers,
      pendingSellers,
      rejectedSellers,
    ] = await Promise.all([
      Seller.countDocuments(),
      Seller.countDocuments({ verificationStatus: "verified" }),
      Seller.countDocuments({ verificationStatus: "pending" }),
      Seller.countDocuments({ verificationStatus: "rejected" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalSellers,
        verifiedSellers,
        pendingSellers,
        rejectedSellers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching seller statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};




