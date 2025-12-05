import { Schema, model } from "mongoose";

const addressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["home", "work", "other"],
    default: "home",
  },
  label: { type: String }, // Custom label like "Mom's House"
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  geolocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    // Remove default flag from other addresses for this user
    await model("Address").updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Indexes
addressSchema.index({ userId: 1 });
addressSchema.index({ isDefault: 1 });

export const Address = model("Address", addressSchema);








