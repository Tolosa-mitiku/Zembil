import { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ "products.productId": 1 });

export const Wishlist = model("Wishlist", wishlistSchema);








