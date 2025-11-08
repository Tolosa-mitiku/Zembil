import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, // URL-friendly name
  description: { type: String },
  image: { type: String }, // Category image/icon
  icon: { type: String }, // Icon name or URL
  parentCategory: { type: Schema.Types.ObjectId, ref: "Category" }, // For subcategories
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }, // For sorting
  productsCount: { type: Number, default: 0 }, // Cache product count
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to generate slug
categorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });

export const Category = model("Category", categorySchema);
