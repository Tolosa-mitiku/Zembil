// Vercel serverless function entry point
import type { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../src/app";

dotenv.config();

// MongoDB connection cache for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const MONGO_URI = process.env.MONGO_URI || "";
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
  } catch (error) {
    isConnected = false;
    throw error;
  }
};

// Handler for Vercel
export default async (req: Request, res: Response) => {
  try {
    // Connect to DB on each cold start
    await connectDB();
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

