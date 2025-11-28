import { Request, Response } from "express";
import { DraftService } from "../services";

/**
 * Save product draft (Seller)
 */
export const saveDraft = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;
    const { productId, draftData } = req.body;

    const draft = await DraftService.saveDraft(sellerId, productId, draftData);

    res.json({
      success: true,
      message: "Draft saved successfully",
      data: draft,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save draft",
    });
  }
};

/**
 * Get saved draft (Seller)
 */
export const getDraft = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;
    const { productId } = req.params;

    const draft = await DraftService.getDraft(sellerId, productId || undefined);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    res.json({
      success: true,
      data: draft,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get draft",
    });
  }
};

/**
 * Delete draft (Seller)
 */
export const deleteDraft = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;
    const { productId } = req.params;

    await DraftService.deleteDraft(sellerId, productId || undefined);

    res.json({
      success: true,
      message: "Draft deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete draft",
    });
  }
};

/**
 * Get all drafts for seller
 */
export const getSellerDrafts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;

    const drafts = await DraftService.getSellerDrafts(sellerId);

    res.json({
      success: true,
      data: drafts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get drafts",
    });
  }
};

