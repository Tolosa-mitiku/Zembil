import { Router } from "express";
import { getAllCategories, getCategoryBySlug } from "../controllers/category";

const router = Router();

// Public routes - no authentication required
// GET /categories - Get all categories
router.get("/", getAllCategories);

// GET /categories/:slug - Get category by slug
router.get("/:slug", getCategoryBySlug);

export default router;


















