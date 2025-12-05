import { Schema, model } from "mongoose";

const bannerSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true }, // Banner image URL
  link: { type: String }, // Link to product/category/external URL
  linkType: {
    type: String,
    enum: ["product", "category", "external", "none"],
    default: "none",
  },
  linkId: { type: String }, // Product ID or Category ID
  targetAudience: {
    type: String,
    enum: ["all", "buyers", "sellers"],
    default: "all",
  },
  placement: {
    type: String,
    enum: ["home_top", "home_middle", "category", "product", "checkout"],
    default: "home_top",
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  // Analytics
  impressions: { type: Number, default: 0 }, // Number of times shown
  clicks: { type: Number, default: 0 }, // Number of clicks
  clickThroughRate: { type: Number, default: 0 }, // CTR percentage
  displayOrder: { type: Number, default: 0 }, // For sorting multiple banners
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Method to check if banner is currently active
bannerSchema.methods.isCurrentlyActive = function () {
  const now = new Date();
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now
  );
};

// Indexes
bannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
bannerSchema.index({ placement: 1 });
bannerSchema.index({ targetAudience: 1 });

export const Banner = model("Banner", bannerSchema);








