import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addResult, getTeacherResults, updateResult, deleteResult } from "../controllers/teacherController.js";

const router = express.Router();

router.post("/add-result", protect, addResult);
router.get("/results", protect, getTeacherResults);
router.put("/update-result/:id", protect, updateResult);
router.delete("/delete-result/:id", protect, deleteResult);

export default router;
