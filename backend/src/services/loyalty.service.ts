/**
 * Loyalty Program Service
 * Manages buyer loyalty points and tier upgrades
 */

import { Buyer, User } from "../models";
import { Types } from "mongoose";

const TIER_REQUIREMENTS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 15000,
};

export class LoyaltyService {
  /**
   * Award points to buyer
   */
  static async awardPoints(
    userId: string | Types.ObjectId,
    points: number,
    reason: string
  ) {
    try {
      const buyer = await Buyer.findOne({ userId });
      if (!buyer) throw new Error("Buyer not found");

      await Buyer.updateOne(
        { userId },
        {
          $inc: {
            "loyalty.points": points,
            "loyalty.pointsLifetime": points,
          },
        }
      );

      // Check for tier upgrade
      await this.checkTierUpgrade(userId);

      console.log(`✅ Awarded ${points} points to user ${userId} - ${reason}`);
    } catch (error) {
      console.error("Error awarding points:", error);
      throw error;
    }
  }

  /**
   * Deduct points (when redeemed)
   */
  static async deductPoints(
    userId: string | Types.ObjectId,
    points: number
  ) {
    try {
      const buyer = await Buyer.findOne({ userId });
      if (!buyer) throw new Error("Buyer not found");

      if ((buyer.loyalty?.points || 0) < points) {
        throw new Error("Insufficient points");
      }

      await Buyer.updateOne(
        { userId },
        {
          $inc: {
            "loyalty.points": -points,
          },
        }
      );

      // Check if tier should be downgraded
      await this.checkTierUpgrade(userId);

      console.log(`✅ Deducted ${points} points from user ${userId}`);
    } catch (error) {
      console.error("Error deducting points:", error);
      throw error;
    }
  }

  /**
   * Check and update loyalty tier
   */
  static async checkTierUpgrade(userId: string | Types.ObjectId) {
    try {
      const buyer = await Buyer.findOne({ userId });
      if (!buyer) return;

      const currentPoints = buyer.loyalty?.pointsLifetime || 0;
      let newTier = "bronze";

      if (currentPoints >= TIER_REQUIREMENTS.platinum) {
        newTier = "platinum";
      } else if (currentPoints >= TIER_REQUIREMENTS.gold) {
        newTier = "gold";
      } else if (currentPoints >= TIER_REQUIREMENTS.silver) {
        newTier = "silver";
      }

      const currentTier = buyer.loyalty?.tier || "bronze";

      if (newTier !== currentTier) {
        // Calculate next tier requirement
        let nextTier = "";
        let nextRequirement = 0;

        if (newTier === "bronze") {
          nextTier = "silver";
          nextRequirement = TIER_REQUIREMENTS.silver - currentPoints;
        } else if (newTier === "silver") {
          nextTier = "gold";
          nextRequirement = TIER_REQUIREMENTS.gold - currentPoints;
        } else if (newTier === "gold") {
          nextTier = "platinum";
          nextRequirement = TIER_REQUIREMENTS.platinum - currentPoints;
        }

        await Buyer.updateOne(
          { userId },
          {
            $set: {
              "loyalty.tier": newTier,
              "loyalty.tierUpgradeDate": new Date(),
              "loyalty.nextTierRequirement": nextRequirement,
            },
          }
        );

        console.log(`🎉 User ${userId} upgraded to ${newTier} tier!`);

        // You can send a notification here
      }
    } catch (error) {
      console.error("Error checking tier upgrade:", error);
      throw error;
    }
  }

  /**
   * Calculate points for order
   */
  static calculateOrderPoints(orderAmount: number): number {
    // 1 point per dollar spent
    return Math.floor(orderAmount);
  }

  /**
   * Award points after order completion
   */
  static async awardOrderPoints(
    userId: string | Types.ObjectId,
    orderAmount: number,
    orderId: string
  ) {
    try {
      const points = this.calculateOrderPoints(orderAmount);
      await this.awardPoints(userId, points, `Order ${orderId} completed`);
    } catch (error) {
      console.error("Error awarding order points:", error);
      throw error;
    }
  }

  /**
   * Process referral
   */
  static async processReferral(
    referrerId: string | Types.ObjectId,
    newUserId: string | Types.ObjectId
  ) {
    try {
      // Award points to referrer
      await this.awardPoints(referrerId, 500, "Successful referral");

      // Award points to new user
      await this.awardPoints(newUserId, 100, "Welcome bonus");

      // Update referral count
      await User.updateOne(
        { _id: referrerId },
        {
          $inc: { referralCount: 1 },
        }
      );

      console.log(`✅ Processed referral from ${referrerId} to ${newUserId}`);
    } catch (error) {
      console.error("Error processing referral:", error);
      throw error;
    }
  }

  /**
   * Get loyalty status
   */
  static async getLoyaltyStatus(userId: string | Types.ObjectId) {
    try {
      const buyer = await Buyer.findOne({ userId });
      if (!buyer) throw new Error("Buyer not found");

      return {
        tier: buyer.loyalty?.tier || "bronze",
        points: buyer.loyalty?.points || 0,
        pointsLifetime: buyer.loyalty?.pointsLifetime || 0,
        nextTierRequirement: buyer.loyalty?.nextTierRequirement || 0,
        tierUpgradeDate: buyer.loyalty?.tierUpgradeDate,
      };
    } catch (error) {
      console.error("Error getting loyalty status:", error);
      throw error;
    }
  }
}

export default LoyaltyService;

