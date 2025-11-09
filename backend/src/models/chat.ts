import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Fixed: ref to User
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Fixed: ref to User
  chatRoomId: { type: String, required: true, unique: true }, // Firebase chat room ID
  lastMessage: { type: String },
  lastMessageAt: { type: Date },
  unreadMessagesCount: {
    buyer: { type: Number, default: 0 },
    seller: { type: Number, default: 0 },
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
chatSchema.index({ buyerId: 1, sellerId: 1 });
chatSchema.index({ chatRoomId: 1 });

export const Chat = model("Chat", chatSchema);
