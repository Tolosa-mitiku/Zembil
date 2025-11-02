import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderTracking,
} from "../controllers/order";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// All order routes require authentication
router.use(verifyFirebaseToken);

// POST /orders - Create a new order
router.post("/", createOrder);

// GET /orders - Get all orders for current user
router.get("/", getUserOrders);

// GET /orders/:id - Get order details
router.get("/:id", getOrderById);

// PUT /orders/:id/tracking - Update order tracking location
router.put("/:id/tracking", updateOrderTracking);

// PUT /orders/:id/cancel - Cancel an order
router.put("/:id/cancel", cancelOrder);

export default router;
