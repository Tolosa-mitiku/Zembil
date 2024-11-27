import { Router } from "express";
import { loginUser } from "../controllers/auth";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// Define routes for signup and login
router.post("/login", verifyFirebaseToken, loginUser); // Route for logging in a user

export default router;
