import { Response } from "express";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get user profile by ID
export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    // const buyer = await User.findById(req.params.id);
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching User profile", error });
  }
};
