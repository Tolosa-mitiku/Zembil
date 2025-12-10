/**
 * Ownership Verification Middleware
 * Ensures users can only access/modify their own resources
 */

import { Request, Response, NextFunction } from "express";
import { Product, Order, Seller, Review, Cart, Wishlist, User } from "../models";
import { ErrorFactory } from "../utils/errorHandler";

/**
 * Helper to get MongoDB user from Firebase UID
 */
const getMongoUser = async (firebaseUid: string) => {
  return User.findOne({ uid: firebaseUid });
};

/**
 * Verify product ownership (seller)
 */
export const verifyProductOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Admins can access all products
    if (user.role === "admin") {
      return next();
    }

    // Sellers can only access their own products
    if (user.role === "seller") {
      const product = await Product.findOne({ _id: id, sellerId: user.sellerId });

      if (!product) {
        throw ErrorFactory.forbidden("Access denied: Not your product");
      }

      (req as any).product = product;
      return next();
    }

    throw ErrorFactory.forbidden("Access denied");
  } catch (error) {
    next(error);
  }
};

/**
 * Verify order ownership (buyer)
 */
export const verifyOrderOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const firebaseUser = (req as any).user;

    // Admins can access all orders
    if (firebaseUser.role === "admin") {
      return next();
    }

    // Look up the MongoDB user by Firebase UID
    const mongoUser = await getMongoUser(firebaseUser.uid);
    
    if (!mongoUser) {
      throw ErrorFactory.forbidden("Access denied: User not found");
    }

    // Buyers can only access their own orders
    const order = await Order.findOne({ _id: id, buyerId: mongoUser._id });

    if (!order) {
      throw ErrorFactory.forbidden("Access denied: Not your order");
    }

    (req as any).order = order;
    (req as any).mongoUser = mongoUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify seller ownership (for seller profile operations)
 */
export const verifySellerOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Admins can access all sellers
    if (user.role === "admin") {
      return next();
    }

    // Seller can only access their own profile
    if (user.sellerId?.toString() !== id) {
      throw ErrorFactory.forbidden("Access denied: Not your profile");
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify review ownership (user)
 */
export const verifyReviewOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const firebaseUser = (req as any).user;

    // Admins can access all reviews
    if (firebaseUser.role === "admin") {
      return next();
    }

    // Look up MongoDB user
    const mongoUser = await getMongoUser(firebaseUser.uid);
    if (!mongoUser) {
      throw ErrorFactory.forbidden("Access denied: User not found");
    }

    const review = await Review.findOne({ _id: id, userId: mongoUser._id });

    if (!review) {
      throw ErrorFactory.forbidden("Access denied: Not your review");
    }

    (req as any).review = review;
    (req as any).mongoUser = mongoUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify cart ownership (buyer)
 */
export const verifyCartOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const firebaseUser = (req as any).user;

    // Look up MongoDB user
    const mongoUser = await getMongoUser(firebaseUser.uid);
    if (!mongoUser) {
      throw ErrorFactory.forbidden("Access denied: User not found");
    }

    const cart = await Cart.findOne({ userId: mongoUser._id });

    if (!cart) {
      // Create cart if doesn't exist
      const newCart = await Cart.create({ userId: mongoUser._id, items: [] });
      (req as any).cart = newCart;
      (req as any).mongoUser = mongoUser;
      return next();
    }

    (req as any).cart = cart;
    (req as any).mongoUser = mongoUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify buyer ownership (for buyer profile operations)
 */
export const verifyBuyerOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const firebaseUser = (req as any).user;

    // Admins can access all buyers
    if (firebaseUser.role === "admin") {
      return next();
    }

    // Look up MongoDB user
    const mongoUser = await getMongoUser(firebaseUser.uid);
    if (!mongoUser) {
      throw ErrorFactory.forbidden("Access denied: User not found");
    }

    // Find buyer and verify ownership
    const { Buyer } = require("../models");
    const buyer = await Buyer.findOne({ _id: id, userId: mongoUser._id });

    if (!buyer) {
      throw ErrorFactory.forbidden("Access denied: Not your profile");
    }

    (req as any).buyer = buyer;
    (req as any).mongoUser = mongoUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify chat access (user must be participant)
 */
export const verifyChatAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const firebaseUser = (req as any).user;

    // Admins can access all chats
    if (firebaseUser.role === "admin") {
      return next();
    }

    // Look up MongoDB user
    const mongoUser = await getMongoUser(firebaseUser.uid);
    if (!mongoUser) {
      throw ErrorFactory.forbidden("Access denied: User not found");
    }

    // User must be either buyer or seller in the chat
    const { Chat } = require("../models");
    const chat = await Chat.findOne({
      _id: id,
      $or: [{ buyerId: mongoUser._id }, { sellerId: mongoUser._id }],
    });

    if (!chat) {
      throw ErrorFactory.forbidden("Access denied: Not your conversation");
    }

    (req as any).chat = chat;
    (req as any).mongoUser = mongoUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify message access (user must be in the chat)
 */
export const verifyMessageAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const firebaseUser = (req as any).user;

    // Look up MongoDB user
    const mongoUser = await getMongoUser(firebaseUser.uid);
    if (!mongoUser) {
      throw ErrorFactory.forbidden("Access denied: User not found");
    }

    // Verify user is participant in chat
    const { Chat } = require("../models");
    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyerId: mongoUser._id }, { sellerId: mongoUser._id }],
    });

    if (!chat) {
      throw ErrorFactory.forbidden("Access denied: Not your conversation");
    }

    (req as any).chat = chat;
    (req as any).mongoUser = mongoUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify seller earnings access
 */
export const verifySellerEarningsAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    // Admins can access all earnings
    if (user.role === "admin") {
      return next();
    }

    // Must be a seller
    if (user.role !== "seller" || !user.sellerId) {
      throw ErrorFactory.forbidden("Access denied: Sellers only");
    }

    (req as any).sellerId = user.sellerId;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user can access resource
 * Generic verification for user-specific resources
 */
export const verifyResourceOwnership = (
  Model: any,
  userIdField: string = "userId"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const firebaseUser = (req as any).user;

      // Admins bypass
      if (firebaseUser.role === "admin") {
        return next();
      }

      // Look up MongoDB user
      const mongoUser = await getMongoUser(firebaseUser.uid);
      if (!mongoUser) {
        throw ErrorFactory.forbidden("Access denied: User not found");
      }

      const query: any = { _id: id };
      query[userIdField] = mongoUser._id;

      const resource = await Model.findOne(query);

      if (!resource) {
        throw ErrorFactory.forbidden("Access denied");
      }

      (req as any).resource = resource;
      (req as any).mongoUser = mongoUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default {
  verifyProductOwnership,
  verifyOrderOwnership,
  verifySellerOwnership,
  verifyBuyerOwnership,
  verifyReviewOwnership,
  verifyCartOwnership,
  verifyChatAccess,
  verifyMessageAccess,
  verifySellerEarningsAccess,
  verifyResourceOwnership,
};

