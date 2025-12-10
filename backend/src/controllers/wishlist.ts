import { Response } from "express";
import mongoose from "mongoose";
import { Wishlist } from "../models/wishlist";
import { Product } from "../models/product";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get user's wishlist
export const getWishlist = async (req: CustomRequest, res: Response) => {
  try {
    // Debug: Log the Firebase UID from the token
    console.log("=== 🔍 WISHLIST DEBUG START ===");
    console.log("Firebase UID from token (req.user?.uid):", req.user?.uid);
    console.log("Full req.user object:", JSON.stringify(req.user, null, 2));

    const user = await User.findOne({ uid: req.user?.uid });
    
    // Debug: Log user lookup result
    console.log("User lookup result:", user ? {
      _id: user._id,
      _idType: typeof user._id,
      _idString: user._id?.toString(),
      uid: user.uid,
      email: user.email,
      name: user.name,
    } : "USER NOT FOUND");

    if (!user) {
      console.log("❌ No user found with uid:", req.user?.uid);
      console.log("=== 🔍 WISHLIST DEBUG END ===");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Debug: Check all wishlists in collection to see what exists
    const allWishlists = await Wishlist.find({}).select('userId products').lean();
    console.log("All wishlists in DB:", allWishlists.map(w => ({
      _id: w._id,
      userId: w.userId,
      userIdString: w.userId?.toString(),
      productsCount: w.products?.length || 0,
    })));

    // Try multiple query approaches to find the wishlist
    const userIdString = user._id.toString();
    const userIdObjectId = new mongoose.Types.ObjectId(userIdString);

    // Debug: Try direct string comparison query
    const wishlistByString = await Wishlist.findOne({ 
      userId: userIdString 
    }).lean();
    console.log("Wishlist found by string comparison:", wishlistByString ? {
      _id: wishlistByString._id,
      userId: wishlistByString.userId,
      productsCount: wishlistByString.products?.length || 0,
    } : "NOT FOUND");

    // Use $or query to handle both ObjectId and string userId
    let wishlist = await Wishlist.findOne({
      $or: [
        { userId: user._id },
        { userId: userIdObjectId },
        { userId: userIdString },
      ]
    }).populate({
      path: "products.productId",
      select: "_id title pricing images discount inventory analytics category slug description",
      populate: {
        path: "category",
        select: "_id name slug icon",
      },
    });

    // Debug: Log wishlist lookup result with detailed product info
    console.log("Wishlist lookup by ObjectId result:", wishlist ? {
      _id: wishlist._id,
      userId: wishlist.userId,
      productsCount: wishlist.products?.length || 0,
    } : "WISHLIST NOT FOUND - WILL CREATE NEW ONE");

    // Debug: Check if products were populated correctly
    if (wishlist && wishlist.products) {
      console.log("=== DETAILED PRODUCT CHECK ===");
      wishlist.products.forEach((p, i) => {
        const productData = p.productId as any;
        console.log(`Product ${i + 1}:`, {
          hasProductId: !!p.productId,
          productIdType: typeof p.productId,
          isPopulated: productData && typeof productData === 'object' && productData._id,
          productId: productData?._id || productData,
          productTitle: productData?.title || 'NOT POPULATED',
          addedAt: p.addedAt,
        });
      });
      
      // Count how many products were actually populated
      const populatedCount = wishlist.products.filter(p => {
        const pd = p.productId as any;
        return pd && typeof pd === 'object' && pd._id && pd.title;
      }).length;
      console.log(`Populated products: ${populatedCount}/${wishlist.products.length}`);
      console.log("=== END PRODUCT CHECK ===");
    }

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      console.log("⚠️ Creating new empty wishlist for user:", user._id.toString());
      wishlist = new Wishlist({ userId: user._id, products: [] });
      await wishlist.save();
      console.log("✅ New wishlist created with _id:", wishlist._id);
    }

    // Log the final response data
    console.log("=== FINAL RESPONSE DATA ===");
    console.log("Response wishlist:", JSON.stringify({
      _id: wishlist._id,
      userId: wishlist.userId,
      productsCount: wishlist.products?.length,
      firstProduct: wishlist.products?.[0] ? {
        productId: wishlist.products[0].productId,
        addedAt: wishlist.products[0].addedAt,
      } : null,
    }, null, 2));
    console.log("=== 🔍 WISHLIST DEBUG END ===");

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error("❌ Error in getWishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Add product to wishlist
export const addToWishlist = async (req: CustomRequest, res: Response) => {
  try {
    const { productId } = req.params;
    
    console.log("=== 🔥 ADD TO WISHLIST START ===");
    console.log("ProductId from params:", productId);
    console.log("Firebase UID:", req.user?.uid);

    const user = await User.findOne({ uid: req.user?.uid });
    console.log("User found:", user ? { _id: user._id, email: user.email } : "NOT FOUND");
    
    if (!user) {
      console.log("❌ User not found, returning 404");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    console.log("Product found:", product ? { _id: product._id, title: product.title } : "NOT FOUND");
    
    if (!product) {
      console.log("❌ Product not found, returning 404");
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create wishlist (use $or to handle both ObjectId and string userId)
    const userIdString = user._id.toString();
    const userIdObjectId = new mongoose.Types.ObjectId(userIdString);
    
    let wishlist = await Wishlist.findOne({
      $or: [
        { userId: user._id },
        { userId: userIdObjectId },
        { userId: userIdString },
      ]
    });
    console.log("Existing wishlist found:", wishlist ? { _id: wishlist._id, productsCount: wishlist.products?.length } : "NOT FOUND - will create new");
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: user._id, products: [] });
      console.log("Created new wishlist instance");
    }

    // Check if product already in wishlist
    const existingIndex = wishlist.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    console.log("Product already in wishlist:", existingIndex >= 0);

    if (existingIndex >= 0) {
      console.log("❌ Product already in wishlist, returning 400");
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add product to wishlist
    console.log("Adding product to wishlist...");
    wishlist.products.push({ productId, addedAt: new Date() });
    wishlist.updatedAt = new Date();
    
    console.log("Saving wishlist...");
    const savedWishlist = await wishlist.save();
    console.log("✅ Wishlist saved successfully:", { _id: savedWishlist._id, productsCount: savedWishlist.products?.length });

    // Populate the wishlist before returning
    await wishlist.populate({
      path: "products.productId",
      select: "_id title pricing images discount inventory analytics category slug description",
      populate: {
        path: "category",
        select: "_id name slug icon",
      },
    });

    console.log("=== 🔥 ADD TO WISHLIST END (SUCCESS) ===");
    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("❌ Error in addToWishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    
    console.log("=== 💔 REMOVE FROM WISHLIST START ===");
    console.log("ProductId from params:", productId);
    console.log("Firebase UID:", req.user?.uid);

    const user = await User.findOne({ uid: req.user?.uid });
    console.log("User found:", user ? { _id: user._id, email: user.email } : "NOT FOUND");
    
    if (!user) {
      console.log("❌ User not found, returning 404");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find wishlist (use $or to handle both ObjectId and string userId)
    const userIdString = user._id.toString();
    const userIdObjectId = new mongoose.Types.ObjectId(userIdString);
    
    const wishlist = await Wishlist.findOne({
      $or: [
        { userId: user._id },
        { userId: userIdObjectId },
        { userId: userIdString },
      ]
    });
    console.log("Wishlist found:", wishlist ? { _id: wishlist._id, productsCount: wishlist.products?.length } : "NOT FOUND");
    
    if (!wishlist) {
      console.log("❌ Wishlist not found, returning 404");
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Remove product from wishlist
    const beforeCount = wishlist.products.length;
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    ) as any;
    const afterCount = wishlist.products.length;
    console.log(`Products removed: ${beforeCount - afterCount} (before: ${beforeCount}, after: ${afterCount})`);
    
    wishlist.updatedAt = new Date();
    
    console.log("Saving wishlist...");
    const savedWishlist = await wishlist.save();
    console.log("✅ Wishlist saved successfully:", { _id: savedWishlist._id, productsCount: savedWishlist.products?.length });

    // Populate the wishlist before returning
    await wishlist.populate({
      path: "products.productId",
      select: "_id title pricing images discount inventory analytics category slug description",
      populate: {
        path: "category",
        select: "_id name slug icon",
      },
    });

    console.log("=== 💔 REMOVE FROM WISHLIST END (SUCCESS) ===");
    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("❌ Error in removeFromWishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find wishlist (use $or to handle both ObjectId and string userId)
    const userIdString = user._id.toString();
    const userIdObjectId = new mongoose.Types.ObjectId(userIdString);
    
    const wishlist = await Wishlist.findOne({
      $or: [
        { userId: user._id },
        { userId: userIdObjectId },
        { userId: userIdString },
      ]
    });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = [] as any;
    wishlist.updatedAt = new Date();
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error clearing wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};










