import { Router } from "express";
import {
  getAddresses,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// All address routes require authentication
router.use(verifyFirebaseToken);

// GET /addresses - Get all user addresses
router.get("/", getAddresses);

// GET /addresses/:id - Get single address
router.get("/:id", getAddressById);

// POST /addresses - Add new address
router.post("/", addAddress);

// PUT /addresses/:id - Update address
router.put("/:id", updateAddress);

// DELETE /addresses/:id - Delete address
router.delete("/:id", deleteAddress);

// PUT /addresses/:id/default - Set as default address
router.put("/:id/default", setDefaultAddress);

export default router;


















