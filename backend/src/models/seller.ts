import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
  firebaseUID: { type: String, ref: "User", required: true }, // Firebase UID reference to User
  type: { type: String, enum: ["individual", "store"], required: true },
  businessName: { type: String }, // Only for store sellers
  phoneNumber: { type: String, required: true },
  profileImage: { type: String }, // URL to profile image
  address: {
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
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  rating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Seller = model("Seller", sellerSchema);
