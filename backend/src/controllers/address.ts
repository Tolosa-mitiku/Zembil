import { Response } from "express";
import { Address } from "../models/address";
import { User } from "../models/users";
import { CustomRequest } from "../types/express";

// Get all user addresses
export const getAddresses = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addresses = await Address.find({ userId: user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get single address by ID
export const getAddressById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = await Address.findOne({ _id: id, userId: user._id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching address",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Add new address
export const addAddress = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      type,
      label,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      geolocation,
      isDefault,
    } = req.body;

    // Check if this is the first address - make it default
    const addressCount = await Address.countDocuments({ userId: user._id });
    const shouldBeDefault = addressCount === 0 || isDefault === true;

    const address = new Address({
      userId: user._id,
      type,
      label,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      geolocation,
      isDefault: shouldBeDefault,
    });

    await address.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update address
export const updateAddress = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = await Address.findOne({ _id: id, userId: user._id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    const {
      type,
      label,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      geolocation,
    } = req.body;

    // Update fields
    if (type !== undefined) address.type = type;
    if (label !== undefined) address.label = label;
    if (fullName !== undefined) address.fullName = fullName;
    if (phoneNumber !== undefined) address.phoneNumber = phoneNumber;
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (geolocation !== undefined) address.geolocation = geolocation;

    address.updatedAt = new Date();
    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete address
export const deleteAddress = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = await Address.findOne({ _id: id, userId: user._id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    const wasDefault = address.isDefault;
    await address.deleteOne();

    // If deleted address was default, make another address default
    if (wasDefault) {
      const nextAddress = await Address.findOne({ userId: user._id });
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Set address as default
export const setDefaultAddress = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uid: req.user?.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = await Address.findOne({ _id: id, userId: user._id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    // Remove default from all other addresses
    await Address.updateMany(
      { userId: user._id, _id: { $ne: id } },
      { $set: { isDefault: false } }
    );

    // Set this address as default
    address.isDefault = true;
    address.updatedAt = new Date();
    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error setting default address",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};







