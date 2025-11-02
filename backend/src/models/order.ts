import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      title: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  shippingAddress: {
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
      },
    ],
    estimatedDelivery: { type: Date },
    trackingNumber: { type: String },
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "stripe", "cash"],
    default: "stripe",
  },
  paymentId: { type: String }, // Payment transaction ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for efficient querying
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ "tracking.status": 1 });
orderSchema.index({ "tracking.trackingNumber": 1 });

export const Order = model("Order", orderSchema);
