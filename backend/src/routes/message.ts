import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { verifyMessageAccess } from "../middlewares/verifyOwnership";
import { validateObjectIdMiddleware } from "../utils/validation";
import {
  getChatMessages,
  sendMessage,
  getUserChats,
  createOrGetChat,
} from "../controllers/message";

const router = Router();

// ============= ALL ROUTES REQUIRE AUTHENTICATION =============
router.use(verifyFirebaseToken);

// GET /messages/chats - Get user's chats (RLS: only user's chats)
router.get("/chats", getUserChats);

// POST /messages/chats - Create or get chat (RLS: user is participant)
router.post("/chats", createOrGetChat);

// GET /messages/chats/:chatId - Get messages (RLS: must be participant)
router.get(
  "/chats/:chatId",
  validateObjectIdMiddleware("chatId"),
  verifyMessageAccess,  // 🔒 RLS MIDDLEWARE
  getChatMessages
);

// POST /messages/chats/:chatId - Send message (RLS: must be participant)
router.post(
  "/chats/:chatId",
  validateObjectIdMiddleware("chatId"),
  verifyMessageAccess,  // 🔒 RLS MIDDLEWARE
  sendMessage
);

export default router;

