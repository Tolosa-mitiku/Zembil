/**
 * Socket.IO Service for Real-time Messaging
 * Handles WebSocket connections, authentication, and message events
 */

import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import admin from "firebase-admin";
import { User, Chat, Message } from "../models";
import { Logger } from "../utils/logger";

// Types
interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface MessageData {
  chatId: string;
  content: string;
  type?: "text" | "image" | "file";
  attachment?: {
    type: string;
    url: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

interface TypingData {
  chatId: string;
  isTyping: boolean;
}

// Store for online users: Map<userId, Set<socketId>>
const onlineUsers = new Map<string, Set<string>>();

// Socket.IO server instance
let io: Server;

/**
 * Initialize Socket.IO server
 */
export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ uid: decodedToken.uid });

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      
      next();
    } catch (error) {
      Logger.error("Socket authentication failed", { error });
      next(new Error("Authentication failed"));
    }
  });

  // Connection handler
  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    
    Logger.info("User connected to socket", { userId, socketId: socket.id });

    // Track online users
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    // Broadcast online status
    broadcastOnlineStatus(userId, true);

    // Join user's chat rooms
    joinUserChatRooms(socket, userId);

    // Handle joining a specific chat room
    socket.on("join_chat", async (chatId: string) => {
      try {
        // Verify user has access to this chat
        const chat = await Chat.findOne({
          _id: chatId,
          $or: [{ buyerId: userId }, { sellerId: userId }],
        });

        if (chat) {
          socket.join(`chat:${chatId}`);
          Logger.info("User joined chat room", { userId, chatId });
        }
      } catch (error) {
        Logger.error("Error joining chat", { error, userId, chatId });
      }
    });

    // Handle leaving a chat room
    socket.on("leave_chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      Logger.info("User left chat room", { userId, chatId });
    });

    // Handle new message
    socket.on("send_message", async (data: MessageData) => {
      try {
        const { chatId, content, type = "text", attachment } = data;

        // Verify user has access to this chat
        const chat = await Chat.findOne({
          _id: chatId,
          $or: [{ buyerId: userId }, { sellerId: userId }],
        });

        if (!chat) {
          socket.emit("error", { message: "Access denied to this chat" });
          return;
        }

        // Determine sender role and recipient
        const senderRole = chat.buyerId.toString() === userId ? "buyer" : "seller";
        const recipientId = senderRole === "buyer" ? chat.sellerId : chat.buyerId;

        // Create message in database
        const message = await Message.create({
          chatRoomId: chat.chatRoomId,
          senderId: userId,
          senderRole,
          recipientId,
          type,
          content,
          attachment,
        });

        // Update chat metadata
        chat.lastMessage = content;
        chat.lastMessageAt = new Date();
        
        // Initialize unreadMessagesCount if it doesn't exist
        if (!chat.unreadMessagesCount) {
          chat.unreadMessagesCount = { buyer: 0, seller: 0 };
        }
        
        if (senderRole === "buyer") {
          chat.unreadMessagesCount.seller = (chat.unreadMessagesCount.seller ?? 0) + 1;
        } else {
          chat.unreadMessagesCount.buyer = (chat.unreadMessagesCount.buyer ?? 0) + 1;
        }
        
        await chat.save();

        // Populate sender info for the response
        const populatedMessage = await Message.findById(message._id)
          .populate("senderId", "name image")
          .lean();

        // Emit to all users in the chat room
        io.to(`chat:${chatId}`).emit("new_message", {
          chatId,
          message: populatedMessage,
        });

        // Emit updated chat to both participants for conversation list updates
        const updatedChat = await Chat.findById(chatId)
          .populate("buyerId", "name image")
          .populate("sellerId", "businessName profileImage")
          .lean();

        io.to(`user:${chat.buyerId}`).emit("chat_updated", updatedChat);
        io.to(`user:${chat.sellerId}`).emit("chat_updated", updatedChat);

        Logger.info("Message sent via socket", { messageId: message._id, chatId });
      } catch (error) {
        Logger.error("Error sending message via socket", { error });
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", async (data: TypingData) => {
      try {
        const { chatId, isTyping } = data;

        // Verify access
        const chat = await Chat.findOne({
          _id: chatId,
          $or: [{ buyerId: userId }, { sellerId: userId }],
        });

        if (!chat) return;

        // Broadcast typing status to other users in chat
        socket.to(`chat:${chatId}`).emit("user_typing", {
          chatId,
          userId,
          isTyping,
        });

        // Update typing status in chat participants
        const participantIndex = chat.participants?.findIndex(
          (p: any) => p.userId?.toString() === userId
        );

        if (participantIndex !== undefined && participantIndex >= 0 && chat.participants) {
          chat.participants[participantIndex].isTyping = isTyping;
          chat.participants[participantIndex].typingStartedAt = isTyping ? new Date() : undefined;
          await chat.save();
        }
      } catch (error) {
        Logger.error("Error handling typing indicator", { error });
      }
    });

    // Handle message read
    socket.on("mark_read", async (chatId: string) => {
      try {
        const chat = await Chat.findOne({
          _id: chatId,
          $or: [{ buyerId: userId }, { sellerId: userId }],
        });

        if (!chat) return;

        // Mark messages as read
        await Message.updateMany(
          {
            chatRoomId: chat.chatRoomId,
            recipientId: userId,
            isRead: false,
          },
          { $set: { isRead: true, readAt: new Date() } }
        );

        // Reset unread count for this user
        const userRole = chat.buyerId.toString() === userId ? "buyer" : "seller";
        
        // Initialize unreadMessagesCount if it doesn't exist
        if (!chat.unreadMessagesCount) {
          chat.unreadMessagesCount = { buyer: 0, seller: 0 };
        }
        
        if (userRole === "buyer") {
          chat.unreadMessagesCount.buyer = 0;
        } else {
          chat.unreadMessagesCount.seller = 0;
        }
        await chat.save();

        // Notify sender that messages were read
        const otherUserId = userRole === "buyer" ? chat.sellerId : chat.buyerId;
        io.to(`user:${otherUserId}`).emit("messages_read", {
          chatId,
          readBy: userId,
        });

        Logger.info("Messages marked as read", { chatId, userId });
      } catch (error) {
        Logger.error("Error marking messages as read", { error });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const userSockets = onlineUsers.get(userId);
      
      if (userSockets) {
        userSockets.delete(socket.id);
        
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          broadcastOnlineStatus(userId, false);
        }
      }

      Logger.info("User disconnected from socket", { userId, socketId: socket.id });
    });
  });

  return io;
};

/**
 * Join user to all their chat rooms on connection
 */
async function joinUserChatRooms(socket: AuthenticatedSocket, userId: string) {
  try {
    const chats = await Chat.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
      isActive: true,
    });

    // Join user-specific room for direct notifications
    socket.join(`user:${userId}`);

    // Join all chat rooms
    for (const chat of chats) {
      socket.join(`chat:${chat._id}`);
    }

    Logger.info("User joined chat rooms", { userId, chatCount: chats.length });
  } catch (error) {
    Logger.error("Error joining chat rooms", { error, userId });
  }
}

/**
 * Broadcast user online/offline status
 */
async function broadcastOnlineStatus(userId: string, isOnline: boolean) {
  try {
    // Update user's online status in their chats
    await Chat.updateMany(
      {
        $or: [{ buyerId: userId }, { sellerId: userId }],
        isActive: true,
      },
      {
        $set: {
          "participants.$[elem].isOnline": isOnline,
          "participants.$[elem].lastSeen": isOnline ? undefined : new Date(),
        },
      },
      {
        arrayFilters: [{ "elem.userId": userId }],
      }
    );

    // Get user's chats to notify other participants
    const chats = await Chat.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
      isActive: true,
    });

    for (const chat of chats) {
      const otherUserId = chat.buyerId.toString() === userId 
        ? chat.sellerId.toString() 
        : chat.buyerId.toString();

      io.to(`user:${otherUserId}`).emit("user_status", {
        userId,
        isOnline,
        lastSeen: isOnline ? null : new Date(),
      });
    }
  } catch (error) {
    Logger.error("Error broadcasting online status", { error, userId });
  }
}

/**
 * Check if a user is online
 */
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId) && onlineUsers.get(userId)!.size > 0;
};

/**
 * Get the Socket.IO server instance
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

/**
 * Emit event to a specific user
 */
export const emitToUser = (userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit event to a chat room
 */
export const emitToChat = (chatId: string, event: string, data: any) => {
  io.to(`chat:${chatId}`).emit(event, data);
};

export default {
  initializeSocket,
  getIO,
  isUserOnline,
  emitToUser,
  emitToChat,
};

