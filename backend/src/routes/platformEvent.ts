import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getPlatformEvents,
} from "../controllers/platformEvent";

const router = Router();

// Public route - platform-wide events
router.get("/platform", getPlatformEvents);

// Protected routes - seller and admin
router.post(
  "/",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  createEvent
);

router.get(
  "/",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  getEvents
);

router.put(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  updateEvent
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  authorizeRole(["seller", "admin"]),
  deleteEvent
);

export default router;

