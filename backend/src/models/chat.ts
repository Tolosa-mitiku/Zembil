import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  chatRoomId: { type: String, required: true, unique: true }, // Firebase chat room ID
  
  lastMessage: { type: String },
  lastMessageAt: { type: Date },
  
  unreadMessagesCount: {
    buyer: { type: Number, default: 0 },
    seller: { type: Number, default: 0 },
  },
  
  // Participant Status
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["buyer", "seller", "admin"] },
      isOnline: { type: Boolean, default: false },
      lastSeen: { type: Date },
      isTyping: { type: Boolean, default: false },
      typingStartedAt: { type: Date },
    }
  ],
  
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
chatSchema.index({ buyerId: 1, sellerId: 1 });
chatSchema.index({ chatRoomId: 1 }, { unique: true });
chatSchema.index({ isActive: 1 });

export const Chat = model("Chat", chatSchema);
