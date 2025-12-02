import { Schema, model } from "mongoose";

const systemHealthSchema = new Schema({
  timestamp: { type: Date, default: Date.now, required: true },
  
  // System Status
  status: { type: String, enum: ["healthy", "degraded", "down"], default: "healthy" },
  
  // Performance Metrics
  cpuUsage: { type: Number }, // Percentage
  memoryUsage: { type: Number }, // Percentage
  memoryTotal: { type: Number }, // MB
  memoryUsed: { type: Number }, // MB
  diskUsage: { type: Number }, // Percentage
  
  // Database Metrics
  database: {
    status: { type: String, default: "connected" },
    connections: { type: Number },
    activeConnections: { type: Number },
    slowQueries: { type: Number },
    averageResponseTime: { type: Number }, // Milliseconds
  },
  
  // Application Metrics
  application: {
    uptime: { type: Number }, // Seconds
    requestsPerSecond: { type: Number },
    averageResponseTime: { type: Number }, // Milliseconds
    errorRate: { type: Number }, // Percentage
    activeUsers: { type: Number },
  },
  
  // Backup Information
  lastBackup: { type: Date },
  nextBackupScheduled: { type: Date },
  backupStatus: { type: String, enum: ["success", "failed", "in_progress"] },
  
  // Version Information
  version: { type: String },
  environment: { type: String, enum: ["production", "staging", "development"], default: "production" },
  
  // Alerts
  alerts: [
    {
      severity: { type: String, enum: ["critical", "warning", "info"] },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false },
    }
  ],
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
}, {
  timestamps: false,
});

// TTL Index - Auto-delete after 30 days
systemHealthSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });
systemHealthSchema.index({ status: 1 });

export const SystemHealth = model("SystemHealth", systemHealthSchema);

