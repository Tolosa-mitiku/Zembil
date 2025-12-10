import { Schema, model } from "mongoose";

const reportConfigSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["sales", "users", "inventory", "financial", "analytics", "custom"],
    required: true,
  },
  
  // Output Format
  format: { type: String, enum: ["pdf", "csv", "excel", "json"], default: "pdf" },
  
  // Scheduling
  schedule: {
    type: String,
    enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "manual"],
    default: "manual",
  },
  scheduledTime: { type: String, default: "00:00" }, // Time of day to run
  dayOfWeek: { type: Number, min: 0, max: 6 }, // 0-6 for weekly reports
  dayOfMonth: { type: Number, min: 1, max: 31 }, // 1-31 for monthly reports
  
  // Recipients
  recipients: [
    {
      email: { type: String, required: true },
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String },
    }
  ],
  
  // Filters/Parameters
  parameters: {
    dateRange: { type: String, default: "last_30_days" },
    startDate: { type: Date },
    endDate: { type: Date },
    includeCharts: { type: Boolean, default: true },
    metrics: [{ type: String }],
    groupBy: { type: String, enum: ["day", "week", "month"] },
  },
  
  // Execution Tracking
  lastRun: { type: Date },
  lastRunStatus: { type: String, enum: ["success", "failed", "partial"] },
  lastRunDuration: { type: Number }, // Milliseconds
  lastRunFileUrl: { type: String },
  nextRun: { type: Date },
  
  executionHistory: [
    {
      runDate: { type: Date },
      status: { type: String },
      fileUrl: { type: String },
      rowCount: { type: Number },
      errorMessage: { type: String },
    }
  ],
  
  // Access Control
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPublic: { type: Boolean, default: false },
  allowedRoles: [{ type: String, enum: ["admin", "seller"] }],
  isActive: { type: Boolean, default: true },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
reportConfigSchema.index({ createdBy: 1 });
reportConfigSchema.index({ type: 1 });
reportConfigSchema.index({ schedule: 1 });
reportConfigSchema.index({ nextRun: 1 });
reportConfigSchema.index({ isActive: 1 });

export const ReportConfig = model("ReportConfig", reportConfigSchema);

