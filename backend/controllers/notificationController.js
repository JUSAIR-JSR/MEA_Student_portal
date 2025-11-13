import Notification from "../models/notificationModel.js";

// ➕ Create notification (manual)
export const createNotification = async (req, res) => {
  try {
    const { title, message, expiryDate } = req.body;

    const notification = new Notification({
      title,
      message,
      expiryDate: expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // default 30 days
      isPublished: false, // saved as draft by default
      autoSend: false,
    });

    await notification.save();
    res.json({ message: "Notification created successfully", notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update notification
export const updateNotification = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all notifications (Admin)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📢 Get published notifications (Students)
export const getPublishedNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      isPublished: true,
      expiryDate: { $gte: new Date() },
    })
      .sort({ createdAt: -1 })
      .limit(10); // only latest 10 notifications
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Toggle Send/Unsend
export const toggleNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.isPublished = !notification.isPublished;
    await notification.save();

    res.json({
      message: `Notification ${notification.isPublished ? "sent" : "unsent"} successfully`,
      notification,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
