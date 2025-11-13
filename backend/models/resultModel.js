import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  grade: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Result", resultSchema);
