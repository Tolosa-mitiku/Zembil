import { Router } from "express";
import {
  createBuyer,
  getBuyerProfile,
  getMyBuyerProfile,
  updateBuyerProfile,
  uploadProfilePicture,
  uploadCoverImage,
  addDeliveryAddress,
  deleteBuyer,
} from "../controllers/buyer";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import { verifyBuyerOwnership } from "../middlewares/verifyOwnership";
import { validateObjectIdMiddleware } from "../utils/validation";
import { upload } from "../middlewares/upload";

const router = Router();

// ============= PUBLIC/ADMIN ROUTES =============

// POST /buyers - Create buyer (authenticated users)
router.post("/", verifyFirebaseToken, createBuyer);

// ============= PROTECTED ROUTES (RLS Enforced) =============

// GET /buyers/me - Get current user's buyer profile (RLS: always own profile)
router.get("/me", verifyFirebaseToken, getMyBuyerProfile);

// GET /buyers/:id - Get buyer profile (RLS: own profile or admin)
router.get(
  "/:id",
  verifyFirebaseToken,
  validateObjectIdMiddleware("id"),
  getBuyerProfile  // RLS check inside controller
);

// PUT /buyers/:id - Update buyer profile (RLS: ownership verified)
router.put(
  "/:id",
  verifyFirebaseToken,
  validateObjectIdMiddleware("id"),
  verifyBuyerOwnership,  // 🔒 RLS MIDDLEWARE
  updateBuyerProfile
);

// PUT /buyers/:id/profile-picture - Upload profile picture (RLS: ownership verified)
router.put(
  "/:id/profile-picture",
  verifyFirebaseToken,
  authorizeRole(["buyer"]),
  validateObjectIdMiddleware("id"),
  upload.single("image"),
  uploadProfilePicture  // RLS check inside controller
);

// PUT /buyers/:id/cover-image - Upload cover image (RLS: ownership verified)
router.put(
  "/:id/cover-image",
  verifyFirebaseToken,
  authorizeRole(["buyer"]),
  validateObjectIdMiddleware("id"),
  upload.single("image"),
  uploadCoverImage  // RLS check inside controller
);

// POST /buyers/:id/addresses - Add delivery address (DEPRECATED - use /addresses endpoint)
router.post(
  "/:id/addresses",
  verifyFirebaseToken,
  validateObjectIdMiddleware("id"),
  verifyBuyerOwnership,  // 🔒 RLS MIDDLEWARE
  addDeliveryAddress
);

// DELETE /buyers/:id - Delete buyer (RLS: own account or admin)
router.delete(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["buyer", "admin"]),
  validateObjectIdMiddleware("id"),
  verifyBuyerOwnership,  // 🔒 RLS MIDDLEWARE
  deleteBuyer
);

export default router;
