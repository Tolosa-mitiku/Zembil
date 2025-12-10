import { Response } from "express";
import { Product } from "../models/product";
import { Seller } from "../models/seller";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get seller's products
export const getSellerProducts = async (req: CustomRequest, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      status,
      category,
      search,
      sort = "-createdAt",
    } = req.query;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { sellerId: seller._id };

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort as string).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create product
export const createSellerProduct = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    // Check if seller is verified
    if (seller.verification?.status !== "verified") {
      return res.status(403).json({
        success: false,
        message: "Seller must be verified to add products",
      });
    }

    const product = new Product({
      ...req.body,
      sellerId: seller._id,
      status: "active", // Auto-approve for verified sellers
    });

    await product.save();

    // Add product to seller's products array
    seller.products.push(product._id);
    await seller.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update product
export const updateSellerProduct = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    // Check if product belongs to this seller
    const product = await Product.findOne({ _id: id, sellerId: seller._id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    // Update product
    Object.assign(product, req.body);
    product.updatedAt = new Date();
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete product
export const deleteSellerProduct = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    // Check if product belongs to this seller
    const product = await Product.findOne({ _id: id, sellerId: seller._id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    await product.deleteOne();

    // Remove from seller's products array
    seller.products = seller.products.filter(
      (pid) => pid.toString() !== id
    ) as any;
    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update product stock
export const updateProductStock = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    if (stockQuantity === undefined || stockQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock quantity",
      });
    }

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const product = await Product.findOne({ _id: id, sellerId: seller._id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    // Update both new and legacy fields
    if (product.inventory) {
      product.inventory.stockQuantity = stockQuantity;
    }
    product.stockQuantity = stockQuantity; // Legacy field (auto-populated by pre-save hook)
    product.updatedAt = new Date();
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: { stockQuantity: stockQuantity },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating stock",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Bulk upload products
export const bulkUploadProducts = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid products array",
      });
    }

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const seller = await Seller.findOne({ firebaseUID: user.uid });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    // Check if seller is verified
    if (seller.verification?.status !== "verified") {
      return res.status(403).json({
        success: false,
        message: "Seller must be verified to add products",
      });
    }

    // Create products
    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const product = new Product({
          ...products[i],
          sellerId: seller._id,
          status: "active",
        });
        await product.save();
        seller.products.push(product._id);
        createdProducts.push(product);
      } catch (error) {
        errors.push({
          index: i,
          product: products[i],
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    await seller.save();

    return res.status(201).json({
      success: true,
      message: `${createdProducts.length} products created successfully`,
      data: {
        created: createdProducts,
        errors,
        summary: {
          total: products.length,
          successful: createdProducts.length,
          failed: errors.length,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error bulk uploading products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};










