/**
 * MongoDB Schema Validation Rules
 * 
 * This file contains validation rules that can be applied at the database level
 * Use these when creating collections for stricter data integrity
 */

export const validationRules = {
  // Users Collection Validation
  users: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["uid", "email", "role"],
        properties: {
          uid: {
            bsonType: "string",
            minLength: 1,
            maxLength: 128,
            description: "Firebase UID is required and must be between 1-128 characters",
          },
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            description: "Valid email address required",
          },
          role: {
            enum: ["buyer", "seller", "admin"],
            description: "Role must be buyer, seller, or admin",
          },
          accountStatus: {
            enum: ["active", "suspended", "banned", "deleted"],
            description: "Account status must be one of the allowed values",
          },
          phoneNumber: {
            bsonType: ["string", "null"],
            pattern: "^\\+?[1-9]\\d{1,14}$",
            description: "Must be valid E.164 format if provided",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  },
  
  // Products Collection Validation
  products: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["sellerId", "title", "description"],
        properties: {
          title: {
            bsonType: "string",
            minLength: 3,
            maxLength: 200,
            description: "Product title must be between 3-200 characters",
          },
          description: {
            bsonType: "string",
            minLength: 10,
            description: "Product description must be at least 10 characters",
          },
          status: {
            enum: ["draft", "active", "inactive", "pending", "rejected", "archived"],
            description: "Status must be a valid state",
          },
          "pricing.basePrice": {
            bsonType: "number",
            minimum: 0,
            description: "Base price must be greater than or equal to 0",
          },
          "inventory.stockQuantity": {
            bsonType: "number",
            minimum: 0,
            description: "Stock quantity cannot be negative",
          },
          "analytics.averageRating": {
            bsonType: ["number", "null"],
            minimum: 0,
            maximum: 5,
            description: "Average rating must be between 0-5",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  },
  
  // Orders Collection Validation
  orders: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["buyerId", "items", "totalPrice"],
        properties: {
          orderNumber: {
            bsonType: "string",
            pattern: "^ZMB-[0-9]{8}-[0-9]{4}$",
            description: "Order number must follow format: ZMB-YYYYMMDD-XXXX",
          },
          items: {
            bsonType: "array",
            minItems: 1,
            description: "Order must have at least one item",
          },
          totalPrice: {
            bsonType: "number",
            minimum: 0,
            description: "Total price must be greater than or equal to 0",
          },
          "tracking.status": {
            enum: ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "canceled"],
            description: "Tracking status must be valid",
          },
          paymentStatus: {
            enum: ["paid", "pending", "failed", "refunded"],
            description: "Payment status must be valid",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  },
  
  // Reviews Collection Validation
  reviews: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "productId", "sellerId", "rating", "comment"],
        properties: {
          rating: {
            bsonType: "number",
            minimum: 1,
            maximum: 5,
            description: "Rating must be between 1-5",
          },
          comment: {
            bsonType: "string",
            minLength: 10,
            maxLength: 2000,
            description: "Comment must be between 10-2000 characters",
          },
          status: {
            enum: ["pending", "approved", "rejected"],
            description: "Status must be valid",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  },
  
  // Support Tickets Validation
  supportTickets: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "ticketNumber", "subject", "message"],
        properties: {
          ticketNumber: {
            bsonType: "string",
            pattern: "^TKT-[0-9]{6}$",
            description: "Ticket number must follow format: TKT-XXXXXX",
          },
          subject: {
            bsonType: "string",
            minLength: 5,
            maxLength: 200,
            description: "Subject must be between 5-200 characters",
          },
          message: {
            bsonType: "string",
            minLength: 10,
            maxLength: 5000,
            description: "Message must be between 10-5000 characters",
          },
          category: {
            enum: ["general", "technical", "billing", "product", "shipping", "returns", "account", "other"],
            description: "Category must be valid",
          },
          priority: {
            enum: ["low", "medium", "high", "urgent"],
            description: "Priority must be valid",
          },
          status: {
            enum: ["open", "in-progress", "waiting-response", "resolved", "closed"],
            description: "Status must be valid",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  },
};

/**
 * Apply validation rules to existing collections
 * 
 * Usage in MongoDB shell or migration script:
 * 
 * db.runCommand({
 *   collMod: "users",
 *   validator: validationRules.users.validator,
 *   validationLevel: "moderate",
 *   validationAction: "warn"
 * });
 */

export const applyValidation = async (db: any) => {
  const collections = Object.keys(validationRules);
  
  for (const collectionName of collections) {
    try {
      const rule = validationRules[collectionName as keyof typeof validationRules];
      await db.command({
        collMod: collectionName,
        validator: rule.validator,
        validationLevel: rule.validationLevel,
        validationAction: rule.validationAction,
      });
      console.log(`✅ Validation applied to ${collectionName}`);
    } catch (error) {
      console.error(`❌ Failed to apply validation to ${collectionName}:`, error);
    }
  }
};

