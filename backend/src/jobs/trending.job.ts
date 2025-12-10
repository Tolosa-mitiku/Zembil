/**
 * Trending Products Job
 * Calculates trending score for products
 * Run: Daily at midnight
 */

import { AnalyticsService } from "../services";

export const calculateTrendingJob = async () => {
  try {
    console.log("🔄 Starting trending products calculation...");

    await AnalyticsService.calculateTrendingProducts();

    console.log("✅ Trending products calculation completed");
  } catch (error) {
    console.error("❌ Trending calculation job failed:", error);
    throw error;
  }
};

export default calculateTrendingJob;

