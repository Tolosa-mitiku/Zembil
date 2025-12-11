import { Response } from "express";
import { Notification } from "../models/notification";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get user notifications
export const getNotifications = async (req: CustomRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", isRead, type } = req.query;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { userId: user._id };
    if (isRead !== undefined) {
      filter.isRead = isRead === "true";
    }
    if (type) {
      filter.type = type;
    }

    // Get notifications with pagination
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: user._id, isRead: false }),
    ]);

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Mark notification as read
export const markAsRead = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      userId: user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error marking notification as read",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Notification.updateMany(
      { userId: user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error marking all notifications as read",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete notification
export const deleteNotification = async (
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

    const notification = await Notification.findOne({
      _id: id,
      userId: user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get unread count
export const getUnreadCount = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const unreadCount = await Notification.countDocuments({
      userId: user._id,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting unread count",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

















