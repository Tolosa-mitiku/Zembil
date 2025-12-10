import { Request, Response } from "express";
import { Promotion, Product } from "../models";

/**
 * Create promotion (Seller)
 */
export const createPromotion = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;
    const { productIds, discountPercentage, startDate, endDate } = req.body;

    // Validate required fields
    if (!productIds || !discountPercentage || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create promotion
    const promotion = await Promotion.create({
      sellerId,
      productIds,
      discountPercentage,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: true,
    });

    // Update products with promotion
    await Product.updateMany(
      { _id: { $in: productIds }, sellerId },
      {
        $set: {
          "discount.isActive": true,
          "discount.type": "percentage",
          "discount.value": discountPercentage,
          "discount.startDate": new Date(startDate),
          "discount.endDate": new Date(endDate),
          isOnSale: true,
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Promotion created successfully",
      data: promotion,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create promotion",
    });
  }
};

/**
 * Get seller promotions
 */
export const getSellerPromotions = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;

    const promotions = await Promotion.find({ sellerId })
      .populate("productIds", "title images pricing")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: promotions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get promotions",
    });
  }
};

/**
 * Update promotion
 */
export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = (req as any).user.sellerId;
    const updates = req.body;

    const promotion = await Promotion.findOneAndUpdate(
      { _id: id, sellerId },
      { $set: updates },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    // Update related products if discount changed
    if (updates.discountPercentage || updates.startDate || updates.endDate) {
      await Product.updateMany(
        { _id: { $in: promotion.productIds } },
        {
          $set: {
            "discount.value": updates.discountPercentage || promotion.discountPercentage,
            "discount.startDate": updates.startDate || promotion.startDate,
            "discount.endDate": updates.endDate || promotion.endDate,
          },
        }
      );
    }

    res.json({
      success: true,
      message: "Promotion updated successfully",
      data: promotion,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update promotion",
    });
  }
};

/**
 * Delete promotion
 */
export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = (req as any).user.sellerId;

    const promotion = await Promotion.findOne({ _id: id, sellerId });
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    // Remove promotion from products
    await Product.updateMany(
      { _id: { $in: promotion.productIds } },
      {
        $set: {
          "discount.isActive": false,
          isOnSale: false,
        },
      }
    );

    // Delete promotion
    await Promotion.deleteOne({ _id: id });

    res.json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete promotion",
    });
  }
};

/**
 * Toggle promotion status
 */
export const togglePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = (req as any).user.sellerId;

    const promotion = await Promotion.findOne({ _id: id, sellerId });
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    const newStatus = !promotion.isActive;

    await Promotion.updateOne(
      { _id: id },
      { $set: { isActive: newStatus } }
    );

    // Update products
    await Product.updateMany(
      { _id: { $in: promotion.productIds } },
      {
        $set: {
          "discount.isActive": newStatus,
          isOnSale: newStatus,
        },
      }
    );

    res.json({
      success: true,
      message: `Promotion ${newStatus ? "activated" : "deactivated"} successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle promotion",
    });
  }
};

/**
 * Get promotion statistics
 */
export const getPromotionStats = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.sellerId;

    const promotions = await Promotion.find({ sellerId });

    const stats = {
      totalPromotions: promotions.length,
      activePromotions: promotions.filter((p) => p.isActive).length,
      totalRevenue: promotions.reduce((sum, p) => sum + (p.revenue || 0), 0),
      totalSales: promotions.reduce((sum, p) => sum + (p.sales || 0), 0),
      avgDiscountRate:
        promotions.reduce((sum, p) => sum + p.discountPercentage, 0) /
          promotions.length || 0,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get promotion statistics",
    });
  }
};

