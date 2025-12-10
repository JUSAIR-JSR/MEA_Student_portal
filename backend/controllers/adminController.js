// backend/controllers/adminController.js
import bcrypt from "bcryptjs";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import Exam from "../models/examModel.js";
import Result from "../models/resultModel.js";


// 🧑‍🏫 Create Teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, subject } = req.body;
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: "Teacher already exists" });

    const hash = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, email, password: hash, subject });
    await teacher.save();
    res.json({ message: "Teacher created successfully", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧑‍🎓 Create Student
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, rollNo, department } = req.body;
    const existing = await Student.findOne({ rollNo });
    if (existing) return res.status(400).json({ message: "Student already exists" });

    const hash = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hash, rollNo, department });
    await student.save();
    res.json({ message: "Student created successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Edit Teacher / Student
export const updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete Teacher / Student
export const deleteTeacher = async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { role, id, newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);

    if (role === "teacher") await Teacher.findByIdAndUpdate(id, { password: hash });
    else if (role === "student") await Student.findByIdAndUpdate(id, { password: hash });
    else return res.status(400).json({ message: "Invalid role" });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllResultsDetailed = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("studentId", "name rollNo email department")
      .populate("teacherId", "name email subject")
      .populate("examId", "title date isPublished")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching admin results:", err);
    res.status(500).json({ message: err.message });
  }
};


// 🗑️ Delete Result by ID
export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Result.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Result not found" });

    res.json({ message: "✅ Result deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting result:", err);
    res.status(500).json({ message: err.message });
  }
};
