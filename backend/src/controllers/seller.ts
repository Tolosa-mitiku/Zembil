import { Request, Response } from "express";
import { Product } from "../models/product";
import { Seller } from "../models/seller";
import { CustomRequest } from "../types/express";
import { verifySellerOwnership } from "../utils/verifySellerOwnership";

// Create a new seller (individual or store)
export const createSeller = async (req: Request, res: Response) => {
  try {
    const seller = new Seller(req.body);
    await seller.save();
    res.status(201).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Error creating seller", error });
  }
};

// Get logged-in seller's profile
export const getCurrentSeller = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const seller = await Seller.findOne({ firebaseUID: req.user.uid });
    
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller profile not found" });
    }

    res.status(200).json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching seller profile", error });
  }
};

// Update seller profile info
export const updateSellerInfo = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isOwner = await verifySellerOwnership(req.user.uid, id);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this profile" });
    }

    const allowedUpdates = [
      "businessName", "phoneNumber", "aboutUs", "returnPolicy", 
      "shippingPolicy", "address", "businessHours", "settings"
    ];

    const updates: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    updates.updatedAt = new Date();

    const updatedSeller = await Seller.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedSeller });
  } catch (error) {
    if (error instanceof Error && error.message === "Seller not found") {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    res.status(500).json({ success: false, message: "Error updating profile", error });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isOwner = await verifySellerOwnership(req.user.uid, id);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this profile" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Construct URL (assuming static serving is configured)
    const imageUrl = `/api/v1/uploads/${req.file.filename}`;

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { profileImage: imageUrl, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Profile picture updated", 
      data: { profileImage: imageUrl, seller: updatedSeller } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading profile picture", error });
  }
};

// Upload cover image
export const uploadCoverImage = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isOwner = await verifySellerOwnership(req.user.uid, id);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this profile" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const imageUrl = `/api/v1/uploads/${req.file.filename}`;

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { coverImage: imageUrl, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Cover image updated", 
      data: { coverImage: imageUrl, seller: updatedSeller } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading cover image", error });
  }
};

// Update seller type
export const updateSellerType = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isOwner = await verifySellerOwnership(req.user.uid, id);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this profile" });
    }

    if (!["individual", "store"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid seller type. Must be 'individual' or 'store'." });
    }

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { type, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Seller type updated", data: updatedSeller });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating seller type", error });
  }
};

// Get seller profile by ID (Public/Admin)
export const getSellerProfile = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller profile", error });
  }
};

// Update seller profile (Legacy/Admin)
export const updateSellerProfile = async (req: Request, res: Response) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: "Error updating seller profile", error });
  }
};

// Add a product by seller
export const addProduct = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    const product = new Product({ ...req.body, seller: req.params.id });
    await product.save();
    seller.products.push(product._id);
    await seller.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// Get all products by seller
export const getSellerProducts = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id).populate("products");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(seller.products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Delete a seller account
export const deleteSeller = async (req: Request, res: Response) => {
  try {
    const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json({ message: "Seller deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting seller", error });
  }
};

// Get store settings
export const getStoreSettings = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        businessName: seller.businessName,
        profileImage: seller.profileImage,
        coverImage: seller.coverImage,
        aboutUs: seller.aboutUs,
        returnPolicy: seller.returnPolicy,
        shippingPolicy: seller.shippingPolicy,
        shippingZones: seller.shippingZones,
        businessHours: seller.businessHours,
        settings: seller.settings,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching store settings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update store settings
export const updateStoreSettings = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const allowedFields = [
      "businessName",
      "profileImage",
      "coverImage",
      "aboutUs",
      "returnPolicy",
      "shippingPolicy",
      "shippingZones",
      "businessHours",
      "settings",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (seller as any)[field] = req.body[field];
      }
    });

    seller.updatedAt = new Date();
    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Store settings updated successfully",
      data: seller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating store settings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
