import { Request, Response } from "express";
import { Category } from "../models/category";
import { Product } from "../models/product";

// Get all categories (public)
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive = "false" } = req.query;

    const filter: any = {};
    if (includeInactive !== "true") {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .sort({ displayOrder: 1, name: 1 })
      .populate("parentCategory", "name slug");

    // Update product counts (could be cached)
    for (const category of categories) {
      const count = await Product.countDocuments({
        category: category._id, // Use ObjectId instead of name
        status: "active",
      });
      category.productsCount = count;
      await category.save();
    }

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get category by slug (public)
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true }).populate(
      "parentCategory",
      "name slug"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get subcategories
    const subcategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
