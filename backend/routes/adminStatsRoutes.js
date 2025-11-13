// backend/routes/adminStatsRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getOverview, getPassFail, getSubjectAverages } from "../controllers/adminStatsController.js";

const router = express.Router();

// protect these endpoints for admin role only
router.get("/overview", protect, getOverview);
router.get("/passfail", protect, getPassFail);
router.get("/subject-average", protect, getSubjectAverages);

export default router;
