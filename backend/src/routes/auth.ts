import { Router } from "express";
import { 
  loginUser, 
  getCurrentUser, 
  refreshUserData, 
  logoutUser 
} from "../controllers/auth";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// Authentication routes
router.post("/login", verifyFirebaseToken, loginUser); // Login/register user
router.get("/me", verifyFirebaseToken, getCurrentUser); // Get current user
router.post("/refresh", verifyFirebaseToken, refreshUserData); // Refresh user data
router.post("/logout", verifyFirebaseToken, logoutUser); // Logout user

export default router;
