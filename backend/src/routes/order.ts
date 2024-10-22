import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrdersByBuyer,
  getOrdersBySeller,
  updateOrderStatus,
} from "../controllers/order";

const router = Router();

// POST /orders - Create a new order
router.post("/", createOrder);

// GET /orders/:id - Get order details
router.get("/:id", getOrderById);

// GET /buyers/:buyerId/orders - Get all orders placed by a buyer
router.get("/buyers/:buyerId", getOrdersByBuyer);

// GET /sellers/:sellerId/orders - Get all orders received by a seller
router.get("/sellers/:sellerId", getOrdersBySeller);

// PUT /orders/:id/status - Update the order status (e.g., shipped, delivered)
router.put("/:id/status", updateOrderStatus);

// PUT /orders/:id/cancel - Cancel an order
router.put("/:id/cancel", cancelOrder);

export default router;
