/**
 * Security Configuration
 * Centralized security settings
 */

export const securityConfig = {
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://10.94.233.66:5173", // Local network IP
      "http://10.94.233.66:3000", // Local network IP alternate port
      "https://zembil.vercel.app",
      "https://www.zembil.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Session-Token",
      "X-Request-ID",
      "Cache-Control",
      "Pragma",
      "Expires",
    ],
    exposedHeaders: ["X-Request-ID", "X-RateLimit-Remaining"],
    maxAge: 86400, // 24 hours
  },

  // Rate Limiting
  rateLimits: {
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window
      message: "Too many requests, please try again later",
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 5, // Only 5 login attempts
      message: "Too many login attempts, please try again in 15 minutes",
    },
    api: {
      windowMs: 60 * 1000, // 1 minute
      max: 60, // 60 requests per minute
      message: "Rate limit exceeded, slow down",
    },
    strict: {
      windowMs: 15 * 60 * 1000,
      max: 10, // For sensitive operations
      message: "Too many attempts, please try again later",
    },
  },

  // Session Configuration
  session: {
    expirationDays: 7, // Standard session
    rememberMeDays: 30, // "Remember me" session
    maxActiveSessions: 5, // Max concurrent sessions per user
    tokenLength: 64, // Session token length (bytes)
  },

  // File Upload
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10, // Max files per upload
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    allowedDocTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    uploadPath: "uploads",
  },

  // Pagination
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100, // Prevent DoS via large queries
  },

  // Request Limits
  request: {
    jsonLimit: "10kb", // Max JSON payload
    urlEncodedLimit: "10kb",
    maxHeaderSize: 8192, // 8KB
  },

  // Password/Auth
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },

  // Input Constraints
  input: {
    maxStringLength: 5000,
    maxArrayLength: 100,
    maxSearchLength: 100,
    maxTagLength: 50,
    maxTags: 20,
  },

  // Price/Amount Limits
  pricing: {
    minPrice: 0,
    maxPrice: 1000000, // $1M max
    minQuantity: 1,
    maxQuantity: 1000,
    minPayoutAmount: 100,
  },

  // Security Headers
  headers: {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  },

  // Allowed Fields for Mass Assignment Protection
  allowedFields: {
    user: ["name", "image", "phoneNumber", "preferences"],
    buyer: ["firstName", "lastName", "phoneNumber", "profileImage"],
    seller: [
      "businessName",
      "phoneNumber",
      "address",
      "storeInfo",
      "businessHours",
      "shipping",
      "settings",
    ],
    product: [
      "title",
      "description",
      "price",
      "stockQuantity",
      "category",
      "brand",
      "images",
      "tags",
      "variants",
      "specifications",
    ],
    order: ["shippingAddress", "notes", "customerNote"],
  },

  // IP Whitelist (for admin operations if needed)
  ipWhitelist: process.env.ADMIN_IP_WHITELIST?.split(",") || [],

  // Feature Flags
  features: {
    enableRateLimiting: process.env.ENABLE_RATE_LIMITING !== "false",
    enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING !== "false",
    enableEncryption: process.env.ENABLE_ENCRYPTION !== "false",
    strictMode: process.env.SECURITY_STRICT_MODE === "true",
  },
};

/**
 * Get allowed fields for entity
 */
export const getAllowedFields = (entity: string): string[] => {
  return (
    securityConfig.allowedFields[
      entity as keyof typeof securityConfig.allowedFields
    ] || []
  );
};

/**
 * Filter object to only allowed fields
 */
export const filterAllowedFields = (
  data: any,
  allowedFields: string[]
): any => {
  const filtered: any = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      filtered[field] = data[field];
    }
  });
  return filtered;
};

export default securityConfig;

