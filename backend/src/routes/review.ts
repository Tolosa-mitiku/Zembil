import { Router } from "express";
import {
  addProductReview,
  deleteReview,
  getProductReviews,
  getSellerReviews,
  markReviewHelpful,
  updateReview,
} from "../controllers/review";
import { validateBody, validateQuery } from "../middlewares/validate";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { verifyReviewOwnership } from "../middlewares/verifyOwnership";
import { validateObjectIdMiddleware } from "../utils/validation";
import {
  createReviewSchema,
  reviewQuerySchema,
  updateReviewSchema,
} from "../validations/review.validation";

const router = Router();

// ============= PUBLIC ROUTES =============

// GET /reviews/:id - Get product reviews (public)
router.get(
  "/:id",
  validateObjectIdMiddleware("id"),
  validateQuery(reviewQuerySchema),
  getProductReviews
);

// GET /reviews/seller/:id - Get seller reviews (public)
router.get(
  "/seller/:id",
  validateObjectIdMiddleware("id"),
  validateQuery(reviewQuerySchema),
  getSellerReviews
);

// ============= PROTECTED ROUTES =============

// POST /reviews/:id - Add product review (authenticated users only)
router.post(
  "/:id",
  verifyFirebaseToken,
  validateObjectIdMiddleware("id"),
  validateBody(createReviewSchema),
  addProductReview
);

// PUT /reviews/:id - Update review (owner only)
router.put(
  "/:id",
  verifyFirebaseToken,
  validateObjectIdMiddleware("id"),
  verifyReviewOwnership,
  validateBody(updateReviewSchema),
  updateReview
);

// DELETE /reviews/:id - Delete review (owner only)
router.delete(
  "/:id",
  verifyFirebaseToken,
  validateObjectIdMiddleware("id"),
  verifyReviewOwnership,
  deleteReview
);

// POST /reviews/:id/helpful - Mark review as helpful (authenticated users)
router.post(
  "/:id/helpful",
  verifyFirebaseToken,
  validateObjectIdMiddleware("id"),
  markReviewHelpful
);

export default router;
