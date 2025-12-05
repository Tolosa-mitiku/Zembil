import { Response } from "express";
import { Review } from "../models/review";
import { Product } from "../models/product";
import { Seller } from "../models/seller";
import { Order } from "../models/order";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Add product review
export const addProductReview = async (req: CustomRequest, res: Response) => {
  try {
    const { id: productId } = req.params;
    const { rating, title, comment, images, orderId } = req.body;

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

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      userId: user._id,
      productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Verify purchase if orderId provided
    let verifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        buyerId: user._id,
        "items.productId": productId,
      });
      verifiedPurchase = !!order;
    }

    // Create review
    const review = new Review({
      userId: user._id,
      productId,
      sellerId: product.sellerId,
      orderId,
      rating,
      title,
      comment,
      images: images || [],
      verifiedPurchase,
    });

    await review.save();

    // Update product's average rating and review count
    const reviews = await Review.find({ productId, status: "approved" });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRating / reviews.length;
    product.totalReviews = reviews.length;
    await product.save();

    // Update seller's average rating
    const seller = await Seller.findById(product.sellerId);
    if (seller) {
      const sellerReviews = await Review.find({
        sellerId: seller._id,
        status: "approved",
      });
      const sellerTotalRating = sellerReviews.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      seller.averageRating = sellerTotalRating / sellerReviews.length;
      seller.totalReviews = sellerReviews.length;
      await seller.save();
    }

    // Populate user info before returning
    await review.populate("userId", "name image");

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get product reviews
export const getProductReviews = async (req: CustomRequest, res: Response) => {
  try {
    const { id: productId } = req.params;
    const { page = "1", limit = "10", rating, sort = "-createdAt" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { productId, status: "approved" };
    if (rating) {
      filter.rating = parseInt(rating as string, 10);
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("userId", "name image")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(filter),
    ]);

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { productId: productId, status: "approved" } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      ratingDistribution,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update review
export const updateReview = async (req: CustomRequest, res: Response) => {
  try {
    const { id: reviewId } = req.params;
    const { rating, title, comment, images } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const review = await Review.findOne({ _id: reviewId, userId: user._id });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    // Update review fields
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;
    review.updatedAt = new Date();

    await review.save();

    // Recalculate product rating
    const product = await Product.findById(review.productId);
    if (product) {
      const reviews = await Review.find({
        productId: product._id,
        status: "approved",
      });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      product.averageRating = totalRating / reviews.length;
      await product.save();
    }

    await review.populate("userId", "name image");

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete review
export const deleteReview = async (req: CustomRequest, res: Response) => {
  try {
    const { id: reviewId } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const review = await Review.findOne({ _id: reviewId, userId: user._id });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    const productId = review.productId;
    await review.deleteOne();

    // Recalculate product rating
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({
        productId: product._id,
        status: "approved",
      });
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        product.averageRating = totalRating / reviews.length;
      } else {
        product.averageRating = 0;
      }
      product.totalReviews = reviews.length;
      await product.save();
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req: CustomRequest, res: Response) => {
  try {
    const { id: reviewId } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.helpfulBy.some(
      (id) => id.toString() === user._id.toString()
    );

    if (alreadyMarked) {
      // Remove from helpful
      review.helpfulBy = review.helpfulBy.filter(
        (id) => id.toString() !== user._id.toString()
      );
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add to helpful
      review.helpfulBy.push(user._id);
      review.helpful += 1;
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: alreadyMarked ? "Removed from helpful" : "Marked as helpful",
      data: { helpful: review.helpful },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error marking review as helpful",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get seller reviews
export const getSellerReviews = async (req: CustomRequest, res: Response) => {
  try {
    const { id: sellerId } = req.params;
    const { page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ sellerId, status: "approved" })
        .populate("userId", "name image")
        .populate("productId", "title images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments({ sellerId, status: "approved" }),
    ]);

    return res.status(200).json({
      success: true,
      data: reviews,
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
      message: "Error fetching seller reviews",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};








