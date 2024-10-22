import { Schema, model } from "mongoose";

const productSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // Example: 'Electronics', 'Clothing'
  price: { type: Number, required: true },
  discount: {
    percentage: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  stockQuantity: { type: Number, required: true },
  images: [{ type: String }], // URLs to product images
  weight: { type: Number }, // Product weight for shipping
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  isFeatured: { type: Boolean, default: false }, // For deals
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = model("Product", productSchema);
