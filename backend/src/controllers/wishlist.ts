import { Response } from "express";
import { Wishlist } from "../models/wishlist";
import { Product } from "../models/product";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get user's wishlist
export const getWishlist = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let wishlist = await Wishlist.findOne({ userId: user._id }).populate({
      path: "products.productId",
      select: "title price images discount stockQuantity averageRating category",
    });

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      wishlist = new Wishlist({ userId: user._id, products: [] });
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Add product to wishlist
export const addToWishlist = async (req: CustomRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId: user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: user._id, products: [] });
    }

    // Check if product already in wishlist
    const existingIndex = wishlist.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingIndex >= 0) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add product to wishlist
    wishlist.products.push({ productId, addedAt: new Date() });
    wishlist.updatedAt = new Date();
    await wishlist.save();

    // Populate the wishlist before returning
    await wishlist.populate({
      path: "products.productId",
      select: "title price images discount stockQuantity averageRating category",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wishlist = await Wishlist.findOne({ userId: user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );
    wishlist.updatedAt = new Date();
    await wishlist.save();

    // Populate the wishlist before returning
    await wishlist.populate({
      path: "products.productId",
      select: "title price images discount stockQuantity averageRating category",
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wishlist = await Wishlist.findOne({ userId: user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = [];
    wishlist.updatedAt = new Date();
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error clearing wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};




