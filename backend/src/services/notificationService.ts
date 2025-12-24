import { Notification } from "../models/notification";
import { Types } from "mongoose";

interface NotificationData {
  userId: Types.ObjectId | string;
  type: string;
  title: string;
  message: string;
  data?: any;
  image?: string;
  actionUrl?: string;
  priority?: "low" | "medium" | "high";
  expiresAt?: Date;
}

// Create notification
export const createNotification = async (
  notificationData: NotificationData
) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Create order notification
export const notifyOrderStatus = async (
  userId: Types.ObjectId | string,
  orderNumber: string,
  orderId: Types.ObjectId | string,
  status: string
) => {
  const statusMessages: Record<string, { title: string; message: string }> = {
    confirmed: {
      title: "Order Confirmed",
      message: `Your order #${orderNumber} has been confirmed and is being prepared`,
    },
    processing: {
      title: "Order Processing",
      message: `Your order #${orderNumber} is being processed`,
    },
    shipped: {
      title: "Order Shipped",
      message: `Your order #${orderNumber} has been shipped`,
    },
    out_for_delivery: {
      title: "Out for Delivery",
      message: `Your order #${orderNumber} is out for delivery`,
    },
    delivered: {
      title: "Order Delivered",
      message: `Your order #${orderNumber} has been delivered`,
    },
    canceled: {
      title: "Order Canceled",
      message: `Your order #${orderNumber} has been canceled`,
    },
  };

  const statusInfo = statusMessages[status];
  if (!statusInfo) return;

  return createNotification({
    userId,
    type: `order_${status}`,
    title: statusInfo.title,
    message: statusInfo.message,
    data: { orderId, orderNumber },
    priority: ["shipped", "delivered"].includes(status) ? "high" : "medium",
  });
};

// Notify payment status
export const notifyPaymentStatus = async (
  userId: Types.ObjectId | string,
  amount: number,
  status: "success" | "failed",
  orderId?: Types.ObjectId | string
) => {
  const isSuccess = status === "success";

  return createNotification({
    userId,
    type: isSuccess ? "payment_success" : "payment_failed",
    title: isSuccess ? "Payment Successful" : "Payment Failed",
    message: isSuccess
      ? `Your payment of $${amount.toFixed(2)} was successful`
      : `Your payment of $${amount.toFixed(2)} failed. Please try again`,
    data: { amount, orderId },
    priority: "high",
  });
};

// Notify price drop
export const notifyPriceDrop = async (
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  productTitle: string,
  oldPrice: number,
  newPrice: number
) => {
  const discount = ((oldPrice - newPrice) / oldPrice * 100).toFixed(0);

  return createNotification({
    userId,
    type: "price_drop",
    title: "Price Drop Alert",
    message: `${productTitle} is now ${discount}% off! Was $${oldPrice}, now $${newPrice}`,
    data: { productId, oldPrice, newPrice },
    actionUrl: `/products/${productId}`,
    priority: "medium",
  });
};

// Notify product back in stock
export const notifyBackInStock = async (
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  productTitle: string
) => {
  return createNotification({
    userId,
    type: "product_back_in_stock",
    title: "Back in Stock",
    message: `${productTitle} is now back in stock!`,
    data: { productId },
    actionUrl: `/products/${productId}`,
    priority: "medium",
  });
};

// Notify seller of new review
export const notifySellerReview = async (
  sellerId: Types.ObjectId | string,
  productTitle: string,
  rating: number,
  reviewId: Types.ObjectId | string
) => {
  return createNotification({
    userId: sellerId,
    type: "review_received",
    title: "New Review Received",
    message: `You received a ${rating}-star review on ${productTitle}`,
    data: { reviewId, productTitle, rating },
    priority: "medium",
  });
};

// Send bulk notifications
export const createBulkNotifications = async (
  notifications: NotificationData[]
) => {
  try {
    const createdNotifications = await Notification.insertMany(notifications);
    return createdNotifications;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
};

export default {
  createNotification,
  notifyOrderStatus,
  notifyPaymentStatus,
  notifyPriceDrop,
  notifyBackInStock,
  notifySellerReview,
  createBulkNotifications,
};




















