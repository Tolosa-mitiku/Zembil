import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import {
  requestRefund,
  getRefundStatus,
  approveRefund,
  rejectRefund,
  getAllRefunds,
} from "../controllers/refund";

const router = Router();

// Buyer routes
router.post(
  "/request",
  verifyFirebaseToken,
  authorizeRole(["buyer"]),
  requestRefund
);

router.get(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["buyer"]),
  getRefundStatus
);

// Admin routes
router.get(
  "/admin/all",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  getAllRefunds
);

router.put(
  "/admin/:id/approve",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  approveRefund
);

router.put(
  "/admin/:id/reject",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  rejectRefund
);

export default router;

