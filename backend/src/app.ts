// app.ts - FULLY SECURED
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express, { Application } from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import path from "path";

// Security configuration
import securityConfig from "./config/security";
import { checkMaintenanceMode } from "./middlewares/maintenanceMode";
import { sanitizeRequest } from "./middlewares/sanitize";
import { errorHandler, notFoundHandler } from "./utils/errorHandler";
import { requestLogger } from "./utils/logger";

// Initialize Firebase Admin SDK
import { initializeFirebase } from "./config/firebase";

dotenv.config();

// Import route files
import authRoutes from "./routes/auth";
import buyerRoutes from "./routes/buyer";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/order";
import paymentRoutes from "./routes/payment";
import productRoutes from "./routes/product";
import sellerRoutes from "./routes/seller";
import userRoutes from "./routes/user";

// Feature routes
import addressRoutes from "./routes/address";
import adminRoutes from "./routes/admin";
import bannerRoutes from "./routes/banner";
import categoryRoutes from "./routes/category";
import featureRequestRoutes from "./routes/featureRequest";
import notificationRoutes from "./routes/notification";
import reviewRoutes from "./routes/review";
import sellerDashboardRoutes from "./routes/sellerDashboard";
import supportTicketRoutes from "./routes/supportTicket";
import wishlistRoutes from "./routes/wishlist";

// New feature routes
import draftRoutes from "./routes/draft";
import payoutRoutes from "./routes/payout";
import platformEventRoutes from "./routes/platformEvent";
import promotionRoutes from "./routes/promotion";
import refundRoutes from "./routes/refund";
import sellerEarningsRoutes from "./routes/sellerEarnings";
import sessionRoutes from "./routes/session";

// Initialize Firebase Admin
initializeFirebase();

// Create Express app
const app: Application = express();

// ============= TRUST PROXY =============
// Enable if behind reverse proxy (Nginx, Load Balancer, etc.)
app.set("trust proxy", 1);

// ============= SECURITY MIDDLEWARE =============

// Security headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: securityConfig.headers.contentSecurityPolicy
        .directives as any,
    },
    hsts: {
      maxAge: securityConfig.headers.hsts.maxAge,
      includeSubDomains: securityConfig.headers.hsts.includeSubDomains,
      preload: securityConfig.headers.hsts.preload,
    },
  })
);

// Additional security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // Don't set COOP/COEP headers as they can interfere with OAuth popups
  // res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  next();
});

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      // In development, be more lenient
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      if (securityConfig.cors.allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    credentials: securityConfig.cors.credentials,
    methods: securityConfig.cors.methods,
    allowedHeaders: securityConfig.cors.allowedHeaders,
    exposedHeaders: securityConfig.cors.exposedHeaders,
    maxAge: securityConfig.cors.maxAge,
  })
);

// Prevent NoSQL Injection
app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ key }) => {
      console.warn(`⚠️  Potential NoSQL injection attempt blocked: ${key}`);
    },
  })
);

// Request Size Limits (Prevent DoS)
app.use(express.json({ limit: securityConfig.request.jsonLimit }));
app.use(
  express.urlencoded({
    extended: true,
    limit: securityConfig.request.urlEncodedLimit,
  })
);

// Input Sanitization (XSS Prevention)
app.use(sanitizeRequest);

// Request ID Tracking
app.use((req, res, next) => {
  (req as any).id = crypto.randomBytes(16).toString("hex");
  res.setHeader("X-Request-ID", (req as any).id);
  next();
});

// Request Logging (Development)
if (process.env.NODE_ENV === "development") {
  app.use(requestLogger);
}

// Disable caching for API responses
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// Maintenance Mode Check
app.use(checkMaintenanceMode);

// ============= STATIC FILES (With Security) =============
// Serve uploaded files (consider moving to CDN for production)
app.use(
  "/api/v1/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: "1d",
    dotfiles: "deny", // Prevent access to hidden files
    index: false, // Disable directory listing
  })
);

// ============= API ROUTES =============

// Health Check (Public)
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/v1/gete", (req, res) => {
  res.send("hello world");
});

// ============= AUTH & USER ROUTES =============
app.use("/api/v1/", authRoutes);
app.use("/api/v1/profile", userRoutes);

// ============= BUYER FEATURES =============
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// ============= PRODUCTS & CATEGORIES =============
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/banners", bannerRoutes);

// ============= ORDERS & PAYMENTS =============
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

// ============= SELLER MANAGEMENT =============
app.use("/api/v1/buyers", buyerRoutes);
app.use("/api/v1/sellers", sellerRoutes);
app.use("/api/v1/sellers/me", sellerDashboardRoutes);

// ============= ADMIN PANEL =============
app.use("/api/v1/admin", adminRoutes);

// ============= SUPPORT & FEATURES =============
app.use("/api/v1/support-tickets", supportTicketRoutes);
app.use("/api/v1/feature-requests", featureRequestRoutes);

// ============= NEW FEATURES =============
app.use("/api/v1/payouts", payoutRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/promotions", promotionRoutes);
app.use("/api/v1/events", platformEventRoutes);
app.use("/api/v1/drafts", draftRoutes);
app.use("/api/v1/refunds", refundRoutes);
app.use("/api/v1/earnings", sellerEarningsRoutes);

// ============= MESSAGING (RLS Protected) =============
// Uncomment when ready to use
// import messageRoutes from "./routes/message";
// app.use("/api/v1/messages", messageRoutes);

// ============= 404 HANDLER =============
app.use(notFoundHandler);

// ============= GLOBAL ERROR HANDLER =============
app.use(errorHandler);

export default app;
