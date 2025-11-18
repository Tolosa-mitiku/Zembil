import { Router } from "express";
import {
  getSellerDashboard,
  getSellerAnalytics,
  getSellerRevenue,
} from "../controllers/sellerDashboard";
import {
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  updateProductStock,
  bulkUploadProducts,
} from "../controllers/sellerProduct";
import {
  getSellerOrders,
  getSellerOrderById,
  updateOrderStatus,
  shipOrder,
  deliverOrder,
} from "../controllers/sellerOrder";
import {
  getEarningsSummary,
  getEarningsDetails,
  getPayoutHistory,
  requestPayout,
  getTransactionHistory,
} from "../controllers/sellerFinance";
import { getStoreSettings, updateStoreSettings } from "../controllers/seller";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";

const router = Router();

// All seller dashboard routes require authentication and seller role
router.use(verifyFirebaseToken);
router.use(authorizeRole(["seller", "admin"]));

// Dashboard & Analytics
router.get("/dashboard", getSellerDashboard);
router.get("/analytics", getSellerAnalytics);
router.get("/revenue", getSellerRevenue);

// Product Management
router.get("/products", getSellerProducts);
router.post("/products", createSellerProduct);
router.post("/products/bulk", bulkUploadProducts);
router.put("/products/:id", updateSellerProduct);
router.put("/products/:id/stock", updateProductStock);
router.delete("/products/:id", deleteSellerProduct);

// Order Management
router.get("/orders", getSellerOrders);
router.get("/orders/:id", getSellerOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/ship", shipOrder);
router.put("/orders/:id/deliver", deliverOrder);

// Financial Management
router.get("/earnings", getEarningsSummary);
router.get("/earnings/details", getEarningsDetails);
router.get("/payouts", getPayoutHistory);
router.post("/payouts/request", requestPayout);
router.get("/transactions", getTransactionHistory);

// Store Settings
router.get("/settings", async (req, res, next) => {
  // Get seller ID from user and pass to controller
  // This is a workaround - in production you'd want cleaner handling
  req.params.id = req.body.sellerId || "";
  return getStoreSettings(req, res);
});
router.put("/settings", async (req, res, next) => {
  req.params.id = req.body.sellerId || "";
  return updateStoreSettings(req, res);
});

export default router;








