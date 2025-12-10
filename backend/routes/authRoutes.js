// backend/routes/authRoutes.js
import express from "express";
import { login, getMe, logout, googleAuth } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.post("/google", googleAuth);

export default router;
