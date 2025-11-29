import { Request, Response } from "express";
import { User } from "../models/users";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { Seller } from "../models/seller";

// Get dashboard overview
export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      revenueData,
      last30DaysOrders,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Seller.countDocuments({ verificationStatus: "verified" }),
      Product.countDocuments({ status: "active" }),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            platformFees: { $sum: "$platformFee" },
          },
        },
      ]),
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Order.countDocuments({
        "tracking.status": { $in: ["pending", "confirmed"] },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSellers,
          totalProducts,
          totalOrders,
          totalRevenue: revenueData[0]?.totalRevenue || 0,
          platformFees: revenueData[0]?.platformFees || 0,
          last30DaysOrders,
          pendingOrders,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard overview",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, period = "daily" } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const revenueByDate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === "monthly" ? "%Y-%m" : "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$totalPrice" },
          platformFees: { $sum: "$platformFee" },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: revenueByDate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching revenue analytics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get sales analytics
export const getSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$tracking.status",
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          title: { $first: "$items.title" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        salesByStatus: salesData,
        topProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sales analytics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get user analytics
export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        userGrowth,
        usersByRole,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user analytics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};




