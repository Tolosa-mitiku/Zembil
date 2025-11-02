import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// All cart routes require authentication
router.use(verifyFirebaseToken);

// GET /cart - Get user cart
router.get("/", getCart);

// POST /cart - Add item to cart
router.post("/", addToCart);

// PUT /cart/:productId - Update cart item quantity
router.put("/:productId", updateCartItem);

// DELETE /cart/:productId - Remove item from cart
router.delete("/:productId", removeFromCart);

// DELETE /cart - Clear entire cart
router.delete("/", clearCart);

export default router;

