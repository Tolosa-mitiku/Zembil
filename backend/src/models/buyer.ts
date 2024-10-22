import { Schema, model } from "mongoose";

const buyerSchema = new Schema({
  firebaseUID: { type: String, ref: "User", required: true }, // Firebase UID reference to User
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  profileImage: { type: String }, // URL to profile image
  deliveryAddresses: [
    {
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
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Buyer = model("Buyer", buyerSchema);
