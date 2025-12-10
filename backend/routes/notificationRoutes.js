import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createNotification,
  updateNotification,
  deleteNotification,
  getAllNotifications,
  getPublishedNotifications,
  toggleNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Admin routes
router.post("/", protect, createNotification);
router.put("/:id", protect, updateNotification);
router.delete("/:id", protect, deleteNotification);
router.get("/", protect, getAllNotifications);
router.put("/toggle/:id", protect, toggleNotification);

// Student route
router.get("/published/all", protect, getPublishedNotifications);

export default router;
