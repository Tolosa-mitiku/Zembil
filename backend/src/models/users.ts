import { Schema, model } from "mongoose";

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  role: { type: String, enum: ["buyer", "seller", "admin"], required: true, default: "buyer" },
  fcmToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = model("User", userSchema);
