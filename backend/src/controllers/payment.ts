import { Request, Response } from "express";
import { Payment, User } from "../models";
import { ErrorFactory } from "../utils/errorHandler";
import { Logger } from "../utils/logger";

/**
 * Create payment details
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const paymentData = req.body;

    // Ensure buyerId is from authenticated user (security)
    paymentData.buyerId = user._id;

    const payment = new Payment(paymentData);
    await payment.save();

    Logger.info("Payment created", {
      paymentId: payment._id,
      orderId: payment.orderId,
      amount: payment.amount,
    });

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: payment,
    });
  } catch (error) {
    Logger.error("Error creating payment", { error });
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};

/**
 * Get payment details by Order ID
 * 🔒 SECURED: Only order owner or admin can view
 */
export const getPaymentByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const user = (req as any).user;

    const payment = await Payment.findOne({ orderId }).populate(
      "buyerId",
      "name email"
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this order",
      });
    }

    // 🔒 SECURITY: Only buyer who made payment or admin can view
    if (
      user.role !== "admin" &&
      payment.buyerId.toString() !== user._id.toString()
    ) {
      Logger.security("Unauthorized payment access attempt", {
        userId: user._id,
        paymentId: payment._id,
        buyerId: payment.buyerId,
      });

      return res.status(403).json({
        success: false,
        message: "Access denied: Not your payment",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    Logger.error("Error fetching payment by order ID", { error });
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
    });
  }
};

/**
 * Get all payments made by a Buyer
 * 🔒 SECURED: Admin only
 */
export const getPaymentsByBuyer = async (req: Request, res: Response) => {
  try {
    const { buyerId } = req.params;
    const requestingUser = (req as any).user;

    // 🔒 SECURITY: Only admin can view (already enforced by route middleware)
    // Double check for extra security
    if (requestingUser.role !== "admin") {
      Logger.security("Unauthorized buyer payments access attempt", {
        requestingUserId: requestingUser._id,
        targetBuyerId: buyerId,
      });

      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    const payments = await Payment.find({ buyerId })
      .select("-metadata") // Don't expose internal metadata
      .sort({ createdAt: -1 });

    if (!payments.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No payments found",
      });
    }

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    Logger.error("Error fetching payments for buyer", { error });
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

/**
 * Get all payments received by a Seller
 * 🔒 SECURED: Seller can view their own, Admin can view all
 */
export const getPaymentsBySeller = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const requestingUser = (req as any).user;

    // 🔒 SECURITY: Verify seller is viewing their own payments or is admin
    if (
      requestingUser.role !== "admin" &&
      requestingUser.sellerId?.toString() !== sellerId
    ) {
      Logger.security("Unauthorized seller payments access attempt", {
        requestingUserId: requestingUser._id,
        targetSellerId: sellerId,
      });

      return res.status(403).json({
        success: false,
        message: "Access denied: Not your payments",
      });
    }

    // Find payments containing this seller's products
    const payments = await Payment.find({
      "sellerEarnings.sellerId": sellerId,
    })
      .select("-metadata")
      .sort({ createdAt: -1 });

    if (!payments.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No payments found",
      });
    }

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    Logger.error("Error fetching payments for seller", { error });
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};
