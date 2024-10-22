// app.ts
import cors from "cors";
import express, { Application } from "express";

// Import route files
import authRoutes from "./routes/auth";
import buyerRoutes from "./routes/buyer";
import chatRoutes from "./routes/chat";
import orderRoutes from "./routes/order";
import paymentRoutes from "./routes/payment";
import productRoutes from "./routes/product";
import sellerRoutes from "./routes/seller";

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

// Create an Express app
const app: Application = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS if your frontend and backend are on different domains
app.use(cors());

// Routes

app.use("/", authRoutes);
app.use("/buyers", buyerRoutes);
app.use("/sellers", sellerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/chats", chatRoutes);

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
