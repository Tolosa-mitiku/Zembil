import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import { verifySellerEarningsAccess } from "../middlewares/verifyOwnership";
import {
  getMyEarnings,
  getEarningsByStatus,
  getEarningsSummary,
  getAllEarnings,
} from "../controllers/sellerEarnings";

const router = Router();

// ============= SELLER ROUTES (RLS Protected) =============
router.get(
  "/me",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  verifySellerEarningsAccess,
  getMyEarnings
);

router.get(
  "/me/status/:status",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  verifySellerEarningsAccess,
  getEarningsByStatus
);

router.get(
  "/me/summary",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  verifySellerEarningsAccess,
  getEarningsSummary
);

// ============= ADMIN ROUTES (No RLS - Full Access) =============
router.get(
  "/admin/all",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  getAllEarnings
);

export default router;

