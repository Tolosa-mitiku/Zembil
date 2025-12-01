import { Request, Response } from "express";
import { PayoutService } from "../services";
import { PayoutRequest } from "../models";

/**
 * Create payout request (Seller)
 */
export const createPayoutRequest = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;
    const { amount } = req.body;

    const payout = await PayoutService.createPayoutRequest(sellerId, amount);

    res.status(201).json({
      success: true,
      message: "Payout request created successfully",
      data: payout,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create payout request",
    });
  }
};

/**
 * Get seller payout requests
 */
export const getSellerPayouts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = { sellerId };
    if (status) query.status = status;

    const payouts = await PayoutRequest.find(query)
      .sort({ requestedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await PayoutRequest.countDocuments(query);

    res.json({
      success: true,
      data: payouts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payout requests",
    });
  }
};

/**
 * Get available earnings (Seller)
 */
export const getAvailableEarnings = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;

    const available = await PayoutService.getAvailableEarnings(sellerId);

    res.json({
      success: true,
      data: available,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get available earnings",
    });
  }
};

/**
 * Approve payout request (Admin)
 */
export const approvePayout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user._id;

    const payout = await PayoutService.approvePayout(id, adminId);

    res.json({
      success: true,
      message: "Payout approved successfully",
      data: payout,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to approve payout",
    });
  }
};

/**
 * Reject payout request (Admin)
 */
export const rejectPayout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user._id;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    await PayoutService.rejectPayout(id, adminId, reason);

    res.json({
      success: true,
      message: "Payout rejected successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to reject payout",
    });
  }
};

/**
 * Get all payout requests (Admin)
 */
export const getAllPayoutRequests = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const payouts = await PayoutRequest.find(query)
      .populate("sellerId", "businessName email")
      .sort({ requestedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await PayoutRequest.countDocuments(query);

    res.json({
      success: true,
      data: payouts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payout requests",
    });
  }
};

/**
 * Cancel payout request (Seller)
 */
export const cancelPayoutRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = (req as any).user.sellerId;

    const payout = await PayoutRequest.findOne({ _id: id, sellerId });
    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout request not found",
      });
    }

    if (payout.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel payout with status: ${payout.status}`,
      });
    }

    // Update payout status
    await PayoutRequest.updateOne(
      { _id: id },
      { $set: { status: "cancelled" } }
    );

    // Release earnings back to pending
    const { SellerEarnings } = require("../models");
    await SellerEarnings.updateMany(
      { _id: { $in: payout.earningIds } },
      { $set: { payoutStatus: "pending" } }
    );

    res.json({
      success: true,
      message: "Payout request cancelled successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel payout request",
    });
  }
};

