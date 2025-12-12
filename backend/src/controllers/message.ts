/**
 * Message Controller
 * 🔒 RLS: Users can only access messages in their conversations
 */

import { Request, Response } from "express";
import { Message, Chat, User } from "../models";
import { CustomRequest } from "../types/express";
import { ErrorFactory } from "../utils/errorHandler";
import { Logger } from "../utils/logger";

/**
 * Get messages for a chat
 * 🔒 RLS: User must be participant in chat
 */
export const getChatMessages = async (req: CustomRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { page = "1", limit = "50" } = req.query;
    const user = await User.findOne({ uid: req.user?.uid });

    if (!user) {
      throw ErrorFactory.notFound("User");
    }

    // 🔒 RLS CHECK: Verify user is participant in chat
    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyerId: user._id }, { sellerId: user._id }],
    });

    if (!chat) {
      Logger.security("Unauthorized chat access attempt", {
        userId: user._id,
        chatId,
      });
      throw ErrorFactory.forbidden("Access denied: Not your conversation");
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    // Get messages for this chat
    const messages = await Message.find({ chatRoomId: chat.chatRoomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({ chatRoomId: chat.chatRoomId });

    // Mark messages as read
    await Message.updateMany(
      {
        chatRoomId: chat.chatRoomId,
        recipientId: user._id,
        isRead: false,
      },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return res.json({
      success: true,
      data: messages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    Logger.error("Error fetching messages", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/**
 * Send message
 * 🔒 RLS: User must be participant in chat
 */
export const sendMessage = async (req: CustomRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content, type = "text", attachment } = req.body;
    const user = await User.findOne({ uid: req.user?.uid });

    if (!user) {
      throw ErrorFactory.notFound("User");
    }

    // 🔒 RLS CHECK: Verify user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyerId: user._id }, { sellerId: user._id }],
    });

    if (!chat) {
      throw ErrorFactory.forbidden("Access denied: Not your conversation");
    }

    // Determine sender role
    const senderRole =
      chat.buyerId.toString() === user._id.toString() ? "buyer" : "seller";
    const recipientId =
      senderRole === "buyer" ? chat.sellerId : chat.buyerId;

    // Create message
    const message = await Message.create({
      chatRoomId: chat.chatRoomId,
      senderId: user._id,
      senderRole,
      recipientId,
      type,
      content,
      attachment,
    });

    // Update chat with last message
    chat.lastMessage = content;
    chat.lastMessageAt = new Date();

    if (senderRole === "buyer") {
      if (!chat.unreadMessagesCount) {
        chat.unreadMessagesCount = { buyer: 0, seller: 0 };
      }
      chat.unreadMessagesCount.seller =
        (chat.unreadMessagesCount.seller || 0) + 1;
    } else {
      if (!chat.unreadMessagesCount) {
        chat.unreadMessagesCount = { buyer: 0, seller: 0 };
      }
      chat.unreadMessagesCount.buyer =
        (chat.unreadMessagesCount.buyer || 0) + 1;
    }

    await chat.save();

    Logger.info("Message sent", {
      messageId: message._id,
      chatId,
      senderId: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    Logger.error("Error sending message", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

/**
 * Get user's chats
 * 🔒 RLS: User only sees chats they're part of
 */
export const getUserChats = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      throw ErrorFactory.notFound("User");
    }

    // 🔒 RLS FILTER: Only chats where user is participant
    const chats = await Chat.find({
      $or: [{ buyerId: user._id }, { sellerId: user._id }],
      isActive: true,
    })
      .populate("buyerId", "name image")
      .populate("sellerId", "businessName profileImage")
      .sort({ lastMessageAt: -1 });

    return res.json({
      success: true,
      data: chats,
    });
  } catch (error) {
    Logger.error("Error fetching chats", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

/**
 * Create or get chat between buyer and seller
 * 🔒 RLS: User can only create chat as participant
 */
export const createOrGetChat = async (req: CustomRequest, res: Response) => {
  try {
    const { sellerId } = req.body;
    const user = await User.findOne({ uid: req.user?.uid });

    if (!user) {
      throw ErrorFactory.notFound("User");
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      buyerId: user._id,
      sellerId,
    });

    if (chat) {
      return res.json({
        success: true,
        data: chat,
        exists: true,
      });
    }

    // Create new chat
    chat = await Chat.create({
      buyerId: user._id,
      sellerId,
      chatRoomId: `${user._id}_${sellerId}_${Date.now()}`,
      isActive: true,
    });

    Logger.info("Chat created", {
      chatId: chat._id,
      buyerId: user._id,
      sellerId,
    });

    return res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
      exists: false,
    });
  } catch (error) {
    Logger.error("Error creating chat", { error });
    return res.status(500).json({
      success: false,
      message: "Failed to create chat",
    });
  }
};

