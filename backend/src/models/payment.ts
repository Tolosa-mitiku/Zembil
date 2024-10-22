import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["paypal", "stripe"], required: true },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    required: true,
  },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Payment = model("Payment", paymentSchema);
