import { Schema, model } from "mongoose";

const productDraftSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" }, // If editing existing product
  
  // Draft Data (Partial product data)
  draftData: { type: Map, of: Schema.Types.Mixed },
  
  // Status
  isAutoSaved: { type: Boolean, default: false },
  lastSaved: { type: Date, default: Date.now },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Auto-delete after 30 days
}, {
  timestamps: true,
});

// Pre-save hook to set expiration (30 days)
productDraftSchema.pre("save", function (next) {
  if (this.isNew && !this.expiresAt) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    this.expiresAt = expirationDate;
  }
  next();
});

// Indexes
productDraftSchema.index({ sellerId: 1 });
productDraftSchema.index({ productId: 1 });
productDraftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
productDraftSchema.index({ sellerId: 1, productId: 1 }, { unique: true, sparse: true });

export const ProductDraft = model("ProductDraft", productDraftSchema);

