import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
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
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "canceled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "stripe"],
    default: "paypal",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Order = model("Order", orderSchema);
