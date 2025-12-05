import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "order_created",
      "order_confirmed",
      "order_shipped",
      "order_delivered",
      "order_canceled",
      "payment_success",
      "payment_failed",
      "promotion",
      "system",
      "review_received",
      "seller_message",
      "product_back_in_stock",
      "price_drop",
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed }, // Additional data (orderId, productId, etc.)
  image: { type: String }, // Optional notification image
  actionUrl: { type: String }, // Deep link or URL to navigate to
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  isSent: { type: Boolean, default: false }, // For push notifications
  sentAt: { type: Date },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional expiration for promotions
});

// Indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

export const Notification = model("Notification", notificationSchema);








