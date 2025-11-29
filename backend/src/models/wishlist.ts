import { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      addedAt: { type: Date, default: Date.now },
      priceAtAdd: { type: Number }, // Track price changes
      notifyOnSale: { type: Boolean, default: false },
      notifyBackInStock: { type: Boolean, default: false },
    },
  ],
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
wishlistSchema.index({ userId: 1 }, { unique: true });
wishlistSchema.index({ "products.productId": 1 });

export const Wishlist = model("Wishlist", wishlistSchema);









