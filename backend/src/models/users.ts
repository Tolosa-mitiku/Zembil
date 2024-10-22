import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firebaseUID: { type: String, required: true, unique: true }, // Firebase UID
  role: { type: String, enum: ["buyer", "seller", "admin"], required: true },
  fcmToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = model("User", userSchema);
