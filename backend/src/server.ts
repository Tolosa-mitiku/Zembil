// server.ts
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import app from "./app"; // Import the app from app.ts
import { initializeJobs } from "./jobs"; // Import scheduled jobs
import { initializeSocket } from "./services/socketService"; // Import Socket.IO service

// Initialize dotenv to load environment variables
dotenv.config();

// Get the MongoDB connection URI and port from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zembil";

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Initialize scheduled jobs
    if (process.env.ENABLE_CRON_JOBS !== "false") {
      initializeJobs();
    } else {
      console.log("⏸️  Scheduled jobs disabled (set ENABLE_CRON_JOBS=true to enable)");
    }
    
    // Start the HTTP server (with Socket.IO attached)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.IO ready for connections`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Export for testing
export { httpServer, io };
