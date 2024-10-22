import { Router } from "express";
import {
  createPayment,
  getPaymentByOrderId,
  getPaymentsByBuyer,
  getPaymentsBySeller,
} from "../controllers/payment";

const router = Router();

// POST /payments - Create a new payment (after order creation)
router.post("/", createPayment);

// GET /payments/orders/:orderId - Get payment details by order ID
router.get("/orders/:orderId", getPaymentByOrderId);

// GET /buyers/:buyerId/payments - Get all payments made by a buyer
router.get("/buyers/:buyerId", getPaymentsByBuyer);

// GET /sellers/:sellerId/payments - Get all payments received by a seller
router.get("/sellers/:sellerId", getPaymentsBySeller);

export default router;
