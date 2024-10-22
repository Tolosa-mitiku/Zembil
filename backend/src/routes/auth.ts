import { Router } from "express";
import { loginUser, signupUser } from "../controllers/auth";

const router = Router();

// Define routes for signup and login
router.post("/signup", signupUser); // Route for signing up a user
router.post("/login", loginUser); // Route for logging in a user

export default router;
