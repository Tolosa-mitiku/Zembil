import { Router } from "express";
import {
  createPayment,
  getPaymentByOrderId,
  getPaymentsByBuyer,
  getPaymentsBySeller,
} from "../controllers/payment";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import { validateObjectIdMiddleware } from "../utils/validation";

const router = Router();

// ============= ALL ROUTES REQUIRE AUTHENTICATION =============
router.use(verifyFirebaseToken);

// POST /payments - Create payment (Buyer/Admin only)
router.post("/", authorizeRole(["buyer", "admin"]), createPayment);

// GET /payments/orders/:orderId - Get payment by order ID
router.get(
  "/orders/:orderId",
  validateObjectIdMiddleware("orderId"),
  getPaymentByOrderId
);

// GET /payments/buyers/:buyerId - Get payments by buyer (Admin only)
router.get(
  "/buyers/:buyerId",
  validateObjectIdMiddleware("buyerId"),
  authorizeRole(["admin"]),
  getPaymentsByBuyer
);

// GET /payments/sellers/:sellerId - Get payments by seller (Seller/Admin)
router.get(
  "/sellers/:sellerId",
  validateObjectIdMiddleware("sellerId"),
  authorizeRole(["seller", "admin"]),
  getPaymentsBySeller
);

export default router;
