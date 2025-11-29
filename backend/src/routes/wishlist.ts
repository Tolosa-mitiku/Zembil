import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// All wishlist routes require authentication
router.use(verifyFirebaseToken);

// GET /wishlist - Get user's wishlist
router.get("/", getWishlist);

// POST /wishlist/:productId - Add product to wishlist
router.post("/:productId", addToWishlist);

// DELETE /wishlist/:productId - Remove product from wishlist
router.delete("/:productId", removeFromWishlist);

// DELETE /wishlist - Clear entire wishlist
router.delete("/", clearWishlist);

export default router;




