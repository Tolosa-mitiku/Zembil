import { Schema, model } from "mongoose";

const auditLogSchema = new Schema({
  action: { type: String, required: true }, // 'UPDATE_USER_ROLE', 'DELETE_PRODUCT', etc.
  adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  adminName: { type: String },
  
  targetType: { type: String, required: true }, // 'user', 'product', 'order', 'seller'
  targetId: { type: Schema.Types.ObjectId, required: true },
  
  details: { type: String },
  changes: { type: Map, of: Schema.Types.Mixed }, // Before/after values
  
  ipAddress: { type: String },
  userAgent: { type: String },
  location: {
    country: { type: String },
    city: { type: String },
  },
  
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["success", "failure"], default: "success" },
  errorMessage: { type: String },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
}, {
  timestamps: false,
});

// Indexes
auditLogSchema.index({ adminId: 1 });
auditLogSchema.index({ targetType: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ adminId: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

export const AuditLog = model("AuditLog", auditLogSchema);

