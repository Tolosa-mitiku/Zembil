import { Response } from "express";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get user profile
export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { name, image } = req.body;

    // Find and update user
    const user = await User.findOneAndUpdate(
      { uid: req.user?.uid },
      {
        ...(name && { name }),
        ...(image && { image }),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
