import { NextFunction, Response } from "express";
import admin from "firebase-admin";
import { CustomRequest } from "../types/express";

// Middleware to verify Firebase ID token
export const verifyFirebaseToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token not provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if email is verified
    if (!decodedToken.email_verified) {
      return res.status(403).send("Email not verified");
    }

    // Attach user details from the decoded token to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      name: decodedToken.name,
      image: decodedToken.picture ?? null,
      role: decodedToken.role, // This will include custom claims (e.g., role)
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error });
  }
};
