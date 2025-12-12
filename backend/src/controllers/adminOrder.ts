import { Request, Response } from "express";
import { Order } from "../models/order";
import { Notification } from "../models/notification";

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      status,
      startDate,
      endDate,
      search,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (status) filter["tracking.status"] = status;
    if (search) {
      filter.orderNumber = { $regex: search, $options: "i" };
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("buyerId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: orders,
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
      message: "Error fetching orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get order details
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("buyerId", "name email phoneNumber image")
      .populate("items.productId", "title images category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Process refund
export const processRefund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.refund = {
      status: "completed",
      amount,
      reason,
      requestedAt: new Date(),
      processedAt: new Date(),
    };
    order.paymentStatus = "refunded";
    order.updatedAt = new Date();

    await order.save();

    // Notify buyer
    await Notification.create({
      userId: order.buyerId,
      type: "payment_success",
      title: "Refund Processed",
      message: `Your refund of $${amount} for order ${order.orderNumber} has been processed`,
      priority: "high",
    });

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing refund",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get order statistics
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$tracking.status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


















