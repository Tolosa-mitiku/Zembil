/**
 * Product Draft Service
 * Handles auto-saving product drafts
 */

import { ProductDraft } from "../models";
import { Types } from "mongoose";

export class DraftService {
  /**
   * Save or update product draft
   */
  static async saveDraft(
    sellerId: string | Types.ObjectId,
    productId: string | Types.ObjectId | null,
    draftData: Record<string, any>
  ) {
    try {
      const filter: any = { sellerId };
      if (productId) {
        filter.productId = productId;
      } else {
        filter.productId = { $exists: false };
      }

      const draft = await ProductDraft.findOneAndUpdate(
        filter,
        {
          $set: {
            draftData,
            lastSaved: new Date(),
            isAutoSaved: true,
          },
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Saved draft for seller ${sellerId}`);
      return draft;
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  }

  /**
   * Get saved draft
   */
  static async getDraft(
    sellerId: string | Types.ObjectId,
    productId?: string | Types.ObjectId
  ) {
    try {
      const filter: any = { sellerId };
      if (productId) {
        filter.productId = productId;
      }

      const draft = await ProductDraft.findOne(filter);
      return draft;
    } catch (error) {
      console.error("Error getting draft:", error);
      throw error;
    }
  }

  /**
   * Delete draft
   */
  static async deleteDraft(
    sellerId: string | Types.ObjectId,
    productId?: string | Types.ObjectId
  ) {
    try {
      const filter: any = { sellerId };
      if (productId) {
        filter.productId = productId;
      }

      await ProductDraft.deleteOne(filter);
      console.log(`✅ Deleted draft for seller ${sellerId}`);
    } catch (error) {
      console.error("Error deleting draft:", error);
      throw error;
    }
  }

  /**
   * Get all drafts for a seller
   */
  static async getSellerDrafts(sellerId: string | Types.ObjectId) {
    try {
      const drafts = await ProductDraft.find({ sellerId }).sort({
        lastSaved: -1,
      });
      return drafts;
    } catch (error) {
      console.error("Error getting seller drafts:", error);
      throw error;
    }
  }
}

export default DraftService;

