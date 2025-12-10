/**
 * Analytics Service
 * Handles all analytics calculations and metric updates
 */

import { Product, Review, Seller, Order, Buyer } from "../models";
import { Types } from "mongoose";

export class AnalyticsService {
  /**
   * Update product analytics (ratings, reviews, sales)
   */
  static async updateProductMetrics(productId: string | Types.ObjectId) {
    try {
      const product = await Product.findById(productId);
      if (!product) return;

      // Get all reviews for this product
      const reviews = await Review.find({ productId, status: "approved" });

      // Calculate average rating
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      // Calculate rating distribution
      const rating1Star = reviews.filter((r) => r.rating === 1).length;
      const rating2Star = reviews.filter((r) => r.rating === 2).length;
      const rating3Star = reviews.filter((r) => r.rating === 3).length;
      const rating4Star = reviews.filter((r) => r.rating === 4).length;
      const rating5Star = reviews.filter((r) => r.rating === 5).length;

      // Update product analytics
      await Product.updateOne(
        { _id: productId },
        {
          $set: {
            "analytics.averageRating": Number(avgRating.toFixed(2)),
            "analytics.totalReviews": reviews.length,
            "analytics.rating1Star": rating1Star,
            "analytics.rating2Star": rating2Star,
            "analytics.rating3Star": rating3Star,
            "analytics.rating4Star": rating4Star,
            "analytics.rating5Star": rating5Star,
            // Update legacy fields for backward compatibility
            averageRating: Number(avgRating.toFixed(2)),
            totalReviews: reviews.length,
          },
        }
      );

      console.log(`✅ Updated metrics for product ${productId}`);
    } catch (error) {
      console.error("Error updating product metrics:", error);
      throw error;
    }
  }

  /**
   * Update seller performance metrics
   */
  static async updateSellerMetrics(sellerId: string | Types.ObjectId) {
    try {
      const seller = await Seller.findById(sellerId);
      if (!seller) return;

      // Get all products for this seller
      const products = await Product.find({ sellerId });

      // Get all orders containing this seller's products
      const orders = await Order.find({ "items.sellerId": sellerId });

      // Get all reviews for this seller
      const reviews = await Review.find({ sellerId, status: "approved" });

      // Calculate sales metrics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
      const platformFee = totalRevenue * 0.1; // 10% platform fee
      const totalEarnings = totalRevenue - platformFee;

      // Calculate product metrics
      const totalProducts = products.length;
      const activeProducts = products.filter((p) => p.status === "active").length;
      const outOfStockProducts = products.filter(
        (p) => p.inventory && p.inventory.stockQuantity === 0
      ).length;

      // Calculate review metrics
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      const rating1Star = reviews.filter((r) => r.rating === 1).length;
      const rating2Star = reviews.filter((r) => r.rating === 2).length;
      const rating3Star = reviews.filter((r) => r.rating === 3).length;
      const rating4Star = reviews.filter((r) => r.rating === 4).length;
      const rating5Star = reviews.filter((r) => r.rating === 5).length;

      // Calculate last 30 days metrics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrders = orders.filter(
        (o) => new Date(o.createdAt) >= thirtyDaysAgo
      );
      const last30DaysRevenue = recentOrders.reduce(
        (sum, o) => sum + o.totalPrice,
        0
      );

      // Update seller metrics
      await Seller.updateOne(
        { _id: sellerId },
        {
          $set: {
            "metrics.totalOrders": totalOrders,
            "metrics.totalRevenue": totalRevenue,
            "metrics.totalEarnings": totalEarnings,
            "metrics.averageOrderValue":
              totalOrders > 0 ? totalRevenue / totalOrders : 0,
            "metrics.totalProducts": totalProducts,
            "metrics.activeProducts": activeProducts,
            "metrics.outOfStockProducts": outOfStockProducts,
            "metrics.averageRating": Number(avgRating.toFixed(2)),
            "metrics.totalReviews": reviews.length,
            "metrics.rating1Star": rating1Star,
            "metrics.rating2Star": rating2Star,
            "metrics.rating3Star": rating3Star,
            "metrics.rating4Star": rating4Star,
            "metrics.rating5Star": rating5Star,
            "metrics.last30Days.orders": recentOrders.length,
            "metrics.last30Days.revenue": last30DaysRevenue,
            "metrics.lastUpdated": new Date(),
            // Update legacy fields
            totalOrders: totalOrders,
            totalRevenue: totalRevenue,
            averageRating: Number(avgRating.toFixed(2)),
            totalReviews: reviews.length,
          },
        }
      );

      console.log(`✅ Updated metrics for seller ${sellerId}`);
    } catch (error) {
      console.error("Error updating seller metrics:", error);
      throw error;
    }
  }

  /**
   * Update buyer analytics
   */
  static async updateBuyerAnalytics(buyerId: string | Types.ObjectId) {
    try {
      const orders = await Order.find({ buyerId });

      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const lastOrderDate =
        orders.length > 0
          ? orders.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0].createdAt
          : null;

      await Buyer.updateOne(
        { userId: buyerId },
        {
          $set: {
            "analytics.totalOrders": totalOrders,
            "analytics.totalSpent": totalSpent,
            "analytics.averageOrderValue": avgOrderValue,
            "analytics.lastOrderDate": lastOrderDate,
          },
        }
      );

      // Also update user stats
      await this.updateUserStats(buyerId);
    } catch (error) {
      console.error("Error updating buyer analytics:", error);
      throw error;
    }
  }

  /**
   * Update user statistics
   */
  static async updateUserStats(userId: string | Types.ObjectId) {
    try {
      const orders = await Order.find({ buyerId: userId });
      const reviews = await Review.find({ userId });

      await Product.findByIdAndUpdate(userId, {
        $set: {
          "stats.totalOrders": orders.length,
          "stats.totalSpent": orders.reduce((sum, o) => sum + o.totalPrice, 0),
          "stats.totalReviews": reviews.length,
        },
      });
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  }

  /**
   * Track product view
   */
  static async trackProductView(
    productId: string | Types.ObjectId,
    userId?: string | Types.ObjectId
  ) {
    try {
      await Product.updateOne(
        { _id: productId },
        {
          $inc: {
            "analytics.views": 1,
            ...(userId ? { "analytics.uniqueViews": 1 } : {}),
          },
        }
      );

      // Add to buyer's viewed products
      if (userId) {
        await Buyer.updateOne(
          { userId },
          {
            $addToSet: {
              "analytics.viewedProducts": productId,
            },
          }
        );
      }
    } catch (error) {
      console.error("Error tracking product view:", error);
    }
  }

  /**
   * Calculate trending products
   */
  static async calculateTrendingProducts() {
    try {
      const products = await Product.find({ status: "active" });

      for (const product of products) {
        // Calculate trending score based on multiple factors
        const viewsWeight = 0.3;
        const salesWeight = 0.5;
        const ratingWeight = 0.2;

        const viewsScore =
          ((product.analytics?.views || 0) / 1000) * 100 * viewsWeight;
        const salesScore =
          ((product.analytics?.totalSold || 0) / 100) * 100 * salesWeight;
        const ratingScore =
          ((product.analytics?.averageRating || 0) / 5) * 100 * ratingWeight;

        const trendingScore = Math.min(
          viewsScore + salesScore + ratingScore,
          100
        );

        await Product.updateOne(
          { _id: product._id },
          {
            $set: {
              "analytics.trending": trendingScore > 70,
              "analytics.trendingScore": Number(trendingScore.toFixed(2)),
            },
          }
        );
      }

      console.log("✅ Updated trending products");
    } catch (error) {
      console.error("Error calculating trending products:", error);
      throw error;
    }
  }

  /**
   * Get seller dashboard analytics
   */
  static async getSellerDashboardAnalytics(sellerId: string | Types.ObjectId) {
    try {
      const seller = await Seller.findById(sellerId);
      if (!seller) throw new Error("Seller not found");

      const products = await Product.find({ sellerId });
      const orders = await Order.find({ "items.sellerId": sellerId });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrders = orders.filter(
        (o) => new Date(o.createdAt) >= thirtyDaysAgo
      );

      return {
        overview: {
          totalOrders: seller.metrics?.totalOrders || 0,
          pendingOrders: orders.filter(
            (o) => o.tracking?.status === "pending"
          ).length,
          last30DaysOrders: recentOrders.length,
          totalProducts: products.length,
          activeProducts: products.filter((p) => p.status === "active").length,
          outOfStock: products.filter(
            (p) => p.inventory && p.inventory.stockQuantity === 0
          ).length,
          totalRevenue: seller.metrics?.totalRevenue || 0,
          totalEarnings: seller.metrics?.totalEarnings || 0,
          pendingPayout: seller.metrics?.pendingEarnings || 0,
        },
        metrics: seller.metrics,
        last30Days: seller.metrics?.last30Days,
      };
    } catch (error) {
      console.error("Error getting seller dashboard analytics:", error);
      throw error;
    }
  }
}

export default AnalyticsService;

