import { Response } from "express";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Controller to handle login
export const loginUser = async (req: CustomRequest, res: Response) => {
  try {
    console.log("🔐 Login request received");
    console.log("👤 User from token:", req.user);
    console.log("📦 Request body:", req.body);

    let user = await User.findOne({ uid: req.user?.uid });
    let isNewUser = false;

    if (!user) {
      console.log("✨ Creating new user...");
      
      // Get role from request body, default to 'buyer' if not specified
      const role = req.body.role || 'buyer';
      
      // Validate role
      const validRoles = ['buyer', 'seller', 'admin'];
      const finalRole = validRoles.includes(role) ? role : 'buyer';
      
      // Create new user with specified role
      user = new User({
        uid: req.user?.uid,
        email: req.user?.email,
        name: req.user?.name,
        image: req.user?.image,
        role: finalRole,
      });
      await user.save();
      isNewUser = true;
      console.log("✅ New user created:", user._id, "with role:", user.role);
    } else {
      console.log("✅ Existing user found:", user._id, "with role:", user.role);
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
    console.error("❌ Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
