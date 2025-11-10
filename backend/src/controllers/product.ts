import { Request, Response } from "express";
import { Product } from "../models/product";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
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

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "sellerId",
      "businessName averageRating totalReviews profileImage"
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await product.save();

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

// Update product details
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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

// Get all products with advanced filtering
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      category,
      minPrice,
      maxPrice,
      minRating,
      brand,
      isFeatured,
      status,
      sort = "-createdAt",
      sellerId,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: any = { status: "active" }; // Only show active products by default

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
    if (status) filter.status = status;
    if (sellerId) filter.sellerId = sellerId;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    // Rating filter
    if (minRating) {
      filter.averageRating = { $gte: parseFloat(minRating as string) };
    }

    // Determine sort order
    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { averageRating: -1 };
    else if (sort === "popular") sortOption = { totalSold: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("sellerId", "businessName averageRating")
        .skip(skip)
        .limit(limitNum)
        .sort(sortOption),
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

// Search products with text search
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      q,
      page = "1",
      limit = "10",
      category,
      minPrice,
      maxPrice,
      minRating,
      sort = "-createdAt",
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

    // Build filter query
    const filter: any = {
      status: "active",
      $text: { $search: q as string },
    };

    if (category) filter.category = category;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    // Rating filter
    if (minRating) {
      filter.averageRating = { $gte: parseFloat(minRating as string) };
    }

    // Determine sort order
    let sortOption: any = { score: { $meta: "textScore" }, createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { averageRating: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter, { score: { $meta: "textScore" } })
        .populate("sellerId", "businessName averageRating")
        .skip(skip)
        .limit(limitNum)
        .sort(sortOption),
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
      message: "Error searching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get autocomplete suggestions
export const getAutocompleteSuggestions = async (
  req: Request,
  res: Response
) => {
  try {
    const { q } = req.query;

    if (!q || (q as string).length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Search for products matching the query
    const products = await Product.find({
      status: "active",
      $or: [
        { title: { $regex: q as string, $options: "i" } },
        { category: { $regex: q as string, $options: "i" } },
        { brand: { $regex: q as string, $options: "i" } },
      ],
    })
      .select("title category brand")
      .limit(10);

    // Extract unique suggestions
    const suggestions = new Set<string>();
    products.forEach((product) => {
      suggestions.add(product.title);
      if (product.category) suggestions.add(product.category);
      if (product.brand) suggestions.add(product.brand);
    });

    return res.status(200).json({
      success: true,
      data: Array.from(suggestions).slice(0, 10),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting autocomplete suggestions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
