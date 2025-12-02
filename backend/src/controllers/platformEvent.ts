import { Request, Response } from "express";
import { PlatformEvent } from "../models";

/**
 * Create event (Admin or Seller)
 */
export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    const eventData = req.body;

    const event = await PlatformEvent.create({
      userId,
      userRole,
      ...eventData,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};

/**
 * Get events
 */
export const getEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    const { startDate, endDate, type } = req.query;

    const query: any = {};

    // Admin can see all events, sellers see only their own
    if (userRole !== "admin") {
      query.userId = userId;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate as string);
      if (endDate) query.startDate.$lte = new Date(endDate as string);
    }

    if (type) query.type = type;

    const events = await PlatformEvent.find(query).sort({ startDate: 1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get events",
    });
  }
};

/**
 * Update event
 */
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    const updates = req.body;

    const query: any = { _id: id };
    
    // Non-admins can only update their own events
    if (userRole !== "admin") {
      query.userId = userId;
    }

    const event = await PlatformEvent.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or access denied",
      });
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update event",
    });
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;

    const query: any = { _id: id };
    
    // Non-admins can only delete their own events
    if (userRole !== "admin") {
      query.userId = userId;
    }

    const result = await PlatformEvent.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or access denied",
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete event",
    });
  }
};

/**
 * Get platform-wide events (All users)
 */
export const getPlatformEvents = async (req: Request, res: Response) => {
  try {
    const events = await PlatformEvent.find({
      isPlatformWide: true,
      endDate: { $gte: new Date() },
    }).sort({ startDate: 1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get platform events",
    });
  }
};

