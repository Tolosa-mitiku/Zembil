import mongoose from "mongoose";
import dotenv from "dotenv";
import { Seller } from "../models/seller";

dotenv.config();

const realisticSellers = [
  {
    type: "store",
    businessName: "Addis Electronics",
    phoneNumber: "+251911234567",
    profileImage: "https://i.pravatar.cc/150?u=addis",
    coverImage: "https://picsum.photos/seed/addis/800/400",
    address: {
      addressLine1: "Bole Road",
      city: "Addis Ababa",
      postalCode: "1000",
      country: "Ethiopia",
    },
    aboutUs: "Best electronics in Addis Ababa.",
    returnPolicy: "7 days return policy.",
    shippingPolicy: "Free shipping within Addis Ababa.",
    businessHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: { open: "closed", close: "closed" },
    },
    verificationStatus: "verified",
    firebaseUID: "dummy_uid_1", // Replace with real UID if needed
  },
  {
    type: "individual",
    phoneNumber: "+251922345678",
    profileImage: "https://i.pravatar.cc/150?u=abebe",
    coverImage: "https://picsum.photos/seed/abebe/800/400",
    address: {
      addressLine1: "Piassa",
      city: "Addis Ababa",
      postalCode: "1000",
      country: "Ethiopia",
    },
    aboutUs: "Selling handmade crafts.",
    returnPolicy: "No returns.",
    shippingPolicy: "Buyer pays shipping.",
    verificationStatus: "verified",
    firebaseUID: "dummy_uid_2",
  },
  {
    type: "store",
    businessName: "Sheger Fashion",
    phoneNumber: "+251933456789",
    profileImage: "https://i.pravatar.cc/150?u=sheger",
    coverImage: "https://picsum.photos/seed/sheger/800/400",
    address: {
      addressLine1: "Mexico Square",
      city: "Addis Ababa",
      postalCode: "1000",
      country: "Ethiopia",
    },
    aboutUs: "Trendy fashion for everyone.",
    returnPolicy: "14 days return policy.",
    shippingPolicy: "Standard shipping rates apply.",
    businessHours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "20:00" },
      friday: { open: "10:00", close: "20:00" },
      saturday: { open: "10:00", close: "20:00" },
      sunday: { open: "12:00", close: "18:00" },
    },
    verificationStatus: "pending",
    firebaseUID: "dummy_uid_3",
  },
  {
    type: "individual",
    phoneNumber: "+251944567890",
    profileImage: "https://i.pravatar.cc/150?u=kebede",
    coverImage: "https://picsum.photos/seed/kebede/800/400",
    address: {
      addressLine1: "Megenagna",
      city: "Addis Ababa",
      postalCode: "1000",
      country: "Ethiopia",
    },
    aboutUs: "Used books and vintage items.",
    returnPolicy: "Returns accepted if item not as described.",
    shippingPolicy: "Local pickup available.",
    verificationStatus: "verified",
    firebaseUID: "dummy_uid_4",
  },
  {
    type: "store",
    businessName: "Ethio Coffee House",
    phoneNumber: "+251955678901",
    profileImage: "https://i.pravatar.cc/150?u=coffee",
    coverImage: "https://picsum.photos/seed/coffee/800/400",
    address: {
      addressLine1: "4 Kilo",
      city: "Addis Ababa",
      postalCode: "1000",
      country: "Ethiopia",
    },
    aboutUs: "Premium Ethiopian coffee beans.",
    returnPolicy: "No returns on food items.",
    shippingPolicy: "Worldwide shipping.",
    businessHours: {
      monday: { open: "08:00", close: "17:00" },
      tuesday: { open: "08:00", close: "17:00" },
      wednesday: { open: "08:00", close: "17:00" },
      thursday: { open: "08:00", close: "17:00" },
      friday: { open: "08:00", close: "17:00" },
      saturday: { open: "09:00", close: "13:00" },
      sunday: { open: "closed", close: "closed" },
    },
    verificationStatus: "verified",
    firebaseUID: "dummy_uid_5",
  },
];

const seedSellers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/zembil";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing sellers (optional, be careful in production)
    // await Seller.deleteMany({}); 
    // console.log("Cleared existing sellers");

    // Loop through and create/update sellers
    for (const sellerData of realisticSellers) {
      // Check if seller with this firebaseUID already exists to avoid duplicates if run multiple times
      const existingSeller = await Seller.findOne({ firebaseUID: sellerData.firebaseUID });
      
      if (existingSeller) {
        console.log(`Seller with UID ${sellerData.firebaseUID} already exists. Skipping.`);
        continue;
      }

      const seller = new Seller(sellerData);
      await seller.save();
      console.log(`Created seller: ${sellerData.businessName || "Individual Seller"}`);
    }

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding sellers:", error);
    process.exit(1);
  }
};

seedSellers();

