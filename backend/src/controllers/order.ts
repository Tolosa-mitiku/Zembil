import { Response } from "express";
import { Order } from "../models/order";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Create a new order
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

    const order = new Order({
      buyerId: user._id, // Use MongoDB ObjectId
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentId,
      paymentStatus: "paid", // Assume paid if creating order
      tracking: {
        status: "confirmed",
        statusHistory: [
          {
            status: "confirmed",
            timestamp: new Date(),
            location: shippingAddress.city,
          },
        ],
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    await order.save();

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

// Get all orders for current user with pagination
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
        // Set time to end of day for endDate
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

    // Get paginated orders
    const orders = await Order.find(filter)
      .populate("items.productId", "title images category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total,
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

// Get order by ID with tracking
export const getOrderById = async (req: CustomRequest, res: Response) => {
  try {
    // Get user's MongoDB _id from Firebase UID
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const order = await Order.findById(req.params.id).populate(
      "items.productId",
      "title images category"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.buyerId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this order",
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

// Update order tracking location (for delivery tracking)
export const updateOrderTracking = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { latitude, longitude, address, status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update current location
    if (order.tracking) {
      order.tracking.currentLocation = {
        latitude,
        longitude,
        address,
        updatedAt: new Date(),
      };

      // Update status if provided
      if (status) {
        order.tracking.status = status;
        order.tracking.statusHistory.push({
          status,
          timestamp: new Date(),
          location: address,
        });
      }
    }

    order.updatedAt = new Date();
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

// Cancel an order
export const cancelOrder = async (req: CustomRequest, res: Response) => {
  try {
    // Get user's MongoDB _id from Firebase UID
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.buyerId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this order",
      });
    }

    // Only allow cancellation if not shipped yet
    if (
      order.tracking &&
      ["shipped", "out_for_delivery", "delivered"].includes(
        order.tracking.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that is already shipped",
      });
    }

    if (order.tracking) {
      order.tracking.status = "canceled";
      order.tracking.statusHistory.push({
        status: "canceled",
        timestamp: new Date(),
        location: "Customer request",
      });
    }
    order.updatedAt = new Date();
    await order.save();

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
