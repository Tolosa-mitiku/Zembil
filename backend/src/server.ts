// server.ts
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app"; // Import the app from app.ts

// Initialize dotenv to load environment variables
dotenv.config();

// Get the MongoDB connection URI and port from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zembil";

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server only if MongoDB is connected
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
