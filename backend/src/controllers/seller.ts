import { Request, Response } from "express";
import { Product } from "../models/product";
import { Seller } from "../models/seller";
import { CustomRequest } from "../types/express";
import { verifySellerOwnership } from "../utils/verifySellerOwnership";
import { syncProfileImageToUser } from "../services/profileSync.service";

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

    const seller = await Seller.findOne({ firebaseUID: req.user.uid }).populate("userId", "email phoneNumber");
    
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller profile not found" });
    }

    // Combine seller data with user data
    const sellerData = seller.toObject();
    const userData = sellerData.userId as any;

    res.status(200).json({ 
      success: true, 
      data: {
        ...sellerData,
        email: userData?.email,
        phoneNumber: userData?.phoneNumber,
      }
    });
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

    const updates: any = { updatedAt: new Date() };
    
    // Handle top-level fields
    // Note: email and phoneNumber are managed in User model
    if (req.body.businessName !== undefined) updates.businessName = req.body.businessName;
    if (req.body.alternatePhone !== undefined) updates.alternatePhone = req.body.alternatePhone;
    if (req.body.address !== undefined) updates.address = req.body.address;
    if (req.body.businessHours !== undefined) updates.businessHours = req.body.businessHours;
    if (req.body.settings !== undefined) updates.settings = req.body.settings;
    
    // Handle storeInfo nested fields
    if (req.body.aboutUs !== undefined) updates['storeInfo.aboutUs'] = req.body.aboutUs;
    if (req.body.returnPolicy !== undefined) updates['storeInfo.returnPolicy'] = req.body.returnPolicy;
    if (req.body.shippingPolicy !== undefined) updates['storeInfo.shippingPolicy'] = req.body.shippingPolicy;

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

    // Sync profile image back to User
    if (updatedSeller) {
      try {
        await syncProfileImageToUser(updatedSeller.userId, imageUrl);
      } catch (error) {
        console.warn("Failed to sync profile image to User", error);
      }
    }

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
    const seller = await Seller.findById(req.params.id).populate("userId", "email phoneNumber");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    
    // Combine seller data with user data
    const sellerData = seller.toObject();
    const userData = sellerData.userId as any;
    
    res.status(200).json({
      ...sellerData,
      email: userData?.email,
      phoneNumber: userData?.phoneNumber,
    });
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
        aboutUs: seller.storeInfo?.aboutUs,
        returnPolicy: seller.storeInfo?.returnPolicy,
        shippingPolicy: seller.storeInfo?.shippingPolicy,
        shippingZones: seller.shipping?.shippingZones,
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

    // Update top-level fields
    if (req.body.businessName !== undefined) seller.businessName = req.body.businessName;
    if (req.body.profileImage !== undefined) seller.profileImage = req.body.profileImage;
    if (req.body.coverImage !== undefined) seller.coverImage = req.body.coverImage;
    if (req.body.businessHours !== undefined) seller.businessHours = req.body.businessHours;
    if (req.body.settings !== undefined) seller.settings = req.body.settings;
    
    // Update storeInfo nested fields
    if (req.body.aboutUs !== undefined) {
      if (!seller.storeInfo) seller.storeInfo = {} as any;
      seller.storeInfo!.aboutUs = req.body.aboutUs;
    }
    if (req.body.returnPolicy !== undefined) {
      if (!seller.storeInfo) seller.storeInfo = {} as any;
      seller.storeInfo!.returnPolicy = req.body.returnPolicy;
    }
    if (req.body.shippingPolicy !== undefined) {
      if (!seller.storeInfo) seller.storeInfo = {} as any;
      seller.storeInfo!.shippingPolicy = req.body.shippingPolicy;
    }
    
    // Update shipping nested fields
    if (req.body.shippingZones !== undefined) {
      if (!seller.shipping) seller.shipping = {} as any;
      seller.shipping!.shippingZones = req.body.shippingZones;
    }

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
