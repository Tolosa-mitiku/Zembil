import { Schema, model } from "mongoose";

const bulkOperationSchema = new Schema({
  type: {
    type: String,
    enum: ["import_products", "update_prices", "delete_users", "approve_sellers", "export_data"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "cancelled"],
    default: "pending",
  },
  
  initiatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  initiatedByRole: { type: String, enum: ["admin", "seller"] },
  
  // Progress Tracking
  progress: { type: Number, default: 0, min: 0, max: 100 },
  totalItems: { type: Number, default: 0 },
  processedItems: { type: Number, default: 0 },
  successfulItems: { type: Number, default: 0 },
  failedItems: { type: Number, default: 0 },
  
  // File Information
  fileUrl: { type: String }, // Input file URL
  resultFileUrl: { type: String }, // Output/result file URL
  fileName: { type: String },
  fileSize: { type: Number },
  
  // Error Tracking
  errors: [
    {
      item: { type: String }, // Item identifier that failed
      error: { type: String },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  
  // Timing
  estimatedCompletion: { type: Date },
  startedAt: { type: Date },
  completedAt: { type: Date },
  duration: { type: Number }, // Milliseconds
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
bulkOperationSchema.index({ initiatedBy: 1 });
bulkOperationSchema.index({ status: 1 });
bulkOperationSchema.index({ createdAt: -1 });
bulkOperationSchema.index({ status: 1, createdAt: -1 });

export const BulkOperation = model("BulkOperation", bulkOperationSchema);

