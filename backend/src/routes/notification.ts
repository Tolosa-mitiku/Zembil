import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notification";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// All notification routes require authentication
router.use(verifyFirebaseToken);

// GET /notifications - Get user notifications
router.get("/", getNotifications);

// GET /notifications/unread-count - Get unread count
router.get("/unread-count", getUnreadCount);

// PUT /notifications/:id/read - Mark notification as read
router.put("/:id/read", markAsRead);

// PUT /notifications/read-all - Mark all notifications as read
router.put("/read-all", markAllAsRead);

// DELETE /notifications/:id - Delete notification
router.delete("/:id", deleteNotification);

export default router;
















