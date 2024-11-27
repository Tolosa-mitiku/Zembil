import { Response } from "express";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Controller to handle login
export const loginUser = async (req: CustomRequest, res: Response) => {
  try {
    let user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      // Create new user
      user = new User({
        uid: req.user?.uid,
        email: req.user?.email,
        name: req.user?.name,
        image: req.user?.image,
      });
      await user.save();
    }
    // Return user data
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
};
