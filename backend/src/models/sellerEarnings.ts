import { Schema, model } from "mongoose";

const sellerEarningsSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  orderNumber: { type: String }, // Cached for quick reference
  
  totalAmount: { type: Number, required: true }, // Total order amount for this seller
  platformFee: { type: Number, required: true }, // Platform commission
  platformFeePercentage: { type: Number, default: 10 }, // Fee percentage at time of order
  sellerAmount: { type: Number, required: true }, // Net amount for seller
  
  // Payout Information
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
  eligibleForPayoutAt: { type: Date }, // When funds become available (7 days)
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Pre-save hook to set eligible payout date (7 days after order)
sellerEarningsSchema.pre("save", function (next) {
  if (!this.eligibleForPayoutAt && this.isNew) {
    const eligibleDate = new Date();
    eligibleDate.setDate(eligibleDate.getDate() + 7); // 7 days hold
    this.eligibleForPayoutAt = eligibleDate;
  }
  this.updatedAt = new Date();
  next();
});

// Indexes
sellerEarningsSchema.index({ sellerId: 1, createdAt: -1 });
sellerEarningsSchema.index({ orderId: 1 });
sellerEarningsSchema.index({ payoutStatus: 1 });
sellerEarningsSchema.index({ eligibleForPayoutAt: 1 });

export const SellerEarnings = model("SellerEarnings", sellerEarningsSchema);









