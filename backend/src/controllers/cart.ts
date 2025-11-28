import { Response } from "express";
import { CustomRequest } from "../types/express";
import { Cart, Product, User } from "../models";
import { InventoryService } from "../services";

/**
 * Get user cart
 */
export const getCart = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cart = await Cart.findOne({ userId: user._id }).populate(
      "items.productId",
      "title images pricing inventory status"
    );

    // Create empty cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({
        userId: user._id,
        items: [],
      });
    }

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

/**
 * Add item to cart
 */
export const addToCart = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { productId, quantity = 1, variant } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    // Validate product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    // Check inventory availability
    const available = await InventoryService.checkAvailability(productId, quantity);
    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Insufficient inventory",
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({
        userId: user._id,
        items: [],
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        sellerId: product.sellerId,
        title: product.title,
        image: product.images?.[0]?.url || product.images?.[0] || product.primaryImage,
        price: product.pricing?.basePrice || product.price,
        quantity,
        variant,
        addedAt: new Date(),
      } as any);
    }

    await cart.save();

    // Reserve inventory
    try {
      await InventoryService.reserveInventory([{ productId, quantity, variant }]);
    } catch (error) {
      console.error("Failed to reserve inventory:", error);
      // Continue anyway - inventory will be checked again at checkout
    }

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

/**
 * Update cart item quantity
 */
export const updateCartItem = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Check inventory availability for new quantity
    const available = await InventoryService.checkAvailability(productId, quantity);
    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Insufficient inventory for requested quantity",
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
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

/**
 * Remove item from cart
 */
export const removeFromCart = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find item to get quantity before removing
    const item = cart.items.find(
      (item: any) => item.productId.toString() === productId
    );

    // Remove item
    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId
    ) as any;

    await cart.save();

    // Release reserved inventory
    if (item) {
      try {
        await InventoryService.releaseInventory([
          { productId, quantity: item.quantity },
        ]);
      } catch (error) {
        console.error("Failed to release inventory:", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Release all reserved inventory
    const items = cart.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (items.length > 0) {
      try {
        await InventoryService.releaseInventory(items);
      } catch (error) {
        console.error("Failed to release inventory:", error);
      }
    }

    // Clear cart
    cart.items = [] as any;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
