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
import { upload } from "../middlewares/upload";

const router = Router();

// POST /sellers - Create a new seller (Individual or Store)
router.post("/", createSeller);

// GET /sellers/me - Get current logged-in seller profile
router.get("/me", verifyFirebaseToken, getCurrentSeller);

// PUT /sellers/:id/info - Update seller profile info
router.put("/:id/info", verifyFirebaseToken, updateSellerInfo);

// PUT /sellers/:id/profile-picture - Upload profile picture
router.put(
  "/:id/profile-picture",
  verifyFirebaseToken,
  upload.single("image"),
  uploadProfilePicture
);

// PUT /sellers/:id/cover-image - Upload cover image
router.put(
  "/:id/cover-image",
  verifyFirebaseToken,
  upload.single("image"),
  uploadCoverImage
);

// PUT /sellers/:id/type - Update seller type
router.put("/:id/type", verifyFirebaseToken, updateSellerType);

// GET /sellers/:id - Get seller profile
router.get("/:id", getSellerProfile);

// PUT /sellers/:id - Update seller profile (Legacy/Admin)
router.put("/:id", updateSellerProfile);

// POST /sellers/:id/products - Add a new product by seller
router.post("/:id/products", addProduct);

// GET /sellers/:id/products - Get all products by seller
router.get("/:id/products", getSellerProducts);

// DELETE /sellers/:id - Delete seller account
router.delete("/:id", deleteSeller);

export default router;
