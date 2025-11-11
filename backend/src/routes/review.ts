import { Router } from "express";
import {
  addProductReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getSellerReviews,
} from "../controllers/review";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// Public routes (no auth required)
// GET /reviews/products/:id - Get product reviews
router.get("/products/:id", getProductReviews);

// GET /reviews/sellers/:id - Get seller reviews
router.get("/sellers/:id", getSellerReviews);

// Protected routes (auth required)
router.use(verifyFirebaseToken);

// POST /reviews/products/:id - Add product review
router.post("/products/:id", addProductReview);

// PUT /reviews/:id - Update review
router.put("/:id", updateReview);

// DELETE /reviews/:id - Delete review
router.delete("/:id", deleteReview);

// POST /reviews/:id/helpful - Mark review as helpful
router.post("/:id/helpful", markReviewHelpful);

export default router;




