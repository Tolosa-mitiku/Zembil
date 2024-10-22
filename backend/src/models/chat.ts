import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  chatRoomId: { type: String, required: true }, // Firebase chat room ID
  lastMessage: { type: String },
  unreadMessagesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Chat = model("Chat", chatSchema);
