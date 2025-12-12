/**
 * Security Configuration
 * Centralized security settings
 */

export const securityConfig = {
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim()) || [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
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
      max: parseInt(process.env.RATE_LIMIT_GENERAL || "100"),
      message: "Too many requests, please try again later",
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_AUTH || "5"),
      message: "Too many login attempts, please try again in 15 minutes",
    },
    api: {
      windowMs: 60 * 1000, // 1 minute
      max: parseInt(process.env.RATE_LIMIT_API || "60"),
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
    expirationDays: parseInt(process.env.SESSION_EXPIRATION_DAYS || "7"),
    rememberMeDays: parseInt(process.env.SESSION_REMEMBER_ME_DAYS || "30"),
    maxActiveSessions: parseInt(process.env.MAX_ACTIVE_SESSIONS || "5"),
    tokenLength: 64, // Session token length (bytes)
  },

  // File Upload
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || String(5 * 1024 * 1024)), // Default 5MB
    maxFiles: parseInt(process.env.MAX_FILES_PER_UPLOAD || "10"),
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    allowedDocTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    uploadPath: process.env.UPLOAD_PATH || "uploads",
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
    minPayoutAmount: parseInt(process.env.PAYOUT_MIN_AMOUNT || "100"),
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

