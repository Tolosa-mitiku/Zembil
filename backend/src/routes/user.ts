import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// Profile routes
router.get("", verifyFirebaseToken, getUserProfile);
router.put("", verifyFirebaseToken, updateUserProfile);

export default router;
