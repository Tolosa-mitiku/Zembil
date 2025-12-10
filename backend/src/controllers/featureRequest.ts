import { Response } from "express";
import { FeatureRequest } from "../models/featureRequest";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Create a new feature request
export const createFeatureRequest = async (req: CustomRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      expectedBenefit,
      useCase,
      tags,
    } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const featureRequest = new FeatureRequest({
      userId: user._id,
      userName: user.name || "Anonymous",
      userEmail: user.email,
      title,
      description,
      category: category || "other",
      priority: priority || "medium",
      expectedBenefit: expectedBenefit || "",
      useCase: useCase || "",
      tags: tags || [],
      status: "submitted",
    });

    await featureRequest.save();

    return res.status(201).json({
      success: true,
      message: "Feature request submitted successfully",
      data: featureRequest,
    });
  } catch (error: any) {
    console.error("Error creating feature request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create feature request",
      error: error.message,
    });
  }
};

// Get all feature requests (with filters and pagination)
export const getFeatureRequests = async (req: CustomRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      includeCompleted = false,
    } = req.query;

    // Build filter
    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Exclude completed unless explicitly requested
    if (!includeCompleted) {
      filter.status = { $ne: "completed" };
    }

    // Build sort
    const sort: any = {};
    if (sortBy === "votes") {
      sort.upvotes = sortOrder === "asc" ? 1 : -1;
    } else {
      sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [featureRequests, total] = await Promise.all([
      FeatureRequest.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate("userId", "name email image")
        .lean(),
      FeatureRequest.countDocuments(filter),
    ]);

    // Add upvote count to each request
    const requestsWithVotes = featureRequests.map((request: any) => ({
      ...request,
      upvoteCount: request.upvotes?.length || 0,
      downvoteCount: request.downvotes?.length || 0,
    }));

    return res.status(200).json({
      success: true,
      data: requestsWithVotes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Error fetching feature requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feature requests",
      error: error.message,
    });
  }
};

// Get feature request by ID
export const getFeatureRequestById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const featureRequest = await FeatureRequest.findById(id)
      .populate("userId", "name email image")
      .populate("comments.userId", "name email image")
      .populate("implementation.assignedTo", "name email")
      .populate("rejection.rejectedBy", "name email");

    if (!featureRequest) {
      return res.status(404).json({
        success: false,
        message: "Feature request not found",
      });
    }

    // Increment views
    featureRequest.views += 1;
    await featureRequest.save();

    const user = await User.findOne({ uid: req.user?.uid });
    const hasUpvoted = user && featureRequest.upvotes.some(id => id.toString() === user._id.toString());
    const hasDownvoted = user && featureRequest.downvotes.some(id => id.toString() === user._id.toString());

    return res.status(200).json({
      success: true,
      data: {
        ...featureRequest.toObject(),
        upvoteCount: featureRequest.upvotes.length,
        downvoteCount: featureRequest.downvotes.length,
        hasUpvoted,
        hasDownvoted,
      },
    });
  } catch (error: any) {
    console.error("Error fetching feature request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feature request",
      error: error.message,
    });
  }
};

// Vote on feature request
export const voteFeatureRequest = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const featureRequest = await FeatureRequest.findById(id);
    if (!featureRequest) {
      return res.status(404).json({
        success: false,
        message: "Feature request not found",
      });
    }

    const hasUpvoted = featureRequest.upvotes.includes(user._id);
    const hasDownvoted = featureRequest.downvotes.includes(user._id);

    if (voteType === "up") {
      if (hasUpvoted) {
        // Remove upvote
        featureRequest.upvotes = featureRequest.upvotes.filter(
          (id) => id.toString() !== user._id.toString()
        );
      } else {
        // Add upvote and remove downvote if exists
        featureRequest.upvotes.push(user._id);
        if (hasDownvoted) {
          featureRequest.downvotes = featureRequest.downvotes.filter(
            (id) => id.toString() !== user._id.toString()
          );
        }
      }
    } else if (voteType === "down") {
      if (hasDownvoted) {
        // Remove downvote
        featureRequest.downvotes = featureRequest.downvotes.filter(
          (id) => id.toString() !== user._id.toString()
        );
      } else {
        // Add downvote and remove upvote if exists
        featureRequest.downvotes.push(user._id);
        if (hasUpvoted) {
          featureRequest.upvotes = featureRequest.upvotes.filter(
            (id) => id.toString() !== user._id.toString()
          );
        }
      }
    }

    featureRequest.lastActivityAt = new Date();
    await featureRequest.save();

    return res.status(200).json({
      success: true,
      message: "Vote updated successfully",
      data: {
        upvoteCount: featureRequest.upvotes.length,
        downvoteCount: featureRequest.downvotes.length,
        hasUpvoted: featureRequest.upvotes.includes(user._id),
        hasDownvoted: featureRequest.downvotes.includes(user._id),
      },
    });
  } catch (error: any) {
    console.error("Error voting feature request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to vote feature request",
      error: error.message,
    });
  }
};

// Add comment to feature request
export const addComment = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comment, isInternal } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const featureRequest = await FeatureRequest.findById(id);
    if (!featureRequest) {
      return res.status(404).json({
        success: false,
        message: "Feature request not found",
      });
    }

    // Only admins can create internal comments
    const commentData = {
      userId: user._id,
      userName: user.name || "Anonymous",
      comment,
      isInternal: user.role === "admin" && isInternal ? true : false,
      createdAt: new Date(),
    };

    featureRequest.comments.push(commentData);
    featureRequest.lastActivityAt = new Date();
    await featureRequest.save();

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: commentData,
    });
  } catch (error: any) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// Update feature request status (admin only)
export const updateFeatureRequestStatus = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, releaseVersion, releaseNotes } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const featureRequest = await FeatureRequest.findById(id);
    if (!featureRequest) {
      return res.status(404).json({
        success: false,
        message: "Feature request not found",
      });
    }

    // Update status
    featureRequest.status = status;

    // Handle rejection
    if (status === "rejected") {
      featureRequest.rejection = {
        rejectedBy: user._id,
        rejectedAt: new Date(),
        reason: rejectionReason || "",
      };
    }

    // Handle completion
    if (status === "completed") {
      if (!featureRequest.implementation) {
        featureRequest.implementation = {};
      }
      featureRequest.implementation.completedAt = new Date();
      if (releaseVersion) featureRequest.implementation.releaseVersion = releaseVersion;
      if (releaseNotes) featureRequest.implementation.releaseNotes = releaseNotes;
    }

    // Handle in-development
    if (status === "in-development" && !featureRequest.implementation?.startedAt) {
      if (!featureRequest.implementation) {
        featureRequest.implementation = {};
      }
      featureRequest.implementation.startedAt = new Date();
    }

    featureRequest.lastActivityAt = new Date();
    await featureRequest.save();

    return res.status(200).json({
      success: true,
      message: "Feature request updated successfully",
      data: featureRequest,
    });
  } catch (error: any) {
    console.error("Error updating feature request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update feature request",
      error: error.message,
    });
  }
};

// Get feature request statistics (for admin dashboard)
export const getFeatureRequestStats = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [
      total,
      byStatus,
      byCategory,
      topVoted,
      recentCompleted,
    ] = await Promise.all([
      FeatureRequest.countDocuments(),
      FeatureRequest.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      FeatureRequest.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
      FeatureRequest.find()
        .sort({ upvotes: -1 })
        .limit(10)
        .populate("userId", "name email")
        .lean(),
      FeatureRequest.find({ status: "completed" })
        .sort({ "implementation.completedAt": -1 })
        .limit(5)
        .populate("userId", "name email")
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
        byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
        topVoted: topVoted.map((req: any) => ({
          ...req,
          upvoteCount: req.upvotes?.length || 0,
        })),
        recentCompleted,
      },
    });
  } catch (error: any) {
    console.error("Error fetching feature request stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feature request stats",
      error: error.message,
    });
  }
};













