import { Response } from "express";
import { SellerEarnings } from "../models/sellerEarnings";
import { Seller } from "../models/seller";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get earnings summary
export const getEarningsSummary = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const summary = await SellerEarnings.aggregate([
      { $match: { sellerId: seller._id } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$sellerAmount" },
          totalPlatformFees: { $sum: "$platformFee" },
          totalOrders: { $sum: 1 },
          availableForPayout: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$payoutStatus", "pending"] },
                    { $lte: ["$eligibleForPayoutAt", new Date()] },
                  ],
                },
                "$sellerAmount",
                0,
              ],
            },
          },
          pendingClearing: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$payoutStatus", "pending"] },
                    { $gt: ["$eligibleForPayoutAt", new Date()] },
                  ],
                },
                "$sellerAmount",
                0,
              ],
            },
          },
          paidOut: {
            $sum: {
              $cond: [{ $eq: ["$payoutStatus", "paid"] }, "$sellerAmount", 0],
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: summary[0] || {
        totalEarnings: 0,
        totalPlatformFees: 0,
        totalOrders: 0,
        availableForPayout: 0,
        pendingClearing: 0,
        paidOut: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching earnings summary",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get detailed earnings
export const getEarningsDetails = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { page = "1", limit = "20", status, startDate, endDate } = req.query;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { sellerId: seller._id };

    if (status) {
      filter.payoutStatus = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const [earnings, total] = await Promise.all([
      SellerEarnings.find(filter)
        .populate("orderId", "orderNumber createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      SellerEarnings.countDocuments(filter),
    ]);

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: "Error fetching earnings details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get payout history
export const getPayoutHistory = async (req: CustomRequest, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get paid payouts grouped by payout date
    const payouts = await SellerEarnings.aggregate([
      {
        $match: {
          sellerId: seller._id,
          payoutStatus: { $in: ["paid", "processing"] },
        },
      },
      {
        $group: {
          _id: "$payoutDate",
          payoutId: { $first: "$payoutId" },
          totalAmount: { $sum: "$sellerAmount" },
          ordersCount: { $sum: 1 },
          payoutMethod: { $first: "$payoutMethod" },
          status: { $first: "$payoutStatus" },
        },
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limitNum },
    ]);

    const total = await SellerEarnings.aggregate([
      {
        $match: {
          sellerId: seller._id,
          payoutStatus: { $in: ["paid", "processing"] },
        },
      },
      {
        $group: {
          _id: "$payoutDate",
        },
      },
      { $count: "total" },
    ]);

    return res.status(200).json({
      success: true,
      data: payouts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total[0]?.total || 0,
        totalPages: Math.ceil((total[0]?.total || 0) / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching payout history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Request payout
export const requestPayout = async (req: CustomRequest, res: Response) => {
  try {
    const { amount, payoutMethod } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    // Check if seller has bank account set up
    if (!seller.bankAccount || !seller.bankAccount.accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Please set up your bank account details before requesting payout",
      });
    }

    // Calculate available balance
    const availableEarnings = await SellerEarnings.find({
      sellerId: seller._id,
      payoutStatus: "pending",
      eligibleForPayoutAt: { $lte: new Date() },
    });

    const availableAmount = availableEarnings.reduce(
      (sum, earning) => sum + earning.sellerAmount,
      0
    );

    if (availableAmount < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: $${availableAmount.toFixed(2)}`,
      });
    }

    // Update earnings status to processing
    let remainingAmount = amount;
    for (const earning of availableEarnings) {
      if (remainingAmount <= 0) break;

      if (earning.sellerAmount <= remainingAmount) {
        earning.payoutStatus = "processing";
        earning.payoutMethod = payoutMethod;
        remainingAmount -= earning.sellerAmount;
        await earning.save();
      }
    }

    // In a real app, integrate with payment processor here
    // For now, just mark as processing

    return res.status(200).json({
      success: true,
      message: "Payout request submitted successfully",
      data: {
        requestedAmount: amount,
        payoutMethod,
        status: "processing",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error requesting payout",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get transaction history
export const getTransactionHistory = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { page = "1", limit = "20", type } = req.query;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { sellerId: seller._id };

    // Filter by transaction type (earning or payout)
    if (type === "payout") {
      filter.payoutStatus = { $in: ["paid", "processing"] };
    } else if (type === "earning") {
      filter.payoutStatus = "pending";
    }

    const [transactions, total] = await Promise.all([
      SellerEarnings.find(filter)
        .populate("orderId", "orderNumber createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      SellerEarnings.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: transactions,
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
      message: "Error fetching transaction history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};








