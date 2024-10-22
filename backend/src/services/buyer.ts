import { Buyer } from "../models/buyer";

// Get buyer by ID
export const getBuyerById = async (id: string) => {
  return await Buyer.findById(id);
};

// Delete a buyer
export const deleteBuyer = async (id: string) => {
  return await Buyer.findByIdAndDelete(id);
};
