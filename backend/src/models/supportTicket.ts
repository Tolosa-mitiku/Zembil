import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISupportTicket extends Document {
  userId: Types.ObjectId;
  ticketNumber: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: "general" | "technical" | "billing" | "product" | "shipping" | "returns" | "account" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "waiting-response" | "resolved" | "closed";
  tags: string[];
  attachments: Array<{
    url: string;
    filename: string;
    fileType: string;
    uploadedAt: Date;
  }>;
  responses: Array<{
    userId: Types.ObjectId;
    userName: string;
    userRole: string;
    message: string;
    isInternal: boolean;
    createdAt: Date;
  }>;
  assignedTo?: Types.ObjectId;
  resolution?: {
    resolvedBy: Types.ObjectId;
    resolvedAt: Date;
    resolutionNotes: string;
    satisfactionRating?: number; // 1-5
    satisfactionFeedback?: string;
  };
  relatedTickets: Types.ObjectId[];
  source: "web" | "mobile" | "email" | "phone";
  firstResponseAt?: Date;
  lastResponseAt?: Date;
  lastActivityAt: Date;
  views: number;
  isEscalated: boolean;
  escalatedAt?: Date;
  escalationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ["general", "technical", "billing", "product", "shipping", "returns", "account", "other"],
      default: "general",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "waiting-response", "resolved", "closed"],
      default: "open",
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    attachments: [{
      url: String,
      filename: String,
      fileType: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    responses: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: String,
      userRole: String,
      message: String,
      isInternal: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolution: {
      resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      resolvedAt: Date,
      resolutionNotes: String,
      satisfactionRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      satisfactionFeedback: String,
    },
    relatedTickets: [{
      type: Schema.Types.ObjectId,
      ref: "SupportTicket",
    }],
    source: {
      type: String,
      enum: ["web", "mobile", "email", "phone"],
      default: "web",
    },
    firstResponseAt: Date,
    lastResponseAt: Date,
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
    escalatedAt: Date,
    escalationReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
SupportTicketSchema.index({ userId: 1, status: 1 });
SupportTicketSchema.index({ createdAt: -1 });
SupportTicketSchema.index({ priority: 1, status: 1 });
SupportTicketSchema.index({ assignedTo: 1 });

// Generate unique ticket number
SupportTicketSchema.pre("save", async function (next) {
  if (this.isNew && !this.ticketNumber) {
    const count = await mongoose.model("SupportTicket").countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

export const SupportTicket = mongoose.model<ISupportTicket>(
  "SupportTicket",
  SupportTicketSchema
);

