/**
 * Session Cleanup Job
 * Cleans up inactive sessions
 * Run: Daily at 3 AM
 */

import { SessionService } from "../services";

export const sessionCleanupJob = async () => {
  try {
    console.log("🔄 Starting session cleanup...");

    await SessionService.cleanupInactiveSessions();

    console.log("✅ Session cleanup completed");
  } catch (error) {
    console.error("❌ Session cleanup job failed:", error);
    throw error;
  }
};

export default sessionCleanupJob;

