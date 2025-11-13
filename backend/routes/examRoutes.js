import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createExam, assignExam, getExams, togglePublish,removeAssignment,  getAssignedExams,getExamStudents,  updateExam,
  deleteExam } from "../controllers/examController.js";

const router = express.Router();

router.post("/create", protect, createExam);
router.put("/assign/:id", protect, assignExam);
router.get("/", protect, getExams);
router.put("/publish/:id", protect, togglePublish);
router.put("/remove-assignment", protect, removeAssignment);
// ✅ Get all exams assigned to this teacher
router.get("/assigned", protect, getAssignedExams);

// ✅ Get students of a specific exam
router.get("/:id/students", protect, getExamStudents);

router.put("/update/:id", protect, updateExam); // ✅ Update exam
router.delete("/delete/:id", protect, deleteExam); // ✅ Delete exam

export default router;
