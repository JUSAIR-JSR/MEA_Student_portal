import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    subject: { type: String, required: true }, // ✅ Added subject field
    date: Date,
    teacherIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
