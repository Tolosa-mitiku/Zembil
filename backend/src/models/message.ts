import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  chatRoomId: { type: String, required: true }, // Reference to chat
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["buyer", "seller", "admin"], required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: "User" },
  
  type: { type: String, enum: ["text", "image", "file", "system"], default: "text" },
  content: { type: String },
  
  // Attachments
  attachment: {
    type: { type: String, enum: ["image", "document", "video"] },
    url: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String },
  },
  
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  
  // System Messages
  isSystem: { type: Boolean, default: false },
  systemEventType: { type: String }, // 'order_created', 'order_shipped'
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // TTL: 90 days
}, {
  timestamps: true,
});

// Indexes
messageSchema.index({ chatRoomId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const Message = model("Message", messageSchema);

