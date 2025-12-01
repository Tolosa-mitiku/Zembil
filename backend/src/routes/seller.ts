import { Router } from "express";
import {
  addProduct,
  createSeller,
  deleteSeller,
  getCurrentSeller,
  getSellerProducts,
  getSellerProfile,
  updateSellerInfo,
  updateSellerProfile,
  updateSellerType,
  uploadCoverImage,
  uploadProfilePicture,
} from "../controllers/seller";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import { verifySellerOwnership } from "../middlewares/verifyOwnership";
import { validateObjectIdMiddleware } from "../utils/validation";
import { upload } from "../middlewares/upload";

const router = Router();

// ============= PUBLIC ROUTES =============

// GET /sellers/:id - Get seller profile (Public)
router.get("/:id", validateObjectIdMiddleware("id"), getSellerProfile);

// GET /sellers/:id/products - Get seller's products (Public)
router.get("/:id/products", validateObjectIdMiddleware("id"), getSellerProducts);

// ============= PROTECTED ROUTES (RLS Enforced) =============

// POST /sellers - Create a new seller
router.post("/", verifyFirebaseToken, createSeller);

// GET /sellers/me - Get current logged-in seller profile (RLS: always own profile)
router.get("/me", verifyFirebaseToken, getCurrentSeller);

// PUT /sellers/:id/info - Update seller info (RLS: ownership verified)
router.put(
  "/:id/info",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  validateObjectIdMiddleware("id"),
  verifySellerOwnership,  // 🔒 RLS MIDDLEWARE
  updateSellerInfo
);

// PUT /sellers/:id/profile-picture - Upload profile picture (RLS: ownership verified)
router.put(
  "/:id/profile-picture",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  validateObjectIdMiddleware("id"),
  verifySellerOwnership,  // 🔒 RLS MIDDLEWARE
  upload.single("image"),
  uploadProfilePicture
);

// PUT /sellers/:id/cover-image - Upload cover image (RLS: ownership verified)
router.put(
  "/:id/cover-image",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  validateObjectIdMiddleware("id"),
  verifySellerOwnership,  // 🔒 RLS MIDDLEWARE
  upload.single("image"),
  uploadCoverImage
);

// PUT /sellers/:id/type - Update seller type (RLS: ownership verified)
router.put(
  "/:id/type",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  validateObjectIdMiddleware("id"),
  verifySellerOwnership,  // 🔒 RLS MIDDLEWARE
  updateSellerType
);

// PUT /sellers/:id - Update seller profile (Admin or owner)
router.put(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  validateObjectIdMiddleware("id"),
  verifySellerOwnership,  // 🔒 RLS MIDDLEWARE
  updateSellerProfile
);

// POST /sellers/:id/products - Add product (RLS: ownership verified)
router.post(
  "/:id/products",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  validateObjectIdMiddleware("id"),
  verifySellerOwnership,  // 🔒 RLS MIDDLEWARE
  addProduct
);

// DELETE /sellers/:id - Delete seller (RLS: ownership verified)
router.delete(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  validateObjectIdMiddleware("id"),
  verifySellerOwnership,  // 🔒 RLS MIDDLEWARE
  deleteSeller
);

export default router;
