/**
 * Payout Service
 * Handles seller payout requests and processing
 */

import { Types } from "mongoose";
import { PayoutRequest, Seller, SellerEarnings } from "../models";

export class PayoutService {
  /**
   * Get available earnings for seller
   */
  static async getAvailableEarnings(sellerId: string | Types.ObjectId) {
    try {
      const earnings = await SellerEarnings.find({
        sellerId,
        payoutStatus: "pending",
        eligibleForPayoutAt: { $lte: new Date() },
      });

      const totalAmount = earnings.reduce((sum, e) => sum + e.sellerAmount, 0);

      return {
        availableAmount: totalAmount,
        earningsCount: earnings.length,
        earnings,
      };
    } catch (error) {
      console.error("Error getting available earnings:", error);
      throw error;
    }
  }

  /**
   * Create payout request
   */
  static async createPayoutRequest(
    sellerId: string | Types.ObjectId,
    amount?: number
  ) {
    try {
      const seller = await Seller.findById(sellerId);
      if (!seller) throw new Error("Seller not found");

      // Get available earnings
      const { availableAmount, earnings } = await this.getAvailableEarnings(
        sellerId
      );

      // Check minimum payout amount
      const minAmount = seller.payoutSettings?.minimumPayoutAmount || 100;
      const requestAmount = amount || availableAmount;

      if (requestAmount < minAmount) {
        throw new Error(
          `Minimum payout amount is ${minAmount}. Available: ${availableAmount}`
        );
      }

      if (requestAmount > availableAmount) {
        throw new Error(
          `Requested amount exceeds available earnings: ${availableAmount}`
        );
      }

      // Get earnings to include in payout
      let earningsToPayou: any[] = [];
      let runningTotal = 0;

      for (const earning of earnings) {
        if (runningTotal + earning.sellerAmount <= requestAmount) {
          earningsToPayou.push(earning);
          runningTotal += earning.sellerAmount;
        }
        if (runningTotal >= requestAmount) break;
      }

      // Create payout request
      const payoutRequest = await PayoutRequest.create({
        sellerId,
        amount: runningTotal,
        currency: "USD",
        requestedAt: new Date(),
        earningIds: earningsToPayou.map((e) => e._id),
        payoutMethod: "bank_transfer",
        bankAccount: {
          accountHolderName: seller.bankAccount?.accountHolderName,
          accountNumber: seller.bankAccount?.accountNumber?.slice(-4), // Last 4 digits
          bankName: seller.bankAccount?.bankName,
          accountType: seller.bankAccount?.accountType,
        },
        status: "pending",
      });

      // Update earnings status
      await SellerEarnings.updateMany(
        { _id: { $in: earningsToPayou.map((e) => e._id) } },
        { $set: { payoutStatus: "processing" } }
      );

      // Update seller metrics
      await Seller.updateOne(
        { _id: sellerId },
        {
          $inc: {
            "metrics.pendingEarnings": -runningTotal,
          },
        }
      );

      console.log(`✅ Created payout request for seller ${sellerId}`);
      return payoutRequest;
    } catch (error) {
      console.error("Error creating payout request:", error);
      throw error;
    }
  }

  /**
   * Approve payout request (Admin)
   */
  static async approvePayout(
    payoutId: string | Types.ObjectId,
    adminId: string | Types.ObjectId
  ) {
    try {
      const payout = await PayoutRequest.findById(payoutId);
      if (!payout) throw new Error("Payout request not found");

      if (payout.status !== "pending") {
        throw new Error(`Cannot approve payout with status: ${payout.status}`);
      }

      // Update payout status
      await PayoutRequest.updateOne(
        { _id: payoutId },
        {
          $set: {
            status: "approved",
            reviewedBy: adminId,
            reviewedAt: new Date(),
            approvedAt: new Date(),
          },
          $push: {
            statusHistory: {
              status: "approved",
              changedBy: adminId,
              changedAt: new Date(),
              note: "Approved by admin",
            },
          },
        }
      );

      console.log(`✅ Approved payout ${payoutId}`);
      return payout;
    } catch (error) {
      console.error("Error approving payout:", error);
      throw error;
    }
  }

  /**
   * Reject payout request (Admin)
   */
  static async rejectPayout(
    payoutId: string | Types.ObjectId,
    adminId: string | Types.ObjectId,
    reason: string
  ) {
    try {
      const payout = await PayoutRequest.findById(payoutId);
      if (!payout) throw new Error("Payout request not found");

      // Update payout status
      await PayoutRequest.updateOne(
        { _id: payoutId },
        {
          $set: {
            status: "rejected",
            reviewedBy: adminId,
            reviewedAt: new Date(),
            rejectionReason: reason,
          },
          $push: {
            statusHistory: {
              status: "rejected",
              changedBy: adminId,
              changedAt: new Date(),
              note: reason,
            },
          },
        }
      );

      // Release earnings back to pending
      await SellerEarnings.updateMany(
        { _id: { $in: payout.earningIds } },
        { $set: { payoutStatus: "pending" } }
      );

      // Update seller metrics
      await Seller.updateOne(
        { _id: payout.sellerId },
        {
          $inc: {
            "metrics.pendingEarnings": payout.amount,
          },
        }
      );

      console.log(`✅ Rejected payout ${payoutId}`);
    } catch (error) {
      console.error("Error rejecting payout:", error);
      throw error;
    }
  }

  /**
   * Process approved payouts (cron job)
   */
  static async processApprovedPayouts() {
    try {
      const approvedPayouts = await PayoutRequest.find({
        status: "approved",
        processedAt: null,
      });

      for (const payout of approvedPayouts) {
        // Here you would integrate with payment processor
        // For now, we'll just mark as completed

        await PayoutRequest.updateOne(
          { _id: payout._id },
          {
            $set: {
              status: "completed",
              processedAt: new Date(),
              completedAt: new Date(),
              transactionId: `TXN-${Date.now()}`, // Replace with actual transaction ID
            },
            $push: {
              statusHistory: {
                status: "completed",
                changedAt: new Date(),
                note: "Payment processed successfully",
              },
            },
          }
        );

        // Mark earnings as paid
        await SellerEarnings.updateMany(
          { _id: { $in: payout.earningIds } },
          {
            $set: {
              payoutStatus: "paid",
              payoutId: payout._id.toString(),
              payoutDate: new Date(),
            },
          }
        );

        // Update seller metrics
        await Seller.updateOne(
          { _id: payout.sellerId },
          {
            $inc: {
              "metrics.totalPayouts": payout.amount,
            },
            $set: {
              "metrics.lastPayoutDate": new Date(),
            },
          }
        );

        console.log(`✅ Processed payout ${payout._id}`);
      }

      return approvedPayouts.length;
    } catch (error) {
      console.error("Error processing payouts:", error);
      throw error;
    }
  }
}

export default PayoutService;
