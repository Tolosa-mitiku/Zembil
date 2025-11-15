import { Response } from "express";
import { Seller } from "../models/seller";
import { Product } from "../models/product";
import { Order } from "../models/order";
import { SellerEarnings } from "../models/sellerEarnings";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get seller dashboard overview
export const getSellerDashboard = async (req: CustomRequest, res: Response) => {
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

    // Get date ranges
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get orders for this seller
    const totalOrders = await Order.countDocuments({
      "items.sellerId": seller._id,
    });

    const pendingOrders = await Order.countDocuments({
      "items.sellerId": seller._id,
      "tracking.status": { $in: ["pending", "confirmed"] },
    });

    const last30DaysOrders = await Order.countDocuments({
      "items.sellerId": seller._id,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Calculate total revenue
    const earnings = await SellerEarnings.aggregate([
      { $match: { sellerId: seller._id } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalEarnings: { $sum: "$sellerAmount" },
          pendingPayout: {
            $sum: {
              $cond: [{ $eq: ["$payoutStatus", "pending"] }, "$sellerAmount", 0],
            },
          },
        },
      },
    ]);

    const revenueData = earnings[0] || {
      totalRevenue: 0,
      totalEarnings: 0,
      pendingPayout: 0,
    };

    // Get product statistics
    const totalProducts = await Product.countDocuments({ sellerId: seller._id });
    const activeProducts = await Product.countDocuments({
      sellerId: seller._id,
      status: "active",
      stockQuantity: { $gt: 0 },
    });
    const outOfStock = await Product.countDocuments({
      sellerId: seller._id,
      stockQuantity: 0,
    });

    // Get recent orders
    const recentOrders = await Order.find({
      "items.sellerId": seller._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber totalPrice tracking.status createdAt items");

    // Calculate growth metrics
    const last7DaysOrders = await Order.countDocuments({
      "items.sellerId": seller._id,
      createdAt: { $gte: sevenDaysAgo },
    });

    const previous7DaysOrders = await Order.countDocuments({
      "items.sellerId": seller._id,
      createdAt: {
        $gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lt: sevenDaysAgo,
      },
    });

    const orderGrowth =
      previous7DaysOrders > 0
        ? ((last7DaysOrders - previous7DaysOrders) / previous7DaysOrders) * 100
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalOrders,
          pendingOrders,
          last30DaysOrders,
          totalProducts,
          activeProducts,
          outOfStock,
          ...revenueData,
        },
        growth: {
          ordersGrowth: orderGrowth.toFixed(2),
        },
        recentOrders,
        sellerInfo: {
          averageRating: seller.averageRating,
          totalReviews: seller.totalReviews,
          verificationStatus: seller.verificationStatus,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get seller analytics
export const getSellerAnalytics = async (req: CustomRequest, res: Response) => {
  try {
    const { startDate, endDate, period = "daily" } = req.query;

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

    // Set date range
    let start = startDate ? new Date(startDate as string) : new Date();
    let end = endDate ? new Date(endDate as string) : new Date();

    if (!startDate) {
      // Default to last 30 days
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Sales over time
    const salesByDate = await Order.aggregate([
      {
        $match: {
          "items.sellerId": seller._id,
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

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          "items.sellerId": seller._id,
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      { $match: { "items.sellerId": seller._id } },
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
          "items.sellerId": seller._id,
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
      message: "Error fetching analytics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get seller revenue data
export const getSellerRevenue = async (req: CustomRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

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

    // Build date filter
    const dateFilter: any = { sellerId: seller._id };
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate as string);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate as string);
    }

    // Get earnings breakdown
    const earnings = await SellerEarnings.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$payoutStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          platformFee: { $sum: "$platformFee" },
          sellerAmount: { $sum: "$sellerAmount" },
        },
      },
    ]);

    // Get total summary
    const totalSummary = await SellerEarnings.aggregate([
      { $match: { sellerId: seller._id } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalPlatformFees: { $sum: "$platformFee" },
          totalEarnings: { $sum: "$sellerAmount" },
          totalPaid: {
            $sum: {
              $cond: [{ $eq: ["$payoutStatus", "paid"] }, "$sellerAmount", 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$payoutStatus", "pending"] }, "$sellerAmount", 0],
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        earningsByStatus: earnings,
        summary: totalSummary[0] || {},
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching revenue data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};








