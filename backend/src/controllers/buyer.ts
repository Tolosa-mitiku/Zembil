import { Request, Response } from "express";
import { Buyer } from "../models/buyer";

// Create a new buyer
export const createBuyer = async (req: Request, res: Response) => {
  try {
    const buyer = new Buyer(req.body);
    await buyer.save();
    res.status(201).json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Error creating buyer", error });
  }
};

// Get buyer profile by ID
export const getBuyerProfile = async (req: Request, res: Response) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching buyer profile", error });
  }
};

// Update buyer profile
export const updateBuyerProfile = async (req: Request, res: Response) => {
  try {
    const updatedBuyer = await Buyer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    res.status(200).json(updatedBuyer);
  } catch (error) {
    res.status(500).json({ message: "Error updating buyer profile", error });
  }
};

// Add a new delivery address
export const addDeliveryAddress = async (req: Request, res: Response) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    buyer.deliveryAddresses.push(req.body);
    await buyer.save();
    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error });
  }
};

// Delete a buyer account
export const deleteBuyer = async (req: Request, res: Response) => {
  try {
    const deletedBuyer = await Buyer.findByIdAndDelete(req.params.id);
    if (!deletedBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    res.status(200).json({ message: "Buyer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting buyer", error });
  }
};
