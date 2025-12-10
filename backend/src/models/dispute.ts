import { Schema, model } from "mongoose";

const disputeSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  orderNumber: { type: String }, // Cached for reference
  
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  
  reason: {
    type: String,
    enum: [
      "item_not_received",
      "item_damaged",
      "wrong_item",
      "item_not_as_described",
      "quality_issue",
      "missing_parts",
      "other",
    ],
    required: true,
  },
  description: { type: String, required: true },
  images: [{ type: String }], // Evidence images
  
  status: {
    type: String,
    enum: ["open", "investigating", "resolved", "closed", "escalated"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  
  // Resolution
  resolution: {
    action: {
      type: String,
      enum: ["refund", "replacement", "partial_refund", "no_action", "none"],
      default: "none",
    },
    amount: { type: Number },
    description: { type: String },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who resolved
    resolvedAt: { type: Date },
  },
  
  // Communication
  adminNotes: [
    {
      note: { type: String },
      adminId: { type: Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  sellerResponse: {
    message: { type: String },
    respondedAt: { type: Date },
  },
  
  // Tracking
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" }, // Admin assigned
  closedAt: { type: Date },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
disputeSchema.index({ orderId: 1 });
disputeSchema.index({ buyerId: 1 });
disputeSchema.index({ sellerId: 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ assignedTo: 1 });
disputeSchema.index({ createdAt: -1 });

export const Dispute = model("Dispute", disputeSchema);









