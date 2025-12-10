import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
      title: { type: String }, // Cached
      image: { type: String },
      price: { type: Number }, // Current price
      quantity: { type: Number, required: true, min: 1 },
      variant: {
        name: { type: String },
        options: { type: Map, of: Schema.Types.Mixed },
      },
      addedAt: { type: Date, default: Date.now },
    }
  ],
  
  // Totals (Computed)
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  
  // Promo Code
  promoCode: { type: String },
  discount: { type: Number, default: 0 },
  
  // Status
  isActive: { type: Boolean, default: true },
  lastActivity: { type: Date, default: Date.now },
  
  // Conversion Tracking
  convertedToOrder: { type: Boolean, default: false },
  orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  
  // Metadata
  metadata: { type: Map, of: Schema.Types.Mixed },
  schemaVersion: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // TTL: 30 days
}, {
  timestamps: true,
});

// Pre-save hook to set expiration and calculate totals
cartSchema.pre("save", function (next) {
  // Set expiration (30 days from creation)
  if (this.isNew && !this.expiresAt) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    this.expiresAt = expirationDate;
  }
  
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => {
    const price = item.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  // Calculate total
  this.total = this.subtotal + (this.tax || 0) + (this.shipping || 0) - (this.discount || 0);
  
  // Update last activity
  this.lastActivity = new Date();
  
  next();
});

// Indexes
cartSchema.index({ userId: 1 }, { unique: true });
cartSchema.index({ "items.productId": 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
cartSchema.index({ isActive: 1 });

export const Cart = model("Cart", cartSchema);

