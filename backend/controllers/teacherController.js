import Result from "../models/resultModel.js";
import Student from "../models/studentModel.js";
import Exam from "../models/examModel.js";
import mongoose from "mongoose";

// ➕ Add Result
export const addResult = async (req, res) => {
  try {
    const { examId, rollNo, subject, marks, grade } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const teacherId = new mongoose.Types.ObjectId(req.user.id);
    if (!exam.teacherIds.some((id) => id.equals(teacherId))) {
      return res.status(403).json({ message: "Not assigned to this exam" });
    }

    const student = await Student.findOne({ rollNo });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const newResult = new Result({
      examId,
      studentId: student._id,
      teacherId,
      subject,
      marks,
      grade,
    });

    await newResult.save();
    res.json({ message: "Result added successfully", result: newResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get all results for teacher’s exams
export const getTeacherResults = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.user.id);
    const results = await Result.find({ teacherId })
      .populate("studentId", "name rollNo department")
      .populate("examId", "title date isPublished");

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Edit result
export const updateResult = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    if (!result.teacherId.equals(teacherId)) return res.status(403).json({ message: "Unauthorized" });

    const updated = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Result updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete result
export const deleteResult = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    if (!result.teacherId.equals(teacherId)) return res.status(403).json({ message: "Unauthorized" });

    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
