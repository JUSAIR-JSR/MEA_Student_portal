import express from "express";
import { registerAdmin, login,googleAuth  } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", login);
// Google OAuth exchange endpoint (frontend sends Google idToken here)
router.post("/google", googleAuth);

export default router;
