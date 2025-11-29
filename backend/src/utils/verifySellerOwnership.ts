import { Seller } from "../models/seller";

export const verifySellerOwnership = async (
  firebaseUID: string,
  sellerId: string
): Promise<boolean> => {
  try {
    const seller = await Seller.findById(sellerId);
    
    if (!seller) {
      throw new Error("Seller not found");
    }

    if (seller.firebaseUID !== firebaseUID) {
      return false;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

