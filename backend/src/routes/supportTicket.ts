import express from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  addResponse,
  updateTicketStatus,
  addSatisfactionRating,
  getSupportTicketStats,
} from "../controllers/supportTicket";

const router = express.Router();

// Public routes (require authentication)
router.post("/", verifyFirebaseToken, createSupportTicket);
router.get("/", verifyFirebaseToken, getSupportTickets);
router.get("/stats", verifyFirebaseToken, getSupportTicketStats);
router.get("/:id", verifyFirebaseToken, getSupportTicketById);
router.post("/:id/response", verifyFirebaseToken, addResponse);
router.post("/:id/rating", verifyFirebaseToken, addSatisfactionRating);

// Admin routes
router.patch("/:id/status", verifyFirebaseToken, updateTicketStatus);

export default router;

















