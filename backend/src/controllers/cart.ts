import { Response } from "express";
import { CustomRequest } from "../types/express";

// Note: Cart is currently managed locally in the frontend using Hive
// These endpoints are for future backend cart synchronization

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

// In-memory cart storage (replace with database if needed)
const userCarts: Map<string, CartItem[]> = new Map();

// Get user cart
export const getCart = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const cart = userCarts.get(userId) || [];

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Add item to cart
export const addToCart = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { productId, title, price, quantity, image } = req.body;

    if (!productId || !title || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = userCarts.get(userId) || [];
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({ productId, title, price, quantity, image });
    }

    userCarts.set(userId, cart);

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const cart = userCarts.get(userId) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex < 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart[itemIndex].quantity = quantity;
    userCarts.set(userId, cart);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { productId } = req.params;

    const cart = userCarts.get(userId) || [];
    const updatedCart = cart.filter(item => item.productId !== productId);

    userCarts.set(userId, updatedCart);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Clear cart
export const clearCart = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    userCarts.set(userId, []);

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

