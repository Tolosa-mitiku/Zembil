import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFeatureRequest extends Document {
  userId: Types.ObjectId;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  category: "ui-ux" | "functionality" | "performance" | "integration" | "mobile" | "analytics" | "other";
  priority: "low" | "medium" | "high";
  status: "submitted" | "under-review" | "planned" | "in-development" | "completed" | "rejected";
  tags: string[];
  expectedBenefit: string;
  useCase: string;
  mockups: Array<{
    url: string;
    filename: string;
    uploadedAt: Date;
  }>;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  comments: Array<{
    userId: Types.ObjectId;
    userName: string;
    comment: string;
    isInternal: boolean;
    createdAt: Date;
  }>;
  implementation?: {
    startedAt?: Date;
    completedAt?: Date;
    releaseVersion?: string;
    releaseNotes?: string;
    assignedTo?: Types.ObjectId[];
  };
  rejection?: {
    rejectedBy: Types.ObjectId;
    rejectedAt: Date;
    reason: string;
  };
  relatedFeatures: Types.ObjectId[];
  views: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureRequestSchema = new Schema<IFeatureRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ["ui-ux", "functionality", "performance", "integration", "mobile", "analytics", "other"],
      default: "other",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["submitted", "under-review", "planned", "in-development", "completed", "rejected"],
      default: "submitted",
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    expectedBenefit: {
      type: String,
      maxlength: 1000,
    },
    useCase: {
      type: String,
      maxlength: 2000,
    },
    mockups: [{
      url: String,
      filename: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    upvotes: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    downvotes: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    comments: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: String,
      comment: String,
      isInternal: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    implementation: {
      startedAt: Date,
      completedAt: Date,
      releaseVersion: String,
      releaseNotes: String,
      assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: "User",
      }],
    },
    rejection: {
      rejectedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      rejectedAt: Date,
      reason: String,
    },
    relatedFeatures: [{
      type: Schema.Types.ObjectId,
      ref: "FeatureRequest",
    }],
    views: {
      type: Number,
      default: 0,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
FeatureRequestSchema.index({ userId: 1, status: 1 });
FeatureRequestSchema.index({ createdAt: -1 });
FeatureRequestSchema.index({ upvotes: 1 });

export const FeatureRequest = mongoose.model<IFeatureRequest>(
  "FeatureRequest",
  FeatureRequestSchema
);

