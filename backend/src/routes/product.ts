import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  updateProduct,
} from "../controllers/product";

const router = Router();

router.get("/featured", getFeaturedProducts);
// POST /products - Create a new product (Seller adds it)
router.post("/", createProduct);

// GET /products/:id - Get product details
router.get("/:id", getProductById);

// PUT /products/:id - Update product details
router.put("/:id", updateProduct);

// DELETE /products/:id - Delete a product
router.delete("/:id", deleteProduct);

// GET /products - Get all products (with optional filters like category, deals, etc.)
router.get("/", getAllProducts);

export default router;
