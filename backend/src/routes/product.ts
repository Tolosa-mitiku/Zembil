import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  searchProducts,
  getFeaturedProducts,
  getProductsByCategory,
} from "../controllers/product";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import { verifyProductOwnership } from "../middlewares/verifyOwnership";
import { validateBody, validateQuery, validateParams, commonSchemas } from "../middlewares/validate";
import { validateObjectIdMiddleware } from "../utils/validation";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validations/product.validation";

const router = Router();

// ============= PUBLIC ROUTES (No Auth Required) =============

// GET /products/search - Search products
router.get("/search", searchProducts);

// GET /products/featured - Get featured products
router.get("/featured", getFeaturedProducts);

// GET /products/category/:category - Get products by category
router.get("/category/:category", getProductsByCategory);

// GET /products - Get all products (with filters)
router.get("/", validateQuery(productQuerySchema), getAllProducts);

// GET /products/:id - Get product details (tracks views)
router.get("/:id", validateObjectIdMiddleware("id"), getProductById);

// ============= PROTECTED ROUTES (Auth Required) =============

// POST /products - Create product (Seller only)
router.post(
  "/",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  validateBody(createProductSchema),
  createProduct
);

// PUT /products/:id - Update product (Seller/Admin only, with ownership check)
router.put(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  validateObjectIdMiddleware("id"),
  verifyProductOwnership,
  validateBody(updateProductSchema),
  updateProduct
);

// DELETE /products/:id - Delete product (Seller/Admin only, with ownership check)
router.delete(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  validateObjectIdMiddleware("id"),
  verifyProductOwnership,
  deleteProduct
);

export default router;
