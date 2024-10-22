import { Router } from "express";
import {
  addProduct,
  createSeller,
  deleteSeller,
  getSellerProducts,
  getSellerProfile,
  updateSellerProfile,
} from "../controllers/seller";

const router = Router();

// POST /sellers - Create a new seller (Individual or Store)
router.post("/", createSeller);

// GET /sellers/:id - Get seller profile
router.get("/:id", getSellerProfile);

// PUT /sellers/:id - Update seller profile
router.put("/:id", updateSellerProfile);

// POST /sellers/:id/products - Add a new product by seller
router.post("/:id/products", addProduct);

// GET /sellers/:id/products - Get all products by seller
router.get("/:id/products", getSellerProducts);

// DELETE /sellers/:id - Delete seller account
router.delete("/:id", deleteSeller);

export default router;
