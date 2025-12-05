import express from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import {
  createFeatureRequest,
  getFeatureRequests,
  getFeatureRequestById,
  voteFeatureRequest,
  addComment,
  updateFeatureRequestStatus,
  getFeatureRequestStats,
} from "../controllers/featureRequest";

const router = express.Router();

// Public routes (require authentication)
router.post("/", verifyFirebaseToken, createFeatureRequest);
router.get("/", getFeatureRequests); // Public to view
router.get("/stats", verifyFirebaseToken, getFeatureRequestStats);
router.get("/:id", getFeatureRequestById); // Public to view
router.post("/:id/vote", verifyFirebaseToken, voteFeatureRequest);
router.post("/:id/comment", verifyFirebaseToken, addComment);

// Admin routes
router.patch("/:id/status", verifyFirebaseToken, updateFeatureRequestStatus);

export default router;





