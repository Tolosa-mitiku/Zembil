import { Router } from "express";
import {
  addDeliveryAddress,
  createBuyer,
  deleteBuyer,
  getBuyerProfile,
  updateBuyerProfile,
} from "../controllers/buyer";

const router = Router();

// POST /buyers - Create a new buyer
router.post("/", createBuyer);

// GET /buyers/:id - Get buyer profile
router.get("/:id", getBuyerProfile);

// PUT /buyers/:id - Update buyer profile
router.put("/:id", updateBuyerProfile);

// POST /buyers/:id/addresses - Add a new delivery address for the buyer
router.post("/:id/addresses", addDeliveryAddress);

// DELETE /buyers/:id - Delete buyer account
router.delete("/:id", deleteBuyer);

export default router;
