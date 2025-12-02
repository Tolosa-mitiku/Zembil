/**
 * Scheduled Jobs Index
 * Initializes all cron jobs
 */

import cron from "node-cron";
import { updateMetricsJob } from "./metrics.job";
import { calculateTrendingJob } from "./trending.job";
import { processPayoutsJob } from "./payout.job";
import { lowStockAlertJob } from "./lowStock.job";
import { sessionCleanupJob } from "./sessionCleanup.job";

/**
 * Initialize all scheduled jobs
 */
export const initializeJobs = () => {
  console.log("🚀 Initializing scheduled jobs...");

  // Every hour - Update metrics
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ [Hourly] Running metrics update job");
    try {
      await updateMetricsJob();
    } catch (error) {
      console.error("Metrics update job failed:", error);
    }
  });

  // Daily at midnight - Calculate trending products
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ [Daily 00:00] Running trending calculation job");
    try {
      await calculateTrendingJob();
    } catch (error) {
      console.error("Trending calculation job failed:", error);
    }
  });

  // Daily at 2 AM - Process payouts
  cron.schedule("0 2 * * *", async () => {
    console.log("⏰ [Daily 02:00] Running payout processing job");
    try {
      await processPayoutsJob();
    } catch (error) {
      console.error("Payout processing job failed:", error);
    }
  });

  // Daily at 9 AM - Check low stock
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ [Daily 09:00] Running low stock alert job");
    try {
      await lowStockAlertJob();
    } catch (error) {
      console.error("Low stock alert job failed:", error);
    }
  });

  // Daily at 3 AM - Clean up sessions
  cron.schedule("0 3 * * *", async () => {
    console.log("⏰ [Daily 03:00] Running session cleanup job");
    try {
      await sessionCleanupJob();
    } catch (error) {
      console.error("Session cleanup job failed:", error);
    }
  });

  console.log("✅ Scheduled jobs initialized:");
  console.log("   - Metrics Update: Every hour");
  console.log("   - Trending Calculation: Daily at 00:00");
  console.log("   - Payout Processing: Daily at 02:00");
  console.log("   - Low Stock Alerts: Daily at 09:00");
  console.log("   - Session Cleanup: Daily at 03:00");
};

// Export individual jobs for manual execution
export {
  updateMetricsJob,
  calculateTrendingJob,
  processPayoutsJob,
  lowStockAlertJob,
  sessionCleanupJob,
};

export default initializeJobs;

