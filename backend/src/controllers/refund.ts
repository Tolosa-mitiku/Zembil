import { Request, Response } from "express";
import { Refund, Order, Payment } from "../models";
import { AuditService } from "../services";

/**
 * Request refund (Buyer)
 */
export const requestRefund = async (req: Request, res: Response) => {
  try {
    const buyerId = (req as any).user._id;
    const { orderId, amount, reason, type } = req.body;

    // Validate order belongs to buyer
    const order = await Order.findOne({ _id: orderId, buyerId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be refunded
    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order payment status must be 'paid' to request refund",
      });
    }

    // Check if refund already exists
    const existingRefund = await Refund.findOne({ orderId });
    if (existingRefund) {
      return res.status(400).json({
        success: false,
        message: "Refund already requested for this order",
      });
    }

    // Get payment info
    const payment = await Payment.findOne({ orderId });

    // Create refund request
    const refund = await Refund.create({
      orderId,
      paymentId: payment?._id,
      buyerId,
      sellerId: order.items[0]?.sellerId, // Primary seller
      amount: type === "partial" ? amount : order.totalPrice,
      reason,
      type: type || "full",
      status: "pending",
    });

    // Update order refund status
    await Order.updateOne(
      { _id: orderId },
      {
        $set: {
          "refund.status": "requested",
          "refund.amount": refund.amount,
          "refund.reason": reason,
          "refund.requestedAt": new Date(),
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Refund requested successfully",
      data: refund,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to request refund",
    });
  }
};

/**
 * Approve refund (Admin)
 */
export const approveRefund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user._id;
    const adminName = (req as any).user.name;
    const { notes } = req.body;

    const refund = await Refund.findById(id);
    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found",
      });
    }

    if (refund.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot approve refund with status: ${refund.status}`,
      });
    }

    // Update refund
    await Refund.updateOne(
      { _id: id },
      {
        $set: {
          status: "processing",
          approvedBy: adminId,
          approvedAt: new Date(),
          notes,
        },
      }
    );

    // Update order
    await Order.updateOne(
      { _id: refund.orderId },
      {
        $set: {
          "refund.status": "processing",
          "refund.processedAt": new Date(),
        },
      }
    );

    // Log audit
    await AuditService.logAction(
      "APPROVE_REFUND",
      adminId,
      adminName,
      "refund",
      id,
      `Approved refund of ${refund.amount} for order ${refund.orderId}`
    );

    res.json({
      success: true,
      message: "Refund approved successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve refund",
    });
  }
};

/**
 * Reject refund (Admin)
 */
export const rejectRefund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user._id;
    const adminName = (req as any).user.name;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const refund = await Refund.findById(id);
    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found",
      });
    }

    await Refund.updateOne(
      { _id: id },
      {
        $set: {
          status: "rejected",
          notes: reason,
        },
      }
    );

    // Update order
    await Order.updateOne(
      { _id: refund.orderId },
      {
        $set: {
          "refund.status": "rejected",
        },
      }
    );

    // Log audit
    await AuditService.logAction(
      "REJECT_REFUND",
      adminId,
      adminName,
      "refund",
      id,
      `Rejected refund: ${reason}`
    );

    res.json({
      success: true,
      message: "Refund rejected",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reject refund",
    });
  }
};

/**
 * Get refund status (Buyer)
 */
export const getRefundStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const buyerId = (req as any).user._id;

    const refund = await Refund.findOne({ _id: id, buyerId })
      .populate("orderId", "orderNumber totalPrice")
      .populate("buyerId", "name email");

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found",
      });
    }

    res.json({
      success: true,
      data: refund,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get refund status",
    });
  }
};

/**
 * Get all refund requests (Admin)
 */
export const getAllRefunds = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const refunds = await Refund.find(query)
      .populate("buyerId", "name email")
      .populate("sellerId", "businessName email")
      .populate("orderId", "orderNumber totalPrice")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Refund.countDocuments(query);

    res.json({
      success: true,
      data: refunds,
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
      message: error.message || "Failed to get refunds",
    });
  }
};

