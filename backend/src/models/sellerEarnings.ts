import { Schema, model } from "mongoose";

const sellerEarningsSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  orderNumber: { type: String }, // Cached for quick reference
  totalAmount: { type: Number, required: true }, // Total order amount for this seller
  platformFee: { type: Number, required: true }, // Platform commission
  platformFeePercentage: { type: Number, default: 10 }, // Fee percentage at time of order
  sellerAmount: { type: Number, required: true }, // Net amount for seller
  // Payout information
  payoutStatus: {
    type: String,
    enum: ["pending", "processing", "paid", "failed", "on_hold"],
    default: "pending",
  },
  payoutId: { type: String }, // Transaction ID from payment processor
  payoutMethod: { type: String }, // bank_transfer, paypal, etc.
  payoutDate: { type: Date },
  payoutFailureReason: { type: String },
  // Dates
  eligibleForPayoutAt: { type: Date }, // When funds become available (e.g., after 7 days)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to set eligible payout date (7 days after order)
sellerEarningsSchema.pre("save", function (next) {
  if (!this.eligibleForPayoutAt && this.isNew) {
    const eligibleDate = new Date();
    eligibleDate.setDate(eligibleDate.getDate() + 7); // 7 days hold
    this.eligibleForPayoutAt = eligibleDate;
  }
  next();
});

// Indexes
sellerEarningsSchema.index({ sellerId: 1, createdAt: -1 });
sellerEarningsSchema.index({ orderId: 1 });
sellerEarningsSchema.index({ payoutStatus: 1 });
sellerEarningsSchema.index({ eligibleForPayoutAt: 1 });

export const SellerEarnings = model("SellerEarnings", sellerEarningsSchema);




