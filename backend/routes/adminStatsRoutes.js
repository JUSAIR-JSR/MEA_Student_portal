// backend/routes/adminStatsRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getOverview, getPassFail, getSubjectAverages,  getDepartmentPerformance,
  getTopPerformers,
  getMonthlyTrends,
  getRecentActivity } from "../controllers/adminStatsController.js";

const router = express.Router();

// protect these endpoints for admin role only
router.get("/overview", protect, getOverview);
router.get("/passfail", protect, getPassFail);
router.get("/subject-average", protect, getSubjectAverages);

router.get("/department-performance", protect, getDepartmentPerformance);
router.get("/top-performers", protect, getTopPerformers);
router.get("/monthly-trends", protect, getMonthlyTrends);
router.get("/recent-activity", protect, getRecentActivity);



export default router;
