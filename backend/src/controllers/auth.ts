import { Request, Response } from "express";
import admin from "firebase-admin"; // Firebase Admin SDK
import { createUserInDB, findUserByFirebaseUID } from "../services/auth";

// Controller to handle signup
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUID, role } = req.body;

    // Validate request data
    if (!firebaseUID || !role) {
      return res
        .status(400)
        .json({ message: "firebaseUID and role are required" });
    }

    // Create user in MongoDB with the Firebase UID
    const user = await createUserInDB(firebaseUID, role);

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to sign up user", error });
  }
};

// Controller to handle login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body; // Firebase ID token sent from the client

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUID = decodedToken.uid;

    // Find the user by Firebase UID in MongoDB
    const user = await findUserByFirebaseUID(firebaseUID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
};
