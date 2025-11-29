import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Fixed: ref to User, not Buyer
  amount: { type: Number, required: true },
  method: { type: String, enum: ["paypal", "stripe", "cash"], required: true },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed", "refunded"],
    required: true,
  },
  transactionId: { type: String, required: true },
  // Platform fee breakdown
  platformFee: { type: Number, default: 0 },
  sellerEarnings: [
    {
      sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
      amount: { type: Number },
      platformFeeAmount: { type: Number },
      netAmount: { type: Number }, // amount - platformFeeAmount
    },
  ],
  // Refund details
  refund: {
    amount: { type: Number },
    reason: { type: String },
    refundId: { type: String },
    refundedAt: { type: Date },
  },
  metadata: { type: Schema.Types.Mixed }, // Additional payment gateway data
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ buyerId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ "sellerEarnings.sellerId": 1 });

export const Payment = model("Payment", paymentSchema);
