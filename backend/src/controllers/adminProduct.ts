import { Request, Response } from "express";
import { Product } from "../models/product";

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      status,
      category,
      search,
      sort = "-createdAt",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("sellerId", "businessName verificationStatus")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Feature/unfeature product
export const featureProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { isFeatured, updatedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product ${isFeatured ? "featured" : "unfeatured"} successfully`,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error featuring product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Approve product
export const approveProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: "active", updatedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product approved successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error approving product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Reject product
export const rejectProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: "rejected", updatedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product rejected successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error rejecting product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};




