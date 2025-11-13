import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveResult, deleteResult } from "../controllers/resultController.js";

const router = express.Router();

router.post("/:examId", protect, saveResult);
router.delete("/:id", protect, deleteResult);

export default router;
