// app.ts
import cors from "cors";
import express, { Application } from "express";
import admin from "firebase-admin"; // Firebase Admin SDK for Firestore/Realtime DB
import serviceAccount from "./firebase-service-account.json";

// Import route files
import authRoutes from "./routes/auth";
import buyerRoutes from "./routes/buyer";
// import chatRoutes from "./routes/chat";
import orderRoutes from "./routes/order";
import paymentRoutes from "./routes/payment";
import productRoutes from "./routes/product";
import sellerRoutes from "./routes/seller";


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// Create an Express app
const app: Application = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS if your frontend and backend are on different domains
app.use(cors());

// Routes
app.use("/api/v1/gete", (req, res) => {
  res.send("hello world");
});
app.use("/api/v1/", authRoutes);
app.use("/api/v1/buyers", buyerRoutes);
app.use("/api/v1/sellers", sellerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
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
