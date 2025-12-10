// backend/routes/adminRoutes.js
import express from "express";

import protect from "../middleware/authMiddleware.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";

import {
  createTeacher,
  createStudent,
  updateTeacher,
  updateStudent,
  deleteTeacher,
  deleteStudent,
  resetPassword,
  getAllResultsDetailed,
  deleteResult, 

} from "../controllers/adminController.js";

const router = express.Router();

// Admin protected routes
router.post("/create-teacher", protect, createTeacher);
router.post("/create-student", protect, createStudent);
router.put("/update-teacher/:id", protect, updateTeacher);
router.put("/update-student/:id", protect, updateStudent);
router.delete("/delete-teacher/:id", protect, deleteTeacher);
router.delete("/delete-student/:id", protect, deleteStudent);
router.put("/reset-password", protect, resetPassword);
router.get("/all-results", protect, getAllResultsDetailed);
router.delete("/delete-result/:id", protect, deleteResult);



// 🧩 Get All Teachers
router.get("/teachers", protect, async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

// 🧩 Get All Students
router.get("/students", protect, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});


export default router;
