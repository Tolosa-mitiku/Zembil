import { Schema, model } from "mongoose";

const promotionSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  
  // Analytics
  clicks: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
promotionSchema.index({ sellerId: 1 });
promotionSchema.index({ productIds: 1 });
promotionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export const Promotion = model("Promotion", promotionSchema);

