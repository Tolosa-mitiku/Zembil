// Vercel serverless function entry point
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../src/app";

dotenv.config();

// MongoDB connection cache for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const MONGO_URI = process.env.MONGO_URI || "";
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// Connect to DB before handling requests
connectDB();

export default app;

