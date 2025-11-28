import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { validateBody, validateParams } from "../middlewares/validate";
import { validateObjectIdMiddleware } from "../utils/validation";
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemIdSchema,
} from "../validations/cart.validation";

const router = Router();

// ============= ALL ROUTES REQUIRE AUTHENTICATION =============
router.use(verifyFirebaseToken);

// GET /cart - Get user's cart
router.get("/", getCart);

// POST /cart - Add item to cart
router.post("/", validateBody(addToCartSchema), addToCart);

// PUT /cart/:productId - Update item quantity
router.put(
  "/:productId",
  validateObjectIdMiddleware("productId"),
  validateBody(updateCartItemSchema),
  updateCartItem
);

// DELETE /cart/:productId - Remove item from cart
router.delete(
  "/:productId",
  validateObjectIdMiddleware("productId"),
  removeFromCart
);

// DELETE /cart - Clear entire cart
router.delete("/", clearCart);

export default router;
