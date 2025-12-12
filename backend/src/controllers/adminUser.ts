import { Request, Response } from "express";
import { User } from "../models/users";
import { Seller } from "../models/seller";
import { Order } from "../models/order";

// Get all users with filters
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      role,
      accountStatus,
      search,
      sort = "-createdAt",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};

    if (role) filter.role = role;
    if (accountStatus) filter.accountStatus = accountStatus;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-__v")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: users,
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
      message: "Error fetching users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get user details
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get additional data based on role
    let additionalData: any = {};

    if (user.role === "seller") {
      const seller = await Seller.findOne({ firebaseUID: user.uid });
      if (seller) {
        additionalData.sellerProfile = seller;
      }
    }

    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { buyerId: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
    ]);

    additionalData.orderStats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        user,
        ...additionalData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["buyer", "seller", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role, updatedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update user status (ban/suspend/activate)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { accountStatus, reason } = req.body;

    if (!["active", "suspended", "banned"].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account status",
      });
    }

    const updateData: any = {
      accountStatus,
      updatedAt: new Date(),
    };

    if (accountStatus !== "active" && reason) {
      updateData.suspensionReason = reason;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${accountStatus} successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get user statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      bannedUsers,
      buyersCount,
      sellersCount,
      adminsCount,
      newUsersLast30Days,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ accountStatus: "active" }),
      User.countDocuments({ accountStatus: "suspended" }),
      User.countDocuments({ accountStatus: "banned" }),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // Get user growth by day (last 30 days)
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

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          suspendedUsers,
          bannedUsers,
        },
        byRole: {
          buyers: buyersCount,
          sellers: sellersCount,
          admins: adminsCount,
        },
        growth: {
          last30Days: newUsersLast30Days,
          daily: userGrowth,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


















