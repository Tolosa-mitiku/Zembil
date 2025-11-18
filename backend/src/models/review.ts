import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order" }, // Link to order for verified purchase
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String, required: true },
  images: [{ type: String }], // Review images
  verifiedPurchase: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 }, // Number of users who found this helpful
  helpfulBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // Users who marked as helpful
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
  sellerResponse: {
    message: { type: String },
    respondedAt: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
reviewSchema.index({ userId: 1 });
reviewSchema.index({ productId: 1 });
reviewSchema.index({ sellerId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ verifiedPurchase: 1 });
reviewSchema.index({ status: 1 });

// Compound index for unique user-product reviews
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review = model("Review", reviewSchema);








