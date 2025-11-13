import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAssignedExams,
  getMyResults,
  getStudentProfile,
  getExamNotifications
} from "../controllers/studentController.js";

const router = express.Router();

// ✅ Get all published exams assigned to this student
router.get("/assigned-exams", protect, getAssignedExams);

// ✅ Get all results for this student
router.get("/my-results", protect, getMyResults);
// profile of student
router.get("/profile", protect, getStudentProfile);

// 🧩 Get upcoming exam notifications
router.get("/notifications", protect, getExamNotifications);



export default router;
