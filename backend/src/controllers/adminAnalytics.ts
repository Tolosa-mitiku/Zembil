import { Request, Response } from "express";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { Seller } from "../models/seller";
import { User } from "../models/users";

// Get dashboard overview with enhanced metrics
export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalSellers,
      verifiedSellers,
      totalProducts,
      activeProducts,
      totalOrders,
      revenueData,
      last30DaysOrders,
      last7DaysOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Seller.countDocuments(),
      Seller.countDocuments({ verificationStatus: "verified" }),
      Product.countDocuments(),
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
      Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Order.countDocuments({
        "tracking.status": { $in: ["pending", "confirmed"] },
      }),
      Order.countDocuments({
        "tracking.status": "delivered",
      }),
      Order.countDocuments({
        "tracking.status": "cancelled",
      }),
    ]);

    // Calculate growth metrics
    const previous7DaysOrders = await Order.countDocuments({
      createdAt: {
        $gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lt: sevenDaysAgo,
      },
    });

    const orderGrowth =
      previous7DaysOrders > 0
        ? ((last7DaysOrders - previous7DaysOrders) / previous7DaysOrders) * 100
        : last7DaysOrders > 0
        ? 100
        : 0;

    // Calculate revenue for last 7 days for growth
    const last7DaysRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const previous7DaysRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
            $lt: sevenDaysAgo,
          },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const currentRevenue = last7DaysRevenue[0]?.revenue || 0;
    const previousRevenue = previous7DaysRevenue[0]?.revenue || 0;
    const revenueGrowth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
        ? 100
        : 0;

    // Get recent orders for display
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber totalPrice tracking.status createdAt buyer")
      .populate("buyer", "name email");

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSellers,
          verifiedSellers,
          totalProducts,
          activeProducts,
          totalOrders,
          totalRevenue: revenueData[0]?.totalRevenue || 0,
          platformFees: revenueData[0]?.platformFees || 0,
          last30DaysOrders,
          last7DaysOrders,
          pendingOrders,
          completedOrders,
          cancelledOrders,
        },
        growth: {
          ordersGrowth: orderGrowth.toFixed(2),
          revenueGrowth: revenueGrowth.toFixed(2),
        },
        recentOrders,
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

// Get revenue analytics (comprehensive for admin)
export const getRevenueAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, period = "daily" } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const revenueByDate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
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

// Get sales analytics (matching seller format)
export const getSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, period = "daily" } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Sales over time
    const salesByDate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
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
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products with details
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
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Populate product details
    for (const item of topProducts) {
      const product = await Product.findById(item._id).select("title images");
      item.productDetails = product;
    }

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$tracking.status",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        salesByDate,
        topProducts,
        ordersByStatus,
        dateRange: {
          start,
          end,
        },
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
