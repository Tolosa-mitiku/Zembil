/**
 * Payout Processing Job
 * Processes approved payout requests
 * Run: Daily at 2 AM
 */

import { PayoutService } from "../services";

export const processPayoutsJob = async () => {
  try {
    console.log("🔄 Starting payout processing job...");

    const processed = await PayoutService.processApprovedPayouts();

    console.log(`✅ Processed ${processed} payout(s)`);
    console.log("✅ Payout processing job completed");

    return { processed };
  } catch (error) {
    console.error("❌ Payout processing job failed:", error);
    throw error;
  }
};

export default processPayoutsJob;

