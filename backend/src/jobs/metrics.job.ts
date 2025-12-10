/**
 * Metrics Update Job
 * Updates cached metrics for products and sellers
 * Run: Every hour
 */

import { Product, Seller, Review } from "../models";
import { AnalyticsService } from "../services";

export const updateMetricsJob = async () => {
  try {
    console.log("🔄 Starting metrics update job...");

    // Get all active products
    const products = await Product.find({ status: "active" }).select("_id");

    let updated = 0;
    for (const product of products) {
      try {
        await AnalyticsService.updateProductMetrics(product._id);
        updated++;
      } catch (error) {
        console.error(`Failed to update product ${product._id}:`, error);
      }
    }

    console.log(`✅ Updated metrics for ${updated}/${products.length} products`);

    // Get all verified sellers
    const sellers = await Seller.find({ "verification.status": "verified" }).select("_id");

    let sellersUpdated = 0;
    for (const seller of sellers) {
      try {
        await AnalyticsService.updateSellerMetrics(seller._id);
        sellersUpdated++;
      } catch (error) {
        console.error(`Failed to update seller ${seller._id}:`, error);
      }
    }

    console.log(`✅ Updated metrics for ${sellersUpdated}/${sellers.length} sellers`);
    console.log("✅ Metrics update job completed");

    return {
      productsUpdated: updated,
      sellersUpdated,
    };
  } catch (error) {
    console.error("❌ Metrics update job failed:", error);
    throw error;
  }
};

export default updateMetricsJob;

