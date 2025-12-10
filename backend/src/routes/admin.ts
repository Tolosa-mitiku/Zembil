import { Router } from "express";
import { authorizeRole } from "../middlewares/authorizeRole";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

// User Management
import {
  getAllUsers,
  getUserDetails,
  getUserStats,
  updateUserRole,
  updateUserStatus,
} from "../controllers/adminUser";

// Seller Management
import {
  getAllSellers,
  getPendingVerifications,
  getSellerDetails,
  getSellerStats,
  rejectSeller,
  suspendSeller,
  verifySeller,
} from "../controllers/adminSeller";

// Product Management
import {
  deleteProduct as adminDeleteProduct,
  getAllProducts as adminGetAllProducts,
  approveProduct,
  featureProduct,
  rejectProduct,
} from "../controllers/adminProduct";

// Order Management
import {
  getAllOrders as adminGetAllOrders,
  getOrderDetails as adminGetOrderDetails,
  getOrderStats,
  processRefund,
} from "../controllers/adminOrder";

// Analytics
import {
  getDashboardOverview,
  getRevenueAnalytics,
  getSalesAnalytics,
  getUserAnalytics,
} from "../controllers/adminAnalytics";

// Category Management
import {
  getAllCategories as adminGetAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/adminCategory";

// Banner Management
import {
  getAllBanners as adminGetAllBanners,
  createBanner,
  deleteBanner,
  toggleBannerStatus,
  updateBanner,
} from "../controllers/adminBanner";

// Audit Logs
import { getAuditLogs, getAuditStats } from "../controllers/auditLog";

// System Management
import { getHealthHistory, getSystemHealth } from "../controllers/systemHealth";

import {
  getSystemConfig,
  toggleMaintenanceMode,
  updateSystemConfig,
} from "../controllers/systemConfig";

// Payout Management (Admin functions)
import {
  approvePayout as adminApprovePayout,
  rejectPayout as adminRejectPayout,
  getAllPayoutRequests,
} from "../controllers/payoutRequest";

// Refund Management (Admin functions)
import {
  approveRefund as adminApproveRefund,
  rejectRefund as adminRejectRefund,
  getAllRefunds,
} from "../controllers/refund";

// Session Management (Admin functions)
import { getAllActiveSessions } from "../controllers/userSession";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyFirebaseToken);
router.use(authorizeRole(["admin"]));

// ============= USER MANAGEMENT =============
router.get("/users", getAllUsers);
router.get("/users/stats", getUserStats);
router.get("/users/:id", getUserDetails);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/status", updateUserStatus);

// ============= SELLER MANAGEMENT =============
router.get("/sellers", getAllSellers);
router.get("/sellers/stats", getSellerStats);
router.get("/sellers/pending", getPendingVerifications);
router.get("/sellers/:id", getSellerDetails);
router.put("/sellers/:id/verify", verifySeller);
router.put("/sellers/:id/reject", rejectSeller);
router.put("/sellers/:id/suspend", suspendSeller);

// ============= PRODUCT MANAGEMENT =============
router.get("/products", adminGetAllProducts);
router.put("/products/:id/feature", featureProduct);
router.put("/products/:id/approve", approveProduct);
router.put("/products/:id/reject", rejectProduct);
router.delete("/products/:id", adminDeleteProduct);

// ============= ORDER MANAGEMENT =============
router.get("/orders", adminGetAllOrders);
router.get("/orders/stats", getOrderStats);
router.get("/orders/:id", adminGetOrderDetails);
router.put("/orders/:id/refund", processRefund);

// ============= ANALYTICS =============
router.get("/dashboard", getDashboardOverview);
router.get("/analytics/revenue", getRevenueAnalytics);
router.get("/analytics/sales", getSalesAnalytics);
router.get("/analytics/users", getUserAnalytics);

// ============= CATEGORY MANAGEMENT =============
router.get("/categories", adminGetAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// ============= BANNER MANAGEMENT =============
router.get("/banners", adminGetAllBanners);
router.post("/banners", createBanner);
router.put("/banners/:id", updateBanner);
router.put("/banners/:id/toggle", toggleBannerStatus);
router.delete("/banners/:id", deleteBanner);

// ============= AUDIT LOGS =============
router.get("/audit", getAuditLogs);
router.get("/audit/stats", getAuditStats);

// ============= SYSTEM HEALTH =============
router.get("/system/health", getSystemHealth);
router.get("/system/health/history", getHealthHistory);

// ============= SYSTEM CONFIGURATION =============
router.get("/system/config", getSystemConfig);
router.put("/system/config", updateSystemConfig);
router.post("/system/maintenance", toggleMaintenanceMode);

// ============= PAYOUT MANAGEMENT =============
router.get("/payouts", getAllPayoutRequests);
router.put("/payouts/:id/approve", adminApprovePayout);
router.put("/payouts/:id/reject", adminRejectPayout);

// ============= REFUND MANAGEMENT =============
router.get("/refunds", getAllRefunds);
router.put("/refunds/:id/approve", adminApproveRefund);
router.put("/refunds/:id/reject", adminRejectRefund);

// ============= SESSION MANAGEMENT =============
router.get("/sessions/all", getAllActiveSessions);

export default router;
