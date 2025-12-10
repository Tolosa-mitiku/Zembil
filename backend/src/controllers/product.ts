import { Request, Response } from "express";
import { Product, Seller, Category } from "../models";
import { AnalyticsService } from "../services";

/**
 * Create a new product
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    // If using new schema structure, map it properly
    if (productData.price && !productData.pricing) {
      productData.pricing = {
        basePrice: productData.price,
        currency: productData.currency || "USD",
      };
    }

    if (productData.stockQuantity !== undefined && !productData.inventory) {
      productData.inventory = {
        stockQuantity: productData.stockQuantity,
        trackInventory: true,
      };
    }

    const product = new Product(productData);
    await product.save();

    // Update seller's product count
    if (product.sellerId) {
      await Seller.updateOne(
        { _id: product.sellerId },
        {
          $inc: { "metrics.totalProducts": 1 },
          $push: { products: product._id },
        }
      );
    }

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

/**
 * Get product by ID
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?._id;

    const product = await Product.findById(id).populate(
      "sellerId",
      "businessName metrics.averageRating metrics.totalReviews profileImage verification.status"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Track product view
    await AnalyticsService.trackProductView(id, userId);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Update product details
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Map legacy fields to new structure
    if (updates.price && !updates.pricing) {
      updates.pricing = {
        basePrice: updates.price,
      };
    }

    if (updates.stockQuantity !== undefined && !updates.inventory) {
      updates.inventory = {
        stockQuantity: updates.stockQuantity,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete - set status to archived instead of deleting
    product.status = "archived";
    await product.save();

    // Update seller's product count
    if (product.sellerId) {
      await Seller.updateOne(
        { _id: product.sellerId },
        {
          $inc: { "metrics.totalProducts": -1, "metrics.activeProducts": -1 },
          $pull: { products: product._id },
        }
      );
    }

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

/**
 * Get all products with filtering and pagination
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      category,
      minPrice,
      maxPrice,
      search,
      sort = "createdAt",
      order = "desc",
      status = "active",
      isFeatured,
      isOnSale,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter["pricing.basePrice"] = {};
      if (minPrice) filter["pricing.basePrice"].$gte = parseFloat(minPrice as string);
      if (maxPrice) filter["pricing.basePrice"].$lte = parseFloat(maxPrice as string);
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    if (isOnSale === "true") {
      filter.isOnSale = true;
    }

    // Build sort
    const sortField = sort as string;
    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj: any = {};

    // Map sort fields to new structure
    if (sortField === "price") {
      sortObj["pricing.basePrice"] = sortOrder;
    } else if (sortField === "rating") {
      sortObj["analytics.averageRating"] = sortOrder;
    } else if (sortField === "sold") {
      sortObj["analytics.totalSold"] = sortOrder;
    } else {
      sortObj[sortField] = sortOrder;
    }

    // Get total count
    const total = await Product.countDocuments(filter);

    // Get products
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate("sellerId", "businessName metrics.averageRating verification.status")
      .populate("category", "name")
      .lean();

    // Populate categoryNames for each product
    const productsWithCategoryNames = products.map((product: any) => {
      let categoryName = 'General';
      if (product.category && typeof product.category === 'object' && product.category.name) {
        categoryName = product.category.name;
      }
      return {
        ...product,
        category: product.category?._id || product.category,
        categoryNames: [categoryName],
      };
    });

    return res.status(200).json({
      success: true,
      data: productsWithCategoryNames,
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

/**
 * Get featured products
 */
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { limit = "10" } = req.query;

    const products = await Product.find({
      isFeatured: true,
      status: "active",
    })
      .limit(parseInt(limit as string, 10))
      .populate("sellerId", "businessName")
      .lean();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching featured products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Search products (full-text search with filters)
 */
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { 
      q, 
      page = "1", 
      limit = "20",
      category,
      minPrice,
      maxPrice,
      minRating,
      condition,
      inStockOnly,
      sort,
      order = "desc"
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter with text search
    const filter: any = {
      $text: { $search: q as string },
      status: "active",
    };

    // Add category filter
    if (category) {
      filter.category = category;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter["pricing.basePrice"] = {};
      if (minPrice) filter["pricing.basePrice"].$gte = parseFloat(minPrice as string);
      if (maxPrice) filter["pricing.basePrice"].$lte = parseFloat(maxPrice as string);
    }

    // Add rating filter
    if (minRating) {
      filter["analytics.averageRating"] = { $gte: parseFloat(minRating as string) };
    }

    // Add condition filter
    if (condition) {
      filter.condition = condition;
    }

    // Add stock filter
    if (inStockOnly === "true") {
      filter["inventory.stockQuantity"] = { $gt: 0 };
    }

    // Build sort object
    let sortObj: any = { score: { $meta: "textScore" } };
    
    // Override with custom sort if provided
    if (sort) {
      const sortField = sort as string;
      const sortOrder = order === "asc" ? 1 : -1;
      
      if (sortField === "price") {
        sortObj = { "pricing.basePrice": sortOrder };
      } else if (sortField === "rating") {
        sortObj = { "analytics.averageRating": sortOrder };
      } else if (sortField === "sold") {
        sortObj = { "analytics.totalSold": sortOrder };
      } else if (sortField === "createdAt" || sortField === "newest") {
        sortObj = { createdAt: sortOrder };
      }
      // If sort is "relevance" or not specified, use text score
    }

    // Text search with score and filters
    const products = await Product.find(
      filter,
      { score: { $meta: "textScore" } }
    )
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate("sellerId", "businessName metrics.averageRating verification.status")
      .populate("category", "name")
      .lean();

    const total = await Product.countDocuments(filter);

    // Populate categoryNames for each product
    const productsWithCategoryNames = products.map((product: any) => {
      let categoryName = 'General';
      if (product.category && typeof product.category === 'object' && product.category.name) {
        categoryName = product.category.name;
      }
      return {
        ...product,
        category: product.category?._id || product.category,
        categoryNames: [categoryName],
      };
    });

    return res.status(200).json({
      success: true,
      data: productsWithCategoryNames,
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
      message: "Error searching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({
      category,
      status: "active",
    })
      .skip(skip)
      .limit(limitNum)
      .populate("sellerId", "businessName")
      .lean();

    const total = await Product.countDocuments({ category, status: "active" });

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
      message: "Error fetching products by category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
