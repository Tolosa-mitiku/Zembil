import { Schema, model } from "mongoose";

const productSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // Example: 'Electronics', 'Clothing'
  brand: { type: String },
  sku: { type: String, unique: true, sparse: true }, // Stock Keeping Unit
  price: { type: Number, required: true },
  discount: {
    percentage: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false },
  },
  stockQuantity: { type: Number, required: true },
  images: [{ type: String }], // URLs to product images
  weight: { type: Number }, // Product weight for shipping
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, default: "cm" }, // cm, inch, etc.
  },
  variants: [
    {
      name: { type: String }, // e.g., "Size", "Color"
      options: [{ type: String }], // e.g., ["Small", "Medium", "Large"]
      priceModifier: { type: Number, default: 0 }, // Additional cost for this variant
    },
  ],
  specifications: { type: Schema.Types.Mixed }, // Flexible specs object
  isFeatured: { type: Boolean, default: false }, // For deals/promotions
  status: {
    type: String,
    enum: ["active", "inactive", "pending", "rejected"],
    default: "active",
  },
  // Analytics & Performance
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  // SEO & Tags
  tags: [{ type: String }], // Search tags
  metaDescription: { type: String }, // For SEO
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for efficient querying
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ title: "text", description: "text", tags: "text" }); // Text search
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ status: 1 });

export const Product = model("Product", productSchema);
