import { Router } from "express";
import { getUserProfile } from "../controllers/user";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// Define routes for get user profile
router.get("", verifyFirebaseToken, getUserProfile); // Route for logging in a user

export default router;
