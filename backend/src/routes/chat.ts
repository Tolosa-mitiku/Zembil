import { Router } from "express";
import {
  getChatHistory,
  getUnreadMessagesCount,
  sendMessage,
  startNewChat,
} from "../controllers/chat";

const router = Router();

// POST /chats - Start a new chat session between a buyer and seller
router.post("/", startNewChat);

// GET /chats/:chatRoomId - Get chat history by chat room ID
router.get("/:chatRoomId", getChatHistory);

// POST /chats/:chatRoomId/messages - Send a new message in the chat
router.post("/:chatRoomId/messages", sendMessage);

// GET /chats/:buyerId/unread - Get unread message count for buyer
router.get("/:buyerId/unread", getUnreadMessagesCount);

export default router;
