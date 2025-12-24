import { Request, Response } from "express";
import { Banner } from "../models/banner";

// Get active banners (public)
export const getActiveBanners = async (req: Request, res: Response) => {
  try {
    const { placement, targetAudience = "all" } = req.query;

    const now = new Date();
    const filter: any = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    };

    if (placement) {
      filter.placement = placement;
    }

    if (targetAudience && targetAudience !== "all") {
      filter.targetAudience = { $in: [targetAudience, "all"] };
    }

    const banners = await Banner.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(10);

    // Increment impression count
    const bannerIds = banners.map((b) => b._id);
    await Banner.updateMany(
      { _id: { $in: bannerIds } },
      { $inc: { impressions: 1 } }
    );

    return res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching banners",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Track banner click (public)
export const trackBannerClick = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Calculate CTR
    if (banner.impressions > 0) {
      banner.clickThroughRate = (banner.clicks / banner.impressions) * 100;
      await banner.save();
    }

    return res.status(200).json({
      success: true,
      message: "Click tracked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error tracking click",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};




















