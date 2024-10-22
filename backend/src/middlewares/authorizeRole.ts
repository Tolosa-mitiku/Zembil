import { NextFunction, Request, Response } from "express";

// Middleware to check user roles
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; // Assumes req.user is populated by verifyFirebaseToken

    if (userRole !== undefined && !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient privileges" });
    }

    next(); // Proceed to the next middleware or route handler
  };
};