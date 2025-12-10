import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import {
  getActiveSessions,
  logoutSession,
  logoutAllDevices,
  markDeviceAsTrusted,
  getAllActiveSessions,
} from "../controllers/userSession";

const router = Router();

// User routes
router.get(
  "/",
  verifyFirebaseToken,
  getActiveSessions
);

router.post(
  "/logout",
  verifyFirebaseToken,
  logoutSession
);

router.post(
  "/logout-all",
  verifyFirebaseToken,
  logoutAllDevices
);

router.post(
  "/trust-device",
  verifyFirebaseToken,
  markDeviceAsTrusted
);

// Admin routes
router.get(
  "/admin/all",
  verifyFirebaseToken,
  authorizeRole(["admin"]),
  getAllActiveSessions
);

export default router;

