/**
 * Seller Earnings Controller
 * 🔒 RLS: Sellers can only view their own earnings, Admins can view all
 */

import { Request, Response } from "express";
import { SellerEarnings, Seller, User } from "../models";
import { CustomRequest } from "../types/express";
import { ErrorFactory } from "../utils/errorHandler";
import { Logger } from "../utils/logger";

/**
 * Get seller's earnings (RLS Protected)
 */
export const getMyEarnings = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      throw ErrorFactory.notFound("User");
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) {
      throw ErrorFactory.notFound("Seller profile");
    }

    const { page = "1", limit = "20", status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    // 🔒 RLS FILTER: Seller can only see their own earnings
    const filter: any = { sellerId: seller._id };

    if (status) {
      filter.payoutStatus = status;
    }

    const [earnings, total] = await Promise.all([
      SellerEarnings.find(filter)
        .populate("orderId", "orderNumber createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      SellerEarnings.countDocuments(filter),
    ]);

    // Calculate summary
    const summary = await SellerEarnings.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$payoutStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$sellerAmount" },
        },
      },
    ]);

    Logger.info("Seller earnings retrieved", {
      sellerId: seller._id,
      count: earnings.length,
    });

    return res.json({
      success: true,
      data: earnings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      summary,
    });
  } catch (error) {
    Logger.error("Error fetching seller earnings", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
    });
  }
};

/**
 * Get earnings by status (RLS Protected)
 */
export const getEarningsByStatus = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { status } = req.params;
    const user = await User.findOne({ uid: req.user?.uid });

    if (!user) {
      throw ErrorFactory.notFound("User");
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) {
      throw ErrorFactory.notFound("Seller profile");
    }

    // 🔒 RLS FILTER
    const earnings = await SellerEarnings.find({
      sellerId: seller._id,
      payoutStatus: status,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: earnings,
      count: earnings.length,
    });
  } catch (error) {
    Logger.error("Error fetching earnings by status", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
    });
  }
};

/**
 * Get earnings summary (RLS Protected)
 */
export const getEarningsSummary = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      throw ErrorFactory.notFound("User");
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) {
      throw ErrorFactory.notFound("Seller profile");
    }

    // 🔒 RLS FILTER
    const summary = await SellerEarnings.aggregate([
      { $match: { sellerId: seller._id } },
      {
        $group: {
          _id: "$payoutStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$sellerAmount" },
          platformFee: { $sum: "$platformFee" },
        },
      },
    ]);

    const total = await SellerEarnings.aggregate([
      { $match: { sellerId: seller._id } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$sellerAmount" },
          totalOrders: { $sum: 1 },
          totalPlatformFees: { $sum: "$platformFee" },
        },
      },
    ]);

    return res.json({
      success: true,
      data: {
        byStatus: summary,
        total: total[0] || {
          totalEarnings: 0,
          totalOrders: 0,
          totalPlatformFees: 0,
        },
      },
    });
  } catch (error) {
    Logger.error("Error fetching earnings summary", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch summary",
    });
  }
};

/**
 * Get all earnings (Admin only - No RLS)
 */
export const getAllEarnings = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20", sellerId, status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (sellerId) filter.sellerId = sellerId;
    if (status) filter.payoutStatus = status;

    const [earnings, total] = await Promise.all([
      SellerEarnings.find(filter)
        .populate("sellerId", "businessName email")
        .populate("orderId", "orderNumber totalPrice")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      SellerEarnings.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: earnings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    Logger.error("Error fetching all earnings", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
    });
  }
};

