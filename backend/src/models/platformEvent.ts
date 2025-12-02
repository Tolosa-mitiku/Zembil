import { Schema, model } from "mongoose";

const platformEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // null for platform-wide events
  userRole: { type: String, enum: ["admin", "seller"] },
  
  // Event Details
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["platform", "promotion", "holiday", "maintenance", "order", "meeting", "reminder", "personal"],
  },
  category: { type: String, enum: ["order", "meeting", "promotion", "reminder", "personal"] },
  
  // Timing
  startDate: { type: Date },
  endDate: { type: Date },
  startTime: { type: String }, // '09:00'
  endTime: { type: String }, // '17:00'
  allDay: { type: Boolean, default: false },
  timezone: { type: String },
  
  // Location
  location: { type: String },
  isVirtual: { type: Boolean, default: false },
  meetingLink: { type: String },
  
  // Visual
  color: { type: String, default: "#10B981" }, // Hex code for calendar display
  icon: { type: String },
  
  // Status
  status: { type: String, enum: ["scheduled", "active", "completed", "cancelled"], default: "scheduled" },
  completed: { type: Boolean, default: false },
  
  // Recurrence (Future feature)
  recurrence: {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
    interval: { type: Number },
    endDate: { type: Date },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0-6 for Sunday-Saturday
  },
  
  // Reminders
  reminders: [
    {
      type: { type: String, enum: ["email", "push", "sms"] },
      minutesBefore: { type: Number },
      sent: { type: Boolean, default: false },
    }
  ],
  
  // Scope
  scope: { type: String, enum: ["platform", "seller", "buyer"], default: "seller" },
  isPlatformWide: { type: Boolean, default: false },
  affectedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes
platformEventSchema.index({ userId: 1 });
platformEventSchema.index({ startDate: 1 });
platformEventSchema.index({ type: 1 });
platformEventSchema.index({ isPlatformWide: 1 });
platformEventSchema.index({ userId: 1, startDate: 1 });

export const PlatformEvent = model("PlatformEvent", platformEventSchema);

