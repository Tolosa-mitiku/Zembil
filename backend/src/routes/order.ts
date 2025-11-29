import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateTracking,
  cancelOrder,
} from "../controllers/order";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { verifyOrderOwnership } from "../middlewares/verifyOwnership";
import { validateBody, validateQuery } from "../middlewares/validate";
import { validateObjectIdMiddleware } from "../utils/validation";
import {
  createOrderSchema,
  updateTrackingSchema,
  orderQuerySchema,
} from "../validations/order.validation";

const router = Router();

// ============= ALL ROUTES REQUIRE AUTHENTICATION =============
router.use(verifyFirebaseToken);

// POST /orders - Create new order
router.post("/", validateBody(createOrderSchema), createOrder);

// GET /orders - Get user's orders with filters
router.get("/", validateQuery(orderQuerySchema), getUserOrders);

// GET /orders/:id - Get specific order (with ownership check)
router.get(
  "/:id",
  validateObjectIdMiddleware("id"),
  verifyOrderOwnership,
  getOrderById
);

// PUT /orders/:id/tracking - Update order tracking
router.put(
  "/:id/tracking",
  validateObjectIdMiddleware("id"),
  validateBody(updateTrackingSchema),
  updateTracking
);

// PUT /orders/:id/cancel - Cancel order (with ownership check)
router.put(
  "/:id/cancel",
  validateObjectIdMiddleware("id"),
  verifyOrderOwnership,
  cancelOrder
);

export default router;
