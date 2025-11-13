import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    isPublished: { type: Boolean, default: false }, // Manual send/unsend control
    expiryDate: { type: Date },
    autoSend: { type: Boolean, default: false }, // true if system-created (like result publish)
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", default: null },
  },
  { timestamps: true }
);

// 🧹 Auto-delete expired notifications after expiryDate
notificationSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Notification", notificationSchema);
