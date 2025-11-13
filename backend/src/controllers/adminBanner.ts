import { Request, Response } from "express";
import { Banner } from "../models/banner";

// Get all banners (admin)
export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 });

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

// Create banner
export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating banner",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update banner
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating banner",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete banner
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting banner",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Toggle banner active status
export const toggleBannerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    banner.isActive = !banner.isActive;
    banner.updatedAt = new Date();
    await banner.save();

    return res.status(200).json({
      success: true,
      message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error toggling banner status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};








