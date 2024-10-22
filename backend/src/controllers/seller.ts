import { Request, Response } from "express";
import { Product } from "../models/product";
import { Seller } from "../models/seller";

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

// Get seller profile by ID
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

// Update seller profile
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
