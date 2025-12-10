import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import {
  createPayoutRequest,
  getSellerPayouts,
  getAvailableEarnings,
  approvePayout,
  rejectPayout,
  getAllPayoutRequests,
  cancelPayoutRequest,
} from "../controllers/payoutRequest";

const router = Router();

// Seller routes
router.post(
  "/request",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  createPayoutRequest
);

router.get(
  "/",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  getSellerPayouts
);

router.get(
  "/available",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  getAvailableEarnings
);

router.delete(
  "/:id/cancel",
  verifyFirebaseToken,
  authorizeRole(["seller"]),
  cancelPayoutRequest
);

// Admin routes
router.get(
  "/admin/all",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  getAllPayoutRequests
);

router.put(
  "/admin/:id/approve",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  approvePayout
);

router.put(
  "/admin/:id/reject",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  rejectPayout
);

export default router;

