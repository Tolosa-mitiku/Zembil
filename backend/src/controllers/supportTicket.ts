import { Response } from "express";
import { SupportTicket } from "../models/supportTicket";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Create a new support ticket
export const createSupportTicket = async (req: CustomRequest, res: Response) => {
  try {
    const {
      subject,
      message,
      category,
      priority,
      tags,
      source,
    } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const supportTicket = new SupportTicket({
      userId: user._id,
      userName: user.name || "Anonymous",
      userEmail: user.email,
      subject,
      message,
      category: category || "general",
      priority: priority || "medium",
      tags: tags || [],
      source: source || "web",
      status: "open",
    });

    await supportTicket.save();

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      data: supportTicket,
    });
  } catch (error: any) {
    console.error("Error creating support ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket",
      error: error.message,
    });
  }
};

// Get all support tickets (with filters and pagination)
export const getSupportTickets = async (req: CustomRequest, res: Response) => {
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
    } = req.query;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Build filter
    const filter: any = {};
    
    // Non-admin users only see their own tickets
    if (user.role !== "admin") {
      filter.userId = user._id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { ticketNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate("userId", "name email image")
        .populate("assignedTo", "name email")
        .lean(),
      SupportTicket.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Error fetching support tickets:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets",
      error: error.message,
    });
  }
};

// Get support ticket by ID
export const getSupportTicketById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const ticket = await SupportTicket.findById(id)
      .populate("userId", "name email image")
      .populate("assignedTo", "name email")
      .populate("responses.userId", "name email image")
      .populate("resolution.resolvedBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Check if user has access to this ticket
    if (
      user.role !== "admin" &&
      ticket.userId.toString() !== user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this ticket",
      });
    }

    // Increment views
    ticket.views += 1;
    await ticket.save();

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error: any) {
    console.error("Error fetching support ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket",
      error: error.message,
    });
  }
};

// Add response to support ticket
export const addResponse = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message, isInternal } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Check if user has access
    const isOwner = ticket.userId.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this ticket",
      });
    }

    // Only admins can create internal responses
    const responseData = {
      userId: user._id,
      userName: user.name || "Anonymous",
      userRole: user.role,
      message,
      isInternal: isAdmin && isInternal ? true : false,
      createdAt: new Date(),
    };

    ticket.responses.push(responseData);
    ticket.lastActivityAt = new Date();

    // Update status to in-progress if it's open and admin responds
    if (ticket.status === "open" && isAdmin) {
      ticket.status = "in-progress";
    }

    // Set first response time if this is the first response
    if (!ticket.firstResponseAt && isAdmin) {
      ticket.firstResponseAt = new Date();
    }

    ticket.lastResponseAt = new Date();
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Response added successfully",
      data: responseData,
    });
  } catch (error: any) {
    console.error("Error adding response:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add response",
      error: error.message,
    });
  }
};

// Update support ticket status (admin only)
export const updateTicketStatus = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolutionNotes } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Update status
    if (status) {
      ticket.status = status;
      
      // If resolving, add resolution details
      if (status === "resolved" || status === "closed") {
        ticket.resolution = {
          resolvedBy: user._id,
          resolvedAt: new Date(),
          resolutionNotes: resolutionNotes || "",
        };
      }
    }

    // Update assignment
    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }

    ticket.lastActivityAt = new Date();
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error: any) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

// Add satisfaction rating
export const addSatisfactionRating = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Only ticket owner can rate
    if (ticket.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only rate your own tickets",
      });
    }

    // Ticket must be resolved
    if (ticket.status !== "resolved" && ticket.status !== "closed") {
      return res.status(400).json({
        success: false,
        message: "Can only rate resolved or closed tickets",
      });
    }

    if (!ticket.resolution) {
      ticket.resolution = {
        resolvedBy: ticket.assignedTo as any,
        resolvedAt: new Date(),
        resolutionNotes: "",
      };
    }

    ticket.resolution.satisfactionRating = rating;
    ticket.resolution.satisfactionFeedback = feedback;
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Rating added successfully",
      data: ticket,
    });
  } catch (error: any) {
    console.error("Error adding rating:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add rating",
      error: error.message,
    });
  }
};

// Get support ticket statistics (for admin dashboard)
export const getSupportTicketStats = async (req: CustomRequest, res: Response) => {
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
      byPriority,
      avgResponseTime,
      avgResolutionTime,
      satisfactionRatings,
      recentTickets,
    ] = await Promise.all([
      SupportTicket.countDocuments(),
      SupportTicket.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      SupportTicket.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
      SupportTicket.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      SupportTicket.aggregate([
        {
          $match: {
            firstResponseAt: { $exists: true },
          },
        },
        {
          $project: {
            responseTime: {
              $subtract: ["$firstResponseAt", "$createdAt"],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: "$responseTime" },
          },
        },
      ]),
      SupportTicket.aggregate([
        {
          $match: {
            "resolution.resolvedAt": { $exists: true },
          },
        },
        {
          $project: {
            resolutionTime: {
              $subtract: ["$resolution.resolvedAt", "$createdAt"],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: "$resolutionTime" },
          },
        },
      ]),
      SupportTicket.aggregate([
        {
          $match: {
            "resolution.satisfactionRating": { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$resolution.satisfactionRating" },
            count: { $sum: 1 },
          },
        },
      ]),
      SupportTicket.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "name email")
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
        byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
        byPriority: Object.fromEntries(byPriority.map((p) => [p._id, p.count])),
        avgResponseTime: avgResponseTime[0]?.avgTime || 0,
        avgResolutionTime: avgResolutionTime[0]?.avgTime || 0,
        satisfactionRatings: satisfactionRatings[0] || { avgRating: 0, count: 0 },
        recentTickets,
      },
    });
  } catch (error: any) {
    console.error("Error fetching support ticket stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket stats",
      error: error.message,
    });
  }
};













