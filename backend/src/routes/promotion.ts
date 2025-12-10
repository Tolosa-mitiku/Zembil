import { Router } from "express";
import {
  createPromotion,
  deletePromotion,
  getPromotionStats,
  getSellerPromotions,
  togglePromotion,
  updatePromotion,
} from "../controllers/promotion";
import { authorizeRole } from "../middlewares/authorizeRole";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// All routes require seller role
router.use(verifyFirebaseToken);
router.use(authorizeRole(["seller"]));

router.post("/", createPromotion);
router.get("/", getSellerPromotions);
router.get("/stats", getPromotionStats);
router.patch("/:id", updatePromotion);
router.delete("/:id", deletePromotion);
router.patch("/:id/toggle", togglePromotion);

export default router;
