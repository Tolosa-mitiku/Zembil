import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";

// Middleware to verify Firebase ID token
export const verifyFirebaseToken = async (
  req: Request,
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

    // Attach user details from the decoded token to the request object
    req.user = {
      firebaseUID: decodedToken.uid,
      role: decodedToken.role, // This will include custom claims (e.g., role)
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error });
  }
};
