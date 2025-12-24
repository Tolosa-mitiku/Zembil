import { Router } from "express";
import { getActiveBanners, trackBannerClick } from "../controllers/banner";

const router = Router();

// Public routes - no authentication required
// GET /banners - Get active banners
router.get("/", getActiveBanners);

// POST /banners/:id/click - Track banner click
router.post("/:id/click", trackBannerClick);

export default router;




















