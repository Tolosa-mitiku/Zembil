import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  searchProducts,
  getAutocompleteSuggestions,
} from "../controllers/product";

const router = Router();

// Search routes (must come before /:id route)
// GET /products/search - Search products
router.get("/search", searchProducts);

// GET /products/autocomplete - Get search suggestions
router.get("/autocomplete", getAutocompleteSuggestions);

// GET /products - Get all products (with optional filters)
router.get("/", getAllProducts);

// POST /products - Create product
router.post("/", createProduct);

// GET /products/:id - Get product details
router.get("/:id", getProductById);

// PUT /products/:id - Update product details
router.put("/:id", updateProduct);

// DELETE /products/:id - Delete a product
router.delete("/:id", deleteProduct);

export default router;
