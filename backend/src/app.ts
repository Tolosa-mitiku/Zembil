// app.ts
import cors from "cors";
import express, { Application } from "express";
import admin from "firebase-admin"; // Firebase Admin SDK for Firestore/Realtime DB
// import serviceAccount from "./firebase-service-account.json";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

// Import route files
import authRoutes from "./routes/auth";
import buyerRoutes from "./routes/buyer";
import cartRoutes from "./routes/cart";
import userRoutes from "./routes/user";
// import chatRoutes from "./routes/chat";
import orderRoutes from "./routes/order";
import paymentRoutes from "./routes/payment";
import productRoutes from "./routes/product";
import sellerRoutes from "./routes/seller";

// New routes
import addressRoutes from "./routes/address";
import adminRoutes from "./routes/admin";
import bannerRoutes from "./routes/banner";
import categoryRoutes from "./routes/category";
import notificationRoutes from "./routes/notification";
import reviewRoutes from "./routes/review";
import sellerDashboardRoutes from "./routes/sellerDashboard";
import wishlistRoutes from "./routes/wishlist";
import supportTicketRoutes from "./routes/supportTicket";
import featureRequestRoutes from "./routes/featureRequest";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// Create an Express app
const app: Application = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS if your frontend and backend are on different domains
app.use(cors());

// Serve uploaded files statically
app.use("/api/v1/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/v1/gete", (req, res) => {
  res.send("hello world");
});

// Auth & User
app.use("/api/v1/", authRoutes);
app.use("/api/v1/profile", userRoutes);

// Buyer Features
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Products & Categories
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/banners", bannerRoutes);

// Orders & Payments
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

// Seller Management
app.use("/api/v1/buyers", buyerRoutes);
app.use("/api/v1/sellers", sellerRoutes);
app.use("/api/v1/sellers/me", sellerDashboardRoutes);

// Admin Panel
app.use("/api/v1/admin", adminRoutes);

// Support
app.use("/api/v1/support-tickets", supportTicketRoutes);
app.use("/api/v1/feature-requests", featureRequestRoutes);

// app.use("/api/v1/chats", chatRoutes);

// Error handling middleware (optional but recommended)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send({
      success: false,
      message: "Something went wrong!",
    });
  }
);

// Export the app so it can be used in `server.ts`
export default app;
