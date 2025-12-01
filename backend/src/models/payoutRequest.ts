import { Schema, model } from "mongoose";

const payoutRequestSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  requestedAt: { type: Date, default: Date.now },
  
  // Source Earnings
  earningIds: [{ type: Schema.Types.ObjectId, ref: "SellerEarnings" }],
  
  // Bank Details (at time of request)
  payoutMethod: { type: String, enum: ["bank_transfer", "paypal", "stripe"], default: "bank_transfer" },
  bankAccount: {
    accountHolderName: { type: String },
    accountNumber: { type: String }, // Last 4 digits for display
    bankName: { type: String },
    accountType: { type: String, enum: ["checking", "savings"] },
  },
  
  // Status Workflow
  status: {
    type: String,
    enum: ["pending", "processing", "approved", "completed", "rejected", "failed"],
    default: "pending",
  },
  
  // Admin Review
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
  approvedAt: { type: Date },
  
  // Transaction Details
  transactionId: { type: String },
  processedAt: { type: Date },
  completedAt: { type: Date },
  
  // Rejection/Failure
  rejectionReason: { type: String },
  failureReason: { type: String },
  retryCount: { type: Number, default: 0 },
  
  // Processing Fees
  processingFee: { type: Number, default: 0 },
  netAmount: { type: Number }, // amount - processingFee
  
  // Audit Trail
  statusHistory: [
    {
      status: { type: String },
      changedBy: { type: Schema.Types.ObjectId, ref: "User" },
      changedAt: { type: Date, default: Date.now },
      note: { type: String },
    }
  ],
  
  // Notes
  sellerNote: { type: String },
  adminNote: { type: String },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Pre-save hook
payoutRequestSchema.pre("save", function (next) {
  // Calculate net amount
  if (this.amount && this.processingFee !== undefined) {
    this.netAmount = this.amount - this.processingFee;
  }
  
  this.updatedAt = new Date();
  next();
});

// Indexes
payoutRequestSchema.index({ sellerId: 1, requestedAt: -1 });
payoutRequestSchema.index({ status: 1 });
payoutRequestSchema.index({ sellerId: 1, status: 1, requestedAt: -1 });

export const PayoutRequest = model("PayoutRequest", payoutRequestSchema);

