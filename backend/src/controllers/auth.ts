import { Response } from "express";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Controller to handle login
export const loginUser = async (req: CustomRequest, res: Response) => {
  try {
    let user = await User.findOne({ uid: req.user?.uid });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = new User({
        uid: req.user?.uid,
        email: req.user?.email,
        name: req.user?.name,
        image: req.user?.image,
      });
      await user.save();
      isNewUser = true;
    }

    // Return user data
    return res.status(200).json({
      success: true,
      message: isNewUser ? "User registered successfully" : "Login successful",
      user: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
