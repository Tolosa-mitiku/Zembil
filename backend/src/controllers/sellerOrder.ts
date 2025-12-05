import { Response } from "express";
import { Order } from "../models/order";
import { Seller } from "../models/seller";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";
import { Notification } from "../models/notification";

// Get seller orders
export const getSellerOrders = async (req: CustomRequest, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      status,
      startDate,
      endDate,
    } = req.query;

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
    const filter: any = { "items.sellerId": seller._id };

    if (status) {
      filter["tracking.status"] = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("buyerId", "name email phoneNumber")
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
      message: "Error fetching seller orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get single order details
export const getSellerOrderById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

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

    const order = await Order.findOne({
      _id: id,
      "items.sellerId": seller._id,
    }).populate("buyerId", "name email phoneNumber image");

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

// Update order fulfillment status
export const updateOrderStatus = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

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

    const order = await Order.findOne({
      _id: id,
      "items.sellerId": seller._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Update order status
    if (order.tracking) {
      order.tracking.status = status;
      order.tracking.statusHistory.push({
        status,
        timestamp: new Date(),
        location: seller.address.city,
        note: note || `Status updated by seller`,
      });
    }

    order.updatedAt = new Date();
    await order.save();

    // Create notification for buyer
    await Notification.create({
      userId: order.buyerId,
      type: `order_${status}`,
      title: `Order ${status}`,
      message: `Your order #${order.orderNumber} has been ${status}`,
      data: { orderId: order._id, orderNumber: order.orderNumber },
    });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Mark order as shipped
export const shipOrder = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier, estimatedDelivery } = req.body;

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

    const order = await Order.findOne({
      _id: id,
      "items.sellerId": seller._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Update order tracking
    if (order.tracking) {
      order.tracking.status = "shipped";
      order.tracking.trackingNumber = trackingNumber;
      order.tracking.carrier = carrier;
      if (estimatedDelivery) {
        order.tracking.estimatedDelivery = new Date(estimatedDelivery);
      }
      order.tracking.statusHistory.push({
        status: "shipped",
        timestamp: new Date(),
        location: seller.address.city,
        note: `Shipped via ${carrier} - Tracking: ${trackingNumber}`,
      });
    }

    order.updatedAt = new Date();
    await order.save();

    // Create notification for buyer
    await Notification.create({
      userId: order.buyerId,
      type: "order_shipped",
      title: "Order Shipped",
      message: `Your order #${order.orderNumber} has been shipped. Tracking number: ${trackingNumber}`,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        trackingNumber,
        carrier,
      },
      priority: "high",
    });

    return res.status(200).json({
      success: true,
      message: "Order marked as shipped",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error shipping order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Mark order as delivered
export const deliverOrder = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

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

    const order = await Order.findOne({
      _id: id,
      "items.sellerId": seller._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Update order status
    if (order.tracking) {
      order.tracking.status = "delivered";
      order.tracking.statusHistory.push({
        status: "delivered",
        timestamp: new Date(),
        location: order.shippingAddress.city,
        note: "Order delivered successfully",
      });
    }

    order.updatedAt = new Date();
    await order.save();

    // Create notification for buyer
    await Notification.create({
      userId: order.buyerId,
      type: "order_delivered",
      title: "Order Delivered",
      message: `Your order #${order.orderNumber} has been delivered`,
      data: { orderId: order._id, orderNumber: order.orderNumber },
      priority: "high",
    });

    return res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error delivering order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};








