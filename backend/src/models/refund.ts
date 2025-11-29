import { Schema, model } from "mongoose";

const refundSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
  
  buyerId: { type: Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: Schema.Types.ObjectId, ref: "User" },
  
  amount: { type: Number, required: true },
  refundMethod: { type: String, enum: ["original", "store_credit", "bank_transfer"], default: "original" },
  
  reason: { type: String, required: true },
  type: { type: String, enum: ["full", "partial"], default: "full" },
  
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "cancelled"],
    default: "pending",
  },
  
  // Transaction Details
  refundId: { type: String }, // From payment processor
  processedAt: { type: Date },
  completedAt: { type: Date },
  failureReason: { type: String },
  
  // Approval
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  
  notes: { type: String },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
refundSchema.index({ orderId: 1 });
refundSchema.index({ buyerId: 1 });
refundSchema.index({ sellerId: 1 });
refundSchema.index({ status: 1 });
refundSchema.index({ createdAt: -1 });

export const Refund = model("Refund", refundSchema);

