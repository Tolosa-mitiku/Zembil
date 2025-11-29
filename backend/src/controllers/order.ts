import { Response } from "express";
import { Order, User, Cart, Payment, SellerEarnings } from "../models";
import { CustomRequest } from "../types/express";
import { InventoryService, AnalyticsService, LoyaltyService } from "../services";

/**
 * Create a new order
 */
export const createOrder = async (req: CustomRequest, res: Response) => {
  try {
    const { items, totalPrice, shippingAddress, paymentMethod, paymentId } =
      req.body;

    // Get user's MongoDB _id from Firebase UID
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create order
    const order = new Order({
      buyerId: user._id,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentId,
      paymentStatus: paymentId ? "paid" : "pending",
      tracking: {
        status: "confirmed",
        statusHistory: [
          {
            status: "confirmed",
            timestamp: new Date(),
            location: shippingAddress.city,
          },
        ],
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await order.save();

    // Commit inventory (deduct from stock)
    try {
      await InventoryService.commitInventory(
        items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      console.error("Failed to commit inventory:", error);
      // Continue anyway - will be handled manually if needed
    }

    // Create payment record if paid
    if (paymentId && paymentMethod) {
      try {
        const platformFee = totalPrice * 0.1; // 10% platform fee
        const sellerEarnings = totalPrice - platformFee;

        await Payment.create({
          orderId: order._id,
          buyerId: user._id,
          amount: totalPrice,
          method: paymentMethod,
          paymentStatus: "paid",
          transactionId: paymentId,
          platformFee,
          sellerEarnings: items.map((item: any) => ({
            sellerId: item.sellerId,
            amount: item.subtotal,
            platformFeeAmount: item.subtotal * 0.1,
            netAmount: item.subtotal * 0.9,
          })),
        });

        // Create seller earnings records
        for (const item of items) {
          if (item.sellerId) {
            await SellerEarnings.create({
              sellerId: item.sellerId,
              orderId: order._id,
              orderNumber: order.orderNumber,
              totalAmount: item.subtotal,
              platformFee: item.subtotal * 0.1,
              platformFeePercentage: 10,
              sellerAmount: item.subtotal * 0.9,
            });
          }
        }
      } catch (error) {
        console.error("Failed to create payment/earnings records:", error);
      }
    }

    // Clear cart after order
    try {
      await Cart.updateOne(
        { userId: user._id },
        {
          $set: {
            items: [],
            convertedToOrder: true,
            orderId: order._id,
          },
        }
      );
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }

    // Update buyer analytics
    try {
      await AnalyticsService.updateBuyerAnalytics(user._id);
    } catch (error) {
      console.error("Failed to update buyer analytics:", error);
    }

    // Award loyalty points (if order is paid)
    if (paymentId) {
      try {
        await LoyaltyService.awardOrderPoints(
          user._id,
          totalPrice,
          order.orderNumber || order._id.toString()
        );
      } catch (error) {
        console.error("Failed to award loyalty points:", error);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get all orders for current user with pagination
 */
export const getUserOrders = async (req: CustomRequest, res: Response) => {
  try {
    const { status, page = "1", limit = "20", startDate, endDate } = req.query;

    // Get user's MongoDB _id from Firebase UID
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Build filter
    const filter: any = { buyerId: user._id };

    // Add status filter if provided
    if (status && status !== "all") {
      filter["tracking.status"] = status;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Order.countDocuments(filter);

    // Get orders with population
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("items.productId", "title images pricing")
      .lean();

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

/**
 * Get order by ID
 */
export const getOrderById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get user's MongoDB _id
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const order = await Order.findOne({
      _id: id,
      buyerId: user._id,
    })
      .populate("items.productId", "title images pricing")
      .populate("items.sellerId", "businessName");

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
      message: "Error fetching order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Update order tracking
 */
export const updateTracking = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, location, note, trackingNumber, carrier } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update tracking status
    if (status && order.tracking) {
      order.tracking.status = status;
      
      // Add to status history
      order.tracking.statusHistory = order.tracking.statusHistory || [];
      order.tracking.statusHistory.push({
        status,
        timestamp: new Date(),
        location: location || "",
        note: note || "",
      } as any);

      if (trackingNumber) {
        order.tracking.trackingNumber = trackingNumber;
      }
      if (carrier) {
        order.tracking.carrier = carrier;
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Tracking updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating tracking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get user
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const order = await Order.findOne({
      _id: id,
      buyerId: user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be canceled
    if (order.tracking?.status === "delivered" || order.tracking?.status === "shipped") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that has been shipped or delivered",
      });
    }

    // Update order status
    if (order.tracking) {
      order.tracking.status = "canceled";
      order.tracking.statusHistory = order.tracking.statusHistory || [];
      order.tracking.statusHistory.push({
        status: "canceled",
        timestamp: new Date(),
        note: "Canceled by user",
      } as any);
    }

    await order.save();

    // Restore inventory
    try {
      await InventoryService.restoreInventory(
        order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      console.error("Failed to restore inventory:", error);
    }

    return res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error canceling order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
