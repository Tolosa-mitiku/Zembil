import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  orderNumber: { type: String, unique: true }, // Auto-generated: ZMB-YYYYMMDD-XXXX
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  
  // Line Items
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
      title: { type: String, required: true }, // Cached
      image: { type: String },
      price: { type: Number, required: true }, // Price at purchase time
      quantity: { type: Number, required: true },
      subtotal: { type: Number, required: true }, // price * quantity
      variant: {
        name: { type: String },
        options: { type: Map, of: Schema.Types.Mixed },
      },
    }
  ],
  
  // Pricing Breakdown
  totalPrice: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  sellerEarnings: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  
  // Shipping Address
  shippingAddress: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    geolocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  
  // Tracking Information
  tracking: {
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
      updatedAt: { type: Date },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "canceled"
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        location: { type: String },
        note: { type: String },
      }
    ],
    estimatedDelivery: { type: Date },
    trackingNumber: { type: String },
    carrier: { type: String }, // 'USPS', 'FedEx', 'UPS', 'DHL'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "stripe", "cash"],
    default: "stripe",
  },
  paymentId: { type: String }, // Payment transaction ID
  
  // Refund Information
  refund: {
    status: {
      type: String,
      enum: ["none", "requested", "processing", "completed", "rejected"],
      default: "none",
    },
    amount: { type: Number, default: 0 },
    reason: { type: String },
    requestedAt: { type: Date },
    processedAt: { type: Date },
  },
  
  // Order Notes
  customerNote: { type: String }, // Special instructions from customer
  sellerNote: { type: String }, // Internal note from seller
  adminNote: { type: String }, // Admin notes for disputes, etc.
  notes: { type: String }, // Legacy field
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Pre-save hook to generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    // Generate order number: ZMB-YYYYMMDD-XXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `ZMB-${dateStr}-${random}`;
  }
  
  this.updatedAt = new Date();
  next();
});

// Indexes
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ "tracking.status": 1 });
orderSchema.index({ "tracking.trackingNumber": 1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ "items.sellerId": 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = model("Order", orderSchema);
