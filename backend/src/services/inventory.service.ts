/**
 * Inventory Management Service
 * Handles stock reservations, releases, and tracking
 */

import { Product, Cart } from "../models";
import { Types } from "mongoose";

interface CartItem {
  productId: string | Types.ObjectId;
  quantity: number;
  variant?: any;
}

interface OrderItem {
  productId: string | Types.ObjectId;
  quantity: number;
}

export class InventoryService {
  /**
   * Reserve inventory when item is added to cart
   */
  static async reserveInventory(items: CartItem[]) {
    try {
      const operations = items.map((item) => ({
        updateOne: {
          filter: {
            _id: item.productId,
            status: "active",
            "inventory.availableQuantity": { $gte: item.quantity },
          },
          update: {
            $inc: {
              "inventory.reservedQuantity": item.quantity,
            },
          },
        },
      }));

      const result = await Product.bulkWrite(operations);

      if (result.modifiedCount !== items.length) {
        // Some items couldn't be reserved - rollback
        await this.releaseInventory(
          items.slice(0, result.modifiedCount)
        );
        throw new Error("Insufficient inventory for some items");
      }

      console.log(`✅ Reserved inventory for ${items.length} items`);
      return true;
    } catch (error) {
      console.error("Error reserving inventory:", error);
      throw error;
    }
  }

  /**
   * Release reserved inventory (cart expires or item removed)
   */
  static async releaseInventory(items: CartItem[]) {
    try {
      const operations = items.map((item) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: {
            $inc: {
              "inventory.reservedQuantity": -item.quantity,
            },
          },
        },
      }));

      await Product.bulkWrite(operations);
      console.log(`✅ Released inventory for ${items.length} items`);
    } catch (error) {
      console.error("Error releasing inventory:", error);
      throw error;
    }
  }

  /**
   * Commit inventory (order placed - deduct from stock)
   */
  static async commitInventory(items: OrderItem[]) {
    try {
      const operations = items.map((item) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: {
            $inc: {
              "inventory.stockQuantity": -item.quantity,
              "inventory.reservedQuantity": -item.quantity,
              "analytics.totalSold": item.quantity,
              "analytics.purchased": 1,
              // Legacy fields
              stockQuantity: -item.quantity,
              totalSold: item.quantity,
            },
          },
        },
      }));

      await Product.bulkWrite(operations);
      console.log(`✅ Committed inventory for ${items.length} items`);
    } catch (error) {
      console.error("Error committing inventory:", error);
      throw error;
    }
  }

  /**
   * Restore inventory (order canceled or refunded)
   */
  static async restoreInventory(items: OrderItem[]) {
    try {
      const operations = items.map((item) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: {
            $inc: {
              "inventory.stockQuantity": item.quantity,
              "analytics.totalSold": -item.quantity,
              // Legacy fields
              stockQuantity: item.quantity,
              totalSold: -item.quantity,
            },
          },
        },
      }));

      await Product.bulkWrite(operations);
      console.log(`✅ Restored inventory for ${items.length} items`);
    } catch (error) {
      console.error("Error restoring inventory:", error);
      throw error;
    }
  }

  /**
   * Check low stock products and alert sellers
   */
  static async checkLowStock() {
    try {
      const lowStockProducts = await Product.find({
        status: "active",
        "inventory.trackInventory": true,
        $expr: {
          $lte: [
            "$inventory.stockQuantity",
            "$inventory.lowStockThreshold",
          ],
        },
      }).populate("sellerId");

      console.log(`⚠️ Found ${lowStockProducts.length} low stock products`);

      // You can send notifications here
      return lowStockProducts;
    } catch (error) {
      console.error("Error checking low stock:", error);
      throw error;
    }
  }

  /**
   * Check product availability
   */
  static async checkAvailability(
    productId: string | Types.ObjectId,
    quantity: number
  ): Promise<boolean> {
    try {
      const product = await Product.findById(productId);

      if (!product) return false;
      if (product.status !== "active") return false;

      const stockQuantity = product.inventory?.stockQuantity || 0;
      const reservedQuantity = product.inventory?.reservedQuantity || 0;
      const available = stockQuantity - reservedQuantity;

      return available >= quantity;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  }

  /**
   * Update product stock manually
   */
  static async updateStock(
    productId: string | Types.ObjectId,
    quantity: number,
    operation: "add" | "set"
  ) {
    try {
      if (operation === "add") {
        await Product.updateOne(
          { _id: productId },
          {
            $inc: {
              "inventory.stockQuantity": quantity,
              stockQuantity: quantity, // Legacy
            },
            $set: {
              lastRestockedAt: new Date(),
            },
          }
        );
      } else {
        await Product.updateOne(
          { _id: productId },
          {
            $set: {
              "inventory.stockQuantity": quantity,
              stockQuantity: quantity, // Legacy
              lastRestockedAt: new Date(),
            },
          }
        );
      }

      console.log(`✅ Updated stock for product ${productId}`);
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }
}

export default InventoryService;

