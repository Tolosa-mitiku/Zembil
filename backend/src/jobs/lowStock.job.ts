/**
 * Low Stock Alert Job
 * Checks for low stock products and sends alerts
 * Run: Daily at 9 AM
 */

import { InventoryService } from "../services";
import { Notification } from "../models";

export const lowStockAlertJob = async () => {
  try {
    console.log("🔄 Starting low stock check...");

    const lowStockProducts = await InventoryService.checkLowStock();

    if (lowStockProducts.length === 0) {
      console.log("✅ No low stock products found");
      return { alertsSent: 0 };
    }

    // Group by seller
    const productsBySeller = lowStockProducts.reduce((acc: any, product: any) => {
      const sellerId = product.sellerId._id.toString();
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(product);
      return acc;
    }, {});

    let alertsSent = 0;

    // Send notifications to sellers
    for (const [sellerId, products] of Object.entries<any>(productsBySeller)) {
      try {
        await Notification.create({
          userId: products[0].sellerId.userId,
          type: "system",
          title: "Low Stock Alert",
          message: `You have ${products.length} product(s) running low on stock`,
          data: {
            products: products.map((p: any) => ({
              id: p._id,
              title: p.title,
              stock: p.inventory?.stockQuantity,
            })),
          },
          priority: "high",
        });

        alertsSent++;
      } catch (error) {
        console.error(`Failed to send alert to seller ${sellerId}:`, error);
      }
    }

    console.log(`✅ Sent ${alertsSent} low stock alerts`);
    console.log("✅ Low stock alert job completed");

    return { alertsSent, productsCount: lowStockProducts.length };
  } catch (error) {
    console.error("❌ Low stock alert job failed:", error);
    throw error;
  }
};

export default lowStockAlertJob;

