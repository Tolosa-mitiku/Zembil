import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  orderNumber: { type: String, unique: true }, // Human-readable order number
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      sellerId: { type: Schema.Types.ObjectId, ref: "Seller" }, // Track which seller owns this item
      title: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      subtotal: { type: Number, required: true }, // price * quantity
    },
  ],
  totalPrice: { type: Number, required: true },
  platformFee: { type: Number, default: 0 }, // Platform commission
  sellerEarnings: { type: Number, default: 0 }, // Total earnings for sellers
  shippingAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String },
    geolocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
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
        "canceled",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        location: { type: String },
        note: { type: String },
      },
    ],
    estimatedDelivery: { type: Date },
    trackingNumber: { type: String },
    carrier: { type: String }, // Shipping carrier name
  },
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
  notes: { type: String }, // Order notes/instructions from buyer
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
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
  next();
});

// Indexes for efficient querying
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ "tracking.status": 1 });
orderSchema.index({ "tracking.trackingNumber": 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "items.sellerId": 1 }); // For seller order queries

export const Order = model("Order", orderSchema);
